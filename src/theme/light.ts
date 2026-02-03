import { ColorPalette, Theme } from './types';
import { SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '../constants/theme';

const lightPalette: ColorPalette = {
  // Primary - Purple
  primary: '#7950f2',
  primaryDark: '#6741d9',
  primaryLight: '#e5dbff',
  onPrimary: '#ffffff',

  // Secondary - Cyan/Teal
  secondary: '#12b886',
  secondaryDark: '#0ca678',
  onSecondary: '#ffffff',

  // Surface & Background
  background: '#f8f9fa',
  backgroundSecondary: '#ffffff',
  backgroundTertiary: '#e9ecef',
  surface: '#ffffff',
  surfaceElevated: '#ffffff',
  surfaceVariant: '#f1f3f5',

  // Content Colors
  text: '#212529',
  textSecondary: '#495057',
  textMuted: '#868e96',
  textInverse: '#ffffff',
  outline: '#dee2e6',

  // Inputs
  inputBackground: '#ffffff',
  placeholder: '#adb5bd',

  // Feedback
  success: '#40c057',
  successLight: '#d3f9d8',
  danger: '#fa5252',
  dangerLight: '#ffe3e3',
  warning: '#fab005',
  warningLight: '#fff3bf',
  info: '#228be6',

  // PNJ Class Colors
  classAdventurer: '#fa5252',
  classSage: '#228be6',
  classBard: '#fab005',
  classTank: '#868e96',
  classFoodie: '#fd7e14',
  classGeek: '#7950f2',
  classArtist: '#e64980',
  classCoach: '#40c057',

  // Rarity Colors
  rarityClassic: '#868e96',
  rarityRare: '#228be6',
  rarityEpic: '#7950f2',
  rarityLegendary: '#fab005',
};

const light: Theme = {
  mode: 'light',
  colors: lightPalette,
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  typography: TYPOGRAPHY,
  shadows: SHADOWS,
};

export default light;
