import { create } from 'zustand';
import { getLevelFromXP, getXPForNextLevel, getTitleForLevel } from '../constants/theme';

export interface PendingReward {
  id: string;
  type: 'xp' | 'badge' | 'level_up' | 'mission_complete';
  amount?: number;
  badgeId?: string;
  newLevel?: number;
  missionTitle?: string;
}

export interface GameState {
  // Local XP tracking (for animations)
  displayXP: number;
  displayLevel: number;

  // Pending rewards to show
  pendingRewards: PendingReward[];

  // Animation states
  isAnimatingXP: boolean;
  showLevelUpModal: boolean;
  levelUpData: { oldLevel: number; newLevel: number } | null;

  // Actions
  setDisplayXP: (xp: number) => void;
  addXP: (amount: number) => void;
  addPendingReward: (reward: PendingReward) => void;
  removePendingReward: (id: string) => void;
  clearPendingRewards: () => void;
  setAnimatingXP: (animating: boolean) => void;
  showLevelUp: (oldLevel: number, newLevel: number) => void;
  hideLevelUp: () => void;

  // Computed
  getProgress: () => { current: number; max: number; percentage: number };
  getTitle: () => string;
}

export const useGameStore = create<GameState>((set, get) => ({
  displayXP: 0,
  displayLevel: 1,
  pendingRewards: [],
  isAnimatingXP: false,
  showLevelUpModal: false,
  levelUpData: null,

  setDisplayXP: (xp) => {
    const newLevel = getLevelFromXP(xp);
    set({ displayXP: xp, displayLevel: newLevel });
  },

  addXP: (amount) => {
    const currentXP = get().displayXP;
    const oldLevel = getLevelFromXP(currentXP);
    const newXP = currentXP + amount;
    const newLevel = getLevelFromXP(newXP);

    set({ displayXP: newXP, displayLevel: newLevel, isAnimatingXP: true });

    // Check for level up
    if (newLevel > oldLevel) {
      get().showLevelUp(oldLevel, newLevel);
    }

    // Reset animation state after animation completes
    setTimeout(() => set({ isAnimatingXP: false }), 1000);
  },

  addPendingReward: (reward) =>
    set((state) => ({
      pendingRewards: [...state.pendingRewards, reward],
    })),

  removePendingReward: (id) =>
    set((state) => ({
      pendingRewards: state.pendingRewards.filter((r) => r.id !== id),
    })),

  clearPendingRewards: () => set({ pendingRewards: [] }),

  setAnimatingXP: (animating) => set({ isAnimatingXP: animating }),

  showLevelUp: (oldLevel, newLevel) =>
    set({
      showLevelUpModal: true,
      levelUpData: { oldLevel, newLevel },
    }),

  hideLevelUp: () =>
    set({
      showLevelUpModal: false,
      levelUpData: null,
    }),

  getProgress: () => {
    const { displayXP, displayLevel } = get();
    const currentLevelXP =
      displayLevel > 1
        ? getXPForNextLevel(displayLevel - 1)
        : 0;
    const nextLevelXP = getXPForNextLevel(displayLevel);
    const current = displayXP - currentLevelXP;
    const max = nextLevelXP - currentLevelXP;
    const percentage = max > 0 ? (current / max) * 100 : 0;
    return { current, max, percentage };
  },

  getTitle: () => getTitleForLevel(get().displayLevel),
}));
