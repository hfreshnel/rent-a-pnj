// ──────────────────────────────────────
// Daily missions
// ──────────────────────────────────────

export interface MockDailyMission {
  id: string;
  title: string;
  description: string;
  xp: number;
  progress: number;
  target: number;
  icon: string;
}

export const MOCK_DAILY_MISSIONS: MockDailyMission[] = [
  { id: '1', title: 'Premier contact', description: 'Réserve ton premier PNJ', xp: 100, progress: 0, target: 1, icon: '🎯' },
  { id: '2', title: 'Curieux', description: 'Consulte 5 profils de PNJ', xp: 50, progress: 2, target: 5, icon: '👀' },
  { id: '3', title: 'Sociable', description: 'Envoie un message', xp: 30, progress: 0, target: 1, icon: '💬' },
];

// ──────────────────────────────────────
// Achievements
// ──────────────────────────────────────

export interface MockAchievement {
  id: string;
  title: string;
  description: string;
  xp: number;
  unlocked: boolean;
  icon: string;
}

export const MOCK_ACHIEVEMENTS: MockAchievement[] = [
  { id: 'a1', title: 'Premier pas', description: 'Premier booking complété', xp: 200, unlocked: false, icon: '🎯' },
  { id: 'a2', title: 'Habitué', description: '5 bookings complétés', xp: 500, unlocked: false, icon: '⭐' },
  { id: 'a3', title: 'Collectionneur', description: '10 PNJ différents rencontrés', xp: 300, unlocked: false, icon: '🏆' },
];
