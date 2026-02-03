import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/user';

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthState {
  // User data
  user: User | null;
  status: AuthStatus;

  // Loading states
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setStatus: (status: AuthStatus) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
  initialize: () => void;

  // Computed helpers
  isAuthenticated: () => boolean;
  isPlayer: () => boolean;
  isPNJ: () => boolean;
  isBoth: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      status: 'idle',
      isLoading: false,
      isInitialized: false,

      setUser: (user) => set({
        user,
        status: user ? 'authenticated' : 'unauthenticated',
        isLoading: false,
        isInitialized: true,
      }),

      setStatus: (status) => set({ status, isLoading: status === 'loading' }),

      initialize: () => set({ isInitialized: true, isLoading: false }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      logout: () => set({ user: null, status: 'unauthenticated', isInitialized: true, isLoading: false }),

      isAuthenticated: () => get().status === 'authenticated' && !!get().user,

      isPlayer: () => {
        const role = get().user?.role;
        return role === 'player' || role === 'both';
      },

      isPNJ: () => {
        const role = get().user?.role;
        return role === 'pnj' || role === 'both';
      },

      isBoth: () => get().user?.role === 'both',
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ user: state.user }), // Only persist user
    }
  )
);
