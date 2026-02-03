import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../theme';
import { Screen } from '../../components/layout/screen';
import { Card, Avatar, Badge, Button } from '../../components/ui';
import { useAuthStore } from '../../stores/authStore';
import { useGameStore } from '../../stores/gameStore';
import { useAuth } from '../../hooks/utils/useAuth';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants/theme';

export default function ProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { signOut } = useAuth();
  const displayLevel = useGameStore((s) => s.displayLevel);
  const getTitle = useGameStore((s) => s.getTitle);

  const title = getTitle();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Screen scroll>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Avatar
            source={user?.avatar}
            name={user?.displayName}
            size="xl"
            badge={
              <View style={[styles.levelBadge, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.levelText}>{displayLevel}</Text>
              </View>
            }
          />
          <Text style={[styles.userName, { color: theme.colors.text }]}>
            {user?.displayName}
          </Text>
          <Text style={[styles.userTitle, { color: theme.colors.primary }]}>
            {title}
          </Text>
          <Text style={[styles.userEmail, { color: theme.colors.textMuted }]}>
            {user?.email}
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard
            value={user?.stats?.bookingsCompleted?.toString() || '0'}
            label="Rencontres"
            theme={theme}
          />
          <StatCard
            value={user?.stats?.uniquePnjMet?.toString() || '0'}
            label="PNJ rencontrés"
            theme={theme}
          />
          <StatCard
            value={`${user?.stats?.totalHours || 0}h`}
            label="Temps total"
            theme={theme}
          />
        </View>

        {/* Menu Items */}
        <View style={styles.menu}>
          <MenuItem
            icon="👤"
            title="Modifier le profil"
            onPress={() => {}}
            theme={theme}
          />
          <MenuItem
            icon="🔔"
            title="Notifications"
            onPress={() => {}}
            theme={theme}
          />
          <MenuItem
            icon="🛡️"
            title="Sécurité"
            onPress={() => {}}
            theme={theme}
          />
          <MenuItem
            icon="🎨"
            title="Apparence"
            subtitle="Thème sombre"
            onPress={() => {}}
            theme={theme}
          />
          <MenuItem
            icon="❓"
            title="Aide"
            onPress={() => {}}
            theme={theme}
          />
          <MenuItem
            icon="📜"
            title="CGU"
            onPress={() => {}}
            theme={theme}
          />
        </View>

        {/* Become PNJ */}
        {user?.role === 'player' && (
          <Card style={styles.becomePnjCard}>
            <Card.Body>
              <View style={styles.becomePnjContent}>
                <Text style={styles.becomePnjEmoji}>🗡️</Text>
                <View style={styles.becomePnjText}>
                  <Text style={[styles.becomePnjTitle, { color: theme.colors.text }]}>
                    Deviens un PNJ
                  </Text>
                  <Text style={[styles.becomePnjDescription, { color: theme.colors.textMuted }]}>
                    Propose tes services et gagne de l'argent
                  </Text>
                </View>
              </View>
              <Button
                title="En savoir plus"
                onPress={() => router.push('/(auth)/onboarding-pnj')}
                variant="primary"
                size="medium"
                fullWidth
              />
            </Card.Body>
          </Card>
        )}

        {/* Logout */}
        <Button
          title="Déconnexion"
          onPress={handleSignOut}
          variant="danger"
          size="large"
          fullWidth
          style={styles.logoutButton}
        />

        {/* Version */}
        <Text style={[styles.version, { color: theme.colors.textMuted }]}>
          Rent a PNJ v1.0.0
        </Text>
      </ScrollView>
    </Screen>
  );
}

const StatCard = ({
  value,
  label,
  theme,
}: {
  value: string;
  label: string;
  theme: ReturnType<typeof useTheme>;
}) => (
  <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
    <Text style={[styles.statValue, { color: theme.colors.text }]}>{value}</Text>
    <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>{label}</Text>
  </View>
);

const MenuItem = ({
  icon,
  title,
  subtitle,
  onPress,
  theme,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
  theme: ReturnType<typeof useTheme>;
}) => (
  <TouchableOpacity onPress={onPress}>
    <View style={[styles.menuItem, { borderBottomColor: theme.colors.outline }]}>
      <Text style={styles.menuIcon}>{icon}</Text>
      <View style={styles.menuText}>
        <Text style={[styles.menuTitle, { color: theme.colors.text }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.menuSubtitle, { color: theme.colors.textMuted }]}>
            {subtitle}
          </Text>
        )}
      </View>
      <Text style={{ color: theme.colors.textMuted }}>›</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: SPACING.xxl,
  },
  header: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  levelBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  userName: {
    ...TYPOGRAPHY.h2,
    marginTop: SPACING.m,
  },
  userTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    marginTop: SPACING.xs,
  },
  userEmail: {
    ...TYPOGRAPHY.caption,
    marginTop: SPACING.xs,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.s,
    marginBottom: SPACING.l,
  },
  statCard: {
    flex: 1,
    padding: SPACING.m,
    borderRadius: BORDER_RADIUS.m,
    alignItems: 'center',
  },
  statValue: {
    ...TYPOGRAPHY.h3,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    textAlign: 'center',
  },
  menu: {
    marginBottom: SPACING.l,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.m,
    borderBottomWidth: 1,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: SPACING.m,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    ...TYPOGRAPHY.body,
  },
  menuSubtitle: {
    ...TYPOGRAPHY.caption,
  },
  becomePnjCard: {
    marginBottom: SPACING.l,
  },
  becomePnjContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  becomePnjEmoji: {
    fontSize: 40,
    marginRight: SPACING.m,
  },
  becomePnjText: {
    flex: 1,
  },
  becomePnjTitle: {
    ...TYPOGRAPHY.h4,
  },
  becomePnjDescription: {
    ...TYPOGRAPHY.caption,
  },
  logoutButton: {
    marginBottom: SPACING.l,
  },
  version: {
    ...TYPOGRAPHY.caption,
    textAlign: 'center',
  },
});
