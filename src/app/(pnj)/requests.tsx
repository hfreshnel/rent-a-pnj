import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme';
import { Screen } from '../../components/layout/screen';
import { Card, Avatar, Badge, Button } from '../../components/ui';
import { useToast } from '../../components/ui/toast';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants/theme';
import { MOCK_BOOKING_REQUESTS, MockBookingRequest } from '../../mocks';

export default function RequestsScreen() {
  const theme = useTheme();
  const toast = useToast();
  const [requests, setRequests] = useState(MOCK_BOOKING_REQUESTS);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleAccept = async (id: string) => {
    setProcessingId(id);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRequests((prev) => prev.filter((r) => r.id !== id));
    setProcessingId(null);
    toast.success('Demande acceptée !');
  };

  const handleDecline = async (id: string) => {
    setProcessingId(id);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRequests((prev) => prev.filter((r) => r.id !== id));
    setProcessingId(null);
    toast.info('Demande refusée');
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
            Demandes 📬
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
            {requests.length} en attente de réponse
          </Text>
        </View>

        {/* Response Time Reminder */}
        <Card style={[styles.reminderCard, { backgroundColor: theme.colors.primaryLight }]}>
          <Card.Body style={styles.reminderContent}>
            <Text style={styles.reminderEmoji}>⏱️</Text>
            <View style={styles.reminderText}>
              <Text style={[styles.reminderTitle, { color: theme.colors.primary }]}>
                Temps de réponse moyen : 15 min
              </Text>
              <Text style={[styles.reminderSubtitle, { color: theme.colors.textMuted }]}>
                Réponds vite pour améliorer ton taux !
              </Text>
            </View>
          </Card.Body>
        </Card>

        {/* Request List */}
        {requests.length > 0 ? (
          requests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              theme={theme}
              onAccept={() => handleAccept(request.id)}
              onDecline={() => handleDecline(request.id)}
              isProcessing={processingId === request.id}
            />
          ))
        ) : (
          <Card>
            <Card.Body style={styles.emptyContent}>
              <Text style={styles.emptyEmoji}>📭</Text>
              <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                Pas de demandes en attente
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.colors.textMuted }]}>
                Les nouvelles demandes apparaîtront ici
              </Text>
            </Card.Body>
          </Card>
        )}
      </ScrollView>
    </Screen>
  );
}

const RequestCard = ({
  request,
  theme,
  onAccept,
  onDecline,
  isProcessing,
}: {
  request: MockBookingRequest;
  theme: ReturnType<typeof useTheme>;
  onAccept: () => void;
  onDecline: () => void;
  isProcessing: boolean;
}) => (
  <Card style={styles.requestCard}>
    <Card.Body>
      {/* Header */}
      <View style={styles.requestHeader}>
        <Avatar name={request.playerName} size="medium" />
        <View style={styles.requestInfo}>
          <View style={styles.nameRow}>
            <Text style={[styles.playerName, { color: theme.colors.text }]}>
              {request.playerName}
            </Text>
            <Badge label={`Niv. ${request.playerLevel}`} variant="default" size="small" />
          </View>
          <Text style={[styles.createdAt, { color: theme.colors.textMuted }]}>
            {request.createdAt}
          </Text>
        </View>
        <View style={styles.priceTag}>
          <Text style={[styles.priceValue, { color: theme.colors.success }]}>
            {request.price}€
          </Text>
        </View>
      </View>

      {/* Details */}
      <View style={[styles.detailsBox, { backgroundColor: theme.colors.surfaceVariant }]}>
        <DetailRow icon="🎯" label="Activité" value={request.activity} theme={theme} />
        <DetailRow icon="📅" label="Date" value={`${request.date} à ${request.time}`} theme={theme} />
        <DetailRow icon="⏱️" label="Durée" value={`${request.duration} min`} theme={theme} />
        <DetailRow icon="📍" label="Lieu" value={request.location} theme={theme} />
      </View>

      {/* Message */}
      <View style={styles.messageBox}>
        <Text style={[styles.messageLabel, { color: theme.colors.textMuted }]}>
          Message :
        </Text>
        <Text style={[styles.messageText, { color: theme.colors.text }]}>
          "{request.message}"
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          title="Refuser"
          onPress={onDecline}
          variant="outline"
          size="medium"
          style={{ flex: 1 }}
          disabled={isProcessing}
        />
        <Button
          title="Accepter"
          onPress={onAccept}
          variant="primary"
          size="medium"
          style={{ flex: 1 }}
          loading={isProcessing}
        />
      </View>
    </Card.Body>
  </Card>
);

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
  reminderCard: {
    marginBottom: SPACING.l,
  },
  reminderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderEmoji: {
    fontSize: 28,
    marginRight: SPACING.m,
  },
  reminderText: {
    flex: 1,
  },
  reminderTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
  },
  reminderSubtitle: {
    ...TYPOGRAPHY.caption,
  },
  requestCard: {
    marginBottom: SPACING.m,
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  requestInfo: {
    flex: 1,
    marginLeft: SPACING.m,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.s,
  },
  playerName: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
  },
  createdAt: {
    ...TYPOGRAPHY.caption,
  },
  priceTag: {
    padding: SPACING.s,
    backgroundColor: 'rgba(81, 207, 102, 0.1)',
    borderRadius: BORDER_RADIUS.s,
  },
  priceValue: {
    ...TYPOGRAPHY.h4,
  },
  detailsBox: {
    padding: SPACING.m,
    borderRadius: BORDER_RADIUS.m,
    marginBottom: SPACING.m,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  detailIcon: {
    fontSize: 14,
    marginRight: SPACING.s,
    width: 20,
  },
  detailLabel: {
    ...TYPOGRAPHY.caption,
    width: 60,
  },
  detailValue: {
    ...TYPOGRAPHY.body,
    flex: 1,
  },
  messageBox: {
    marginBottom: SPACING.m,
  },
  messageLabel: {
    ...TYPOGRAPHY.caption,
    marginBottom: SPACING.xs,
  },
  messageText: {
    ...TYPOGRAPHY.body,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.m,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: SPACING.m,
  },
  emptyTitle: {
    ...TYPOGRAPHY.h4,
    marginBottom: SPACING.xs,
  },
  emptySubtitle: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
  },
});
