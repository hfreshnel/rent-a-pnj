import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, spacing, textStyles } from '@/theme';

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingState({
  message = 'Chargement...',
  fullScreen = false,
}: LoadingStateProps) {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size="large" color={colors.primary[500]} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

// Skeleton loading component
interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: object;
}

export function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}: SkeletonProps) {
  return (
    <View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
        },
        style,
      ]}
    />
  );
}

// Card skeleton
export function CardSkeleton() {
  return (
    <View style={styles.cardSkeleton}>
      <View style={styles.cardSkeletonHeader}>
        <Skeleton width={60} height={60} borderRadius={30} />
        <View style={styles.cardSkeletonHeaderText}>
          <Skeleton width="60%" height={16} />
          <Skeleton width="40%" height={14} style={{ marginTop: 8 }} />
        </View>
      </View>
      <Skeleton height={14} style={{ marginTop: 16 }} />
      <Skeleton width="80%" height={14} style={{ marginTop: 8 }} />
    </View>
  );
}

// List skeleton
interface ListSkeletonProps {
  count?: number;
}

export function ListSkeleton({ count = 3 }: ListSkeletonProps) {
  return (
    <View style={styles.listSkeleton}>
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.bg.primary,
    zIndex: 999,
  },
  message: {
    ...textStyles.body,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  skeleton: {
    backgroundColor: colors.bg.tertiary,
    opacity: 0.5,
  },
  cardSkeleton: {
    backgroundColor: colors.bg.secondary,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardSkeletonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardSkeletonHeaderText: {
    flex: 1,
    marginLeft: spacing.md,
  },
  listSkeleton: {
    padding: spacing.md,
  },
});
