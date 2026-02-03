# React Native UI Component System

A scalable architecture for building maintainable React Native applications with consistent styling, reusable components, and design tokens.

---

## Table of Contents

1. [Directory Structure](#directory-structure)
2. [Design Tokens](#design-tokens)
3. [Style Functions Pattern](#style-functions-pattern)
4. [Variant-Based Components](#variant-based-components)
5. [Core Hooks](#core-hooks)
6. [Base Components](#base-components)
7. [Component Composition](#component-composition)
8. [Best Practices](#best-practices)

---

## Directory Structure

Organize components into atomic primitives and domain-specific modules:

```
src/
├── components/
│   ├── ui/                    # Atomic/primitive components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── loading-spinner.tsx
│   │   ├── toast.tsx
│   │   └── toast-container.tsx
│   ├── screen.tsx             # Layout wrappers
│   ├── safe-component.tsx     # Error boundaries
│   └── [domain]-*.tsx         # Domain-specific components
├── constants/
│   └── theme.ts               # Design tokens
├── hooks/
│   ├── use-styles.ts          # Style memoization hook
│   └── use-theme.ts           # Theme access hook
└── types/
    └── theme.ts               # Type definitions
```

**Principles:**
- `ui/` contains only reusable primitives with no business logic
- Domain components compose primitives for specific features
- Layout components handle safe areas, keyboard, and scrolling

---

## Design Tokens

Centralize all design values in a single constants file. This ensures consistency and makes global changes trivial.

```typescript
// src/constants/theme.ts

export const SPACING = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
} as const;

export const RADIUS = {
  s: 4,
  m: 12,
  l: 20,
  full: 999,
} as const;

export const TYPOGRAPHY = {
  h1: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
  },
  h2: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
  },
} as const;

export const SHADOWS = {
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
} as const;
```

**Usage in components:**
```typescript
import { SPACING, RADIUS, TYPOGRAPHY } from '@/constants/theme';

const styles = StyleSheet.create({
  container: {
    padding: SPACING.m,
    borderRadius: RADIUS.m,
  },
  title: {
    ...TYPOGRAPHY.h1,
  },
});
```

---

## Style Functions Pattern

Generate styles dynamically based on theme or props. This pattern enables theme-aware styling while maintaining type safety.

### Basic Pattern

```typescript
import { StyleSheet } from 'react-native';
import { Theme } from '@/types/theme';
import { SPACING, RADIUS } from '@/constants/theme';

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      padding: SPACING.m,
      borderRadius: RADIUS.m,
    },
    title: {
      color: theme.colors.text,
      fontSize: 18,
      fontWeight: '600',
    },
    subtitle: {
      color: theme.colors.textMuted,
      fontSize: 14,
    },
  });

// In component:
const MyComponent = () => {
  const theme = useTheme();
  const styles = useStyles(getStyles);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Title</Text>
    </View>
  );
};
```

### With Props

```typescript
type Size = 'small' | 'medium' | 'large';

const getStyles = (theme: Theme, size: Size) =>
  StyleSheet.create({
    container: {
      padding: size === 'small' ? SPACING.s : size === 'medium' ? SPACING.m : SPACING.l,
    },
  });

// In component:
const styles = useMemo(() => getStyles(theme, size), [theme, size]);
```

---

## Variant-Based Components

Build components with predefined visual variants. This ensures consistency while providing flexibility.

### Button Example

```typescript
import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Theme } from '@/types/theme';
import { SPACING, RADIUS } from '@/constants/theme';

type Variant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const getVariantStyles = (theme: Theme, variant: Variant) => {
  const variants = {
    primary: {
      container: { backgroundColor: theme.colors.primary },
      text: { color: theme.colors.onPrimary },
    },
    secondary: {
      container: { backgroundColor: theme.colors.surfaceVariant },
      text: { color: theme.colors.text },
    },
    outline: {
      container: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.primary,
      },
      text: { color: theme.colors.primary },
    },
    danger: {
      container: { backgroundColor: theme.colors.danger },
      text: { color: theme.colors.onPrimary },
    },
    ghost: {
      container: { backgroundColor: 'transparent' },
      text: { color: theme.colors.primary },
    },
  };
  return variants[variant];
};

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  loadingText,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const theme = useTheme();
  const variantStyles = getVariantStyles(theme, variant);
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={[
        styles.base,
        variantStyles.container,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <>
          <ActivityIndicator size="small" color={variantStyles.text.color} />
          {loadingText && (
            <Text style={[styles.text, variantStyles.text, styles.loadingText, textStyle]}>
              {loadingText}
            </Text>
          )}
        </>
      ) : (
        <Text style={[styles.text, variantStyles.text, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.s + 4,
    paddingHorizontal: SPACING.m,
    borderRadius: RADIUS.m,
    minHeight: 48,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    marginLeft: SPACING.s,
  },
});
```

### Size Variants Pattern

```typescript
type Size = 'small' | 'medium' | 'large';

const SIZE_CONFIG = {
  small: { fontSize: 20, iconSize: 16, padding: SPACING.s },
  medium: { fontSize: 28, iconSize: 20, padding: SPACING.m },
  large: { fontSize: 36, iconSize: 24, padding: SPACING.l },
} as const;

interface DisplayProps {
  value: string;
  size?: Size;
}

export const Display: React.FC<DisplayProps> = ({ value, size = 'medium' }) => {
  const config = SIZE_CONFIG[size];

  return (
    <View style={{ padding: config.padding }}>
      <Text style={{ fontSize: config.fontSize }}>{value}</Text>
    </View>
  );
};
```

---

## Core Hooks

### useStyles Hook

Memoize style generation to prevent unnecessary recalculations:

```typescript
// src/hooks/use-styles.ts
import { useMemo } from 'react';
import { useTheme } from './use-theme';
import { Theme } from '@/types/theme';

export function useStyles<T>(styleGenerator: (theme: Theme) => T): T {
  const theme = useTheme();
  return useMemo(() => styleGenerator(theme), [theme, styleGenerator]);
}
```

### useTheme Hook

Access the current theme (implementation depends on your theme management):

```typescript
// src/hooks/use-theme.ts
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from '@/theme';

export function useTheme() {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? darkTheme : lightTheme;
}
```

---

## Base Components

### Screen Wrapper

Handle safe areas and keyboard avoiding in one place:

```typescript
// src/components/screen.tsx
import React from 'react';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import { useTheme } from '@/hooks/use-theme';

interface ScreenProps {
  children: React.ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

export const Screen: React.FC<ScreenProps> = ({
  children,
  scroll = false,
  style,
  contentStyle,
}) => {
  const theme = useTheme();

  const content = scroll ? (
    <ScrollView
      contentContainerStyle={[styles.scrollContent, contentStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    children
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }, style]}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {content}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  keyboard: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
```

### Safe Component (Error Boundary)

Wrap components with error handling and suspense:

```typescript
// src/components/safe-component.tsx
import React, { Component, Suspense, ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LoadingSpinner } from './ui/loading-spinner';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<{ children: ReactNode; fallback?: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Something went wrong</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

interface SafeComponentProps {
  children: ReactNode;
  fallback?: ReactNode;
  loadingFallback?: ReactNode;
}

export const SafeComponent: React.FC<SafeComponentProps> = ({
  children,
  fallback,
  loadingFallback = <LoadingSpinner />,
}) => (
  <ErrorBoundary fallback={fallback}>
    <Suspense fallback={loadingFallback}>{children}</Suspense>
  </ErrorBoundary>
);

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
  },
});
```

### Input Component

```typescript
// src/components/ui/input.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { SPACING, RADIUS, TYPOGRAPHY } from '@/constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  left,
  right,
  style,
  ...props
}) => {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  const hasError = !!error;

  // Dynamic border color based on state
  let borderColor = theme.colors.outline;
  if (hasError) borderColor = theme.colors.danger;
  else if (focused) borderColor = theme.colors.primary;

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.colors.surface,
            borderColor,
          },
        ]}
      >
        {left && <View style={styles.iconLeft}>{left}</View>}
        <TextInput
          style={[
            styles.input,
            { color: theme.colors.text },
            left && styles.inputWithLeft,
            right && styles.inputWithRight,
            style,
          ]}
          placeholderTextColor={theme.colors.textMuted}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {right && <View style={styles.iconRight}>{right}</View>}
      </View>
      {(error || helperText) && (
        <Text
          style={[
            styles.helperText,
            { color: hasError ? theme.colors.danger : theme.colors.textMuted },
          ]}
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.m,
  },
  label: {
    ...TYPOGRAPHY.body,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: RADIUS.m,
    minHeight: 48,
  },
  input: {
    flex: 1,
    ...TYPOGRAPHY.body,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
  },
  inputWithLeft: {
    paddingLeft: SPACING.xs,
  },
  inputWithRight: {
    paddingRight: SPACING.xs,
  },
  iconLeft: {
    paddingLeft: SPACING.m,
  },
  iconRight: {
    paddingRight: SPACING.m,
  },
  helperText: {
    ...TYPOGRAPHY.caption,
    marginTop: SPACING.xs,
  },
});
```

---

## Component Composition

Build complex UI by composing smaller components:

### Compound Component Pattern

```typescript
// Card with header, body, and footer slots
interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}

const CardHeader: React.FC<CardHeaderProps> = ({ title, subtitle, right }) => {
  const theme = useTheme();
  return (
    <View style={cardStyles.header}>
      <View style={cardStyles.headerText}>
        <Text style={[cardStyles.title, { color: theme.colors.text }]}>{title}</Text>
        {subtitle && (
          <Text style={[cardStyles.subtitle, { color: theme.colors.textMuted }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {right}
    </View>
  );
};

const CardBody: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={cardStyles.body}>{children}</View>
);

const CardFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={cardStyles.footer}>{children}</View>
);

const Card: React.FC<CardProps> & {
  Header: typeof CardHeader;
  Body: typeof CardBody;
  Footer: typeof CardFooter;
} = ({ children, style }) => {
  const theme = useTheme();
  return (
    <View style={[cardStyles.container, { backgroundColor: theme.colors.surface }, style]}>
      {children}
    </View>
  );
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

// Usage:
<Card>
  <Card.Header title="Settings" subtitle="Manage your preferences" />
  <Card.Body>
    <Text>Content here</Text>
  </Card.Body>
  <Card.Footer>
    <Button title="Save" onPress={handleSave} />
  </Card.Footer>
</Card>
```

### Action Grid Pattern

```typescript
interface ActionItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description?: string;
  color: string;
  onPress: () => void;
}

interface ActionGridProps {
  items: ActionItem[];
  columns?: number;
}

export const ActionGrid: React.FC<ActionGridProps> = ({ items, columns = 2 }) => {
  const theme = useTheme();

  return (
    <View style={gridStyles.container}>
      {items.map((item, index) => (
        <TouchableOpacity
          key={item.id}
          style={[
            gridStyles.item,
            {
              backgroundColor: theme.colors.surface,
              width: `${100 / columns - 2}%`,
            },
          ]}
          onPress={item.onPress}
        >
          <View style={[gridStyles.iconContainer, { backgroundColor: item.color + '20' }]}>
            {item.icon}
          </View>
          <Text style={[gridStyles.title, { color: theme.colors.text }]}>
            {item.title}
          </Text>
          {item.description && (
            <Text style={[gridStyles.description, { color: theme.colors.textMuted }]}>
              {item.description}
            </Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};
```

---

## Best Practices

### 1. Keep Components Pure
Components should only receive data through props and not access global state directly (except through hooks).

### 2. Use TypeScript Strictly
Define interfaces for all props and theme types:

```typescript
interface Theme {
  colors: {
    primary: string;
    primaryDark: string;
    onPrimary: string;
    secondary: string;
    background: string;
    surface: string;
    surfaceVariant: string;
    text: string;
    textMuted: string;
    outline: string;
    success: string;
    danger: string;
    warning: string;
  };
}
```

### 3. Consistent Naming
- Files: `kebab-case.tsx`
- Components: `PascalCase`
- Hooks: `useCamelCase`
- Style functions: `getStyles` or `get[Component]Styles`

### 4. Accessibility
Always include accessibility props:

```typescript
<TouchableOpacity
  accessibilityRole="button"
  accessibilityLabel="Submit form"
  accessibilityState={{ disabled: isDisabled, busy: isLoading }}
>
```

### 5. Performance
- Use `useMemo` for style generation
- Use `useCallback` for event handlers passed to children
- Avoid inline styles for repeated elements

### 6. Testing
Structure components to be easily testable:
- Export style functions separately for snapshot testing
- Accept all dependencies through props or hooks
- Avoid side effects in render

---

## Checklist for New Components

- [ ] Define TypeScript interface for props
- [ ] Support theme via `useTheme()` hook
- [ ] Use design tokens from constants
- [ ] Add accessibility attributes
- [ ] Handle loading/disabled states if interactive
- [ ] Export from index file
- [ ] Document variants and props with JSDoc
