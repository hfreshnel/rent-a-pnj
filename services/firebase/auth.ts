import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import { auth } from './config';

export type AuthUser = FirebaseUser;

// Sign in with email and password
export async function signInWithEmail(email: string, password: string): Promise<AuthUser> {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

// Register with email and password
export async function registerWithEmail(
  email: string,
  password: string,
  displayName?: string
): Promise<AuthUser> {
  const result = await createUserWithEmailAndPassword(auth, email, password);

  if (displayName) {
    await updateProfile(result.user, { displayName });
  }

  // Send email verification
  await sendEmailVerification(result.user);

  return result.user;
}

// Sign out
export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

// Send password reset email
export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

// Send email verification
export async function sendVerificationEmail(): Promise<void> {
  const user = auth.currentUser;
  if (user) {
    await sendEmailVerification(user);
  }
}

// Update user profile
export async function updateUserProfile(data: {
  displayName?: string;
  photoURL?: string;
}): Promise<void> {
  const user = auth.currentUser;
  if (user) {
    await updateProfile(user, data);
  }
}

// Sign in with Google (requires expo-auth-session setup)
export async function signInWithGoogle(idToken: string): Promise<AuthUser> {
  const credential = GoogleAuthProvider.credential(idToken);
  const result = await signInWithCredential(auth, credential);
  return result.user;
}

// Sign in with Apple (requires expo-apple-authentication setup)
export async function signInWithApple(
  identityToken: string,
  nonce: string
): Promise<AuthUser> {
  const provider = new OAuthProvider('apple.com');
  const credential = provider.credential({
    idToken: identityToken,
    rawNonce: nonce,
  });
  const result = await signInWithCredential(auth, credential);
  return result.user;
}

// Get current user
export function getCurrentUser(): AuthUser | null {
  return auth.currentUser;
}

// Subscribe to auth state changes
export function subscribeToAuthState(
  callback: (user: AuthUser | null) => void
): () => void {
  return onAuthStateChanged(auth, callback);
}

// Check if email is verified
export function isEmailVerified(): boolean {
  return auth.currentUser?.emailVerified ?? false;
}

// Reload user data
export async function reloadUser(): Promise<void> {
  const user = auth.currentUser;
  if (user) {
    await user.reload();
  }
}

// Get ID token for API calls
export async function getIdToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (user) {
    return user.getIdToken();
  }
  return null;
}
