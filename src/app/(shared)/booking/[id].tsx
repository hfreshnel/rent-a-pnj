import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../../theme';
import { Screen } from '../../../components/layout/screen';
import { Card, Avatar, Badge, Button } from '../../../components/ui';
import { useToast } from '../../../components/ui/toast';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../../constants/theme';
import { MOCK_BOOKING_DETAIL } from '../../../mocks';

export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams();
  const theme = useTheme();
  const router = useRouter();
  const toast = useToast();

  const getStatusBadge = () => {
    switch (MOCK_BOOKING_DETAIL.status) {
      case 'pending':
        return <Badge label="En attente" variant="warning" />;
      case 'confirmed':
        return <Badge label="Confirmé" variant="success" />;
      case 'completed':
        return <Badge label="Terminé" variant="default" />;
      case 'cancelled':
        return <Badge label="Annulé" variant="danger" />;
      default:
        return null;
    }
  };

  const handleCancel = () => {
    toast.warning('Annulation en cours...');
    // In real app, call API
  };

  const handleChat = () => {
    router.push('/(shared)/chat/1');
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
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: theme.colors.primary, fontSize: 24 }}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Réservation
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Status */}
        <View style={styles.statusContainer}>
          {getStatusBadge()}
          <Text style={[styles.bookingId, { color: theme.colors.textMuted }]}>
            #{MOCK_BOOKING_DETAIL.id}
          </Text>
        </View>

        {/* Main Info */}
        <Card style={styles.mainCard}>
          <Card.Body>
            <View style={styles.activityHeader}>
              <Text style={styles.activityEmoji}>🥾</Text>
              <View style={styles.activityInfo}>
                <Text style={[styles.activityName, { color: theme.colors.text }]}>
                  {MOCK_BOOKING_DETAIL.activity}
                </Text>
                <Text style={[styles.activityDuration, { color: theme.colors.textMuted }]}>
                  {MOCK_BOOKING_DETAIL.duration} minutes
                </Text>
              </View>
              <View style={styles.priceContainer}>
                <Text style={[styles.priceValue, { color: theme.colors.primary }]}>
                  {MOCK_BOOKING_DETAIL.price}€
                </Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.colors.outline }]} />

            <DetailRow icon="📅" label="Date" value={MOCK_BOOKING_DETAIL.date} theme={theme} />
            <DetailRow icon="🕐" label="Heure" value={MOCK_BOOKING_DETAIL.time} theme={theme} />
            <DetailRow icon="📍" label="Lieu" value={MOCK_BOOKING_DETAIL.location} theme={theme} />
          </Card.Body>
        </Card>

        {/* Participant Card */}
        <Card style={styles.participantCard}>
          <Card.Header title="Participant" />
          <Card.Body style={styles.participantContent}>
            <Avatar name={MOCK_BOOKING_DETAIL.player.name} size="medium" />
            <View style={styles.participantInfo}>
              <Text style={[styles.participantName, { color: theme.colors.text }]}>
                {MOCK_BOOKING_DETAIL.player.name}
              </Text>
              <Text style={[styles.participantLevel, { color: theme.colors.textMuted }]}>
                Niveau {MOCK_BOOKING_DETAIL.player.level}
              </Text>
            </View>
            <Button
              title="💬 Chat"
              onPress={handleChat}
              variant="outline"
              size="small"
            />
          </Card.Body>
        </Card>

        {/* PNJ Card */}
        <Card style={styles.participantCard}>
          <Card.Header title="PNJ" />
          <Card.Body style={styles.participantContent}>
            <Avatar name={MOCK_BOOKING_DETAIL.pnj.name} size="medium" />
            <View style={styles.participantInfo}>
              <Text style={[styles.participantName, { color: theme.colors.text }]}>
                {MOCK_BOOKING_DETAIL.pnj.name}
              </Text>
              <Text style={[styles.participantRating, { color: theme.colors.warning }]}>
                ⭐ {MOCK_BOOKING_DETAIL.pnj.rating}
              </Text>
            </View>
            <Button
              title="Voir profil"
              onPress={() => router.push(`/(player)/pnj/${MOCK_BOOKING_DETAIL.pnj.id}`)}
              variant="outline"
              size="small"
            />
          </Card.Body>
        </Card>

        {/* Timeline */}
        <Card style={styles.timelineCard}>
          <Card.Header title="Historique" />
          <Card.Body>
            <TimelineItem
              icon="📝"
              title="Demande envoyée"
              date={MOCK_BOOKING_DETAIL.createdAt}
              theme={theme}
            />
            <TimelineItem
              icon="✅"
              title="Confirmé par le PNJ"
              date="21 Jan 2024"
              theme={theme}
            />
            {MOCK_BOOKING_DETAIL.status === 'completed' && (
              <TimelineItem
                icon="🎉"
                title="Rencontre terminée"
                date="25 Jan 2024"
                theme={theme}
                isLast
              />
            )}
          </Card.Body>
        </Card>

        {/* Actions */}
        {MOCK_BOOKING_DETAIL.status === 'confirmed' && (
          <View style={styles.actions}>
            <Button
              title="Annuler la réservation"
              onPress={handleCancel}
              variant="danger"
              size="large"
              fullWidth
            />
          </View>
        )}

        {/* Help */}
        <TouchableOpacity style={styles.helpLink}>
          <Text style={[styles.helpText, { color: theme.colors.primary }]}>
            Un problème ? Contacte le support
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
}

const DetailRow = ({
  icon,
  label,
  value,
  theme,
}: {
  icon: string;
  label: string;
  value: string;
  theme: ReturnType<typeof useTheme>;
}) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailIcon}>{icon}</Text>
    <Text style={[styles.detailLabel, { color: theme.colors.textMuted }]}>{label}</Text>
    <Text style={[styles.detailValue, { color: theme.colors.text }]}>{value}</Text>
  </View>
);

const TimelineItem = ({
  icon,
  title,
  date,
  theme,
  isLast = false,
}: {
  icon: string;
  title: string;
  date: string;
  theme: ReturnType<typeof useTheme>;
  isLast?: boolean;
}) => (
  <View style={styles.timelineItem}>
    <View style={styles.timelineDot}>
      <Text style={styles.timelineIcon}>{icon}</Text>
      {!isLast && (
        <View style={[styles.timelineLine, { backgroundColor: theme.colors.outline }]} />
      )}
    </View>
    <View style={styles.timelineContent}>
      <Text style={[styles.timelineTitle, { color: theme.colors.text }]}>{title}</Text>
      <Text style={[styles.timelineDate, { color: theme.colors.textMuted }]}>{date}</Text>
    </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.m,
  },
  title: {
    ...TYPOGRAPHY.h4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.m,
    marginBottom: SPACING.l,
  },
  bookingId: {
    ...TYPOGRAPHY.caption,
  },
  mainCard: {
    marginHorizontal: SPACING.m,
    marginBottom: SPACING.m,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  activityEmoji: {
    fontSize: 40,
    marginRight: SPACING.m,
  },
  activityInfo: {
    flex: 1,
  },
  activityName: {
    ...TYPOGRAPHY.h3,
  },
  activityDuration: {
    ...TYPOGRAPHY.body,
  },
  priceContainer: {
    padding: SPACING.s,
    backgroundColor: 'rgba(132, 94, 247, 0.1)',
    borderRadius: BORDER_RADIUS.m,
  },
  priceValue: {
    ...TYPOGRAPHY.h3,
  },
  divider: {
    height: 1,
    marginVertical: SPACING.m,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  detailIcon: {
    fontSize: 16,
    marginRight: SPACING.s,
    width: 24,
  },
  detailLabel: {
    ...TYPOGRAPHY.body,
    width: 60,
  },
  detailValue: {
    ...TYPOGRAPHY.body,
    flex: 1,
    fontWeight: '500',
  },
  participantCard: {
    marginHorizontal: SPACING.m,
    marginBottom: SPACING.m,
  },
  participantContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantInfo: {
    flex: 1,
    marginLeft: SPACING.m,
  },
  participantName: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
  },
  participantLevel: {
    ...TYPOGRAPHY.caption,
  },
  participantRating: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
  },
  timelineCard: {
    marginHorizontal: SPACING.m,
    marginBottom: SPACING.l,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: SPACING.m,
  },
  timelineDot: {
    alignItems: 'center',
    marginRight: SPACING.m,
  },
  timelineIcon: {
    fontSize: 20,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: SPACING.xs,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: SPACING.m,
  },
  timelineTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: '500',
  },
  timelineDate: {
    ...TYPOGRAPHY.caption,
  },
  actions: {
    paddingHorizontal: SPACING.m,
    marginBottom: SPACING.m,
  },
  helpLink: {
    alignItems: 'center',
    paddingVertical: SPACING.m,
  },
  helpText: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
  },
});
