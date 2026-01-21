import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle, Clock, CreditCard, Eye } from 'lucide-react-native';
import { colors, spacing, textStyles, borderRadius } from '@/theme';
import { Button } from '@/components/ui';
import { useToast } from '@/stores';

export default function PNJOnboardingStep5() {
  const router = useRouter();
  const toast = useToast();

  const handleComplete = () => {
    toast.success('Profil créé avec succès !');
    // Navigate to PNJ dashboard
    router.replace('/(pnj)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Progress */}
        <View style={styles.progressContainer}>
          {[1, 2, 3, 4, 5].map((step) => (
            <View
              key={step}
              style={[
                styles.progressDot,
                step === 5 && styles.progressDotActive,
                step < 5 && styles.progressDotCompleted,
              ]}
            />
          ))}
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.stepLabel}>Étape 5/5</Text>
          <Text style={styles.title}>Presque fini !</Text>
          <Text style={styles.subtitle}>
            Voici ce qui se passe ensuite
          </Text>
        </View>

        {/* Success Icon */}
        <View style={styles.successIcon}>
          <CheckCircle size={80} color={colors.success} />
        </View>

        {/* Next Steps */}
        <View style={styles.stepsContainer}>
          <StepItem
            icon={<Eye size={24} color={colors.primary[400]} />}
            title="Vérification du profil"
            description="Notre équipe vérifie ton profil dans les 24-48h"
            status="En cours"
          />
          <StepItem
            icon={<Clock size={24} color={colors.text.secondary} />}
            title="Configuration des disponibilités"
            description="Tu pourras définir tes créneaux horaires depuis ton dashboard"
            status="À faire"
          />
          <StepItem
            icon={<CreditCard size={24} color={colors.text.secondary} />}
            title="Configuration des paiements"
            description="Connecte ton compte Stripe pour recevoir tes paiements"
            status="À faire"
          />
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>En attendant la vérification</Text>
          <Text style={styles.infoText}>
            Tu peux déjà explorer le dashboard, configurer tes disponibilités
            et personnaliser ton profil. Tu seras visible dans la recherche
            une fois vérifié.
          </Text>
        </View>

        {/* Navigation */}
        <View style={styles.navigation}>
          <Button
            title="Accéder à mon dashboard"
            onPress={handleComplete}
            variant="primary"
            size="lg"
            fullWidth
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StepItem({
  icon,
  title,
  description,
  status,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: string;
}) {
  const isInProgress = status === 'En cours';

  return (
    <View style={styles.stepItem}>
      <View style={styles.stepIcon}>{icon}</View>
      <View style={styles.stepContent}>
        <View style={styles.stepHeader}>
          <Text style={styles.stepTitle}>{title}</Text>
          <View
            style={[
              styles.statusBadge,
              isInProgress && styles.statusBadgeActive,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                isInProgress && styles.statusTextActive,
              ]}
            >
              {status}
            </Text>
          </View>
        </View>
        <Text style={styles.stepDescription}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.bg.tertiary,
  },
  progressDotActive: {
    backgroundColor: colors.primary[500],
    width: 24,
  },
  progressDotCompleted: {
    backgroundColor: colors.primary[500],
  },
  header: {
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  stepLabel: {
    ...textStyles.caption,
    color: colors.primary[400],
    marginBottom: spacing.xs,
  },
  title: {
    ...textStyles.h2,
    color: colors.white,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...textStyles.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  successIcon: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  stepsContainer: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  stepItem: {
    flexDirection: 'row',
    backgroundColor: colors.bg.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    gap: spacing.md,
  },
  stepIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.bg.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepContent: {
    flex: 1,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  stepTitle: {
    ...textStyles.bodySemiBold,
    color: colors.text.primary,
    flex: 1,
  },
  statusBadge: {
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.bg.tertiary,
  },
  statusBadgeActive: {
    backgroundColor: colors.primary[500] + '20',
  },
  statusText: {
    ...textStyles.caption,
    color: colors.text.tertiary,
  },
  statusTextActive: {
    color: colors.primary[400],
  },
  stepDescription: {
    ...textStyles.caption,
    color: colors.text.secondary,
  },
  infoBox: {
    backgroundColor: colors.info + '15',
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.info,
    marginBottom: spacing.xl,
  },
  infoTitle: {
    ...textStyles.bodySemiBold,
    color: colors.info,
    marginBottom: spacing.sm,
  },
  infoText: {
    ...textStyles.bodySmall,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  navigation: {
    marginTop: 'auto',
  },
});
