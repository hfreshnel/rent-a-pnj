import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trophy, Sparkles, Star, Zap } from 'lucide-react-native';
import { colors, spacing, textStyles } from '@/theme';
import { Button } from '@/components/ui';

const { width } = Dimensions.get('window');

export default function PlayerOnboardingStep3() {
  const router = useRouter();

  const handleComplete = () => {
    // Navigate to main player app
    router.replace('/(player)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
          <View style={[styles.progressDot, styles.progressDotActive]} />
        </View>

        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <View style={styles.iconCircle}>
            <Trophy size={64} color={colors.white} />
          </View>
          <Sparkles
            size={32}
            color={colors.warning}
            style={styles.sparkle1}
          />
          <Star
            size={24}
            color={colors.primary[400]}
            style={styles.sparkle2}
            fill={colors.primary[400]}
          />
        </View>

        {/* Content */}
        <View style={styles.textContent}>
          <Text style={styles.title}>Vis l'aventure gamifiée</Text>
          <Text style={styles.description}>
            Complète des missions, gagne de l'XP et monte en niveau.
            Collectionne des souvenirs uniques de chaque rencontre !
          </Text>
        </View>

        {/* Rewards Preview */}
        <View style={styles.rewardsContainer}>
          <RewardItem
            icon={<Zap size={24} color={colors.warning} />}
            title="Missions quotidiennes"
            description="3 nouvelles missions chaque jour"
          />
          <RewardItem
            icon={<Star size={24} color={colors.primary[400]} fill={colors.primary[400]} />}
            title="Système de niveaux"
            description="Gagne de l'XP et débloque des titres"
          />
          <RewardItem
            icon={<Trophy size={24} color={colors.secondary[400]} />}
            title="Collection de souvenirs"
            description="Chaque rencontre devient une carte"
          />
        </View>

        {/* Navigation */}
        <View style={styles.navigation}>
          <Button
            title="C'est parti !"
            onPress={handleComplete}
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

function RewardItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.rewardItem}>
      <View style={styles.rewardIcon}>{icon}</View>
      <View style={styles.rewardContent}>
        <Text style={styles.rewardTitle}>{title}</Text>
        <Text style={styles.rewardDescription}>{description}</Text>
      </View>
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
    backgroundColor: colors.warning + 'CC',
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
    bottom: 40,
    left: width * 0.2,
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
  rewardsContainer: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg.secondary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    gap: spacing.md,
  },
  rewardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.bg.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardContent: {
    flex: 1,
  },
  rewardTitle: {
    ...textStyles.bodySemiBold,
    color: colors.text.primary,
    marginBottom: 2,
  },
  rewardDescription: {
    ...textStyles.caption,
    color: colors.text.secondary,
  },
  navigation: {
    marginTop: 'auto',
    gap: spacing.sm,
  },
});
