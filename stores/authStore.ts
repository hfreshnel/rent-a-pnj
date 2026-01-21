import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserRole } from '@/types';
import {
  signInWithEmail,
  registerWithEmail,
  signOut as firebaseSignOut,
  resetPassword,
  subscribeToAuthState,
  AuthUser,
} from '@/services/firebase/auth';

interface AuthState {
  // State
  user: User | null;
  firebaseUser: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions
  initialize: () => () => void;
  setUser: (user: User | null) => void;
  setFirebaseUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Auth actions
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;

  // Role management
  hasRole: (role: UserRole) => boolean;
  isPNJ: () => boolean;
  isPlayer: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      firebaseUser: null,
      isAuthenticated: false,
      isLoading: true,
      isInitialized: false,
      error: null,

      // Initialize auth state listener
      initialize: () => {
        const unsubscribe = subscribeToAuthState((firebaseUser) => {
          set({
            firebaseUser,
            isAuthenticated: !!firebaseUser,
            isLoading: false,
            isInitialized: true,
          });
        });
        return unsubscribe;
      },

      // Setters
      setUser: (user) => set({ user }),
      setFirebaseUser: (firebaseUser) =>
        set({ firebaseUser, isAuthenticated: !!firebaseUser }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Sign in
      signIn: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          await signInWithEmail(email, password);
          // Firebase user will be set by the auth state listener
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : 'Erreur de connexion';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      // Sign up
      signUp: async (email, password, displayName) => {
        set({ isLoading: true, error: null });
        try {
          await registerWithEmail(email, password, displayName);
          // Firebase user will be set by the auth state listener
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : "Erreur d'inscription";
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      // Sign out
      signOut: async () => {
        set({ isLoading: true, error: null });
        try {
          await firebaseSignOut();
          set({ user: null, firebaseUser: null, isAuthenticated: false });
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : 'Erreur de déconnexion';
          set({ error: errorMessage });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Forgot password
      forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          await resetPassword(email);
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : 'Erreur lors de la réinitialisation';
          set({ error: errorMessage });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Role helpers
      hasRole: (role) => {
        const { user } = get();
        if (!user) return false;
        return user.role === role || user.role === 'both';
      },

      isPNJ: () => {
        const { user } = get();
        return user?.role === 'pnj' || user?.role === 'both';
      },

      isPlayer: () => {
        const { user } = get();
        return user?.role === 'player' || user?.role === 'both';
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);
