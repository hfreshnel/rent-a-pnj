import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants/theme';
import { Message, MessageType } from '../../types/chat';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn }) => {
  const theme = useTheme();

  // System messages
  if (message.type === 'system') {
    return (
      <View style={styles.systemContainer}>
        <View style={[styles.systemBubble, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Text style={[styles.systemText, { color: theme.colors.textMuted }]}>
            {message.content}
          </Text>
        </View>
      </View>
    );
  }

  // Booking request messages
  if (message.type === 'booking_request' || message.type === 'booking_update') {
    return (
      <View style={[styles.container, isOwn && styles.ownContainer]}>
        <View
          style={[
            styles.bookingBubble,
            { backgroundColor: theme.colors.primaryLight, borderColor: theme.colors.primary },
          ]}
        >
          <View style={styles.bookingHeader}>
            <Text style={styles.bookingEmoji}>📅</Text>
            <Text style={[styles.bookingTitle, { color: theme.colors.primary }]}>
              {message.type === 'booking_request' ? 'Demande de réservation' : 'Mise à jour'}
            </Text>
          </View>
          <Text style={[styles.bookingContent, { color: theme.colors.text }]}>
            {message.content}
          </Text>
          <Text style={[styles.time, { color: theme.colors.textMuted }]}>
            {formatTime(message.createdAt)}
          </Text>
        </View>
      </View>
    );
  }

  // Regular text messages
  return (
    <View style={[styles.container, isOwn && styles.ownContainer]}>
      <View
        style={[
          styles.bubble,
          isOwn
            ? { backgroundColor: theme.colors.primary }
            : { backgroundColor: theme.colors.surface },
        ]}
      >
        <Text
          style={[
            styles.text,
            { color: isOwn ? theme.colors.onPrimary : theme.colors.text },
          ]}
        >
          {message.content}
        </Text>
        <View style={styles.footer}>
          <Text
            style={[
              styles.time,
              { color: isOwn ? 'rgba(255,255,255,0.7)' : theme.colors.textMuted },
            ]}
          >
            {formatTime(message.createdAt)}
          </Text>
          {isOwn && message.read && (
            <Text style={styles.readIndicator}>✓✓</Text>
          )}
        </View>
      </View>
    </View>
  );
};

const formatTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.m,
    marginBottom: SPACING.s,
    alignItems: 'flex-start',
  },
  ownContainer: {
    alignItems: 'flex-end',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    borderRadius: BORDER_RADIUS.l,
  },
  text: {
    ...TYPOGRAPHY.body,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
    gap: SPACING.xs,
  },
  time: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
  },
  readIndicator: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
  },
  systemContainer: {
    alignItems: 'center',
    paddingHorizontal: SPACING.m,
    marginVertical: SPACING.s,
  },
  systemBubble: {
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  systemText: {
    ...TYPOGRAPHY.caption,
    textAlign: 'center',
  },
  bookingBubble: {
    maxWidth: '85%',
    padding: SPACING.m,
    borderRadius: BORDER_RADIUS.m,
    borderWidth: 1,
  },
  bookingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
    gap: SPACING.xs,
  },
  bookingEmoji: {
    fontSize: 16,
  },
  bookingTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
  },
  bookingContent: {
    ...TYPOGRAPHY.body,
  },
});

export default MessageBubble;
