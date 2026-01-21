import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

export interface Modal {
  id: string;
  component: React.ComponentType<unknown>;
  props?: Record<string, unknown>;
}

interface UIState {
  // Toast state
  toasts: Toast[];
  addToast: (type: ToastType, message: string, duration?: number) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;

  // Modal state
  modals: Modal[];
  openModal: (id: string, component: React.ComponentType<unknown>, props?: Record<string, unknown>) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;

  // Loading state
  globalLoading: boolean;
  loadingMessage: string | null;
  setGlobalLoading: (loading: boolean, message?: string) => void;

  // Bottom sheet state
  bottomSheetOpen: boolean;
  bottomSheetContent: React.ReactNode | null;
  openBottomSheet: (content: React.ReactNode) => void;
  closeBottomSheet: () => void;

  // Keyboard state
  keyboardVisible: boolean;
  setKeyboardVisible: (visible: boolean) => void;

  // Tab bar visibility
  tabBarVisible: boolean;
  setTabBarVisible: (visible: boolean) => void;
}

let toastIdCounter = 0;

export const useUIStore = create<UIState>((set, get) => ({
  // Toast state
  toasts: [],

  addToast: (type, message, duration = 3000) => {
    const id = `toast-${++toastIdCounter}`;
    const toast: Toast = { id, type, message, duration };

    set((state) => ({
      toasts: [...state.toasts, toast],
    }));

    // Auto-remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    }
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  clearToasts: () => {
    set({ toasts: [] });
  },

  // Modal state
  modals: [],

  openModal: (id, component, props) => {
    set((state) => ({
      modals: [...state.modals, { id, component, props }],
    }));
  },

  closeModal: (id) => {
    set((state) => ({
      modals: state.modals.filter((m) => m.id !== id),
    }));
  },

  closeAllModals: () => {
    set({ modals: [] });
  },

  // Loading state
  globalLoading: false,
  loadingMessage: null,

  setGlobalLoading: (loading, message = null) => {
    set({
      globalLoading: loading,
      loadingMessage: message || null,
    });
  },

  // Bottom sheet state
  bottomSheetOpen: false,
  bottomSheetContent: null,

  openBottomSheet: (content) => {
    set({
      bottomSheetOpen: true,
      bottomSheetContent: content,
    });
  },

  closeBottomSheet: () => {
    set({
      bottomSheetOpen: false,
      bottomSheetContent: null,
    });
  },

  // Keyboard state
  keyboardVisible: false,
  setKeyboardVisible: (visible) => {
    set({ keyboardVisible: visible });
  },

  // Tab bar visibility
  tabBarVisible: true,
  setTabBarVisible: (visible) => {
    set({ tabBarVisible: visible });
  },
}));

// Convenience hooks for common toast types
export const useToast = () => {
  const addToast = useUIStore((state) => state.addToast);

  return {
    success: (message: string) => addToast('success', message),
    error: (message: string) => addToast('error', message),
    warning: (message: string) => addToast('warning', message),
    info: (message: string) => addToast('info', message),
  };
};
