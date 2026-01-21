import { Timestamp } from 'firebase/firestore';

export type UserRole = 'player' | 'pnj' | 'both';

export type UserStatus = 'active' | 'suspended' | 'banned';

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

export interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

export interface UserStats {
  bookingsCompleted: number;
  totalHours: number;
  uniquePnjMet: number;
  reviewsGiven: number;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatar: string;

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
  stripeCustomerId: string;

  // Stats
  stats: UserStats;

  // Admin
  status: UserStatus;
  suspendedUntil?: Timestamp;
  suspensionReason?: string;

  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastActiveAt: Timestamp;
}

// Form types for creating/updating users
export interface CreateUserInput {
  email: string;
  displayName: string;
  avatar?: string;
  role?: UserRole;
}

export interface UpdateUserInput {
  displayName?: string;
  avatar?: string;
  role?: UserRole;
  phoneNumber?: string;
  preferences?: Partial<UserPreferences>;
  emergencyContact?: EmergencyContact | null;
}
