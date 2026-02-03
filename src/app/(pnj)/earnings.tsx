import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme';
import { Screen } from '../../components/layout/screen';
import { Card, Badge, Button } from '../../components/ui';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants/theme';
import { MOCK_EARNINGS_SUMMARY, MOCK_TRANSACTIONS, MockTransaction } from '../../mocks';

type Period = 'week' | 'month' | 'year';

export default function EarningsScreen() {
  const theme = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('month');

  const handleWithdraw = () => {
    // Navigate to withdrawal flow
  };

  return (
    <Screen>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Revenus 💰
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
            Gère tes gains
          </Text>
        </View>

        {/* Balance Card */}
        <Card style={[styles.balanceCard, { backgroundColor: theme.colors.primary }]}>
          <Card.Body>
            <Text style={styles.balanceLabel}>Solde disponible</Text>
            <Text style={styles.balanceAmount}>{MOCK_EARNINGS_SUMMARY.available}€</Text>
            <View style={styles.pendingRow}>
              <Text style={styles.pendingText}>
                + {MOCK_EARNINGS_SUMMARY.pending}€ en attente
              </Text>
            </View>
            <Button
              title="Retirer"
              onPress={handleWithdraw}
              variant="secondary"
              size="medium"
              style={styles.withdrawButton}
            />
          </Card.Body>
        </Card>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {(['week', 'month', 'year'] as Period[]).map((period) => (
            <TouchableOpacity
              key={period}
              onPress={() => setSelectedPeriod(period)}
              style={[
                styles.periodButton,
                {
                  backgroundColor:
                    selectedPeriod === period
                      ? theme.colors.primary
                      : theme.colors.surface,
                },
              ]}
            >
              <Text
                style={[
                  styles.periodText,
                  {
                    color:
                      selectedPeriod === period
                        ? theme.colors.onPrimary
                        : theme.colors.text,
                  },
                ]}
              >
                {period === 'week' ? 'Semaine' : period === 'month' ? 'Mois' : 'Année'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            value={`${MOCK_EARNINGS_SUMMARY.thisMonth}€`}
            label="Ce mois"
            icon="📈"
            theme={theme}
          />
          <StatCard
            value={`${MOCK_EARNINGS_SUMMARY.lastMonth}€`}
            label="Mois dernier"
            icon="📊"
            theme={theme}
          />
          <StatCard
            value={MOCK_EARNINGS_SUMMARY.bookingsThisMonth.toString()}
            label="Réservations"
            icon="📅"
            theme={theme}
          />
          <StatCard
            value={`${MOCK_EARNINGS_SUMMARY.totalEarned}€`}
            label="Total gagné"
            icon="💎"
            theme={theme}
          />
        </View>

        {/* Transactions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Historique
          </Text>

          {MOCK_TRANSACTIONS.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              theme={theme}
            />
          ))}
        </View>

        {/* Payout Info */}
        <Card style={styles.infoCard}>
          <Card.Body style={styles.infoContent}>
            <Text style={styles.infoEmoji}>ℹ️</Text>
            <View style={styles.infoText}>
              <Text style={[styles.infoTitle, { color: theme.colors.text }]}>
                Comment ça marche ?
              </Text>
              <Text style={[styles.infoDescription, { color: theme.colors.textMuted }]}>
                Les gains sont crédités 24h après chaque réservation complétée.
                Tu peux retirer tes fonds à tout moment vers ton compte bancaire.
              </Text>
            </View>
          </Card.Body>
        </Card>
      </ScrollView>
    </Screen>
  );
}

const StatCard = ({
  value,
  label,
  icon,
  theme,
}: {
  value: string;
  label: string;
  icon: string;
  theme: ReturnType<typeof useTheme>;
}) => (
  <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
    <Text style={styles.statIcon}>{icon}</Text>
    <Text style={[styles.statValue, { color: theme.colors.text }]}>{value}</Text>
    <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>{label}</Text>
  </View>
);

const TransactionItem = ({
  transaction,
  theme,
}: {
  transaction: MockTransaction;
  theme: ReturnType<typeof useTheme>;
}) => {
  const isEarning = transaction.type === 'earning';
  const isPending = transaction.status === 'pending';

  return (
    <View
      style={[
        styles.transactionItem,
        { borderBottomColor: theme.colors.outline },
      ]}
    >
      <View
        style={[
          styles.transactionIcon,
          {
            backgroundColor: isEarning
              ? theme.colors.success + '20'
              : theme.colors.primary + '20',
          },
        ]}
      >
        <Text style={styles.transactionEmoji}>
          {isEarning ? '💵' : '🏦'}
        </Text>
      </View>
      <View style={styles.transactionInfo}>
        <Text style={[styles.transactionDescription, { color: theme.colors.text }]}>
          {transaction.description}
        </Text>
        <View style={styles.transactionMeta}>
          <Text style={[styles.transactionDate, { color: theme.colors.textMuted }]}>
            {transaction.date}
          </Text>
          {isPending && (
            <Badge label="En attente" variant="warning" size="small" />
          )}
        </View>
      </View>
      <Text
        style={[
          styles.transactionAmount,
          {
            color: isEarning ? theme.colors.success : theme.colors.text,
          },
        ]}
      >
        {isEarning ? '+' : ''}{transaction.amount}€
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: SPACING.xxl,
  },
  header: {
    paddingVertical: SPACING.l,
  },
  title: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
  },
  balanceCard: {
    marginBottom: SPACING.l,
  },
  balanceLabel: {
    ...TYPOGRAPHY.body,
    color: 'rgba(255,255,255,0.8)',
  },
  balanceAmount: {
    fontSize: 48,
    fontWeight: '700',
    color: '#fff',
    marginVertical: SPACING.s,
  },
  pendingRow: {
    marginBottom: SPACING.m,
  },
  pendingText: {
    ...TYPOGRAPHY.body,
    color: 'rgba(255,255,255,0.7)',
  },
  withdrawButton: {
    backgroundColor: '#fff',
  },
  periodSelector: {
    flexDirection: 'row',
    gap: SPACING.s,
    marginBottom: SPACING.l,
  },
  periodButton: {
    flex: 1,
    paddingVertical: SPACING.s,
    borderRadius: BORDER_RADIUS.m,
    alignItems: 'center',
  },
  periodText: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
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
    ...TYPOGRAPHY.h4,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
  },
  section: {
    marginBottom: SPACING.l,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h4,
    marginBottom: SPACING.m,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.m,
    borderBottomWidth: 1,
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.m,
  },
  transactionEmoji: {
    fontSize: 20,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    ...TYPOGRAPHY.body,
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.s,
  },
  transactionDate: {
    ...TYPOGRAPHY.caption,
  },
  transactionAmount: {
    ...TYPOGRAPHY.h4,
  },
  infoCard: {
    marginTop: SPACING.m,
  },
  infoContent: {
    flexDirection: 'row',
  },
  infoEmoji: {
    fontSize: 24,
    marginRight: SPACING.m,
  },
  infoText: {
    flex: 1,
  },
  infoTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  infoDescription: {
    ...TYPOGRAPHY.caption,
    lineHeight: 18,
  },
});
