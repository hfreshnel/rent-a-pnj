import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../../theme';
import { Button } from '../../../components/ui';
import { SPACING, TYPOGRAPHY } from '../../../constants/theme';

export default function OnboardingPlayerStep3() {
  const theme = useTheme();
  const router = useRouter();

  const handleComplete = () => {
    // Navigate to the main player app
    router.replace('/(player)');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        {/* Illustration */}
        <View style={styles.illustration}>
          <Text style={styles.emoji}>✨</Text>
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Collectionne tes souvenirs
        </Text>

        {/* Description */}
        <Text style={[styles.description, { color: theme.colors.textMuted }]}>
          Après chaque rencontre, reçois une carte souvenir unique. Plus tu
          gagnes d'XP, plus la carte est rare !
        </Text>

        {/* Card Preview */}
        <View style={styles.cardPreview}>
          <View style={[styles.cardStack, { transform: [{ rotate: '-8deg' }] }]}>
            <CardPreview rarity="rare" theme={theme} />
          </View>
          <View style={[styles.cardStack, { transform: [{ rotate: '0deg' }], zIndex: 1 }]}>
            <CardPreview rarity="epic" theme={theme} />
          </View>
          <View style={[styles.cardStack, { transform: [{ rotate: '8deg' }] }]}>
            <CardPreview rarity="legendary" theme={theme} />
          </View>
        </View>

        {/* Rarity Labels */}
        <View style={styles.rarityLabels}>
          <RarityLabel label="Rare" color={theme.colors.info} />
          <RarityLabel label="Épique" color={theme.colors.primary} />
          <RarityLabel label="Légendaire" color={theme.colors.warning} />
        </View>
      </View>

      {/* Navigation */}
      <View style={styles.navigation}>
        <View style={styles.dots}>
          <View style={[styles.dot, { backgroundColor: theme.colors.outline }]} />
          <View style={[styles.dot, { backgroundColor: theme.colors.outline }]} />
          <View style={[styles.dot, { backgroundColor: theme.colors.primary }]} />
        </View>

        <Button
          title="Commencer l'aventure !"
          onPress={handleComplete}
          variant="primary"
          size="large"
          fullWidth
        />
      </View>
    </View>
  );
}

const CardPreview = ({
  rarity,
  theme,
}: {
  rarity: 'rare' | 'epic' | 'legendary';
  theme: ReturnType<typeof useTheme>;
}) => {
  const colors = {
    rare: theme.colors.info,
    epic: theme.colors.primary,
    legendary: theme.colors.warning,
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: colors[rarity],
        },
      ]}
    >
      <View style={[styles.cardShine, { backgroundColor: colors[rarity] }]} />
    </View>
  );
};

const RarityLabel = ({ label, color }: { label: string; color: string }) => (
  <View style={styles.rarityLabel}>
    <View style={[styles.rarityDot, { backgroundColor: color }]} />
    <Text style={[styles.rarityText, { color }]}>{label}</Text>
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
  cardPreview: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  cardStack: {
    marginHorizontal: -20,
  },
  card: {
    width: 100,
    height: 140,
    borderRadius: 12,
    borderWidth: 3,
    overflow: 'hidden',
    ...{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
  },
  cardShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '30%',
    opacity: 0.3,
  },
  rarityLabels: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.l,
  },
  rarityLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rarityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.xs,
  },
  rarityText: {
    ...TYPOGRAPHY.caption,
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
