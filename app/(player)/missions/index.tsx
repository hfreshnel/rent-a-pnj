import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Zap, Trophy, Target } from 'lucide-react-native';
import { colors, spacing, textStyles, borderRadius } from '@/theme';
import { Card, Badge } from '@/components/ui';

export default function MissionsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Missions</Text>
          <Text style={styles.subtitle}>Complete des missions pour gagner de l'XP</Text>
        </View>

        {/* Daily Missions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Zap size={20} color={colors.warning} />
            <Text style={styles.sectionTitle}>Missions quotidiennes</Text>
            <Text style={styles.resetTimer}>Reset dans 12h</Text>
          </View>

          <MissionItem
            title="Premier contact"
            description="Envoie un message à un PNJ"
            xp={50}
            progress={0}
            target={1}
            difficulty="easy"
          />
          <MissionItem
            title="Explorateur"
            description="Consulte 5 profils de PNJ"
            xp={30}
            progress={2}
            target={5}
            difficulty="easy"
          />
          <MissionItem
            title="Social"
            description="Réserve un PNJ"
            xp={100}
            progress={0}
            target={1}
            difficulty="medium"
          />
        </View>

        {/* Weekly Missions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Target size={20} color={colors.info} />
            <Text style={styles.sectionTitle}>Missions hebdomadaires</Text>
            <Text style={styles.resetTimer}>Reset lundi</Text>
          </View>

          <MissionItem
            title="Aventurier confirmé"
            description="Complète 2 bookings cette semaine"
            xp={200}
            progress={0}
            target={2}
            difficulty="hard"
          />
          <MissionItem
            title="Critique éclairé"
            description="Laisse 2 avis"
            xp={100}
            progress={1}
            target={2}
            difficulty="medium"
          />
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Trophy size={20} color={colors.secondary[400]} />
            <Text style={styles.sectionTitle}>Succès</Text>
          </View>

          <AchievementItem
            title="Premier pas"
            description="Premier booking complété"
            xp={200}
            unlocked={false}
          />
          <AchievementItem
            title="Habitué"
            description="5 bookings complétés"
            xp={500}
            unlocked={false}
          />
          <AchievementItem
            title="Collectionneur"
            description="Rencontrer 10 PNJ différents"
            xp={300}
            unlocked={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MissionItem({
  title,
  description,
  xp,
  progress,
  target,
  difficulty,
}: {
  title: string;
  description: string;
  xp: number;
  progress: number;
  target: number;
  difficulty: 'easy' | 'medium' | 'hard';
}) {
  const progressPercent = (progress / target) * 100;
  const isComplete = progress >= target;

  const difficultyColors = {
    easy: colors.success,
    medium: colors.warning,
    hard: colors.error,
  };

  return (
    <Card style={[styles.missionCard, isComplete && styles.missionCardComplete]}>
      <View style={styles.missionHeader}>
        <View>
          <Text style={styles.missionTitle}>{title}</Text>
          <Text style={styles.missionDescription}>{description}</Text>
        </View>
        <Badge label={`+${xp} XP`} variant="warning" size="sm" />
      </View>
      <View style={styles.missionFooter}>
        <View style={styles.missionProgressContainer}>
          <View style={styles.missionProgressBar}>
            <View
              style={[
                styles.missionProgress,
                { width: `${progressPercent}%` },
                isComplete && { backgroundColor: colors.success },
              ]}
            />
          </View>
          <Text style={styles.missionProgressText}>
            {progress}/{target}
          </Text>
        </View>
        <View style={[styles.difficultyDot, { backgroundColor: difficultyColors[difficulty] }]} />
      </View>
    </Card>
  );
}

function AchievementItem({
  title,
  description,
  xp,
  unlocked,
}: {
  title: string;
  description: string;
  xp: number;
  unlocked: boolean;
}) {
  return (
    <Card style={[styles.achievementCard, !unlocked && styles.achievementLocked]}>
      <View style={styles.achievementIcon}>
        <Trophy size={24} color={unlocked ? colors.warning : colors.text.tertiary} />
      </View>
      <View style={styles.achievementContent}>
        <Text style={[styles.achievementTitle, !unlocked && styles.textLocked]}>
          {title}
        </Text>
        <Text style={styles.achievementDescription}>{description}</Text>
      </View>
      <Badge
        label={`+${xp} XP`}
        variant={unlocked ? 'warning' : 'neutral'}
        size="sm"
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  title: {
    ...textStyles.h2,
    color: colors.white,
  },
  subtitle: {
    ...textStyles.body,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  sectionTitle: {
    ...textStyles.h4,
    color: colors.white,
    flex: 1,
  },
  resetTimer: {
    ...textStyles.caption,
    color: colors.text.tertiary,
  },
  missionCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  missionCardComplete: {
    borderColor: colors.success,
    borderWidth: 1,
  },
  missionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  missionTitle: {
    ...textStyles.bodySemiBold,
    color: colors.white,
    marginBottom: 2,
  },
  missionDescription: {
    ...textStyles.bodySmall,
    color: colors.text.secondary,
  },
  missionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  missionProgressContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  missionProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: colors.bg.tertiary,
    borderRadius: 3,
    overflow: 'hidden',
  },
  missionProgress: {
    height: '100%',
    backgroundColor: colors.primary[500],
    borderRadius: 3,
  },
  missionProgressText: {
    ...textStyles.caption,
    color: colors.text.tertiary,
    minWidth: 30,
  },
  difficultyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  achievementLocked: {
    opacity: 0.6,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.bg.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    ...textStyles.bodySemiBold,
    color: colors.white,
    marginBottom: 2,
  },
  textLocked: {
    color: colors.text.secondary,
  },
  achievementDescription: {
    ...textStyles.caption,
    color: colors.text.tertiary,
  },
});
