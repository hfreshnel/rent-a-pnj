import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
  UserCredential,
  GoogleAuthProvider,
  signInWithCredential,
  OAuthProvider,
} from 'firebase/auth';
import { auth, isConfigured } from './config';

/**
 * Firebase Authentication Service
 *
 * Provides methods for user authentication including:
 * - Email/Password registration and login
 * - Google Sign-In
 * - Apple Sign-In
 * - Password reset
 * - Email verification
 */

// Register with email and password
export const registerWithEmail = async (
  email: string,
  password: string,
  displayName: string
): Promise<UserCredential> => {
  if (!isConfigured) {
    throw new Error('Firebase is not configured');
  }

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  // Update profile with display name
  await updateProfile(userCredential.user, { displayName });

  // Send email verification
  await sendEmailVerification(userCredential.user);

  return userCredential;
};

// Sign in with email and password
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  if (!isConfigured) {
    throw new Error('Firebase is not configured');
  }

  return signInWithEmailAndPassword(auth, email, password);
};

// Sign in with Google (requires expo-auth-session setup)
export const signInWithGoogle = async (idToken: string): Promise<UserCredential> => {
  if (!isConfigured) {
    throw new Error('Firebase is not configured');
  }

  const credential = GoogleAuthProvider.credential(idToken);
  return signInWithCredential(auth, credential);
};

// Sign in with Apple (requires expo-apple-authentication setup)
export const signInWithApple = async (
  identityToken: string,
  nonce: string
): Promise<UserCredential> => {
  if (!isConfigured) {
    throw new Error('Firebase is not configured');
  }

  const provider = new OAuthProvider('apple.com');
  const credential = provider.credential({
    idToken: identityToken,
    rawNonce: nonce,
  });
  return signInWithCredential(auth, credential);
};

// Sign out
export const logOut = async (): Promise<void> => {
  if (!isConfigured) {
    throw new Error('Firebase is not configured');
  }

  return signOut(auth);
};

// Send password reset email
export const resetPassword = async (email: string): Promise<void> => {
  if (!isConfigured) {
    throw new Error('Firebase is not configured');
  }

  return sendPasswordResetEmail(auth, email);
};

// Resend email verification
export const resendEmailVerification = async (): Promise<void> => {
  if (!isConfigured) {
    throw new Error('Firebase is not configured');
  }

  const user = auth.currentUser;
  if (!user) {
    throw new Error('No user is currently signed in');
  }

  return sendEmailVerification(user);
};

// Update user profile
export const updateUserProfile = async (profile: {
  displayName?: string;
  photoURL?: string;
}): Promise<void> => {
  if (!isConfigured) {
    throw new Error('Firebase is not configured');
  }

  const user = auth.currentUser;
  if (!user) {
    throw new Error('No user is currently signed in');
  }

  return updateProfile(user, profile);
};

// Get current user
export const getCurrentUser = (): FirebaseUser | null => {
  return auth.currentUser;
};

// Subscribe to auth state changes
export const subscribeToAuthState = (
  callback: (user: FirebaseUser | null) => void
): (() => void) => {
  return onAuthStateChanged(auth, callback);
};

// Check if email is verified
export const isEmailVerified = (): boolean => {
  const user = auth.currentUser;
  return user?.emailVerified ?? false;
};

// Reload user to get fresh data
export const reloadUser = async (): Promise<void> => {
  const user = auth.currentUser;
  if (user) {
    await user.reload();
  }
};
