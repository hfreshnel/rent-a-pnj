import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, spacing, borderRadius, textStyles } from '@/theme';

export type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral';

export type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export function Badge({
  label,
  variant = 'primary',
  size = 'md',
  icon,
  style,
}: BadgeProps) {
  return (
    <View
      style={[
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        style,
      ]}
    >
      {icon}
      <Text style={[styles.text, styles[`text_${variant}`], styles[`textSize_${size}`]]}>
        {label}
      </Text>
    </View>
  );
}

// Notification badge (circular)
interface NotificationBadgeProps {
  count: number;
  maxCount?: number;
  style?: ViewStyle;
}

export function NotificationBadge({
  count,
  maxCount = 99,
  style,
}: NotificationBadgeProps) {
  if (count <= 0) return null;

  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

  return (
    <View style={[styles.notificationBadge, style]}>
      <Text style={styles.notificationText}>{displayCount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },

  // Variants
  primary: {
    backgroundColor: colors.primary[500] + '20',
  },
  secondary: {
    backgroundColor: colors.secondary[500] + '20',
  },
  success: {
    backgroundColor: colors.success + '20',
  },
  warning: {
    backgroundColor: colors.warning + '20',
  },
  error: {
    backgroundColor: colors.error + '20',
  },
  info: {
    backgroundColor: colors.info + '20',
  },
  neutral: {
    backgroundColor: colors.bg.tertiary,
  },

  // Sizes
  size_sm: {
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
  },
  size_md: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },

  // Text
  text: {
    ...textStyles.caption,
    fontWeight: '600',
  },
  text_primary: {
    color: colors.primary[400],
  },
  text_secondary: {
    color: colors.secondary[400],
  },
  text_success: {
    color: colors.success,
  },
  text_warning: {
    color: colors.warning,
  },
  text_error: {
    color: colors.error,
  },
  text_info: {
    color: colors.info,
  },
  text_neutral: {
    color: colors.text.secondary,
  },

  textSize_sm: {
    fontSize: 10,
  },
  textSize_md: {
    fontSize: 12,
  },

  // Notification badge
  notificationBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notificationText: {
    ...textStyles.caption,
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
});
