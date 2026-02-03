import { TextStyle } from 'react-native';

// PNJ Class types
export type PNJClass =
  | 'adventurer'
  | 'sage'
  | 'bard'
  | 'tank'
  | 'foodie'
  | 'geek'
  | 'artist'
  | 'coach';

// Rarity types for souvenirs
export type Rarity = 'classic' | 'rare' | 'epic' | 'legendary';

export type ColorPalette = {
  // Brand colors
  primary: string;
  primaryDark: string;
  primaryLight: string;
  onPrimary: string;
  secondary: string;
  secondaryDark: string;
  onSecondary: string;

  // Surface & Background
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  surface: string;
  surfaceElevated: string;
  surfaceVariant: string;

  // Content Colors
  text: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  outline: string;

  // Inputs
  inputBackground: string;
  placeholder: string;

  // Feedback
  success: string;
  successLight: string;
  danger: string;
  dangerLight: string;
  warning: string;
  warningLight: string;
  info: string;

  // PNJ Class Colors
  classAdventurer: string;
  classSage: string;
  classBard: string;
  classTank: string;
  classFoodie: string;
  classGeek: string;
  classArtist: string;
  classCoach: string;

  // Rarity Colors
  rarityClassic: string;
  rarityRare: string;
  rarityEpic: string;
  rarityLegendary: string;
};

export type Spacing = {
  xs: number;  // 4
  s: number;   // 8
  m: number;   // 16
  l: number;   // 24
  xl: number;  // 32
  xxl: number; // 48
};

export type BorderRadius = {
  s: number;    // 4
  m: number;    // 12
  l: number;    // 20
  xl: number;   // 24
  full: number; // 9999
};

export type Typography = {
  h1: TextStyle;
  h2: TextStyle;
  h3: TextStyle;
  h4: TextStyle;
  body: TextStyle;
  bodySmall: TextStyle;
  caption: TextStyle;
  button: TextStyle;
};

export type Shadow = {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
};

export type Shadows = {
  small: Shadow;
  medium: Shadow;
  large: Shadow;
};

export type Theme = {
  mode: 'light' | 'dark';
  colors: ColorPalette;
  spacing: Spacing;
  borderRadius: BorderRadius;
  typography: Typography;
  shadows: Shadows;
};

export type ThemeMode = 'system' | 'light' | 'dark';

// Helper function to get class color
export const getClassColor = (colors: ColorPalette, pnjClass: PNJClass): string => {
  const classColors: Record<PNJClass, keyof ColorPalette> = {
    adventurer: 'classAdventurer',
    sage: 'classSage',
    bard: 'classBard',
    tank: 'classTank',
    foodie: 'classFoodie',
    geek: 'classGeek',
    artist: 'classArtist',
    coach: 'classCoach',
  };
  return colors[classColors[pnjClass]];
};

// Helper function to get rarity color
export const getRarityColor = (colors: ColorPalette, rarity: Rarity): string => {
  const rarityColors: Record<Rarity, keyof ColorPalette> = {
    classic: 'rarityClassic',
    rare: 'rarityRare',
    epic: 'rarityEpic',
    legendary: 'rarityLegendary',
  };
  return colors[rarityColors[rarity]];
};
