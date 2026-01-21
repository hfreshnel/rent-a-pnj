import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  TrendingUp,
  Calendar,
  Clock,
  Star,
  ChevronRight,
  AlertCircle,
  CheckCircle,
} from 'lucide-react-native';
import { colors, spacing, textStyles, borderRadius } from '@/theme';
import { Avatar, Card, Badge } from '@/components/ui';
import { useAuthStore } from '@/stores';
import { useCurrentPNJProfile, usePNJPendingBookings } from '@/hooks';

export default function PNJDashboardScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { data: pnjProfile } = useCurrentPNJProfile();
  const { data: pendingBookings } = usePNJPendingBookings(pnjProfile?.id);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Bonjour {user?.displayName?.split(' ')[0]} !</Text>
            <Text style={styles.subtitle}>Voici ton activité du jour</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(pnj)/profile')}>
            <Avatar source={pnjProfile?.avatar} name={pnjProfile?.displayName} size="lg" />
          </TouchableOpacity>
        </View>

        {/* Verification Status */}
        {pnjProfile && !pnjProfile.verified && (
          <Card style={styles.verificationCard}>
            <View style={styles.verificationContent}>
              <AlertCircle size={24} color={colors.warning} />
              <View style={styles.verificationText}>
                <Text style={styles.verificationTitle}>Profil en attente de vérification</Text>
                <Text style={styles.verificationDescription}>
                  Notre équipe vérifie ton profil. Tu seras visible dans les 24-48h.
                </Text>
              </View>
            </View>
          </Card>
        )}

        {pnjProfile?.verified && (
          <Card style={styles.verifiedCard}>
            <View style={styles.verificationContent}>
              <CheckCircle size={24} color={colors.success} />
              <View style={styles.verificationText}>
                <Text style={styles.verifiedTitle}>Profil vérifié</Text>
                <Text style={styles.verificationDescription}>
                  Tu es visible dans la recherche !
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Stats Overview */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <TrendingUp size={24} color={colors.success} />
            <Text style={styles.statValue}>0€</Text>
            <Text style={styles.statLabel}>Ce mois</Text>
          </Card>
          <Card style={styles.statCard}>
            <Calendar size={24} color={colors.primary[400]} />
            <Text style={styles.statValue}>{pnjProfile?.completedBookings || 0}</Text>
            <Text style={styles.statLabel}>Bookings</Text>
          </Card>
          <Card style={styles.statCard}>
            <Star size={24} color={colors.warning} />
            <Text style={styles.statValue}>{pnjProfile?.rating?.toFixed(1) || '-'}</Text>
            <Text style={styles.statLabel}>Note</Text>
          </Card>
          <Card style={styles.statCard}>
            <Clock size={24} color={colors.info} />
            <Text style={styles.statValue}>{pnjProfile?.responseRate || 100}%</Text>
            <Text style={styles.statLabel}>Réponses</Text>
          </Card>
        </View>

        {/* Pending Requests */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Demandes en attente</Text>
            {pendingBookings && pendingBookings.length > 0 && (
              <Badge label={pendingBookings.length.toString()} variant="primary" size="sm" />
            )}
          </View>

          {pendingBookings && pendingBookings.length > 0 ? (
            pendingBookings.slice(0, 3).map((booking) => (
              <Card key={booking.id} style={styles.requestCard} onPress={() => {}}>
                <View style={styles.requestHeader}>
                  <Text style={styles.requestActivity}>{booking.activity.name}</Text>
                  <Text style={styles.requestPrice}>{booking.totalPrice}€</Text>
                </View>
                <Text style={styles.requestDetails}>
                  {new Date(booking.date.seconds * 1000).toLocaleDateString('fr-FR')} à {booking.startTime}
                </Text>
                <View style={styles.requestFooter}>
                  <Badge label="En attente" variant="warning" size="sm" />
                  <ChevronRight size={16} color={colors.text.tertiary} />
                </View>
              </Card>
            ))
          ) : (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>Aucune demande en attente</Text>
            </Card>
          )}

          {pendingBookings && pendingBookings.length > 3 && (
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => router.push('/(pnj)/requests')}
            >
              <Text style={styles.viewAllText}>Voir toutes les demandes</Text>
              <ChevronRight size={16} color={colors.primary[400]} />
            </TouchableOpacity>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(pnj)/profile')}
            >
              <Text style={styles.actionEmoji}>✏️</Text>
              <Text style={styles.actionText}>Modifier profil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionEmoji}>📅</Text>
              <Text style={styles.actionText}>Disponibilités</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(pnj)/earnings')}
            >
              <Text style={styles.actionEmoji}>💰</Text>
              <Text style={styles.actionText}>Mes gains</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionEmoji}>⚙️</Text>
              <Text style={styles.actionText}>Paramètres</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  verificationCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    backgroundColor: colors.warning + '15',
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  verifiedCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    backgroundColor: colors.success + '15',
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  verificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  verificationText: {
    flex: 1,
  },
  verificationTitle: {
    ...textStyles.bodySemiBold,
    color: colors.warning,
    marginBottom: 2,
  },
  verifiedTitle: {
    ...textStyles.bodySemiBold,
    color: colors.success,
    marginBottom: 2,
  },
  verificationDescription: {
    ...textStyles.caption,
    color: colors.text.secondary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    width: '47%',
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  statValue: {
    ...textStyles.h3,
    color: colors.white,
    marginTop: spacing.sm,
  },
  statLabel: {
    ...textStyles.caption,
    color: colors.text.secondary,
    marginTop: 2,
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
  requestCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  requestActivity: {
    ...textStyles.bodySemiBold,
    color: colors.white,
  },
  requestPrice: {
    ...textStyles.bodySemiBold,
    color: colors.secondary[400],
  },
  requestDetails: {
    ...textStyles.caption,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  requestFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emptyCard: {
    marginHorizontal: spacing.lg,
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    ...textStyles.body,
    color: colors.text.tertiary,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  viewAllText: {
    ...textStyles.bodySmall,
    color: colors.primary[400],
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  actionCard: {
    width: '47%',
    backgroundColor: colors.bg.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: 'center',
  },
  actionEmoji: {
    fontSize: 28,
    marginBottom: spacing.sm,
  },
  actionText: {
    ...textStyles.bodySmall,
    color: colors.text.primary,
    textAlign: 'center',
  },
});
