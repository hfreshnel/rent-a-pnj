import {
  PNJProfile,
  CreatePNJProfileInput,
  UpdatePNJProfileInput,
  PNJCardData,
  PNJClass,
} from '@/types';
import {
  COLLECTIONS,
  getDocument,
  setDocument,
  updateDocument,
  queryDocuments,
  Timestamp,
  serverTimestamp,
  createGeoPoint,
  where,
  orderBy,
  limit,
  startAfter,
} from '@/services/firebase/firestore';
import { calculateDistance } from '@/stores/locationStore';

// Get PNJ profile by ID
export async function getPNJProfile(profileId: string): Promise<PNJProfile | null> {
  return getDocument<PNJProfile>(COLLECTIONS.PNJ_PROFILES, profileId);
}

// Get PNJ profile by user ID
export async function getPNJProfileByUserId(userId: string): Promise<PNJProfile | null> {
  const profiles = await queryDocuments<PNJProfile>(COLLECTIONS.PNJ_PROFILES, [
    where('userId', '==', userId),
    limit(1),
  ]);

  return profiles[0] || null;
}

// Create PNJ profile
export async function createPNJProfile(
  userId: string,
  input: CreatePNJProfileInput
): Promise<PNJProfile> {
  const now = Timestamp.now();

  const profile: Omit<PNJProfile, 'id'> = {
    userId,
    displayName: input.displayName,
    avatar: input.avatar,
    photos: input.photos || [],
    class: input.class,
    secondaryClass: input.secondaryClass,
    level: 1,
    xp: 0,
    badges: [],
    bio: input.bio,
    hourlyRate: input.hourlyRate,
    languages: input.languages,
    activities: input.activities,
    city: input.city,
    location: createGeoPoint(input.latitude, input.longitude),
    maxDistance: input.maxDistance,
    availability: input.availability,
    exceptionalDates: [],
    rating: 0,
    reviewCount: 0,
    completedBookings: 0,
    responseRate: 100,
    responseTime: 0,
    verified: false,
    active: false, // Set to true after admin verification
    stripeConnectId: '',
    createdAt: now,
    updatedAt: now,
  };

  // Generate a unique ID
  const profileId = `pnj_${userId}_${Date.now()}`;

  await setDocument(COLLECTIONS.PNJ_PROFILES, profileId, profile);

  return { id: profileId, ...profile };
}

// Update PNJ profile
export async function updatePNJProfile(
  profileId: string,
  input: UpdatePNJProfileInput
): Promise<void> {
  const updateData: Record<string, unknown> = {
    ...input,
    updatedAt: serverTimestamp(),
  };

  // Handle location update
  if (input.latitude !== undefined && input.longitude !== undefined) {
    updateData.location = createGeoPoint(input.latitude, input.longitude);
    delete updateData.latitude;
    delete updateData.longitude;
  }

  await updateDocument(COLLECTIONS.PNJ_PROFILES, profileId, updateData);
}

// Search PNJ profiles
export interface SearchPNJFilters {
  classes?: PNJClass[];
  activities?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  city?: string;
  verified?: boolean;
}

export async function searchPNJProfiles(
  filters: SearchPNJFilters,
  pageSize = 20,
  lastDocId?: string
): Promise<PNJCardData[]> {
  const constraints = [
    where('active', '==', true),
  ];

  // Add filters
  if (filters.classes && filters.classes.length > 0) {
    constraints.push(where('class', 'in', filters.classes));
  }

  if (filters.minRating !== undefined) {
    constraints.push(where('rating', '>=', filters.minRating));
  }

  if (filters.city) {
    constraints.push(where('city', '==', filters.city));
  }

  if (filters.verified !== undefined) {
    constraints.push(where('verified', '==', filters.verified));
  }

  // Order and limit
  constraints.push(orderBy('rating', 'desc'));
  constraints.push(limit(pageSize));

  // Pagination
  if (lastDocId) {
    // Note: In a real app, you'd need to get the actual document for startAfter
    // This is simplified
  }

  const profiles = await queryDocuments<PNJProfile>(
    COLLECTIONS.PNJ_PROFILES,
    constraints
  );

  // Apply client-side filters that Firestore can't handle efficiently
  let filtered = profiles;

  if (filters.minPrice !== undefined) {
    filtered = filtered.filter((p) => p.hourlyRate >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter((p) => p.hourlyRate <= filters.maxPrice!);
  }

  if (filters.activities && filters.activities.length > 0) {
    filtered = filtered.filter((p) =>
      filters.activities!.some((a) => p.activities.includes(a))
    );
  }

  // Convert to card data
  return filtered.map((p) => ({
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
    verified: p.verified,
    activities: p.activities,
    isNew: p.completedBookings < 5,
  }));
}

// Get nearby PNJ profiles
export async function getNearbyPNJProfiles(
  latitude: number,
  longitude: number,
  maxDistanceKm: number,
  pageSize = 20
): Promise<PNJCardData[]> {
  // Firestore doesn't support native geoqueries well
  // In a real app, you'd use Geohash or a service like Algolia
  // This is a simplified approach that fetches and filters client-side

  const profiles = await queryDocuments<PNJProfile>(COLLECTIONS.PNJ_PROFILES, [
    where('active', '==', true),
    orderBy('rating', 'desc'),
    limit(100), // Fetch more to filter
  ]);

  // Calculate distances and filter
  const withDistance = profiles
    .map((p) => {
      const distance = calculateDistance(
        latitude,
        longitude,
        p.location.latitude,
        p.location.longitude
      );
      return { ...p, distance };
    })
    .filter((p) => p.distance <= maxDistanceKm)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, pageSize);

  // Convert to card data
  return withDistance.map((p) => ({
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
    verified: p.verified,
    activities: p.activities,
    distance: Math.round(p.distance * 10) / 10,
    isNew: p.completedBookings < 5,
  }));
}

// Check if PNJ is available on a specific date/time
export function checkAvailability(
  profile: PNJProfile,
  date: Date,
  startTime: string,
  duration: number
): boolean {
  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as keyof typeof profile.availability;

  // Check exceptional dates first
  const dateString = date.toISOString().split('T')[0];
  const exceptional = profile.exceptionalDates.find((ed) => ed.date === dateString);

  if (exceptional) {
    if (!exceptional.available) return false;
    if (exceptional.slots && exceptional.slots.length > 0) {
      return isTimeInSlots(startTime, duration, exceptional.slots);
    }
  }

  // Check regular availability
  const daySlots = profile.availability[dayOfWeek];
  return isTimeInSlots(startTime, duration, daySlots);
}

// Helper to check if time fits in slots
function isTimeInSlots(
  startTime: string,
  duration: number,
  slots: { start: string; end: string }[]
): boolean {
  const [startHour, startMin] = startTime.split(':').map(Number);
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = startMinutes + duration;

  return slots.some((slot) => {
    const [slotStartHour, slotStartMin] = slot.start.split(':').map(Number);
    const [slotEndHour, slotEndMin] = slot.end.split(':').map(Number);
    const slotStartMinutes = slotStartHour * 60 + slotStartMin;
    const slotEndMinutes = slotEndHour * 60 + slotEndMin;

    return startMinutes >= slotStartMinutes && endMinutes <= slotEndMinutes;
  });
}
