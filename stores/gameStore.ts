import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calculateLevel, getLevelProgress, LEVEL_TITLES } from '@/types/mission';

interface PendingXP {
  amount: number;
  source: string;
  timestamp: number;
}

interface LevelUpData {
  previousLevel: number;
  newLevel: number;
  title: string;
}

interface GameState {
  // XP State
  pendingXP: PendingXP[];
  showXPAnimation: boolean;
  currentXPAnimation: PendingXP | null;

  // Level up state
  showLevelUp: boolean;
  levelUpData: LevelUpData | null;

  // Actions
  addPendingXP: (amount: number, source: string) => void;
  processPendingXP: () => PendingXP | null;
  clearPendingXP: () => void;
  setShowXPAnimation: (show: boolean) => void;

  // Level up actions
  triggerLevelUp: (previousLevel: number, newLevel: number) => void;
  dismissLevelUp: () => void;

  // Utility functions
  getLevel: (xp: number) => number;
  getProgress: (xp: number) => number;
  getTitle: (level: number) => string;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial state
      pendingXP: [],
      showXPAnimation: false,
      currentXPAnimation: null,
      showLevelUp: false,
      levelUpData: null,

      // Add XP to pending queue
      addPendingXP: (amount, source) => {
        const pending: PendingXP = {
          amount,
          source,
          timestamp: Date.now(),
        };

        set((state) => ({
          pendingXP: [...state.pendingXP, pending],
        }));
      },

      // Process next pending XP animation
      processPendingXP: () => {
        const { pendingXP } = get();

        if (pendingXP.length === 0) {
          return null;
        }

        const [next, ...rest] = pendingXP;

        set({
          pendingXP: rest,
          currentXPAnimation: next,
          showXPAnimation: true,
        });

        return next;
      },

      // Clear all pending XP
      clearPendingXP: () => {
        set({
          pendingXP: [],
          currentXPAnimation: null,
          showXPAnimation: false,
        });
      },

      // Toggle XP animation visibility
      setShowXPAnimation: (show) => {
        set({
          showXPAnimation: show,
          currentXPAnimation: show ? get().currentXPAnimation : null,
        });
      },

      // Trigger level up modal
      triggerLevelUp: (previousLevel, newLevel) => {
        const title = LEVEL_TITLES[newLevel] || LEVEL_TITLES[
          Object.keys(LEVEL_TITLES)
            .map(Number)
            .filter((l) => l <= newLevel)
            .pop() || 1
        ];

        set({
          showLevelUp: true,
          levelUpData: {
            previousLevel,
            newLevel,
            title,
          },
        });
      },

      // Dismiss level up modal
      dismissLevelUp: () => {
        set({
          showLevelUp: false,
          levelUpData: null,
        });
      },

      // Utility functions
      getLevel: (xp) => calculateLevel(xp),
      getProgress: (xp) => getLevelProgress(xp),
      getTitle: (level) =>
        LEVEL_TITLES[level] ||
        LEVEL_TITLES[
          Object.keys(LEVEL_TITLES)
            .map(Number)
            .filter((l) => l <= level)
            .pop() || 1
        ],
    }),
    {
      name: 'game-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // Only persist pending XP to handle app restarts
        pendingXP: state.pendingXP,
      }),
    }
  )
);
