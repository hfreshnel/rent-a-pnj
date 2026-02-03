import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import { SPACING, TYPOGRAPHY } from '../../constants/theme';
import { Button } from './button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  style,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      {description && (
        <Text style={[styles.description, { color: theme.colors.textMuted }]}>
          {description}
        </Text>
      )}
      {actionText && onAction && (
        <Button
          title={actionText}
          onPress={onAction}
          variant="primary"
          size="medium"
          style={styles.button}
        />
      )}
    </View>
  );
};

// Specific empty states for common scenarios
export const EmptySearchResults: React.FC<{
  searchTerm?: string;
  onClear?: () => void;
}> = ({ searchTerm, onClear }) => (
  <EmptyState
    title="Aucun résultat"
    description={
      searchTerm
        ? `Aucun résultat pour "${searchTerm}". Essayez avec d'autres termes.`
        : 'Aucun résultat trouvé. Modifiez vos filtres.'
    }
    actionText={onClear ? 'Effacer la recherche' : undefined}
    onAction={onClear}
  />
);

export const EmptyBookings: React.FC<{ onExplore?: () => void }> = ({
  onExplore,
}) => (
  <EmptyState
    title="Pas encore de réservation"
    description="Explorez les PNJ disponibles et réservez votre première aventure !"
    actionText="Explorer"
    onAction={onExplore}
  />
);

export const EmptyMessages: React.FC = () => (
  <EmptyState
    title="Pas de messages"
    description="Les conversations avec les PNJ apparaîtront ici après une réservation."
  />
);

export const EmptyMissions: React.FC = () => (
  <EmptyState
    title="Aucune mission"
    description="Revenez demain pour de nouvelles missions !"
  />
);

export const EmptyCollection: React.FC<{ onExplore?: () => void }> = ({
  onExplore,
}) => (
  <EmptyState
    title="Collection vide"
    description="Complétez des rencontres pour collectionner des souvenirs uniques."
    actionText="Trouver un PNJ"
    onAction={onExplore}
  />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  iconContainer: {
    marginBottom: SPACING.m,
  },
  title: {
    ...TYPOGRAPHY.h3,
    textAlign: 'center',
    marginBottom: SPACING.s,
  },
  description: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    maxWidth: 280,
  },
  button: {
    marginTop: SPACING.l,
  },
});

export default EmptyState;
