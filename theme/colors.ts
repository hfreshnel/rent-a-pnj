export const colors = {
  // Primary - Violet gaming
  primary: {
    50: '#f3f0ff',
    100: '#e5dbff',
    200: '#d0bfff',
    300: '#b197fc',
    400: '#9775fa',
    500: '#845ef7',
    600: '#7950f2',
    700: '#7048e8',
    800: '#6741d9',
    900: '#5f3dc4',
  },

  // Secondary - Cyan/Teal
  secondary: {
    50: '#e6fcf5',
    100: '#c3fae8',
    200: '#96f2d7',
    300: '#63e6be',
    400: '#38d9a9',
    500: '#20c997',
    600: '#12b886',
    700: '#0ca678',
    800: '#099268',
    900: '#087f5b',
  },

  // Background - Dark theme
  bg: {
    primary: '#0f0f1a',
    secondary: '#1a1a2e',
    tertiary: '#252542',
    elevated: '#2d2d4a',
  },

  // Text
  text: {
    primary: '#ffffff',
    secondary: '#a0a0b8',
    tertiary: '#6c6c80',
    inverse: '#0f0f1a',
  },

  // Status
  success: '#51cf66',
  warning: '#fcc419',
  error: '#ff6b6b',
  info: '#339af0',

  // Classes PNJ
  classes: {
    adventurer: '#ff6b6b',
    sage: '#339af0',
    bard: '#fcc419',
    tank: '#868e96',
    foodie: '#ff922b',
    geek: '#845ef7',
    artist: '#f06595',
    coach: '#51cf66',
  },

  // Rarity
  rarity: {
    classic: '#868e96',
    rare: '#339af0',
    epic: '#845ef7',
    legendary: '#fcc419',
  },

  // Transparent
  transparent: 'transparent',
  white: '#ffffff',
  black: '#000000',
} as const;

export type ColorKey = keyof typeof colors;
