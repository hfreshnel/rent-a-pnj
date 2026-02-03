import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeMode } from '../theme/types';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

export interface UIState {
  // Theme
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;

  // Loading states
  isLoading: boolean;
  loadingMessage: string | null;
  setLoading: (loading: boolean, message?: string) => void;

  // Toasts
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;

  // Modals
  activeModal: string | null;
  modalData: Record<string, unknown> | null;
  openModal: (modalId: string, data?: Record<string, unknown>) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Theme - default to system
      theme: 'system',
      setTheme: (mode) => set({ theme: mode }),

      // Loading
      isLoading: false,
      loadingMessage: null,
      setLoading: (loading, message) =>
        set({ isLoading: loading, loadingMessage: message || null }),

      // Toasts
      toasts: [],
      addToast: (toast) => {
        const id = Date.now().toString();
        set((state) => ({
          toasts: [...state.toasts, { ...toast, id }],
        }));

        // Auto remove after duration
        const duration = toast.duration || 3000;
        setTimeout(() => {
          get().removeToast(id);
        }, duration);
      },
      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),

      // Modals
      activeModal: null,
      modalData: null,
      openModal: (modalId, data) =>
        set({ activeModal: modalId, modalData: data || null }),
      closeModal: () => set({ activeModal: null, modalData: null }),
    }),
    {
      name: 'ui-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ theme: state.theme }), // Only persist theme
    }
  )
);
