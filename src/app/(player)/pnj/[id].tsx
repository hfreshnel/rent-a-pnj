import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../../theme';
import { Screen } from '../../../components/layout/screen';
import { Button, Card, Avatar, Badge } from '../../../components/ui';
import { PNJ_CLASS_INFO } from '../../../types/pnj';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../../constants/theme';
import { PNJClass } from '../../../theme/types';
import { MOCK_PNJ_DETAIL } from '../../../mocks';

export default function PNJDetailScreen() {
  const { id } = useLocalSearchParams();
  const theme = useTheme();
  const router = useRouter();

  const pnj = MOCK_PNJ_DETAIL; // In real app, fetch by id
  const classInfo = PNJ_CLASS_INFO[pnj.class];

  return (
    <Screen>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={{ color: theme.colors.primary, fontSize: 24 }}>←</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Avatar name={pnj.name} size="xl" />
          <View style={styles.headerInfo}>
            <View style={styles.nameRow}>
              <Text style={[styles.name, { color: theme.colors.text }]}>{pnj.name}</Text>
              {pnj.verified && (
                <Badge label="Vérifié" variant="success" size="small" />
              )}
            </View>
            <View style={styles.classRow}>
              <Text style={styles.classEmoji}>{classInfo.emoji}</Text>
              <Text style={[styles.className, { color: theme.colors.primary }]}>
                {classInfo.label}
              </Text>
              <Text style={[styles.level, { color: theme.colors.textMuted }]}>
                Niv. {pnj.level}
              </Text>
            </View>
            <Text style={[styles.city, { color: theme.colors.textMuted }]}>
              📍 {pnj.city}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statItem, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.statValue, { color: theme.colors.warning }]}>
              ⭐ {pnj.rating}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>
              {pnj.reviewCount} avis
            </Text>
          </View>
          <View style={[styles.statItem, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.statValue, { color: theme.colors.success }]}>
              {pnj.responseRate}%
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>
              Réponse
            </Text>
          </View>
          <View style={[styles.statItem, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>
              {pnj.completedBookings}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>
              Bookings
            </Text>
          </View>
        </View>

        {/* Bio */}
        <Card style={styles.section}>
          <Card.Header title="À propos" />
          <Card.Body>
            <Text style={[styles.bio, { color: theme.colors.textSecondary }]}>
              {pnj.bio}
            </Text>
          </Card.Body>
        </Card>

        {/* Activities */}
        <Card style={styles.section}>
          <Card.Header title="Activités proposées" />
          <Card.Body>
            <View style={styles.tags}>
              {pnj.activities.map((activity) => (
                <View
                  key={activity}
                  style={[styles.tag, { backgroundColor: theme.colors.primaryLight }]}
                >
                  <Text style={[styles.tagText, { color: theme.colors.primary }]}>
                    {activity}
                  </Text>
                </View>
              ))}
            </View>
          </Card.Body>
        </Card>

        {/* Languages */}
        <Card style={styles.section}>
          <Card.Header title="Langues" />
          <Card.Body>
            <View style={styles.tags}>
              {pnj.languages.map((lang) => (
                <View
                  key={lang}
                  style={[styles.tag, { backgroundColor: theme.colors.surfaceVariant }]}
                >
                  <Text style={[styles.tagText, { color: theme.colors.text }]}>
                    {lang}
                  </Text>
                </View>
              ))}
            </View>
          </Card.Body>
        </Card>
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.outline,
          },
        ]}
      >
        <View style={styles.priceContainer}>
          <Text style={[styles.price, { color: theme.colors.primary }]}>
            {pnj.price}€
          </Text>
          <Text style={[styles.priceUnit, { color: theme.colors.textMuted }]}>
            /heure
          </Text>
        </View>
        <Button
          title="Réserver"
          onPress={() => router.push(`/(player)/book/${pnj.id}`)}
          variant="primary"
          size="large"
          style={{ flex: 1 }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 100,
  },
  backButton: {
    padding: SPACING.m,
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.m,
    marginBottom: SPACING.l,
  },
  headerInfo: {
    flex: 1,
    marginLeft: SPACING.m,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.s,
    marginBottom: SPACING.xs,
  },
  name: {
    ...TYPOGRAPHY.h2,
  },
  classRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  classEmoji: {
    fontSize: 16,
  },
  className: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
  },
  level: {
    ...TYPOGRAPHY.caption,
  },
  city: {
    ...TYPOGRAPHY.bodySmall,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.m,
    gap: SPACING.s,
    marginBottom: SPACING.l,
  },
  statItem: {
    flex: 1,
    padding: SPACING.m,
    borderRadius: BORDER_RADIUS.m,
    alignItems: 'center',
  },
  statValue: {
    ...TYPOGRAPHY.h4,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
  },
  section: {
    marginHorizontal: SPACING.m,
    marginBottom: SPACING.m,
  },
  bio: {
    ...TYPOGRAPHY.body,
    lineHeight: 24,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.s,
  },
  tag: {
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  tagText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.m,
    borderTopWidth: 1,
    gap: SPACING.m,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    ...TYPOGRAPHY.h2,
  },
  priceUnit: {
    ...TYPOGRAPHY.body,
  },
});
