import { Timestamp, GeoPoint } from 'firebase/firestore';

export type PNJClass =
  | 'adventurer'
  | 'sage'
  | 'bard'
  | 'tank'
  | 'foodie'
  | 'geek'
  | 'artist'
  | 'coach';

export interface TimeSlot {
  start: string; // "09:00"
  end: string; // "12:00"
}

export interface WeeklyAvailability {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
}

export interface ExceptionalDate {
  date: string; // "2024-03-15"
  available: boolean;
  slots?: TimeSlot[];
  reason?: string;
}

export interface PNJProfile {
  id: string;

  // Identity
  userId: string;
  displayName: string;
  avatar: string;
  photos: string[];

  // Gameplay
  class: PNJClass;
  secondaryClass?: PNJClass;
  level: number;
  xp: number;
  badges: string[];

  // Infos pratiques
  bio: string;
  hourlyRate: number;
  languages: string[];
  activities: string[];

  // Localisation
  city: string;
  location: GeoPoint;
  maxDistance: number;

  // Disponibilités
  availability: WeeklyAvailability;
  exceptionalDates: ExceptionalDate[];

  // Stats
  rating: number;
  reviewCount: number;
  completedBookings: number;
  responseRate: number;
  responseTime: number;

  // Admin
  verified: boolean;
  active: boolean;
  stripeConnectId: string;

  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Form types
export interface CreatePNJProfileInput {
  displayName: string;
  avatar: string;
  photos?: string[];
  class: PNJClass;
  secondaryClass?: PNJClass;
  bio: string;
  hourlyRate: number;
  languages: string[];
  activities: string[];
  city: string;
  latitude: number;
  longitude: number;
  maxDistance: number;
  availability: WeeklyAvailability;
}

export interface UpdatePNJProfileInput {
  displayName?: string;
  avatar?: string;
  photos?: string[];
  class?: PNJClass;
  secondaryClass?: PNJClass;
  bio?: string;
  hourlyRate?: number;
  languages?: string[];
  activities?: string[];
  city?: string;
  latitude?: number;
  longitude?: number;
  maxDistance?: number;
  availability?: WeeklyAvailability;
  exceptionalDates?: ExceptionalDate[];
  active?: boolean;
}

// For display in lists
export interface PNJCardData {
  id: string;
  userId: string;
  displayName: string;
  avatar: string;
  class: PNJClass;
  secondaryClass?: PNJClass;
  level: number;
  bio: string;
  hourlyRate: number;
  city: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  activities: string[];
  distance?: number; // Calculated based on user location
  isAvailableToday?: boolean;
  isNew?: boolean;
}

// Empty availability template
export const emptyWeeklyAvailability: WeeklyAvailability = {
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
  sunday: [],
};
