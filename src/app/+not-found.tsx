import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../theme';
import { Screen } from '../components/layout/screen';
import { Button } from '../components/ui';
import { SPACING, TYPOGRAPHY } from '../constants/theme';

export default function NotFoundScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.emoji}>🔍</Text>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Page introuvable
        </Text>
        <Text style={[styles.description, { color: theme.colors.textMuted }]}>
          Oups ! Cette page n'existe pas ou a été déplacée.
        </Text>
        <Button
          title="Retour à l'accueil"
          onPress={() => router.replace('/')}
          variant="primary"
          size="large"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  emoji: {
    fontSize: 80,
    marginBottom: SPACING.l,
  },
  title: {
    ...TYPOGRAPHY.h2,
    textAlign: 'center',
    marginBottom: SPACING.s,
  },
  description: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
});
