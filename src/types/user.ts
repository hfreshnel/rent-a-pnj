import { Timestamp } from 'firebase/firestore';

export type UserRole = 'player' | 'pnj' | 'both';
export type UserStatus = 'active' | 'suspended' | 'banned';

export interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

export interface NotificationPreferences {
  push: boolean;
  email: boolean;
  marketing: boolean;
}

export interface PrivacyPreferences {
  showLevel: boolean;
  showBadges: boolean;
}

export interface UserPreferences {
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
}

export interface UserStats {
  bookingsCompleted: number;
  totalHours: number;
  uniquePnjMet: number;
  reviewsGiven: number;
}

export interface User {
  // Core
  id: string;
  email: string;
  displayName: string;
  avatar: string | null;

  // Role
  role: UserRole;
  pnjProfileId?: string;

  // Verification
  emailVerified: boolean;
  phoneNumber?: string;
  phoneVerified: boolean;
  identityVerified: boolean;

  // Gamification
  level: number;
  xp: number;
  totalXpEarned: number;
  badges: string[];

  // Preferences
  preferences: UserPreferences;

  // Security
  emergencyContact?: EmergencyContact;
  blockedUsers: string[];

  // Stripe
  stripeCustomerId?: string;

  // Stats
  stats: UserStats;

  // Admin
  status: UserStatus;
  suspendedUntil?: Timestamp | null;
  suspensionReason?: string;

  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastActiveAt: Timestamp;
}

// User creation payload (for registration)
export interface CreateUserPayload {
  email: string;
  displayName: string;
  role?: UserRole;
}

// User update payload
export interface UpdateUserPayload {
  displayName?: string;
  avatar?: string;
  phoneNumber?: string;
  preferences?: Partial<UserPreferences>;
  emergencyContact?: EmergencyContact | null;
}
