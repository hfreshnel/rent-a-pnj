import { Spacing, BorderRadius, Typography, Shadows } from '../theme/types';

export const SPACING: Spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS: BorderRadius = {
  s: 4,
  m: 12,
  l: 20,
  xl: 24,
  full: 9999,
};

export const TYPOGRAPHY: Typography = {
  h1: {
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 43,
  },
  h2: {
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 29,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
};

export const SHADOWS: Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

// Animation durations
export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500,
};

// Level thresholds for gamification
export const LEVEL_THRESHOLDS = [
  0,      // Level 1
  100,    // Level 2
  300,    // Level 3
  600,    // Level 4
  1000,   // Level 5
  1500,   // Level 6
  2200,   // Level 7
  3000,   // Level 8
  4000,   // Level 9
  5200,   // Level 10
  6600,   // Level 11
  8200,   // Level 12
  10000,  // Level 13
  12000,  // Level 14
  14200,  // Level 15
  16600,  // Level 16
  19200,  // Level 17
  22000,  // Level 18
  25000,  // Level 19
  28200,  // Level 20
];

export const LEVEL_TITLES: Record<number, string> = {
  1: 'Noob',
  5: 'Apprenti Sociable',
  10: 'Aventurier Confirmé',
  15: 'Maître des Rencontres',
  20: 'Légende Locale',
};

// Calculate level from XP
export const getLevelFromXP = (xp: number): number => {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
};

// Get XP required for next level
export const getXPForNextLevel = (currentLevel: number): number => {
  if (currentLevel >= LEVEL_THRESHOLDS.length) {
    return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + 3200;
  }
  return LEVEL_THRESHOLDS[currentLevel];
};

// Get title for level
export const getTitleForLevel = (level: number): string => {
  const titles = Object.keys(LEVEL_TITLES)
    .map(Number)
    .sort((a, b) => b - a);

  for (const threshold of titles) {
    if (level >= threshold) {
      return LEVEL_TITLES[threshold];
    }
  }
  return LEVEL_TITLES[1];
};
