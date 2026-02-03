import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Screen } from '../../components/layout/screen';
import { Avatar, Badge, Button, Card } from '../../components/ui';
import { SPACING, TYPOGRAPHY } from '../../constants/theme';
import { useAuthStore } from '../../stores/authStore';
import { useGameStore } from '../../stores/gameStore';
import { useTheme } from '../../theme';

export default function PlayerHomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const displayLevel = useGameStore((s) => s.displayLevel);
  const getProgress = useGameStore((s) => s.getProgress);
  const getTitle = useGameStore((s) => s.getTitle);

  const progress = getProgress();
  const title = getTitle();

  return (
    <Screen scroll>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.colors.textMuted }]}>
              Salut,
            </Text>
            <Text style={[styles.userName, { color: theme.colors.text }]}>
              {user?.displayName || 'Aventurier'} 👋
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(player)/profile')}>
            <Avatar
              source={user?.avatar}
              name={user?.displayName}
              size="md"
              badge={
                <View
                  style={[
                    styles.levelBadge,
                    { backgroundColor: theme.colors.primary },
                  ]}
                >
                  <Text style={styles.levelText}>{displayLevel}</Text>
                </View>
              }
            />
          </TouchableOpacity>
        </View>

        {/* Level Progress Card */}
        <Card style={styles.levelCard}>
          <Card.Body>
            <View style={styles.levelHeader}>
              <View>
                <Text style={[styles.levelTitle, { color: theme.colors.text }]}>
                  Niveau {displayLevel}
                </Text>
                <Text style={[styles.levelSubtitle, { color: theme.colors.primary }]}>
                  {title}
                </Text>
              </View>
              <Badge label={`${Math.round(progress.percentage)}%`} variant="primary" />
            </View>
            <View style={[styles.progressBar, { backgroundColor: theme.colors.surfaceVariant }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: theme.colors.primary,
                    width: `${progress.percentage}%`,
                  },
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: theme.colors.textMuted }]}>
              {progress.current} / {progress.max} XP
            </Text>
          </Card.Body>
        </Card>

        {/* Daily Missions Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Missions du jour 🎯
            </Text>
            <TouchableOpacity onPress={() => router.push('/(player)/missions')}>
              <Text style={[styles.seeAll, { color: theme.colors.primary }]}>
                Voir tout
              </Text>
            </TouchableOpacity>
          </View>

          <MissionPreviewCard
            title="Premier contact"
            description="Réserve ton premier PNJ"
            xp={100}
            progress={0}
            target={1}
            theme={theme}
          />
          <MissionPreviewCard
            title="Curieux"
            description="Consulte 5 profils"
            xp={50}
            progress={2}
            target={5}
            theme={theme}
          />
        </View>

        {/* Featured PNJ Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              PNJ à découvrir 🌟
            </Text>
            <TouchableOpacity onPress={() => router.push('/(player)/search')}>
              <Text style={[styles.seeAll, { color: theme.colors.primary }]}>
                Explorer
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pnjScroll}
          >
            <PNJPreviewCard
              name="Alex"
              class="Aventurier"
              emoji="🗡️"
              rating={4.8}
              price={25}
              theme={theme}
              onPress={() => router.push('/(player)/search')}
            />
            <PNJPreviewCard
              name="Marie"
              class="Sage"
              emoji="📚"
              rating={4.9}
              price={30}
              theme={theme}
              onPress={() => router.push('/(player)/search')}
            />
            <PNJPreviewCard
              name="Lucas"
              class="Geek"
              emoji="🎮"
              rating={4.7}
              price={20}
              theme={theme}
              onPress={() => router.push('/(player)/search')}
            />
          </ScrollView>
        </View>

        {/* CTA */}
        <View style={styles.ctaSection}>
          <Button
            title="Trouver un PNJ"
            onPress={() => router.push('/(player)/search')}
            variant="primary"
            size="large"
            fullWidth
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

// Mission Preview Card Component
const MissionPreviewCard = ({
  title,
  description,
  xp,
  progress,
  target,
  theme,
}: {
  title: string;
  description: string;
  xp: number;
  progress: number;
  target: number;
  theme: ReturnType<typeof useTheme>;
}) => (
  <Card style={styles.missionCard}>
    <Card.Body style={styles.missionContent}>
      <View style={styles.missionInfo}>
        <Text style={[styles.missionTitle, { color: theme.colors.text }]}>{title}</Text>
        <Text style={[styles.missionDescription, { color: theme.colors.textMuted }]}>
          {description}
        </Text>
      </View>
      <View style={styles.missionReward}>
        <Badge label={`+${xp} XP`} variant="primary" size="small" />
        <Text style={[styles.missionProgress, { color: theme.colors.textMuted }]}>
          {progress}/{target}
        </Text>
      </View>
    </Card.Body>
  </Card>
);

// PNJ Preview Card Component
const PNJPreviewCard = ({
  name,
  class: pnjClass,
  emoji,
  rating,
  price,
  theme,
  onPress,
}: {
  name: string;
  class: string;
  emoji: string;
  rating: number;
  price: number;
  theme: ReturnType<typeof useTheme>;
  onPress: () => void;
}) => (
  <TouchableOpacity onPress={onPress}>
    <View style={[styles.pnjCard, { backgroundColor: theme.colors.surface }]}>
      <View style={[styles.pnjAvatar, { backgroundColor: theme.colors.primaryLight }]}>
        <Text style={styles.pnjEmoji}>{emoji}</Text>
      </View>
      <Text style={[styles.pnjName, { color: theme.colors.text }]}>{name}</Text>
      <Text style={[styles.pnjClass, { color: theme.colors.textMuted }]}>{pnjClass}</Text>
      <View style={styles.pnjStats}>
        <Text style={{ color: theme.colors.warning }}>⭐ {rating}</Text>
        <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>{price}€/h</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: SPACING.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.l,
    paddingTop: SPACING.m,
  },
  greeting: {
    ...TYPOGRAPHY.bodySmall,
  },
  userName: {
    ...TYPOGRAPHY.h3,
  },
  levelBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  levelCard: {
    marginBottom: SPACING.l,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.m,
  },
  levelTitle: {
    ...TYPOGRAPHY.h4,
  },
  levelSubtitle: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: SPACING.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    ...TYPOGRAPHY.caption,
    textAlign: 'right',
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
  seeAll: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
  },
  missionCard: {
    marginBottom: SPACING.s,
  },
  missionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  missionReward: {
    alignItems: 'flex-end',
  },
  missionProgress: {
    ...TYPOGRAPHY.caption,
    marginTop: SPACING.xs,
  },
  pnjScroll: {
    gap: SPACING.m,
  },
  pnjCard: {
    width: 140,
    padding: SPACING.m,
    borderRadius: 16,
    alignItems: 'center',
  },
  pnjAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.s,
  },
  pnjEmoji: {
    fontSize: 28,
  },
  pnjName: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
  },
  pnjClass: {
    ...TYPOGRAPHY.caption,
    marginBottom: SPACING.s,
  },
  pnjStats: {
    flexDirection: 'row',
    gap: SPACING.m,
  },
  ctaSection: {
    marginTop: SPACING.m,
  },
});
