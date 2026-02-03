import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../theme';
import { Screen } from '../../components/layout/screen';
import { Card, Badge } from '../../components/ui';
import { SPACING, TYPOGRAPHY } from '../../constants/theme';
import { MOCK_DAILY_MISSIONS, MOCK_ACHIEVEMENTS, MockDailyMission, MockAchievement } from '../../mocks';

export default function MissionsScreen() {
  const theme = useTheme();

  return (
    <Screen scroll>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Missions 🎯
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
            Complète des missions pour gagner de l'XP
          </Text>
        </View>

        {/* Daily Missions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Missions du jour
            </Text>
            <Text style={[styles.timer, { color: theme.colors.primary }]}>
              ⏱️ 23h restantes
            </Text>
          </View>

          {MOCK_DAILY_MISSIONS.map((mission) => (
            <MissionCard key={mission.id} mission={mission} theme={theme} />
          ))}
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Succès
            </Text>
          </View>

          {MOCK_ACHIEVEMENTS.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              theme={theme}
            />
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const MissionCard = ({
  mission,
  theme,
}: {
  mission: MockDailyMission;
  theme: ReturnType<typeof useTheme>;
}) => {
  const progress = (mission.progress / mission.target) * 100;
  const isComplete = mission.progress >= mission.target;

  return (
    <Card style={[styles.missionCard, isComplete && { opacity: 0.6 }]}>
      <Card.Body>
        <View style={styles.missionHeader}>
          <View style={styles.missionIcon}>
            <Text style={styles.missionEmoji}>{mission.icon}</Text>
          </View>
          <View style={styles.missionInfo}>
            <Text style={[styles.missionTitle, { color: theme.colors.text }]}>
              {mission.title}
            </Text>
            <Text style={[styles.missionDescription, { color: theme.colors.textMuted }]}>
              {mission.description}
            </Text>
          </View>
          <Badge
            label={isComplete ? '✓' : `+${mission.xp} XP`}
            variant={isComplete ? 'success' : 'primary'}
            size="small"
          />
        </View>
        <View style={styles.progressContainer}>
          <View
            style={[styles.progressBar, { backgroundColor: theme.colors.surfaceVariant }]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: isComplete
                    ? theme.colors.success
                    : theme.colors.primary,
                  width: `${progress}%`,
                },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: theme.colors.textMuted }]}>
            {mission.progress}/{mission.target}
          </Text>
        </View>
      </Card.Body>
    </Card>
  );
};

const AchievementCard = ({
  achievement,
  theme,
}: {
  achievement: MockAchievement;
  theme: ReturnType<typeof useTheme>;
}) => (
  <Card style={[styles.achievementCard, !achievement.unlocked && { opacity: 0.5 }]}>
    <Card.Body style={styles.achievementContent}>
      <View
        style={[
          styles.achievementIcon,
          {
            backgroundColor: achievement.unlocked
              ? theme.colors.primaryLight
              : theme.colors.surfaceVariant,
          },
        ]}
      >
        <Text style={styles.achievementEmoji}>{achievement.icon}</Text>
      </View>
      <View style={styles.achievementInfo}>
        <Text style={[styles.achievementTitle, { color: theme.colors.text }]}>
          {achievement.title}
        </Text>
        <Text style={[styles.achievementDescription, { color: theme.colors.textMuted }]}>
          {achievement.description}
        </Text>
      </View>
      <Badge
        label={achievement.unlocked ? '✓' : `+${achievement.xp}`}
        variant={achievement.unlocked ? 'success' : 'default'}
        size="small"
      />
    </Card.Body>
  </Card>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: SPACING.xxl,
  },
  header: {
    marginBottom: SPACING.l,
    paddingTop: SPACING.m,
  },
  title: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
  },
  section: {
    marginBottom: SPACING.l,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h4,
  },
  timer: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
  },
  missionCard: {
    marginBottom: SPACING.s,
  },
  missionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  missionIcon: {
    marginRight: SPACING.m,
  },
  missionEmoji: {
    fontSize: 28,
  },
  missionInfo: {
    flex: 1,
  },
  missionTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
  },
  missionDescription: {
    ...TYPOGRAPHY.caption,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    marginRight: SPACING.s,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    ...TYPOGRAPHY.caption,
    minWidth: 30,
    textAlign: 'right',
  },
  achievementCard: {
    marginBottom: SPACING.s,
  },
  achievementContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.m,
  },
  achievementEmoji: {
    fontSize: 24,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
  },
  achievementDescription: {
    ...TYPOGRAPHY.caption,
  },
});
