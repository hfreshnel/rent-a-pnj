import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../../theme';
import { Button, Card } from '../../../components/ui';
import { SPACING, TYPOGRAPHY } from '../../../constants/theme';

/**
 * PNJ Onboarding Screen
 *
 * In a full implementation, this would be a multi-step wizard:
 * - Step 1: Basic info (name, bio)
 * - Step 2: Class selection
 * - Step 3: Hourly rate & location
 * - Step 4: Photo upload
 * - Step 5: Availability calendar
 * - Step 6: Stripe Connect setup
 *
 * For MVP, we'll show a placeholder and redirect to the PNJ dashboard.
 */

export default function OnboardingPNJStart() {
  const theme = useTheme();
  const router = useRouter();

  const handleComplete = () => {
    // In production, this would go through the full onboarding
    // For now, redirect to PNJ dashboard
    router.replace('/(pnj)');
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.emoji}>🗡️</Text>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Deviens un PNJ !
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
          Crée ton profil et commence à recevoir des demandes
        </Text>
      </View>

      {/* Steps Overview */}
      <View style={styles.steps}>
        <StepItem
          number={1}
          title="Ton profil"
          description="Nom, bio, photos"
          theme={theme}
        />
        <StepItem
          number={2}
          title="Ta classe"
          description="Aventurier, Sage, Barde..."
          theme={theme}
        />
        <StepItem
          number={3}
          title="Tes tarifs"
          description="Tarif horaire et zone"
          theme={theme}
        />
        <StepItem
          number={4}
          title="Tes disponibilités"
          description="Configure ton calendrier"
          theme={theme}
        />
        <StepItem
          number={5}
          title="Tes paiements"
          description="Connexion Stripe"
          theme={theme}
        />
      </View>

      {/* Info Card */}
      <Card style={styles.infoCard}>
        <Card.Body>
          <Text style={[styles.infoTitle, { color: theme.colors.text }]}>
            💡 Bon à savoir
          </Text>
          <Text style={[styles.infoText, { color: theme.colors.textMuted }]}>
            • Tarif minimum : 15€/heure{'\n'}
            • Commission plateforme : 20%{'\n'}
            • Paiement sécurisé via Stripe{'\n'}
            • Vérification de profil requise
          </Text>
        </Card.Body>
      </Card>

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          title="Commencer"
          onPress={handleComplete}
          variant="primary"
          size="large"
          fullWidth
        />
        <Button
          title="Plus tard"
          onPress={() => router.replace('/(player)')}
          variant="ghost"
          size="medium"
          fullWidth
          style={{ marginTop: SPACING.m }}
        />
      </View>
    </ScrollView>
  );
}

const StepItem = ({
  number,
  title,
  description,
  theme,
}: {
  number: number;
  title: string;
  description: string;
  theme: ReturnType<typeof useTheme>;
}) => (
  <View style={styles.stepItem}>
    <View style={[styles.stepNumber, { backgroundColor: theme.colors.primary }]}>
      <Text style={[styles.stepNumberText, { color: theme.colors.onPrimary }]}>
        {number}
      </Text>
    </View>
    <View style={styles.stepText}>
      <Text style={[styles.stepTitle, { color: theme.colors.text }]}>{title}</Text>
      <Text style={[styles.stepDescription, { color: theme.colors.textMuted }]}>
        {description}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.l,
    paddingTop: SPACING.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  emoji: {
    fontSize: 64,
    marginBottom: SPACING.m,
  },
  title: {
    ...TYPOGRAPHY.h2,
    textAlign: 'center',
    marginBottom: SPACING.s,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
  },
  steps: {
    marginBottom: SPACING.l,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.m,
  },
  stepNumberText: {
    fontWeight: '700',
    fontSize: 14,
  },
  stepText: {
    flex: 1,
  },
  stepTitle: {
    ...TYPOGRAPHY.h4,
    marginBottom: 2,
  },
  stepDescription: {
    ...TYPOGRAPHY.caption,
  },
  infoCard: {
    marginBottom: SPACING.l,
  },
  infoTitle: {
    ...TYPOGRAPHY.h4,
    marginBottom: SPACING.s,
  },
  infoText: {
    ...TYPOGRAPHY.bodySmall,
    lineHeight: 22,
  },
  actions: {
    marginTop: SPACING.m,
  },
});
