import { Timestamp, GeoPoint } from 'firebase/firestore';
import {
  getDocument,
  getDocuments,
  createDocument,
  setDocument,
  updateDocument,
  subscribeToDocument,
  firestoreHelpers,
  COLLECTIONS,
} from '../firebase';
import {
  PNJProfile,
  PNJListItem,
  CreatePNJProfilePayload,
  UpdatePNJProfilePayload,
  WeeklyAvailability,
} from '../../types/pnj';
import { PNJClass } from '../../theme/types';

const { where, orderBy, limit } = firestoreHelpers;

/**
 * PNJ Profile API Service
 *
 * CRUD operations for PNJ profiles
 */

// Get PNJ profile by ID
export const getPNJProfile = async (profileId: string): Promise<PNJProfile | null> => {
  return getDocument<PNJProfile>(COLLECTIONS.PNJ_PROFILES, profileId);
};

// Get PNJ profile by user ID
export const getPNJProfileByUserId = async (userId: string): Promise<PNJProfile | null> => {
  const profiles = await getDocuments<PNJProfile>(COLLECTIONS.PNJ_PROFILES, [
    where('userId', '==', userId),
    limit(1),
  ]);
  return profiles[0] || null;
};

// Create PNJ profile (onboarding)
export const createPNJProfile = async (
  userId: string,
  payload: CreatePNJProfilePayload
): Promise<string> => {
  const now = Timestamp.now();

  const profile: Omit<PNJProfile, 'id'> = {
    userId,
    displayName: payload.displayName,
    avatar: '', // Will be set after upload
    photos: [],
    class: payload.class,
    secondaryClass: payload.secondaryClass,
    level: 1,
    xp: 0,
    badges: [],
    bio: payload.bio,
    hourlyRate: payload.hourlyRate,
    languages: payload.languages,
    activities: payload.activities,
    city: payload.city,
    location: new GeoPoint(payload.location.latitude, payload.location.longitude),
    maxDistance: payload.maxDistance,
    availability: payload.availability,
    exceptionalDates: [],
    rating: 0,
    reviewCount: 0,
    completedBookings: 0,
    responseRate: 100,
    responseTime: 0,
    verified: false, // Needs manual verification
    active: false, // Not visible until profile is complete
    createdAt: now,
    updatedAt: now,
  };

  return createDocument(COLLECTIONS.PNJ_PROFILES, profile);
};

// Update PNJ profile
export const updatePNJProfile = async (
  profileId: string,
  payload: UpdatePNJProfilePayload
): Promise<void> => {
  const updates: Record<string, unknown> = { ...payload };

  // Convert location to GeoPoint if provided
  if (payload.location) {
    updates.location = new GeoPoint(payload.location.latitude, payload.location.longitude);
  }

  await updateDocument(COLLECTIONS.PNJ_PROFILES, profileId, updates);
};

// Search PNJ profiles with filters
export interface SearchPNJFilters {
  classes?: PNJClass[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  activities?: string[];
  city?: string;
  verified?: boolean;
  limitCount?: number;
}

export const searchPNJProfiles = async (
  filters: SearchPNJFilters = {}
): Promise<PNJListItem[]> => {
  const constraints = [];

  // Only show active profiles
  constraints.push(where('active', '==', true));

  // Filter by class
  if (filters.classes && filters.classes.length > 0) {
    constraints.push(where('class', 'in', filters.classes));
  }

  // Filter by verified status
  if (filters.verified !== undefined) {
    constraints.push(where('verified', '==', filters.verified));
  }

  // Filter by city
  if (filters.city) {
    constraints.push(where('city', '==', filters.city));
  }

  // Order by rating (default)
  constraints.push(orderBy('rating', 'desc'));

  // Limit results
  constraints.push(limit(filters.limitCount || 20));

  const profiles = await getDocuments<PNJProfile>(COLLECTIONS.PNJ_PROFILES, constraints);

  // Apply client-side filters (Firestore limitations)
  return profiles
    .filter((p) => {
      if (filters.minPrice && p.hourlyRate < filters.minPrice) return false;
      if (filters.maxPrice && p.hourlyRate > filters.maxPrice) return false;
      if (filters.minRating && p.rating < filters.minRating) return false;
      if (filters.activities && filters.activities.length > 0) {
        const hasActivity = filters.activities.some((a) => p.activities.includes(a));
        if (!hasActivity) return false;
      }
      return true;
    })
    .map((p) => ({
      id: p.id,
      userId: p.userId,
      displayName: p.displayName,
      avatar: p.avatar,
      class: p.class,
      secondaryClass: p.secondaryClass,
      level: p.level,
      bio: p.bio,
      hourlyRate: p.hourlyRate,
      city: p.city,
      rating: p.rating,
      reviewCount: p.reviewCount,
      completedBookings: p.completedBookings,
      activities: p.activities,
      verified: p.verified,
    }));
};

// Get featured PNJ profiles (for home screen)
export const getFeaturedPNJProfiles = async (count: number = 5): Promise<PNJListItem[]> => {
  return searchPNJProfiles({
    verified: true,
    minRating: 4,
    limitCount: count,
  });
};

// Update PNJ stats after booking
export const updatePNJStats = async (
  profileId: string,
  stats: {
    completedBookings?: number;
    rating?: number;
    reviewCount?: number;
    responseRate?: number;
    responseTime?: number;
  }
): Promise<void> => {
  await updateDocument(COLLECTIONS.PNJ_PROFILES, profileId, stats);
};

// Toggle PNJ active status
export const togglePNJActive = async (
  profileId: string,
  active: boolean
): Promise<void> => {
  await updateDocument(COLLECTIONS.PNJ_PROFILES, profileId, { active });
};

// Subscribe to PNJ profile updates
export const subscribeToPNJProfile = (
  profileId: string,
  callback: (profile: PNJProfile | null) => void
): (() => void) => {
  return subscribeToDocument<PNJProfile>(COLLECTIONS.PNJ_PROFILES, profileId, callback);
};

// Check if time slot is available
export const checkAvailability = (
  availability: WeeklyAvailability,
  date: Date,
  startTime: string,
  duration: number
): boolean => {
  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'lowercase' }) as keyof WeeklyAvailability;
  const slots = availability[dayOfWeek];

  if (!slots || slots.length === 0) return false;

  const [startHour, startMin] = startTime.split(':').map(Number);
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = startMinutes + duration;

  return slots.some((slot) => {
    const [slotStartHour, slotStartMin] = slot.start.split(':').map(Number);
    const [slotEndHour, slotEndMin] = slot.end.split(':').map(Number);
    const slotStart = slotStartHour * 60 + slotStartMin;
    const slotEnd = slotEndHour * 60 + slotEndMin;

    return startMinutes >= slotStart && endMinutes <= slotEnd;
  });
};
