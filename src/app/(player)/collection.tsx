import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Screen } from '../../components/layout/screen';
import { EmptyCollection } from '../../components/ui';
import { BORDER_RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';
import { MOCK_SOUVENIRS, MockSouvenir } from '../../mocks';
import { useTheme } from '../../theme';
import { getClassColor, getRarityColor } from '../../theme/types';

export default function CollectionScreen() {
  const theme = useTheme();
  const router = useRouter();

  const renderSouvenir = ({ item }: { item: MockSouvenir }) => {
    const rarityColor = getRarityColor(theme.colors, item.rarity);
    const classColor = getClassColor(theme.colors, item.pnjClass);

    return (
      <TouchableOpacity style={styles.cardWrapper}>
        <View
          style={[
            styles.souvenirCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: rarityColor,
            },
          ]}
        >
          {/* Rarity Glow */}
          <View style={[styles.rarityGlow, { backgroundColor: rarityColor }]} />

          {/* Content */}
          <View style={styles.cardContent}>
            <View
              style={[styles.classIcon, { backgroundColor: classColor + '30' }]}
            >
              <Text style={styles.classEmoji}>🗡️</Text>
            </View>
            <Text style={[styles.pnjName, { color: theme.colors.text }]}>
              {item.pnjName}
            </Text>
            <Text style={[styles.activity, { color: theme.colors.textMuted }]}>
              {item.activity}
            </Text>
            <Text style={[styles.date, { color: theme.colors.textMuted }]}>
              {item.date}
            </Text>
          </View>

          {/* XP Badge */}
          <View style={[styles.xpBadge, { backgroundColor: rarityColor }]}>
            <Text style={styles.xpText}>+{item.xpEarned} XP</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Screen>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Collection ✨
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
            {MOCK_SOUVENIRS.length} souvenirs collectés
          </Text>
        </View>

        {/* Stats */}
        {MOCK_SOUVENIRS.length > 0 && (
          <View style={styles.stats}>
            <StatItem label="Total" value={MOCK_SOUVENIRS.length.toString()} theme={theme} />
            <StatItem label="Rare" value="0" theme={theme} color={theme.colors.info} />
            <StatItem label="Épique" value="0" theme={theme} color={theme.colors.primary} />
            <StatItem label="Légendaire" value="0" theme={theme} color={theme.colors.warning} />
          </View>
        )}

        {/* Collection Grid */}
        {MOCK_SOUVENIRS.length > 0 ? (
          <FlatList
            data={MOCK_SOUVENIRS}
            renderItem={renderSouvenir}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.grid}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <EmptyCollection onExplore={() => router.push('/(player)/search')} />
        )}
      </View>
    </Screen>
  );
}

const StatItem = ({
  label,
  value,
  theme,
  color,
}: {
  label: string;
  value: string;
  theme: ReturnType<typeof useTheme>;
  color?: string;
}) => (
  <View style={styles.statItem}>
    <Text style={[styles.statValue, { color: color || theme.colors.text }]}>
      {value}
    </Text>
    <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: SPACING.m,
  },
  header: {
    marginBottom: SPACING.l,
  },
  title: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.l,
    paddingVertical: SPACING.m,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...TYPOGRAPHY.h3,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
  },
  grid: {
    gap: SPACING.m,
    paddingBottom: SPACING.xxl,
  },
  cardWrapper: {
    flex: 1,
    maxWidth: '50%',
    padding: SPACING.xs,
  },
  souvenirCard: {
    borderRadius: BORDER_RADIUS.l,
    borderWidth: 3,
    overflow: 'hidden',
    aspectRatio: 0.7,
  },
  rarityGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '20%',
    opacity: 0.3,
  },
  cardContent: {
    flex: 1,
    padding: SPACING.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  classIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.s,
  },
  classEmoji: {
    fontSize: 24,
  },
  pnjName: {
    ...TYPOGRAPHY.h4,
    textAlign: 'center',
  },
  activity: {
    ...TYPOGRAPHY.caption,
    textAlign: 'center',
  },
  date: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    marginTop: SPACING.xs,
  },
  xpBadge: {
    position: 'absolute',
    bottom: SPACING.s,
    right: SPACING.s,
    paddingHorizontal: SPACING.s,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.s,
  },
  xpText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});
