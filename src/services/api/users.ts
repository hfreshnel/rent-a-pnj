import { Timestamp } from 'firebase/firestore';
import {
  getDocument,
  setDocument,
  updateDocument,
  subscribeToDocument,
  COLLECTIONS,
} from '../firebase';
import { User, CreateUserPayload, UpdateUserPayload, UserRole } from '../../types/user';

/**
 * User API Service
 *
 * CRUD operations for user documents
 */

// Get user by ID
export const getUser = async (userId: string): Promise<User | null> => {
  return getDocument<User>(COLLECTIONS.USERS, userId);
};

// Create new user (called after Firebase Auth registration)
export const createUser = async (
  userId: string,
  payload: CreateUserPayload
): Promise<void> => {
  const now = Timestamp.now();

  const user: Omit<User, 'id'> = {
    email: payload.email,
    displayName: payload.displayName,
    avatar: null,

    // Role - default to player
    role: payload.role || 'player',

    // Verification
    emailVerified: false,
    phoneVerified: false,
    identityVerified: false,

    // Gamification
    level: 1,
    xp: 0,
    totalXpEarned: 0,
    badges: [],

    // Preferences
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

    // Security
    blockedUsers: [],

    // Stats
    stats: {
      bookingsCompleted: 0,
      totalHours: 0,
      uniquePnjMet: 0,
      reviewsGiven: 0,
    },

    // Admin
    status: 'active',

    // Timestamps
    createdAt: now,
    updatedAt: now,
    lastActiveAt: now,
  };

  await setDocument(COLLECTIONS.USERS, userId, user);
};

// Update user profile
export const updateUser = async (
  userId: string,
  payload: UpdateUserPayload
): Promise<void> => {
  await updateDocument(COLLECTIONS.USERS, userId, payload);
};

// Update user role
export const updateUserRole = async (
  userId: string,
  role: UserRole,
  pnjProfileId?: string
): Promise<void> => {
  const updates: Partial<User> = { role };
  if (pnjProfileId) {
    updates.pnjProfileId = pnjProfileId;
  }
  await updateDocument(COLLECTIONS.USERS, userId, updates);
};

// Update user XP and level
export const updateUserXP = async (
  userId: string,
  xpToAdd: number,
  newLevel?: number
): Promise<void> => {
  const user = await getUser(userId);
  if (!user) return;

  const updates: Partial<User> = {
    xp: user.xp + xpToAdd,
    totalXpEarned: user.totalXpEarned + xpToAdd,
  };

  if (newLevel && newLevel > user.level) {
    updates.level = newLevel;
  }

  await updateDocument(COLLECTIONS.USERS, userId, updates);
};

// Add badge to user
export const addUserBadge = async (userId: string, badgeId: string): Promise<void> => {
  const user = await getUser(userId);
  if (!user || user.badges.includes(badgeId)) return;

  await updateDocument(COLLECTIONS.USERS, userId, {
    badges: [...user.badges, badgeId],
  });
};

// Block a user
export const blockUser = async (userId: string, blockedUserId: string): Promise<void> => {
  const user = await getUser(userId);
  if (!user || user.blockedUsers.includes(blockedUserId)) return;

  await updateDocument(COLLECTIONS.USERS, userId, {
    blockedUsers: [...user.blockedUsers, blockedUserId],
  });
};

// Unblock a user
export const unblockUser = async (userId: string, blockedUserId: string): Promise<void> => {
  const user = await getUser(userId);
  if (!user) return;

  await updateDocument(COLLECTIONS.USERS, userId, {
    blockedUsers: user.blockedUsers.filter((id) => id !== blockedUserId),
  });
};

// Update last active timestamp
export const updateLastActive = async (userId: string): Promise<void> => {
  await updateDocument(COLLECTIONS.USERS, userId, {
    lastActiveAt: Timestamp.now(),
  });
};

// Subscribe to user updates
export const subscribeToUser = (
  userId: string,
  callback: (user: User | null) => void
): (() => void) => {
  return subscribeToDocument<User>(COLLECTIONS.USERS, userId, callback);
};

// Update user stats
export const updateUserStats = async (
  userId: string,
  stats: Partial<User['stats']>
): Promise<void> => {
  const user = await getUser(userId);
  if (!user) return;

  await updateDocument(COLLECTIONS.USERS, userId, {
    stats: { ...user.stats, ...stats },
  });
};
