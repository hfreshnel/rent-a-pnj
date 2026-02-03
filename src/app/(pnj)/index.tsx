import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../theme';
import { Screen } from '../../components/layout/screen';
import { Card, Avatar, Badge, Button } from '../../components/ui';
import { useAuthStore } from '../../stores/authStore';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants/theme';
import { MOCK_PNJ_DASHBOARD_STATS, MOCK_UPCOMING_BOOKINGS, MOCK_PENDING_BOOKINGS, MockDashboardBooking } from '../../mocks';

export default function PNJDashboardScreen() {
  const theme = useTheme();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  return (
    <Screen>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.colors.textMuted }]}>
              Bonjour 👋
            </Text>
            <Text style={[styles.name, { color: theme.colors.text }]}>
              {user?.displayName || 'PNJ'}
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(pnj)/profile')}>
            <Avatar name={user?.displayName} size="medium" />
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <StatCard
            value={MOCK_PNJ_DASHBOARD_STATS.pendingRequests.toString()}
            label="En attente"
            icon="📬"
            color={theme.colors.warning}
            theme={theme}
            onPress={() => router.push('/(pnj)/requests')}
          />
          <StatCard
            value={MOCK_PNJ_DASHBOARD_STATS.upcomingBookings.toString()}
            label="À venir"
            icon="📅"
            color={theme.colors.primary}
            theme={theme}
            onPress={() => router.push('/(pnj)/calendar')}
          />
          <StatCard
            value={`${MOCK_PNJ_DASHBOARD_STATS.monthlyEarnings}€`}
            label="Ce mois"
            icon="💰"
            color={theme.colors.success}
            theme={theme}
            onPress={() => router.push('/(pnj)/earnings')}
          />
          <StatCard
            value={MOCK_PNJ_DASHBOARD_STATS.averageRating.toString()}
            label="Note"
            icon="⭐"
            color={theme.colors.warning}
            theme={theme}
          />
        </View>

        {/* Pending Requests Alert */}
        {MOCK_PNJ_DASHBOARD_STATS.pendingRequests > 0 && (
          <TouchableOpacity onPress={() => router.push('/(pnj)/requests')}>
            <Card style={[styles.alertCard, { borderColor: theme.colors.warning }]}>
              <Card.Body style={styles.alertContent}>
                <View style={styles.alertIcon}>
                  <Text style={styles.alertEmoji}>⚡</Text>
                </View>
                <View style={styles.alertText}>
                  <Text style={[styles.alertTitle, { color: theme.colors.text }]}>
                    {MOCK_PNJ_DASHBOARD_STATS.pendingRequests} demande(s) en attente
                  </Text>
                  <Text style={[styles.alertSubtitle, { color: theme.colors.textMuted }]}>
                    Réponds rapidement pour garder un bon taux de réponse
                  </Text>
                </View>
                <Text style={{ color: theme.colors.textMuted }}>›</Text>
              </Card.Body>
            </Card>
          </TouchableOpacity>
        )}

        {/* Upcoming Bookings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Prochains rendez-vous
            </Text>
            <TouchableOpacity onPress={() => router.push('/(pnj)/calendar')}>
              <Text style={[styles.seeAll, { color: theme.colors.primary }]}>
                Voir tout
              </Text>
            </TouchableOpacity>
          </View>

          {MOCK_UPCOMING_BOOKINGS.length > 0 ? (
            MOCK_UPCOMING_BOOKINGS.map((booking) => (
              <BookingCard key={booking.id} booking={booking} theme={theme} />
            ))
          ) : (
            <Card>
              <Card.Body>
                <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>
                  Aucun rendez-vous à venir
                </Text>
              </Card.Body>
            </Card>
          )}
        </View>

        {/* Performance Summary */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Tes performances
          </Text>
          <Card>
            <Card.Body>
              <PerformanceItem
                label="Réservations totales"
                value={MOCK_PNJ_DASHBOARD_STATS.totalBookings.toString()}
                theme={theme}
              />
              <PerformanceItem
                label="Taux de réponse"
                value={`${MOCK_PNJ_DASHBOARD_STATS.responseRate}%`}
                theme={theme}
                color={theme.colors.success}
              />
              <PerformanceItem
                label="Note moyenne"
                value={`⭐ ${MOCK_PNJ_DASHBOARD_STATS.averageRating}`}
                theme={theme}
                color={theme.colors.warning}
              />
            </Card.Body>
          </Card>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Actions rapides
          </Text>
          <View style={styles.actionsRow}>
            <Button
              title="Modifier dispo"
              onPress={() => router.push('/(pnj)/calendar')}
              variant="outline"
              size="medium"
              style={{ flex: 1 }}
            />
            <Button
              title="Voir profil"
              onPress={() => router.push('/(pnj)/profile')}
              variant="outline"
              size="medium"
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const StatCard = ({
  value,
  label,
  icon,
  color,
  theme,
  onPress,
}: {
  value: string;
  label: string;
  icon: string;
  color: string;
  theme: ReturnType<typeof useTheme>;
  onPress?: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.statCard, { backgroundColor: theme.colors.surface }]}
    disabled={!onPress}
  >
    <Text style={styles.statIcon}>{icon}</Text>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>{label}</Text>
  </TouchableOpacity>
);

const BookingCard = ({
  booking,
  theme,
}: {
  booking: MockDashboardBooking;
  theme: ReturnType<typeof useTheme>;
}) => (
  <Card style={styles.bookingCard}>
    <Card.Body style={styles.bookingContent}>
      <Avatar name={booking.playerName} size="medium" />
      <View style={styles.bookingInfo}>
        <Text style={[styles.bookingPlayer, { color: theme.colors.text }]}>
          {booking.playerName}
        </Text>
        <Text style={[styles.bookingActivity, { color: theme.colors.textMuted }]}>
          {booking.activity} • {booking.duration} min
        </Text>
        <Text style={[styles.bookingTime, { color: theme.colors.primary }]}>
          {booking.date} à {booking.time}
        </Text>
      </View>
      <View style={styles.bookingPrice}>
        <Text style={[styles.priceValue, { color: theme.colors.success }]}>
          {booking.price}€
        </Text>
      </View>
    </Card.Body>
  </Card>
);

const PerformanceItem = ({
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
  <View style={styles.perfItem}>
    <Text style={[styles.perfLabel, { color: theme.colors.textMuted }]}>{label}</Text>
    <Text style={[styles.perfValue, { color: color || theme.colors.text }]}>{value}</Text>
  </View>
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
    paddingVertical: SPACING.l,
  },
  greeting: {
    ...TYPOGRAPHY.body,
  },
  name: {
    ...TYPOGRAPHY.h2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.s,
    marginBottom: SPACING.l,
  },
  statCard: {
    width: '48%',
    padding: SPACING.m,
    borderRadius: BORDER_RADIUS.m,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  statValue: {
    ...TYPOGRAPHY.h3,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
  },
  alertCard: {
    marginBottom: SPACING.l,
    borderWidth: 2,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertIcon: {
    marginRight: SPACING.m,
  },
  alertEmoji: {
    fontSize: 28,
  },
  alertText: {
    flex: 1,
  },
  alertTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
  },
  alertSubtitle: {
    ...TYPOGRAPHY.caption,
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
    ...TYPOGRAPHY.body,
    fontWeight: '600',
  },
  bookingCard: {
    marginBottom: SPACING.s,
  },
  bookingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookingInfo: {
    flex: 1,
    marginLeft: SPACING.m,
  },
  bookingPlayer: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
  },
  bookingActivity: {
    ...TYPOGRAPHY.caption,
  },
  bookingTime: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
  },
  bookingPrice: {
    alignItems: 'flex-end',
  },
  priceValue: {
    ...TYPOGRAPHY.h4,
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
  },
  perfItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.s,
  },
  perfLabel: {
    ...TYPOGRAPHY.body,
  },
  perfValue: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: SPACING.m,
  },
});
