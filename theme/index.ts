export { colors } from './colors';
export { fonts, fontSizes, fontWeights, lineHeights, textStyles } from './typography';
export { spacing, borderRadius, shadows } from './spacing';

// Class icons mapping (using Lucide icon names)
export const classIcons = {
  adventurer: 'Sword',
  sage: 'BookOpen',
  bard: 'Music',
  tank: 'Shield',
  foodie: 'UtensilsCrossed',
  geek: 'Gamepad2',
  artist: 'Palette',
  coach: 'Dumbbell',
} as const;

// Class emoji mapping for fallback
export const classEmojis = {
  adventurer: '🗡️',
  sage: '📚',
  bard: '🎭',
  tank: '🛡️',
  foodie: '🍜',
  geek: '🎮',
  artist: '🎨',
  coach: '💪',
} as const;

// Class display names
export const classNames = {
  adventurer: 'Aventurier',
  sage: 'Sage',
  bard: 'Barde',
  tank: 'Tank',
  foodie: 'Glouton',
  geek: 'Geek',
  artist: 'Artiste',
  coach: 'Coach',
} as const;
