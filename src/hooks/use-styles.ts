import { useMemo } from 'react';
import { useTheme } from './use-theme';
import { Theme } from '../theme/types';

/**
 * Hook that memoizes style generation based on the current theme.
 *
 * Usage:
 * ```typescript
 * const styles = useStyles(getStyles);
 *
 * const getStyles = (theme: Theme) => StyleSheet.create({
 *   container: {
 *     backgroundColor: theme.colors.surface,
 *     padding: theme.spacing.m,
 *   },
 * });
 * ```
 */
export function useStyles<T>(styleGenerator: (theme: Theme) => T): T {
  const theme = useTheme();
  return useMemo(() => styleGenerator(theme), [styleGenerator, theme]);
}

/**
 * Hook that memoizes style generation with additional parameters.
 *
 * Usage:
 * ```typescript
 * const styles = useStylesWithParams(
 *   (theme, isActive) => StyleSheet.create({
 *     button: {
 *       backgroundColor: isActive ? theme.colors.primary : theme.colors.surface,
 *     },
 *   }),
 *   isActive
 * );
 * ```
 */
export function useStylesWithParams<T, P extends unknown[]>(
  styleGenerator: (theme: Theme, ...params: P) => T,
  ...params: P
): T {
  const theme = useTheme();
  return useMemo(
    () => styleGenerator(theme, ...params),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [styleGenerator, theme, ...params]
  );
}
