import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../../theme';
import { Screen } from '../../../components/layout/screen';
import { Card } from '../../../components/ui';
import { useToast } from '../../../components/ui/toast';
import { SPACING, TYPOGRAPHY } from '../../../constants/theme';

export default function NotificationsSettingsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const toast = useToast();

  const [notifications, setNotifications] = useState({
    pushEnabled: true,
    emailEnabled: true,
    newBooking: true,
    bookingReminder: true,
    messages: true,
    promotions: false,
    levelUp: true,
    missionComplete: true,
  });

  const toggleSetting = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
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
            Notifications
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Global Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textMuted }]}>
            Canaux
          </Text>
          <Card>
            <NotificationToggle
              icon="📱"
              title="Notifications push"
              description="Recevoir des notifications sur ton téléphone"
              value={notifications.pushEnabled}
              onToggle={() => toggleSetting('pushEnabled')}
              theme={theme}
            />
            <NotificationToggle
              icon="📧"
              title="Notifications email"
              description="Recevoir des emails importants"
              value={notifications.emailEnabled}
              onToggle={() => toggleSetting('emailEnabled')}
              theme={theme}
              isLast
            />
          </Card>
        </View>

        {/* Booking Notifications */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textMuted }]}>
            Réservations
          </Text>
          <Card>
            <NotificationToggle
              icon="📅"
              title="Nouvelles réservations"
              description="Quand quelqu'un te réserve"
              value={notifications.newBooking}
              onToggle={() => toggleSetting('newBooking')}
              theme={theme}
            />
            <NotificationToggle
              icon="⏰"
              title="Rappels"
              description="Rappel avant chaque réservation"
              value={notifications.bookingReminder}
              onToggle={() => toggleSetting('bookingReminder')}
              theme={theme}
              isLast
            />
          </Card>
        </View>

        {/* Messages */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textMuted }]}>
            Messages
          </Text>
          <Card>
            <NotificationToggle
              icon="💬"
              title="Nouveaux messages"
              description="Quand tu reçois un message"
              value={notifications.messages}
              onToggle={() => toggleSetting('messages')}
              theme={theme}
              isLast
            />
          </Card>
        </View>

        {/* Gamification */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textMuted }]}>
            Jeu
          </Text>
          <Card>
            <NotificationToggle
              icon="⬆️"
              title="Passage de niveau"
              description="Quand tu gagnes un niveau"
              value={notifications.levelUp}
              onToggle={() => toggleSetting('levelUp')}
              theme={theme}
            />
            <NotificationToggle
              icon="🎯"
              title="Missions complétées"
              description="Quand tu complètes une mission"
              value={notifications.missionComplete}
              onToggle={() => toggleSetting('missionComplete')}
              theme={theme}
              isLast
            />
          </Card>
        </View>

        {/* Marketing */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textMuted }]}>
            Marketing
          </Text>
          <Card>
            <NotificationToggle
              icon="🎁"
              title="Offres et promotions"
              description="Recevoir des offres spéciales"
              value={notifications.promotions}
              onToggle={() => toggleSetting('promotions')}
              theme={theme}
              isLast
            />
          </Card>
        </View>
      </ScrollView>
    </Screen>
  );
}

const NotificationToggle = ({
  icon,
  title,
  description,
  value,
  onToggle,
  theme,
  isLast = false,
}: {
  icon: string;
  title: string;
  description: string;
  value: boolean;
  onToggle: () => void;
  theme: ReturnType<typeof useTheme>;
  isLast?: boolean;
}) => (
  <View
    style={[
      styles.toggleItem,
      { borderBottomColor: isLast ? 'transparent' : theme.colors.outline },
    ]}
  >
    <Text style={styles.toggleIcon}>{icon}</Text>
    <View style={styles.toggleInfo}>
      <Text style={[styles.toggleTitle, { color: theme.colors.text }]}>{title}</Text>
      <Text style={[styles.toggleDescription, { color: theme.colors.textMuted }]}>
        {description}
      </Text>
    </View>
    <Switch
      value={value}
      onValueChange={onToggle}
      trackColor={{ false: '#767577', true: theme.colors.primary }}
      thumbColor="#fff"
    />
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
  section: {
    marginBottom: SPACING.l,
    paddingHorizontal: SPACING.m,
  },
  sectionTitle: {
    ...TYPOGRAPHY.caption,
    textTransform: 'uppercase',
    marginBottom: SPACING.s,
    marginLeft: SPACING.s,
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.m,
    borderBottomWidth: 1,
  },
  toggleIcon: {
    fontSize: 20,
    marginRight: SPACING.m,
  },
  toggleInfo: {
    flex: 1,
  },
  toggleTitle: {
    ...TYPOGRAPHY.body,
  },
  toggleDescription: {
    ...TYPOGRAPHY.caption,
  },
});
