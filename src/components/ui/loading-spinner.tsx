import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import { SPACING, TYPOGRAPHY } from '../../constants/theme';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  message?: string;
  fullScreen?: boolean;
  style?: ViewStyle;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color,
  message,
  fullScreen = false,
  style,
}) => {
  const theme = useTheme();
  const spinnerColor = color || theme.colors.primary;

  const content = (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={spinnerColor} />
      {message && (
        <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
          {message}
        </Text>
      )}
    </View>
  );

  if (fullScreen) {
    return (
      <View
        style={[
          styles.fullScreen,
          { backgroundColor: theme.colors.background },
        ]}
      >
        {content}
      </View>
    );
  }

  return content;
};

// Loading overlay that covers the entire screen
interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message,
}) => {
  const theme = useTheme();

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View
        style={[
          styles.overlayContent,
          {
            backgroundColor: theme.colors.surface,
            ...theme.shadows.large,
          },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
        {message && (
          <Text style={[styles.overlayMessage, { color: theme.colors.text }]}>
            {message}
          </Text>
        )}
      </View>
    </View>
  );
};

// Skeleton loader for content placeholders
interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
}) => {
  const theme = useTheme();

  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: theme.colors.surfaceVariant,
        },
        style,
      ]}
    />
  );
};

// Skeleton card for loading states
export const SkeletonCard: React.FC<{ style?: ViewStyle }> = ({ style }) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.skeletonCard,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.outline,
        },
        style,
      ]}
    >
      <View style={styles.skeletonHeader}>
        <Skeleton width={48} height={48} borderRadius={24} />
        <View style={styles.skeletonHeaderText}>
          <Skeleton width="60%" height={16} />
          <Skeleton width="40%" height={12} style={{ marginTop: 8 }} />
        </View>
      </View>
      <Skeleton width="100%" height={12} style={{ marginTop: 16 }} />
      <Skeleton width="80%" height={12} style={{ marginTop: 8 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.l,
  },
  fullScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    ...TYPOGRAPHY.bodySmall,
    marginTop: SPACING.m,
    textAlign: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  overlayContent: {
    padding: SPACING.xl,
    borderRadius: 16,
    alignItems: 'center',
  },
  overlayMessage: {
    ...TYPOGRAPHY.body,
    marginTop: SPACING.m,
  },
  skeletonCard: {
    padding: SPACING.m,
    borderRadius: 12,
    borderWidth: 1,
  },
  skeletonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skeletonHeaderText: {
    flex: 1,
    marginLeft: SPACING.m,
  },
});

export default LoadingSpinner;
