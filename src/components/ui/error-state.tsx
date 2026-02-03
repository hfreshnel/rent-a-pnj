import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import { SPACING, TYPOGRAPHY } from '../../constants/theme';
import { Button } from './button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
  style?: ViewStyle;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Une erreur est survenue',
  message = "Quelque chose s'est mal passé. Veuillez réessayer.",
  onRetry,
  retryText = 'Réessayer',
  style,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: theme.colors.dangerLight },
        ]}
      >
        <Text style={[styles.icon, { color: theme.colors.danger }]}>!</Text>
      </View>
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      <Text style={[styles.message, { color: theme.colors.textMuted }]}>
        {message}
      </Text>
      {onRetry && (
        <Button
          title={retryText}
          onPress={onRetry}
          variant="primary"
          size="medium"
          style={styles.button}
        />
      )}
    </View>
  );
};

// Network error state
export const NetworkError: React.FC<{ onRetry?: () => void }> = ({
  onRetry,
}) => (
  <ErrorState
    title="Pas de connexion"
    message="Vérifiez votre connexion internet et réessayez."
    onRetry={onRetry}
  />
);

// Server error state
export const ServerError: React.FC<{ onRetry?: () => void }> = ({
  onRetry,
}) => (
  <ErrorState
    title="Erreur serveur"
    message="Nos serveurs rencontrent un problème. Veuillez réessayer plus tard."
    onRetry={onRetry}
  />
);

// Not found error state
export const NotFoundError: React.FC<{ onGoBack?: () => void }> = ({
  onGoBack,
}) => (
  <ErrorState
    title="Page introuvable"
    message="Cette page n'existe pas ou a été déplacée."
    onRetry={onGoBack}
    retryText="Retour"
  />
);

// Permission denied error state
export const PermissionError: React.FC<{
  permission?: string;
  onRequestPermission?: () => void;
}> = ({ permission, onRequestPermission }) => (
  <ErrorState
    title="Permission requise"
    message={
      permission
        ? `L'accès à ${permission} est nécessaire pour cette fonctionnalité.`
        : 'Une permission est requise pour accéder à cette fonctionnalité.'
    }
    onRetry={onRequestPermission}
    retryText="Autoriser"
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
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.m,
  },
  icon: {
    fontSize: 32,
    fontWeight: '700',
  },
  title: {
    ...TYPOGRAPHY.h3,
    textAlign: 'center',
    marginBottom: SPACING.s,
  },
  message: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    maxWidth: 280,
  },
  button: {
    marginTop: SPACING.l,
  },
});

export default ErrorState;
