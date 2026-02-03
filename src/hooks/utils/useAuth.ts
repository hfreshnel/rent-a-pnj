import { useEffect, useCallback } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { User as FirebaseUser } from 'firebase/auth';
import { useAuthStore } from '../../stores/authStore';
import { useGameStore } from '../../stores/gameStore';
import {
  subscribeToAuthState,
  logOut,
  registerWithEmail,
  signInWithEmail,
  resetPassword,
  resendEmailVerification,
  isEmailVerified,
} from '../../services/firebase';
import { getUser, createUser, updateLastActive } from '../../services/api/users';
import { User } from '../../types/user';
import { DEBUG_CONFIG } from '../../config/debug';
import { MOCK_USER } from '../../mocks/users';

/**
 * Authentication hook
 *
 * Provides authentication state and actions
 */
export const useAuth = () => {
  const router = useRouter();
  const segments = useSegments();

  const user = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status);
  const setUser = useAuthStore((s) => s.setUser);
  const setStatus = useAuthStore((s) => s.setStatus);
  const logout = useAuthStore((s) => s.logout);

  const setDisplayXP = useGameStore((s) => s.setDisplayXP);

  // Handle auth state changes
  const handleAuthStateChange = useCallback(
    async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setStatus('loading');

        try {
          // Get user document from Firestore
          let userData = await getUser(firebaseUser.uid);

          // If no user document exists, create one
          if (!userData) {
            await createUser(firebaseUser.uid, {
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'Utilisateur',
            });
            userData = await getUser(firebaseUser.uid);
          }

          if (userData) {
            // Update last active
            updateLastActive(firebaseUser.uid);

            // Sync game state
            setDisplayXP(userData.xp);

            setUser(userData);
          } else {
            setStatus('unauthenticated');
          }
        } catch (error) {
          console.error('Error loading user data:', error);
          setStatus('unauthenticated');
        }
      } else {
        logout();
      }
    },
    [setUser, setStatus, logout, setDisplayXP]
  );

  // Subscribe to auth state on mount (or use mock data in offline mode)
  useEffect(() => {
    // OFFLINE MODE: Skip Firebase and use mock data
    if (DEBUG_CONFIG.OFFLINE_MODE) {
      console.log('🔧 OFFLINE MODE: Skipping Firebase connection');
      if (DEBUG_CONFIG.START_AUTHENTICATED) {
        setDisplayXP(MOCK_USER.xp);
        setUser(MOCK_USER);
      } else {
        logout();
      }
      return;
    }

    // ONLINE MODE: Use Firebase auth
    const unsubscribe = subscribeToAuthState(handleAuthStateChange);
    return () => unsubscribe();
  }, [handleAuthStateChange, setUser, logout, setDisplayXP]);

  // Handle routing based on auth state
  useEffect(() => {
    if (status === 'loading' || status === 'idle') return;

    const inAuthGroup = segments[0] === '(auth)';
    const isAuthenticated = status === 'authenticated' && user;

    if (!isAuthenticated && !inAuthGroup) {
      // Not authenticated, redirect to welcome
      router.replace('/(auth)');
    } else if (isAuthenticated && inAuthGroup) {
      // Authenticated, but in auth group
      // Check if user needs onboarding
      if (!user.role || user.role === 'player') {
        router.replace('/(player)');
      } else if (user.role === 'pnj') {
        router.replace('/(pnj)');
      } else {
        // role === 'both', default to player view
        router.replace('/(player)');
      }
    }
  }, [status, user, segments, router]);

  // Register action
  const register = useCallback(
    async (email: string, password: string, displayName: string) => {
      setStatus('loading');
      try {
        const credential = await registerWithEmail(email, password, displayName);
        // User will be handled by auth state listener
        return credential;
      } catch (error) {
        setStatus('unauthenticated');
        throw error;
      }
    },
    [setStatus]
  );

  // Login action
  const login = useCallback(
    async (email: string, password: string) => {
      setStatus('loading');
      try {
        const credential = await signInWithEmail(email, password);
        // User will be handled by auth state listener
        return credential;
      } catch (error) {
        setStatus('unauthenticated');
        throw error;
      }
    },
    [setStatus]
  );

  // Logout action
  const signOut = useCallback(async () => {
    try {
      await logOut();
      logout();
      router.replace('/(auth)');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }, [logout, router]);

  // Forgot password action
  const forgotPassword = useCallback(async (email: string) => {
    await resetPassword(email);
  }, []);

  // Resend verification email
  const sendVerificationEmail = useCallback(async () => {
    await resendEmailVerification();
  }, []);

  // Check email verification status
  const checkEmailVerified = useCallback(() => {
    return isEmailVerified();
  }, []);

  return {
    user,
    status,
    isAuthenticated: status === 'authenticated' && !!user,
    isLoading: status === 'loading' || status === 'idle',

    // Actions
    register,
    login,
    signOut,
    forgotPassword,
    sendVerificationEmail,
    checkEmailVerified,
  };
};

export default useAuth;
