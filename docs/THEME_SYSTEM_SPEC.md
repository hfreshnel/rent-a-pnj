# Theme System Specification

A lightweight, type-safe theming system for React Native applications with automatic light/dark mode support using Zustand.

## Overview

This theme system provides:
- Automatic system preference detection (light/dark)
- User override capability ("system" | "light" | "dark")
- Type-safe theme tokens (colors, spacing, typography, border radius)
- Memoized style generation for performance
- No Context Provider boilerplate (uses Zustand)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    UIStore (Zustand)                        │
│  theme: "system" | "light" | "dark"                         │
│  setTheme(mode) → updates state                             │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    useTheme() Hook                          │
│  1. Get system preference (useColorScheme)                  │
│  2. Get user override (useUIStore)                          │
│  3. Resolve: override > system > default                    │
│  4. Return: Theme object (light or dark)                    │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Components                               │
│  useTheme() → full theme object                             │
│  useStyles(fn) → memoized StyleSheet                        │
└─────────────────────────────────────────────────────────────┘
```

---

## File Structure

```
src/
├── theme/
│   ├── types.ts          # Type definitions
│   ├── light.ts          # Light theme configuration
│   ├── dark.ts           # Dark theme configuration
│   └── index.ts          # Re-exports useTheme hook
├── constants/
│   └── theme.ts          # Shared design tokens (spacing, typography, etc.)
├── store/
│   ├── types.ts          # UIState type definition
│   └── uiStore.ts        # Zustand store for theme state
└── hooks/
    ├── use-theme.ts      # Main theme resolution hook
    └── use-styles.ts     # Memoized style generator hook
```

---

## Implementation

### 1. Type Definitions (`theme/types.ts`)

```typescript
import { TextStyle } from "react-native";

export type ColorPalette = {
  // Brand colors
  primary: string;
  primaryDark: string;
  primaryLight: string;
  onPrimary: string;
  secondary: string;
  onSecondary: string;

  // Surface & Background
  background: string;
  surface: string;
  surfaceVariant: string;

  // Content Colors
  text: string;
  textMuted: string;
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
};

export type Spacing = {
  xs: number;  // 4
  s: number;   // 8
  m: number;   // 16
  l: number;   // 24
  xl: number;  // 32
  xxl: number; // 48
};

export type Theme = {
  mode: "light" | "dark";
  colors: ColorPalette;
  spacing: Spacing;
  borderRadius: {
    s: number;    // 4
    m: number;    // 12
    l: number;    // 20
    full: number; // 999
  };
  typography: {
    h1: TextStyle;
    h2: TextStyle;
    body: TextStyle;
    caption: TextStyle;
  };
};
```

### 2. Shared Constants (`constants/theme.ts`)

```typescript
import { Spacing } from "../theme/types";

export const SPACING: Spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  s: 4,
  m: 12,
  l: 20,
  full: 999,
};

export const TYPOGRAPHY = {
  h1: { fontSize: 24, fontWeight: "700" as const, lineHeight: 32 },
  h2: { fontSize: 20, fontWeight: "600" as const, lineHeight: 28 },
  body: { fontSize: 16, fontWeight: "400" as const, lineHeight: 24 },
  caption: { fontSize: 13, fontWeight: "400" as const, lineHeight: 18 },
};
```

### 3. Light Theme (`theme/light.ts`)

```typescript
import { ColorPalette, Theme } from "./types";
import { SPACING, BORDER_RADIUS, TYPOGRAPHY } from "@/src/constants/theme";

const lightPalette: ColorPalette = {
  primary: "#7c3aed",
  primaryDark: "#6d28d9",
  primaryLight: "#ede9fe",
  onPrimary: "#FFFFFF",
  secondary: "#94a3b8",
  onSecondary: "#FFFFFF",
  background: "#F8FAFC",
  surface: "#FFFFFF",
  surfaceVariant: "#F1F5F9",
  text: "#0F172A",
  textMuted: "#64748b",
  outline: "#E2E8F0",
  inputBackground: "#FFFFFF",
  placeholder: "#94a3b8",
  success: "#22c55e",
  successLight: "#dcfce7",
  danger: "#ef4444",
  dangerLight: "#fee2e2",
  warning: "#f59e0b",
  warningLight: "#fef3c7",
};

const light: Theme = {
  mode: "light" as const,
  colors: lightPalette,
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  typography: TYPOGRAPHY,
};

export default light;
```

### 4. Dark Theme (`theme/dark.ts`)

```typescript
import { ColorPalette, Theme } from "./types";
import { SPACING, BORDER_RADIUS, TYPOGRAPHY } from "@/src/constants/theme";

const darkPalette: ColorPalette = {
  primary: "#a78bfa",        // Lighter for dark backgrounds
  primaryDark: "#7c3aed",
  primaryLight: "#4c1d95",   // Darker variant for dark mode
  onPrimary: "#FFFFFF",
  secondary: "#475569",
  onSecondary: "#F8FAFC",
  background: "#0F172A",
  surface: "#1E293B",
  surfaceVariant: "#334155",
  text: "#F8FAFC",
  textMuted: "#94a3b8",
  outline: "#334155",
  inputBackground: "#0F172A",
  placeholder: "#64748b",
  success: "#4ade80",
  successLight: "#14532d",   // Dark variant
  danger: "#f87171",
  dangerLight: "#7f1d1d",    // Dark variant
  warning: "#fbbf24",
  warningLight: "#78350f",   // Dark variant
};

const dark: Theme = {
  mode: "dark" as const,
  colors: darkPalette,
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  typography: TYPOGRAPHY,
};

export default dark;
```

### 5. Store Types (`store/types.ts`)

```typescript
export type ThemeMode = "system" | "light" | "dark";

export type UIState = {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
};
```

### 6. Zustand Store (`store/uiStore.ts`)

```typescript
import { create } from "zustand";
import { UIState } from "./types";

export const useUIStore = create<UIState>((set) => ({
  theme: "system",
  setTheme: (mode) => set({ theme: mode }),
}));
```

### 7. Theme Hook (`hooks/use-theme.ts`)

```typescript
import { useColorScheme } from "react-native";
import { useUIStore } from "@/src/store/uiStore";
import type { Theme } from "@/src/theme/types";
import light from "@/src/theme/light";
import dark from "@/src/theme/dark";

export function useTheme(): Theme {
  const system = useColorScheme();
  const override = useUIStore((s) => s.theme);

  // Priority: user override > system preference > default light
  const mode = override === "system" || !override
    ? system || "light"
    : override;

  return mode === "dark" ? dark : light;
}
```

### 8. Styles Hook (`hooks/use-styles.ts`)

```typescript
import { useMemo } from "react";
import { useTheme } from "@/src/hooks/use-theme";
import type { Theme } from "@/src/theme/types";

export function useStyles<T>(styleGenerator: (theme: Theme) => T): T {
  const theme = useTheme();
  return useMemo(() => styleGenerator(theme), [styleGenerator, theme]);
}
```

### 9. Theme Index Export (`theme/index.ts`)

```typescript
export { useTheme } from "@/src/hooks/use-theme";
export type { Theme, ColorPalette, Spacing } from "./types";
export { default as light } from "./light";
export { default as dark } from "./dark";
```

---

## Usage Patterns

### Pattern 1: Direct Theme Access (Simple Components)

```typescript
import { View, Text } from "react-native";
import { useTheme } from "@/src/theme";

export function SimpleCard({ title }: { title: string }) {
  const theme = useTheme();

  return (
    <View style={{
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.m,
      borderRadius: theme.borderRadius.m,
    }}>
      <Text style={{
        ...theme.typography.h2,
        color: theme.colors.text,
      }}>
        {title}
      </Text>
    </View>
  );
}
```

### Pattern 2: Memoized Styles (Complex Components)

```typescript
import { View, Text, StyleSheet } from "react-native";
import { useStyles } from "@/src/hooks/use-styles";
import type { Theme } from "@/src/theme/types";

export function ComplexCard({ title, subtitle }: Props) {
  const styles = useStyles(getStyles);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const getStyles = (theme: Theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    borderWidth: 1,
    borderColor: theme.colors.outline,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
});
```

### Pattern 3: Variant-Based Styling

```typescript
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useStyles } from "@/src/hooks/use-styles";
import type { Theme } from "@/src/theme/types";

type Variant = "primary" | "secondary" | "outline" | "danger";

type Props = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
};

export function Button({ title, onPress, variant = "primary", disabled = false }: Props) {
  const styles = useStyles((theme) => getStyles(theme, variant, disabled));

  return (
    <TouchableOpacity style={styles.button} onPress={onPress} disabled={disabled}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const getStyles = (theme: Theme, variant: Variant, disabled: boolean) => {
  const variants = {
    primary: {
      bg: theme.colors.primary,
      border: theme.colors.primary,
      text: theme.colors.onPrimary,
    },
    secondary: {
      bg: theme.colors.surfaceVariant,
      border: theme.colors.outline,
      text: theme.colors.text,
    },
    outline: {
      bg: "transparent",
      border: theme.colors.primary,
      text: theme.colors.primary,
    },
    danger: {
      bg: theme.colors.danger,
      border: theme.colors.danger,
      text: theme.colors.onPrimary,
    },
  };

  const v = variants[variant];

  return StyleSheet.create({
    button: {
      backgroundColor: disabled ? theme.colors.outline : v.bg,
      borderColor: disabled ? theme.colors.outline : v.border,
      borderWidth: 1,
      borderRadius: theme.borderRadius.m,
      paddingVertical: theme.spacing.m,
      paddingHorizontal: theme.spacing.l,
      alignItems: "center",
    },
    text: {
      ...theme.typography.body,
      color: disabled ? theme.colors.textMuted : v.text,
    },
  });
};
```

### Pattern 4: Theme Switching

```typescript
import { View, Text, TouchableOpacity } from "react-native";
import { useUIStore } from "@/src/store/uiStore";
import { useTheme } from "@/src/theme";

export function ThemeSettings() {
  const theme = useTheme();
  const currentMode = useUIStore((s) => s.theme);
  const setTheme = useUIStore((s) => s.setTheme);

  const options = ["system", "light", "dark"] as const;

  return (
    <View>
      {options.map((mode) => (
        <TouchableOpacity
          key={mode}
          onPress={() => setTheme(mode)}
          style={{
            padding: theme.spacing.m,
            backgroundColor: currentMode === mode
              ? theme.colors.primaryLight
              : theme.colors.surface,
          }}
        >
          <Text style={{ color: theme.colors.text }}>
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
```

---

## Installation

### Dependencies

```bash
npm install zustand
# or
yarn add zustand
```

### Setup Checklist

1. Create `src/theme/types.ts` with type definitions
2. Create `src/constants/theme.ts` with shared tokens
3. Create `src/theme/light.ts` and `src/theme/dark.ts`
4. Create `src/theme/index.ts` for exports
5. Create `src/store/types.ts` and `src/store/uiStore.ts`
6. Create `src/hooks/use-theme.ts` and `src/hooks/use-styles.ts`

---

## Design Token Reference

### Colors

| Token | Purpose |
|-------|---------|
| `primary` | Main brand color, buttons, links |
| `primaryDark` | Hover/pressed states |
| `primaryLight` | Backgrounds, highlights |
| `onPrimary` | Text on primary color |
| `background` | App background |
| `surface` | Card/container backgrounds |
| `surfaceVariant` | Secondary surfaces |
| `text` | Primary text |
| `textMuted` | Secondary text, captions |
| `outline` | Borders, dividers |
| `success/danger/warning` | Feedback states |
| `*Light` | Light variants for backgrounds |

### Spacing

| Token | Value | Use Case |
|-------|-------|----------|
| `xs` | 4px | Tight spacing, icons |
| `s` | 8px | Related elements |
| `m` | 16px | Standard padding |
| `l` | 24px | Section spacing |
| `xl` | 32px | Major sections |
| `xxl` | 48px | Page margins |

### Border Radius

| Token | Value | Use Case |
|-------|-------|----------|
| `s` | 4px | Small elements, chips |
| `m` | 12px | Cards, buttons |
| `l` | 20px | Modals, large cards |
| `full` | 999px | Circles, pills |

### Typography

| Style | Size | Weight | Use Case |
|-------|------|--------|----------|
| `h1` | 24px | Bold (700) | Page titles |
| `h2` | 20px | Semi-bold (600) | Section headers |
| `body` | 16px | Regular (400) | Body text |
| `caption` | 13px | Regular (400) | Labels, hints |

---

## Best Practices

1. **Always use theme tokens** - Never hardcode colors, spacing, or typography
2. **Use `useStyles` for complex components** - Ensures memoization
3. **Keep style generators outside components** - Prevents recreation on render
4. **Use semantic color names** - `primary`, `danger` not `purple`, `red`
5. **Test both themes** - Verify contrast and readability in light and dark modes
6. **Use `onPrimary`/`onSecondary`** - For text on colored backgrounds

---

## Extending the System

### Adding New Colors

1. Add type to `ColorPalette` in `types.ts`
2. Add value to both `light.ts` and `dark.ts`

### Adding New Typography Styles

1. Add type to `Theme.typography` in `types.ts`
2. Add style object to `TYPOGRAPHY` in `constants/theme.ts`

### Persisting Theme Preference

Add persistence to the Zustand store:

```typescript
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useUIStore = create(
  persist<UIState>(
    (set) => ({
      theme: "system",
      setTheme: (mode) => set({ theme: mode }),
    }),
    {
      name: "ui-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```
