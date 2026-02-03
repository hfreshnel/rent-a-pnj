import { Timestamp } from 'firebase/firestore';
import { PNJClass, Rarity } from '../theme/types';

export interface SouvenirPNJ {
  id: string;
  displayName: string;
  avatar: string;
  class: PNJClass;
}

export interface SouvenirActivity {
  id: string;
  name: string;
  category: string;
}

export interface SouvenirLocation {
  name: string;
  city: string;
}

export interface Souvenir {
  id: string;
  bookingId: string;

  // Infos de la rencontre
  pnj: SouvenirPNJ;
  activity: SouvenirActivity;
  location: SouvenirLocation;

  date: Timestamp;
  duration: number;           // Minutes

  // Contenu
  cardStyle: Rarity;          // Basé sur XP gagné
  quote?: string;             // Citation mémorable (ajoutée par user)

  // Stats de la rencontre
  xpEarned: number;
  missionCompleted?: string;

  // Timestamps
  createdAt: Timestamp;
}

// Souvenir collection stats
export interface CollectionStats {
  totalSouvenirs: number;
  totalHours: number;
  uniquePNJs: number;
  classesEncountered: PNJClass[];
  activitiesCount: number;
  rarityDistribution: Record<Rarity, number>;
}

// Calculate souvenir rarity based on XP earned
export const getSouvenirRarity = (xpEarned: number): Rarity => {
  if (xpEarned >= 351) return 'legendary';
  if (xpEarned >= 201) return 'epic';
  if (xpEarned >= 101) return 'rare';
  return 'classic';
};

// Calculate collection stats
export const calculateCollectionStats = (souvenirs: Souvenir[]): CollectionStats => {
  const uniquePNJIds = new Set(souvenirs.map((s) => s.pnj.id));
  const uniqueClasses = new Set(souvenirs.map((s) => s.pnj.class));
  const uniqueActivities = new Set(souvenirs.map((s) => s.activity.id));

  const rarityDistribution: Record<Rarity, number> = {
    classic: 0,
    rare: 0,
    epic: 0,
    legendary: 0,
  };
  souvenirs.forEach((s) => {
    rarityDistribution[s.cardStyle]++;
  });

  return {
    totalSouvenirs: souvenirs.length,
    totalHours: souvenirs.reduce((sum, s) => sum + s.duration / 60, 0),
    uniquePNJs: uniquePNJIds.size,
    classesEncountered: Array.from(uniqueClasses),
    activitiesCount: uniqueActivities.size,
    rarityDistribution,
  };
};

// Update souvenir payload (for adding quote)
export interface UpdateSouvenirPayload {
  quote?: string;
}
