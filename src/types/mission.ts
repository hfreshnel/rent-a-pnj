import { Timestamp } from 'firebase/firestore';
import { PNJClass } from '../theme/types';

export type MissionType = 'daily' | 'weekly' | 'achievement';
export type MissionCategory = 'social' | 'exploration' | 'loyalty' | 'special';
export type MissionDifficulty = 'easy' | 'medium' | 'hard';
export type MissionStatus = 'active' | 'completed' | 'expired';

export type RequirementType =
  | 'complete_booking'        // Terminer X bookings
  | 'book_class'              // Booker une classe spécifique
  | 'book_activity'           // Booker une activité spécifique
  | 'book_new_pnj'            // Booker un PNJ jamais rencontré
  | 'leave_review'            // Laisser X reviews
  | 'check_in'                // Faire X check-ins
  | 'consecutive_days'        // Se connecter X jours de suite
  | 'spend_hours';            // Passer X heures avec des PNJ

export interface MissionRequirement {
  type: RequirementType;
  target: number;             // Objectif (ex: 1, 3, 5)
  current: number;            // Progression actuelle
  filters?: {
    activityType?: string;
    pnjClass?: PNJClass;
    minDuration?: number;
  };
}

export interface MissionRewards {
  xp: number;
  coins?: number;             // Monnaie interne (future)
  badge?: string;             // ID du badge débloqué
}

export interface Mission {
  id: string;
  type: MissionType;

  // Affichage
  title: string;              // "Premier Contact"
  description: string;        // "Réserve ton premier PNJ"
  icon: string;               // Emoji ou icon name

  // Conditions
  requirements: MissionRequirement[];

  // Récompenses
  rewards: MissionRewards;

  // Timing
  expiresAt?: Timestamp;      // Pour daily/weekly
  startedAt: Timestamp;
  completedAt?: Timestamp;

  // Status
  status: MissionStatus;

  // Metadata
  category: MissionCategory;
  difficulty: MissionDifficulty;
  repeatable: boolean;
}

// Mission template (used by admin to create missions)
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

// Mission progress (computed)
export interface MissionProgress {
  percentage: number;
  requirementsProgress: {
    type: RequirementType;
    current: number;
    target: number;
    percentage: number;
  }[];
}

// Calculate mission progress
export const calculateMissionProgress = (mission: Mission): MissionProgress => {
  const requirementsProgress = mission.requirements.map((req) => ({
    type: req.type,
    current: req.current,
    target: req.target,
    percentage: Math.min(100, (req.current / req.target) * 100),
  }));

  const totalProgress =
    requirementsProgress.reduce((sum, r) => sum + r.percentage, 0) /
    requirementsProgress.length;

  return {
    percentage: totalProgress,
    requirementsProgress,
  };
};

// Check if mission is completed
export const isMissionCompleted = (mission: Mission): boolean => {
  return mission.requirements.every((req) => req.current >= req.target);
};

// Daily missions examples
export const DAILY_MISSIONS_EXAMPLES: Partial<MissionTemplate>[] = [
  {
    title: 'Petit curieux',
    description: 'Consulte 5 profils de PNJ',
    icon: '👀',
    rewards: { xp: 50 },
    difficulty: 'easy',
  },
  {
    title: 'Sociable',
    description: 'Envoie un message',
    icon: '💬',
    rewards: { xp: 30 },
    difficulty: 'easy',
  },
  {
    title: "L'aventurier",
    description: 'Réserve un PNJ classe Aventurier',
    icon: '🗡️',
    rewards: { xp: 100 },
    difficulty: 'medium',
  },
];

// Achievement missions examples
export const ACHIEVEMENT_MISSIONS_EXAMPLES: Partial<MissionTemplate>[] = [
  {
    title: 'Premier pas',
    description: 'Premier booking complété',
    icon: '🎯',
    rewards: { xp: 200, badge: 'first_step' },
    difficulty: 'easy',
  },
  {
    title: 'Habitué',
    description: '5 bookings complétés',
    icon: '⭐',
    rewards: { xp: 500, badge: 'regular' },
    difficulty: 'medium',
  },
  {
    title: 'Vétéran',
    description: '20 bookings complétés',
    icon: '🏆',
    rewards: { xp: 1000, badge: 'veteran' },
    difficulty: 'hard',
  },
];
