import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../../theme';
import { Button } from '../../../components/ui';
import { SPACING, TYPOGRAPHY } from '../../../constants/theme';

export default function OnboardingPlayerStep1() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        {/* Illustration */}
        <View style={styles.illustration}>
          <Text style={styles.emoji}>🎮</Text>
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Bienvenue, Aventurier !
        </Text>

        {/* Description */}
        <Text style={[styles.description, { color: theme.colors.textMuted }]}>
          Rent a PNJ te permet de trouver des compagnons pour toutes tes activités.
          Musées, restaurants, jeux de société... Plus jamais seul !
        </Text>

        {/* Features */}
        <View style={styles.features}>
          <FeatureItem emoji="🔍" text="Trouve des PNJ près de chez toi" theme={theme} />
          <FeatureItem emoji="📅" text="Réserve en quelques clics" theme={theme} />
          <FeatureItem emoji="💬" text="Discute avant le rendez-vous" theme={theme} />
        </View>
      </View>

      {/* Navigation */}
      <View style={styles.navigation}>
        <View style={styles.dots}>
          <View style={[styles.dot, { backgroundColor: theme.colors.primary }]} />
          <View style={[styles.dot, { backgroundColor: theme.colors.outline }]} />
          <View style={[styles.dot, { backgroundColor: theme.colors.outline }]} />
        </View>

        <Button
          title="Continuer"
          onPress={() => router.push('/(auth)/onboarding-player/step2')}
          variant="primary"
          size="large"
          fullWidth
        />
      </View>
    </View>
  );
}

const FeatureItem = ({
  emoji,
  text,
  theme,
}: {
  emoji: string;
  text: string;
  theme: ReturnType<typeof useTheme>;
}) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureEmoji}>{emoji}</Text>
    <Text style={[styles.featureText, { color: theme.colors.text }]}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.l,
    paddingTop: SPACING.xxl,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  illustration: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  emoji: {
    fontSize: 80,
  },
  title: {
    ...TYPOGRAPHY.h2,
    textAlign: 'center',
    marginBottom: SPACING.m,
  },
  description: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  features: {
    gap: SPACING.m,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureEmoji: {
    fontSize: 24,
    marginRight: SPACING.m,
  },
  featureText: {
    ...TYPOGRAPHY.body,
  },
  navigation: {
    gap: SPACING.l,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.s,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
