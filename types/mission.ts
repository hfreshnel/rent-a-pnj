import { Timestamp } from 'firebase/firestore';
import { PNJClass } from './pnj';

export type MissionType = 'daily' | 'weekly' | 'achievement';

export type MissionCategory = 'social' | 'exploration' | 'loyalty' | 'special';

export type MissionDifficulty = 'easy' | 'medium' | 'hard';

export type RequirementType =
  | 'complete_booking'
  | 'book_class'
  | 'book_activity'
  | 'book_new_pnj'
  | 'leave_review'
  | 'check_in'
  | 'consecutive_days'
  | 'spend_hours'
  | 'view_profiles';

export interface RequirementFilters {
  activityType?: string;
  pnjClass?: PNJClass;
  minDuration?: number;
}

export interface MissionRequirement {
  type: RequirementType;
  target: number;
  current: number;
  filters?: RequirementFilters;
}

export interface MissionRewards {
  xp: number;
  coins?: number;
  badge?: string;
}

export interface MissionTemplate {
  id: string;
  type: MissionType;
  title: string;
  description: string;
  icon: string;
  requirements: Omit<MissionRequirement, 'current'>[];
  rewards: MissionRewards;
  category: MissionCategory;
  difficulty: MissionDifficulty;
  repeatable: boolean;
}

export interface UserMission {
  id: string;
  templateId: string;
  userId: string;
  type: MissionType;
  title: string;
  description: string;
  icon: string;
  requirements: MissionRequirement[];
  rewards: MissionRewards;
  category: MissionCategory;
  difficulty: MissionDifficulty;
  status: 'active' | 'completed' | 'expired';
  expiresAt?: Timestamp;
  completedAt?: Timestamp;
  createdAt: Timestamp;
}

// Level thresholds
export const LEVEL_THRESHOLDS = [
  0, // Level 1
  100, // Level 2
  300, // Level 3
  600, // Level 4
  1000, // Level 5
  1500, // Level 6
  2200, // Level 7
  3000, // Level 8
  4000, // Level 9
  5200, // Level 10
  6600, // Level 11
  8200, // Level 12
  10000, // Level 13
  12000, // Level 14
  14200, // Level 15
  16600, // Level 16
  19200, // Level 17
  22000, // Level 18
  25000, // Level 19
  28200, // Level 20
];

export const LEVEL_TITLES: Record<number, string> = {
  1: 'Noob',
  5: 'Apprenti Sociable',
  10: 'Aventurier Confirmé',
  15: 'Maître des Rencontres',
  20: 'Légende Locale',
};

// Helper to calculate level from XP
export function calculateLevel(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
}

// Helper to get XP needed for next level
export function getXpForNextLevel(currentLevel: number): number {
  if (currentLevel >= LEVEL_THRESHOLDS.length) {
    return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  }
  return LEVEL_THRESHOLDS[currentLevel];
}

// Helper to get current level progress percentage
export function getLevelProgress(xp: number): number {
  const currentLevel = calculateLevel(xp);
  const currentLevelXp = LEVEL_THRESHOLDS[currentLevel - 1] || 0;
  const nextLevelXp = LEVEL_THRESHOLDS[currentLevel] || currentLevelXp + 1000;
  const progress = (xp - currentLevelXp) / (nextLevelXp - currentLevelXp);
  return Math.min(Math.max(progress, 0), 1);
}
