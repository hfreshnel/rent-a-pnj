import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, MapPin, CreditCard, Sparkles } from 'lucide-react-native';
import { colors, spacing, textStyles } from '@/theme';
import { Button } from '@/components/ui';

const { width } = Dimensions.get('window');

export default function PlayerOnboardingStep2() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressDot} />
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={styles.progressDot} />
        </View>

        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <View style={styles.iconCircle}>
            <Calendar size={64} color={colors.white} />
          </View>
          <Sparkles
            size={32}
            color={colors.secondary[400]}
            style={styles.sparkle1}
          />
        </View>

        {/* Content */}
        <View style={styles.textContent}>
          <Text style={styles.title}>Réserve en quelques taps</Text>
          <Text style={styles.description}>
            Choisis ton activité, sélectionne un créneau et un lieu de rendez-vous.
            Paiement 100% sécurisé avec Stripe.
          </Text>
        </View>

        {/* Steps */}
        <View style={styles.stepsContainer}>
          <StepItem
            number={1}
            icon={<Calendar size={20} color={colors.primary[400]} />}
            text="Choisis une date et un créneau"
          />
          <StepItem
            number={2}
            icon={<MapPin size={20} color={colors.primary[400]} />}
            text="Sélectionne le lieu de RDV"
          />
          <StepItem
            number={3}
            icon={<CreditCard size={20} color={colors.primary[400]} />}
            text="Paye de manière sécurisée"
          />
        </View>

        {/* Navigation */}
        <View style={styles.navigation}>
          <Button
            title="Suivant"
            onPress={() => router.push('/(auth)/onboarding-player/step3')}
            variant="primary"
            size="lg"
            fullWidth
          />
          <Button
            title="Retour"
            onPress={() => router.back()}
            variant="ghost"
            size="md"
            fullWidth
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

function StepItem({
  number,
  icon,
  text,
}: {
  number: number;
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <View style={styles.stepItem}>
      <View style={styles.stepNumber}>
        <Text style={styles.stepNumberText}>{number}</Text>
      </View>
      <View style={styles.stepIcon}>{icon}</View>
      <Text style={styles.stepText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  content: {
    flex: 1,
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
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    marginBottom: spacing.xl,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.secondary[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkle1: {
    position: 'absolute',
    top: 20,
    right: width * 0.2,
  },
  textContent: {
    marginBottom: spacing.xl,
  },
  title: {
    ...textStyles.h2,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    ...textStyles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  stepsContainer: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg.secondary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    gap: spacing.md,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    ...textStyles.bodySemiBold,
    color: colors.white,
    fontSize: 14,
  },
  stepIcon: {
    width: 32,
    alignItems: 'center',
  },
  stepText: {
    ...textStyles.bodySmall,
    color: colors.text.primary,
    flex: 1,
  },
  navigation: {
    marginTop: 'auto',
    gap: spacing.sm,
  },
});
