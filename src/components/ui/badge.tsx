import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import { SPACING, BORDER_RADIUS } from '../../constants/theme';

export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
export type BadgeSize = 'small' | 'medium';

interface BadgeProps {
  label?: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  dot?: boolean;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  size = 'medium',
  icon,
  dot = false,
  style,
}) => {
  const theme = useTheme();

  const variantColors = {
    default: {
      bg: theme.colors.surfaceVariant,
      text: theme.colors.text,
    },
    primary: {
      bg: theme.colors.primaryLight,
      text: theme.colors.primary,
    },
    secondary: {
      bg: theme.colors.surfaceVariant,
      text: theme.colors.secondary,
    },
    success: {
      bg: theme.colors.successLight,
      text: theme.colors.success,
    },
    warning: {
      bg: theme.colors.warningLight,
      text: theme.colors.warning,
    },
    danger: {
      bg: theme.colors.dangerLight,
      text: theme.colors.danger,
    },
    info: {
      bg: theme.colors.surfaceVariant,
      text: theme.colors.info,
    },
  };

  const colors = variantColors[variant];
  const isSmall = size === 'small';

  // Dot badge (no text)
  if (dot) {
    return (
      <View
        style={[
          styles.dot,
          { backgroundColor: colors.text },
          style,
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.bg,
          paddingVertical: isSmall ? 2 : SPACING.xs,
          paddingHorizontal: isSmall ? SPACING.xs : SPACING.s,
        },
        style,
      ]}
    >
      {icon && <View style={styles.icon}>{icon}</View>}
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: colors.text,
              fontSize: isSmall ? 10 : 12,
            },
          ]}
        >
          {label}
        </Text>
      )}
    </View>
  );
};

// Notification badge for counts
interface NotificationBadgeProps {
  count: number;
  maxCount?: number;
  style?: ViewStyle;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  maxCount = 99,
  style,
}) => {
  const theme = useTheme();

  if (count <= 0) return null;

  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

  return (
    <View
      style={[
        styles.notificationBadge,
        { backgroundColor: theme.colors.danger },
        style,
      ]}
    >
      <Text style={styles.notificationText}>{displayCount}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.full,
  },
  icon: {
    marginRight: SPACING.xs,
  },
  label: {
    fontWeight: '600',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  notificationBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notificationText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
});

export default Badge;
