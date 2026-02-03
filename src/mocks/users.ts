import { Timestamp } from 'firebase/firestore';
import { User } from '../types/user';
import { MOCK_IDS } from './ids';

/**
 * Mock user for offline testing.
 * Role is set dynamically via DEBUG_CONFIG.MOCK_USER_ROLE in debug.ts.
 */
export const MOCK_USER: User = {
  id: MOCK_IDS.users.currentUser,
  email: 'test@example.com',
  displayName: 'Test User',
  avatar: null,
  role: 'player', // Overridden by DEBUG_CONFIG.MOCK_USER_ROLE at usage site
  emailVerified: true,
  phoneVerified: false,
  identityVerified: false,
  level: 5,
  xp: 450,
  totalXpEarned: 1250,
  badges: ['early_adopter', 'first_booking'],
  preferences: {
    notifications: {
      push: true,
      email: true,
      marketing: false,
    },
    privacy: {
      showLevel: true,
      showBadges: true,
    },
  },
  blockedUsers: [],
  stats: {
    bookingsCompleted: 3,
    totalHours: 12,
    uniquePnjMet: 2,
    reviewsGiven: 2,
  },
  status: 'active',
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
  lastActiveAt: Timestamp.now(),
};

/** Lightweight player info used by PNJ-side screens */
export interface MockPlayerSummary {
  id: string;
  name: string;
  level: number;
}

export const MOCK_PLAYERS: Record<string, MockPlayerSummary> = {
  [MOCK_IDS.users.player_marie]: { id: MOCK_IDS.users.player_marie, name: 'Marie', level: 5 },
  [MOCK_IDS.users.player_thomas]: { id: MOCK_IDS.users.player_thomas, name: 'Thomas', level: 3 },
  [MOCK_IDS.users.player_sophie]: { id: MOCK_IDS.users.player_sophie, name: 'Sophie', level: 5 },
  [MOCK_IDS.users.player_lucas]: { id: MOCK_IDS.users.player_lucas, name: 'Lucas', level: 3 },
  [MOCK_IDS.users.player_emma]: { id: MOCK_IDS.users.player_emma, name: 'Emma', level: 8 },
};
