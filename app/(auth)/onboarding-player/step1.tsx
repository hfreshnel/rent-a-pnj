import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Sparkles } from 'lucide-react-native';
import { colors, spacing, textStyles } from '@/theme';
import { Button } from '@/components/ui';

const { width } = Dimensions.get('window');

export default function PlayerOnboardingStep1() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Progress */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
        </View>

        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <View style={styles.iconCircle}>
            <Search size={64} color={colors.white} />
          </View>
          <Sparkles
            size={32}
            color={colors.secondary[400]}
            style={styles.sparkle1}
          />
          <Sparkles
            size={24}
            color={colors.primary[400]}
            style={styles.sparkle2}
          />
        </View>

        {/* Content */}
        <View style={styles.textContent}>
          <Text style={styles.title}>Trouve ton PNJ idéal</Text>
          <Text style={styles.description}>
            Explore notre communauté de PNJ passionnés. Chaque profil est unique
            avec sa classe, ses activités favorites et son style.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <FeatureItem emoji="🎮" text="8 classes de PNJ à découvrir" />
          <FeatureItem emoji="📍" text="Recherche par proximité" />
          <FeatureItem emoji="⭐" text="Avis vérifiés" />
        </View>

        {/* Navigation */}
        <View style={styles.navigation}>
          <Button
            title="Suivant"
            onPress={() => router.push('/(auth)/onboarding-player/step2')}
            variant="primary"
            size="lg"
            fullWidth
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

function FeatureItem({ emoji, text }: { emoji: string; text: string }) {
  return (
    <View style={styles.featureItem}>
      <Text style={styles.featureEmoji}>{emoji}</Text>
      <Text style={styles.featureText}>{text}</Text>
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
    backgroundColor: colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkle1: {
    position: 'absolute',
    top: 20,
    right: width * 0.2,
  },
  sparkle2: {
    position: 'absolute',
    bottom: 30,
    left: width * 0.15,
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
  featuresContainer: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg.secondary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    gap: spacing.md,
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureText: {
    ...textStyles.body,
    color: colors.text.primary,
  },
  navigation: {
    marginTop: 'auto',
  },
});
