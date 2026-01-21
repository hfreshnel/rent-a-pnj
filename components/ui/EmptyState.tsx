import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SearchX, Inbox, Users, Calendar } from 'lucide-react-native';
import { colors, spacing, textStyles } from '@/theme';
import { Button } from './Button';

type EmptyStateType = 'search' | 'inbox' | 'users' | 'calendar' | 'generic';

interface EmptyStateProps {
  type?: EmptyStateType;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

const ICONS: Record<EmptyStateType, React.ReactNode> = {
  search: <SearchX size={64} color={colors.text.tertiary} />,
  inbox: <Inbox size={64} color={colors.text.tertiary} />,
  users: <Users size={64} color={colors.text.tertiary} />,
  calendar: <Calendar size={64} color={colors.text.tertiary} />,
  generic: <Inbox size={64} color={colors.text.tertiary} />,
};

export function EmptyState({
  type = 'generic',
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {icon || ICONS[type]}
      </View>

      <Text style={styles.title}>{title}</Text>

      {description && (
        <Text style={styles.description}>{description}</Text>
      )}

      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="primary"
          size="md"
          style={styles.button}
        />
      )}
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
  iconContainer: {
    marginBottom: spacing.lg,
    opacity: 0.5,
  },
  title: {
    ...textStyles.h4,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  description: {
    ...textStyles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    maxWidth: 280,
  },
  button: {
    marginTop: spacing.lg,
  },
});
