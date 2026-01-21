import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AlertCircle, WifiOff, ServerCrash } from 'lucide-react-native';
import { colors, spacing, textStyles } from '@/theme';
import { Button } from './Button';

type ErrorType = 'network' | 'server' | 'generic';

interface ErrorStateProps {
  type?: ErrorType;
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

const ERROR_CONFIG: Record<ErrorType, { icon: React.ReactNode; defaultTitle: string; defaultMessage: string }> = {
  network: {
    icon: <WifiOff size={64} color={colors.error} />,
    defaultTitle: 'Pas de connexion',
    defaultMessage: 'Vérifiez votre connexion internet et réessayez.',
  },
  server: {
    icon: <ServerCrash size={64} color={colors.error} />,
    defaultTitle: 'Erreur serveur',
    defaultMessage: 'Nos serveurs rencontrent un problème. Veuillez réessayer plus tard.',
  },
  generic: {
    icon: <AlertCircle size={64} color={colors.error} />,
    defaultTitle: 'Une erreur est survenue',
    defaultMessage: 'Quelque chose s\'est mal passé. Veuillez réessayer.',
  },
};

export function ErrorState({
  type = 'generic',
  title,
  message,
  onRetry,
  retryLabel = 'Réessayer',
}: ErrorStateProps) {
  const config = ERROR_CONFIG[type];

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {config.icon}
      </View>

      <Text style={styles.title}>{title || config.defaultTitle}</Text>

      <Text style={styles.message}>{message || config.defaultMessage}</Text>

      {onRetry && (
        <Button
          title={retryLabel}
          onPress={onRetry}
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
  },
  title: {
    ...textStyles.h4,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  message: {
    ...textStyles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    maxWidth: 280,
  },
  button: {
    marginTop: spacing.lg,
  },
});
