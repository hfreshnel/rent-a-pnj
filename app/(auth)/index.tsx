import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, Sparkles } from 'lucide-react-native';
import { colors, spacing, textStyles } from '@/theme';
import { Button } from '@/components/ui';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={[colors.bg.primary, colors.primary[900], colors.bg.primary]}
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Logo/Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.logoContainer}>
              <View style={styles.iconCircle}>
                <Users size={48} color={colors.white} />
              </View>
              <Sparkles
                size={24}
                color={colors.secondary[400]}
                style={styles.sparkle}
              />
            </View>

            <Text style={styles.title}>PNJ Premium</Text>
            <Text style={styles.subtitle}>
              Trouve ton compagnon d'aventure
            </Text>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.description}>
              Rencontre des personnes passionnantes pour partager des activités,
              explorer de nouveaux horizons et vivre des expériences uniques.
            </Text>
          </View>

          {/* Features */}
          <View style={styles.featuresSection}>
            <FeatureItem
              emoji="🎮"
              text="Gamification unique avec missions et récompenses"
            />
            <FeatureItem
              emoji="🤝"
              text="PNJ vérifiés et passionnés"
            />
            <FeatureItem
              emoji="🔒"
              text="Paiements sécurisés"
            />
          </View>

          {/* CTA Buttons */}
          <View style={styles.ctaSection}>
            <Button
              title="Créer un compte"
              onPress={() => router.push('/(auth)/register')}
              variant="primary"
              size="lg"
              fullWidth
            />

            <Button
              title="Se connecter"
              onPress={() => router.push('/(auth)/login')}
              variant="outline"
              size="lg"
              fullWidth
              style={styles.secondaryButton}
            />
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
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
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
    paddingVertical: spacing.xl,
  },
  heroSection: {
    alignItems: 'center',
    marginTop: spacing['2xl'],
  },
  logoContainer: {
    position: 'relative',
    marginBottom: spacing.lg,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkle: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  title: {
    ...textStyles.h1,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...textStyles.h4,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  descriptionSection: {
    paddingHorizontal: spacing.md,
  },
  description: {
    ...textStyles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresSection: {
    gap: spacing.md,
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
    ...textStyles.bodySmall,
    color: colors.text.primary,
    flex: 1,
  },
  ctaSection: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  secondaryButton: {
    marginTop: 0,
  },
});
