import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, ChevronRight, Zap, Trophy, Sparkles } from 'lucide-react-native';
import { colors, spacing, textStyles, borderRadius } from '@/theme';
import { Avatar, Card, Badge, ListSkeleton } from '@/components/ui';
import { useAuthStore } from '@/stores';
import { useCurrentUser, useSuggestedPNJ } from '@/hooks';
import { calculateLevel, getLevelProgress } from '@/types/mission';
import { PNJCardData } from '@/types';

export default function PlayerHomeScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { data: suggestedPNJ, isLoading: pnjLoading } = useSuggestedPNJ(4);

  const level = user ? calculateLevel(user.xp) : 1;
  const progress = user ? getLevelProgress(user.xp) : 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Salut {user?.displayName?.split(' ')[0]} !</Text>
            <Text style={styles.subtitle}>Prêt pour une nouvelle aventure ?</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(player)/profile')}>
            <Avatar source={user?.avatar} name={user?.displayName} size="lg" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => router.push('/(player)/search')}
        >
          <Search size={20} color={colors.text.tertiary} />
          <Text style={styles.searchPlaceholder}>Rechercher un PNJ...</Text>
        </TouchableOpacity>

        {/* Level Progress Card */}
        <Card variant="elevated" style={styles.levelCard}>
          <View style={styles.levelHeader}>
            <View style={styles.levelInfo}>
              <View style={styles.levelBadge}>
                <Trophy size={16} color={colors.warning} />
                <Text style={styles.levelText}>Niveau {level}</Text>
              </View>
              <Text style={styles.xpText}>{user?.xp || 0} XP</Text>
            </View>
            <TouchableOpacity
              style={styles.collectionsLink}
              onPress={() => router.push('/(player)/collection')}
            >
              <Sparkles size={16} color={colors.primary[400]} />
              <Text style={styles.collectionsText}>Ma collection</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.progressBarContainer}>
            <View
              style={[styles.progressBar, { width: `${progress * 100}%` }]}
            />
          </View>
        </Card>

        {/* Daily Missions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Zap size={20} color={colors.warning} />
              <Text style={styles.sectionTitle}>Missions du jour</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(player)/missions')}>
              <Text style={styles.seeAllText}>Voir tout</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.missionsScroll}
          >
            <MissionCard
              title="Premier contact"
              description="Envoie un message à un PNJ"
              xp={50}
              progress={0}
              target={1}
            />
            <MissionCard
              title="Explorateur"
              description="Consulte 5 profils de PNJ"
              xp={30}
              progress={2}
              target={5}
            />
            <MissionCard
              title="Social"
              description="Réserve un PNJ"
              xp={100}
              progress={0}
              target={1}
            />
          </ScrollView>
        </View>

        {/* Suggested PNJ */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>PNJ suggérés</Text>
            <TouchableOpacity onPress={() => router.push('/(player)/search')}>
              <Text style={styles.seeAllText}>Voir tout</Text>
            </TouchableOpacity>
          </View>

          {pnjLoading ? (
            <ListSkeleton count={2} />
          ) : (
            <View style={styles.pnjGrid}>
              {suggestedPNJ?.map((pnj) => (
                <PNJCard key={pnj.id} pnj={pnj} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Mission Card Component
function MissionCard({
  title,
  description,
  xp,
  progress,
  target,
}: {
  title: string;
  description: string;
  xp: number;
  progress: number;
  target: number;
}) {
  const progressPercent = (progress / target) * 100;

  return (
    <Card style={styles.missionCard}>
      <View style={styles.missionHeader}>
        <Badge label={`+${xp} XP`} variant="warning" size="sm" />
      </View>
      <Text style={styles.missionTitle}>{title}</Text>
      <Text style={styles.missionDescription}>{description}</Text>
      <View style={styles.missionProgressContainer}>
        <View style={styles.missionProgressBar}>
          <View
            style={[styles.missionProgress, { width: `${progressPercent}%` }]}
          />
        </View>
        <Text style={styles.missionProgressText}>
          {progress}/{target}
        </Text>
      </View>
    </Card>
  );
}

// PNJ Card Component (compact version)
function PNJCard({ pnj }: { pnj: PNJCardData }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.pnjCard}
      onPress={() => router.push(`/(player)/pnj/${pnj.id}`)}
      activeOpacity={0.7}
    >
      <Avatar source={pnj.avatar} name={pnj.displayName} size="lg" />
      <View style={styles.pnjInfo}>
        <Text style={styles.pnjName} numberOfLines={1}>
          {pnj.displayName}
        </Text>
        <Text style={styles.pnjClass}>
          {pnj.class.charAt(0).toUpperCase() + pnj.class.slice(1)}
        </Text>
        <View style={styles.pnjMeta}>
          <Text style={styles.pnjRating}>
            {'⭐'} {pnj.rating.toFixed(1)}
          </Text>
          <Text style={styles.pnjPrice}>{pnj.hourlyRate}€/h</Text>
        </View>
      </View>
      <ChevronRight size={20} color={colors.text.tertiary} />
    </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  greeting: {
    ...textStyles.h3,
    color: colors.white,
  },
  subtitle: {
    ...textStyles.body,
    color: colors.text.secondary,
    marginTop: 2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg.secondary,
    marginHorizontal: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  searchPlaceholder: {
    ...textStyles.body,
    color: colors.text.tertiary,
  },
  levelCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  levelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning + '20',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  levelText: {
    ...textStyles.bodySemiBold,
    color: colors.warning,
    fontSize: 14,
  },
  xpText: {
    ...textStyles.bodySmall,
    color: colors.text.secondary,
  },
  collectionsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  collectionsText: {
    ...textStyles.bodySmall,
    color: colors.primary[400],
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.bg.tertiary,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary[500],
    borderRadius: 4,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionTitle: {
    ...textStyles.h4,
    color: colors.white,
  },
  seeAllText: {
    ...textStyles.bodySmall,
    color: colors.primary[400],
  },
  missionsScroll: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  missionCard: {
    width: 180,
    padding: spacing.md,
  },
  missionHeader: {
    marginBottom: spacing.sm,
  },
  missionTitle: {
    ...textStyles.bodySemiBold,
    color: colors.white,
    marginBottom: 2,
  },
  missionDescription: {
    ...textStyles.caption,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  missionProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  missionProgressBar: {
    flex: 1,
    height: 4,
    backgroundColor: colors.bg.tertiary,
    borderRadius: 2,
    overflow: 'hidden',
  },
  missionProgress: {
    height: '100%',
    backgroundColor: colors.primary[500],
  },
  missionProgressText: {
    ...textStyles.caption,
    color: colors.text.tertiary,
  },
  pnjGrid: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  pnjCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    gap: spacing.md,
  },
  pnjInfo: {
    flex: 1,
  },
  pnjName: {
    ...textStyles.bodySemiBold,
    color: colors.white,
  },
  pnjClass: {
    ...textStyles.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  pnjMeta: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  pnjRating: {
    ...textStyles.caption,
    color: colors.warning,
  },
  pnjPrice: {
    ...textStyles.caption,
    color: colors.primary[400],
  },
});
