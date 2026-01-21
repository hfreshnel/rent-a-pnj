import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, CreditCard, ArrowUpRight } from 'lucide-react-native';
import { colors, spacing, textStyles, borderRadius } from '@/theme';
import { Card, Button } from '@/components/ui';

export default function EarningsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Mes gains</Text>
        </View>

        {/* Balance Card */}
        <Card variant="elevated" style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Solde disponible</Text>
          <Text style={styles.balanceAmount}>0,00€</Text>
          <Button
            title="Configurer les paiements"
            onPress={() => {}}
            variant="primary"
            size="md"
            fullWidth
            leftIcon={<CreditCard size={18} color={colors.white} />}
            style={styles.stripeButton}
          />
        </Card>

        {/* Stats */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <TrendingUp size={20} color={colors.success} />
            <Text style={styles.statValue}>0€</Text>
            <Text style={styles.statLabel}>Ce mois</Text>
          </Card>
          <Card style={styles.statCard}>
            <ArrowUpRight size={20} color={colors.primary[400]} />
            <Text style={styles.statValue}>0€</Text>
            <Text style={styles.statLabel}>Total</Text>
          </Card>
        </View>

        {/* Transactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Historique des transactions</Text>
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>Aucune transaction pour le moment</Text>
            <Text style={styles.emptyHint}>
              Tes paiements apparaîtront ici après tes premières réservations
            </Text>
          </Card>
        </View>

        {/* Stripe Info */}
        <Card style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <CreditCard size={24} color={colors.info} />
          </View>
          <Text style={styles.infoTitle}>Paiements sécurisés avec Stripe</Text>
          <Text style={styles.infoText}>
            Connecte ton compte Stripe pour recevoir tes paiements automatiquement
            après chaque prestation. Commission plateforme: 20%
          </Text>
        </Card>
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  title: {
    ...textStyles.h2,
    color: colors.white,
  },
  balanceCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  balanceLabel: {
    ...textStyles.bodySmall,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  balanceAmount: {
    ...textStyles.h1,
    color: colors.white,
    marginBottom: spacing.lg,
  },
  stripeButton: {
    marginTop: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
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
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...textStyles.h4,
    color: colors.white,
    marginBottom: spacing.md,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    ...textStyles.body,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  emptyHint: {
    ...textStyles.caption,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  infoCard: {
    marginHorizontal: spacing.lg,
    alignItems: 'center',
    backgroundColor: colors.info + '15',
    borderWidth: 1,
    borderColor: colors.info + '30',
  },
  infoIcon: {
    marginBottom: spacing.md,
  },
  infoTitle: {
    ...textStyles.bodySemiBold,
    color: colors.info,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  infoText: {
    ...textStyles.bodySmall,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
