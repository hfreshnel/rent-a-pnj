import { ColorPalette, Theme } from './types';
import { SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '../constants/theme';

const darkPalette: ColorPalette = {
  // Primary - Purple gaming
  primary: '#845ef7',
  primaryDark: '#7048e8',
  primaryLight: '#5f3dc4',
  onPrimary: '#ffffff',

  // Secondary - Cyan/Teal
  secondary: '#20c997',
  secondaryDark: '#12b886',
  onSecondary: '#ffffff',

  // Surface & Background - Dark gaming theme
  background: '#0f0f1a',
  backgroundSecondary: '#1a1a2e',
  backgroundTertiary: '#252542',
  surface: '#1a1a2e',
  surfaceElevated: '#2d2d4a',
  surfaceVariant: '#252542',

  // Content Colors
  text: '#ffffff',
  textSecondary: '#a0a0b8',
  textMuted: '#6c6c80',
  textInverse: '#0f0f1a',
  outline: '#3d3d5c',

  // Inputs
  inputBackground: '#1a1a2e',
  placeholder: '#6c6c80',

  // Feedback
  success: '#51cf66',
  successLight: '#2b8a3e',
  danger: '#ff6b6b',
  dangerLight: '#c92a2a',
  warning: '#fcc419',
  warningLight: '#e67700',
  info: '#339af0',

  // PNJ Class Colors
  classAdventurer: '#ff6b6b',
  classSage: '#339af0',
  classBard: '#fcc419',
  classTank: '#868e96',
  classFoodie: '#ff922b',
  classGeek: '#845ef7',
  classArtist: '#f06595',
  classCoach: '#51cf66',

  // Rarity Colors
  rarityClassic: '#868e96',
  rarityRare: '#339af0',
  rarityEpic: '#845ef7',
  rarityLegendary: '#fcc419',
};

const dark: Theme = {
  mode: 'dark',
  colors: darkPalette,
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  typography: TYPOGRAPHY,
  shadows: SHADOWS,
};

export default dark;
