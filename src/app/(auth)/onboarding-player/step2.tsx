import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../../theme';
import { Button } from '../../../components/ui';
import { SPACING, TYPOGRAPHY } from '../../../constants/theme';

export default function OnboardingPlayerStep2() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        {/* Illustration */}
        <View style={styles.illustration}>
          <Text style={styles.emoji}>🎯</Text>
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Des missions pour progresser
        </Text>

        {/* Description */}
        <Text style={[styles.description, { color: theme.colors.textMuted }]}>
          Complète des missions quotidiennes, gagne de l'XP et monte en niveau.
          Chaque rencontre te rapproche du statut de Légende !
        </Text>

        {/* Level Preview */}
        <View style={[styles.levelPreview, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.levelRow}>
            <Text style={[styles.levelLabel, { color: theme.colors.textMuted }]}>
              Niveau 1
            </Text>
            <Text style={[styles.levelTitle, { color: theme.colors.primary }]}>
              Noob
            </Text>
          </View>
          <View style={[styles.xpBar, { backgroundColor: theme.colors.surfaceVariant }]}>
            <View
              style={[
                styles.xpBarFill,
                { backgroundColor: theme.colors.primary, width: '10%' },
              ]}
            />
          </View>
          <Text style={[styles.xpText, { color: theme.colors.textMuted }]}>
            0 / 100 XP
          </Text>
        </View>

        {/* Reward Tiers */}
        <View style={styles.tiers}>
          <TierItem emoji="🥉" level="5" title="Apprenti" theme={theme} />
          <TierItem emoji="🥈" level="10" title="Confirmé" theme={theme} />
          <TierItem emoji="🥇" level="20" title="Légende" theme={theme} />
        </View>
      </View>

      {/* Navigation */}
      <View style={styles.navigation}>
        <View style={styles.dots}>
          <View style={[styles.dot, { backgroundColor: theme.colors.outline }]} />
          <View style={[styles.dot, { backgroundColor: theme.colors.primary }]} />
          <View style={[styles.dot, { backgroundColor: theme.colors.outline }]} />
        </View>

        <Button
          title="Continuer"
          onPress={() => router.push('/(auth)/onboarding-player/step3')}
          variant="primary"
          size="large"
          fullWidth
        />
      </View>
    </View>
  );
}

const TierItem = ({
  emoji,
  level,
  title,
  theme,
}: {
  emoji: string;
  level: string;
  title: string;
  theme: ReturnType<typeof useTheme>;
}) => (
  <View style={styles.tierItem}>
    <Text style={styles.tierEmoji}>{emoji}</Text>
    <Text style={[styles.tierLevel, { color: theme.colors.textMuted }]}>Niv. {level}</Text>
    <Text style={[styles.tierTitle, { color: theme.colors.text }]}>{title}</Text>
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
  levelPreview: {
    padding: SPACING.m,
    borderRadius: 16,
    marginBottom: SPACING.l,
  },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.s,
  },
  levelLabel: {
    ...TYPOGRAPHY.caption,
  },
  levelTitle: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
  },
  xpBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: SPACING.xs,
  },
  xpBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  xpText: {
    ...TYPOGRAPHY.caption,
    textAlign: 'right',
  },
  tiers: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tierItem: {
    alignItems: 'center',
  },
  tierEmoji: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  tierLevel: {
    ...TYPOGRAPHY.caption,
  },
  tierTitle: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
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
