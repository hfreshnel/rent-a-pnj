import {
  User,
  CreateUserInput,
  UpdateUserInput,
  UserRole,
} from '@/types';
import {
  COLLECTIONS,
  getDocument,
  setDocument,
  updateDocument,
  Timestamp,
  serverTimestamp,
} from '@/services/firebase/firestore';

// Get user by ID
export async function getUser(userId: string): Promise<User | null> {
  return getDocument<User>(COLLECTIONS.USERS, userId);
}

// Create new user (called by onUserCreate Cloud Function typically)
export async function createUser(
  userId: string,
  input: CreateUserInput
): Promise<User> {
  const now = Timestamp.now();

  const user: Omit<User, 'id'> = {
    email: input.email,
    displayName: input.displayName,
    avatar: input.avatar || '',
    role: input.role || 'player',
    pnjProfileId: undefined,
    emailVerified: false,
    phoneNumber: undefined,
    phoneVerified: false,
    identityVerified: false,
    level: 1,
    xp: 0,
    totalXpEarned: 0,
    badges: [],
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
    emergencyContact: undefined,
    blockedUsers: [],
    stripeCustomerId: '',
    stats: {
      bookingsCompleted: 0,
      totalHours: 0,
      uniquePnjMet: 0,
      reviewsGiven: 0,
    },
    status: 'active',
    suspendedUntil: undefined,
    suspensionReason: undefined,
    createdAt: now,
    updatedAt: now,
    lastActiveAt: now,
  };

  await setDocument(COLLECTIONS.USERS, userId, user);

  return { id: userId, ...user };
}

// Update user
export async function updateUser(
  userId: string,
  input: UpdateUserInput
): Promise<void> {
  const updateData: Record<string, unknown> = {
    ...input,
    updatedAt: serverTimestamp(),
  };

  await updateDocument(COLLECTIONS.USERS, userId, updateData);
}

// Update user role
export async function updateUserRole(
  userId: string,
  role: UserRole,
  pnjProfileId?: string
): Promise<void> {
  const updateData: Record<string, unknown> = {
    role,
    updatedAt: serverTimestamp(),
  };

  if (pnjProfileId) {
    updateData.pnjProfileId = pnjProfileId;
  }

  await updateDocument(COLLECTIONS.USERS, userId, updateData);
}

// Update last active timestamp
export async function updateLastActive(userId: string): Promise<void> {
  await updateDocument(COLLECTIONS.USERS, userId, {
    lastActiveAt: serverTimestamp(),
  });
}

// Add XP to user
export async function addXP(userId: string, amount: number): Promise<void> {
  const user = await getUser(userId);
  if (!user) return;

  const newXp = user.xp + amount;
  const newTotalXp = user.totalXpEarned + amount;

  // Calculate new level (simplified - you might want a more sophisticated calculation)
  const newLevel = calculateLevelFromXP(newXp);

  await updateDocument(COLLECTIONS.USERS, userId, {
    xp: newXp,
    totalXpEarned: newTotalXp,
    level: newLevel,
    updatedAt: serverTimestamp(),
  });
}

// Helper function to calculate level from XP
function calculateLevelFromXP(xp: number): number {
  const thresholds = [0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5200];
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (xp >= thresholds[i]) {
      return i + 1;
    }
  }
  return 1;
}

// Block user
export async function blockUser(
  userId: string,
  blockedUserId: string
): Promise<void> {
  const user = await getUser(userId);
  if (!user) return;

  if (!user.blockedUsers.includes(blockedUserId)) {
    await updateDocument(COLLECTIONS.USERS, userId, {
      blockedUsers: [...user.blockedUsers, blockedUserId],
      updatedAt: serverTimestamp(),
    });
  }
}

// Unblock user
export async function unblockUser(
  userId: string,
  blockedUserId: string
): Promise<void> {
  const user = await getUser(userId);
  if (!user) return;

  await updateDocument(COLLECTIONS.USERS, userId, {
    blockedUsers: user.blockedUsers.filter((id) => id !== blockedUserId),
    updatedAt: serverTimestamp(),
  });
}

// Update emergency contact
export async function updateEmergencyContact(
  userId: string,
  contact: { name: string; phone: string; relation: string } | null
): Promise<void> {
  await updateDocument(COLLECTIONS.USERS, userId, {
    emergencyContact: contact,
    updatedAt: serverTimestamp(),
  });
}
