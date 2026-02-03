import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../theme';
import { Screen } from '../../components/layout/screen';
import { Card, Avatar, Badge, Button } from '../../components/ui';
import { useAuthStore } from '../../stores/authStore';
import { useAuth } from '../../hooks/utils/useAuth';
import { PNJ_CLASS_INFO } from '../../types/pnj';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants/theme';
import { PNJClass } from '../../theme/types';
import { MOCK_CURRENT_PNJ_PROFILE } from '../../mocks';

export default function PNJProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { signOut } = useAuth();

  const classInfo = PNJ_CLASS_INFO[MOCK_CURRENT_PNJ_PROFILE.class];

  const handleSignOut = async () => {
    await signOut();
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
          <Avatar
            name={user?.displayName}
            size="xl"
            badge={
              MOCK_CURRENT_PNJ_PROFILE.verified ? (
                <View style={[styles.verifiedBadge, { backgroundColor: theme.colors.success }]}>
                  <Text style={styles.verifiedText}>✓</Text>
                </View>
              ) : undefined
            }
          />
          <Text style={[styles.userName, { color: theme.colors.text }]}>
            {user?.displayName}
          </Text>
          <View style={styles.classRow}>
            <Text style={styles.classEmoji}>{classInfo.emoji}</Text>
            <Text style={[styles.className, { color: theme.colors.primary }]}>
              {classInfo.label}
            </Text>
            <Text style={[styles.level, { color: theme.colors.textMuted }]}>
              Niv. {MOCK_CURRENT_PNJ_PROFILE.level}
            </Text>
          </View>
          <Text style={[styles.city, { color: theme.colors.textMuted }]}>
            📍 {MOCK_CURRENT_PNJ_PROFILE.city}
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard
            value={`⭐ ${MOCK_CURRENT_PNJ_PROFILE.rating}`}
            label={`${MOCK_CURRENT_PNJ_PROFILE.reviewCount} avis`}
            theme={theme}
          />
          <StatCard
            value={`${MOCK_CURRENT_PNJ_PROFILE.responseRate}%`}
            label="Réponse"
            theme={theme}
          />
          <StatCard
            value={MOCK_CURRENT_PNJ_PROFILE.completedBookings.toString()}
            label="Bookings"
            theme={theme}
          />
        </View>

        {/* Price */}
        <Card style={styles.priceCard}>
          <Card.Body style={styles.priceContent}>
            <View>
              <Text style={[styles.priceLabel, { color: theme.colors.textMuted }]}>
                Ton tarif horaire
              </Text>
              <View style={styles.priceRow}>
                <Text style={[styles.priceValue, { color: theme.colors.primary }]}>
                  {MOCK_CURRENT_PNJ_PROFILE.hourlyRate}€
                </Text>
                <Text style={[styles.priceUnit, { color: theme.colors.textMuted }]}>
                  /heure
                </Text>
              </View>
            </View>
            <Button
              title="Modifier"
              onPress={() => {}}
              variant="outline"
              size="small"
            />
          </Card.Body>
        </Card>

        {/* Bio */}
        <Card style={styles.section}>
          <Card.Header title="À propos" />
          <Card.Body>
            <Text style={[styles.bio, { color: theme.colors.textSecondary }]}>
              {MOCK_CURRENT_PNJ_PROFILE.bio}
            </Text>
          </Card.Body>
        </Card>

        {/* Activities */}
        <Card style={styles.section}>
          <Card.Header title="Activités" />
          <Card.Body>
            <View style={styles.tags}>
              {MOCK_CURRENT_PNJ_PROFILE.activities.map((activity) => (
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
              {MOCK_CURRENT_PNJ_PROFILE.languages.map((lang) => (
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

        {/* Menu */}
        <View style={styles.menu}>
          <MenuItem
            icon="✏️"
            title="Modifier le profil"
            onPress={() => {}}
            theme={theme}
          />
          <MenuItem
            icon="👁️"
            title="Prévisualiser mon profil"
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
            title="Vérification d'identité"
            subtitle={MOCK_CURRENT_PNJ_PROFILE.verified ? 'Vérifié' : 'Non vérifié'}
            onPress={() => {}}
            theme={theme}
          />
          <MenuItem
            icon="🏦"
            title="Informations bancaires"
            onPress={() => {}}
            theme={theme}
          />
          <MenuItem
            icon="❓"
            title="Aide"
            onPress={() => {}}
            theme={theme}
          />
        </View>

        {/* Switch to Player Mode */}
        {user?.role === 'both' && (
          <Button
            title="Passer en mode Joueur"
            onPress={() => router.replace('/(player)')}
            variant="outline"
            size="large"
            fullWidth
            style={styles.switchButton}
          />
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
          Rent a PNJ v1.0.0 • Mode PNJ
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
  verifiedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  userName: {
    ...TYPOGRAPHY.h2,
    marginTop: SPACING.m,
  },
  classRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.xs,
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
    ...TYPOGRAPHY.body,
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
    ...TYPOGRAPHY.h4,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    textAlign: 'center',
  },
  priceCard: {
    marginBottom: SPACING.l,
  },
  priceContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    ...TYPOGRAPHY.caption,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceValue: {
    ...TYPOGRAPHY.h2,
  },
  priceUnit: {
    ...TYPOGRAPHY.body,
  },
  section: {
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
  menu: {
    marginTop: SPACING.m,
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
  switchButton: {
    marginBottom: SPACING.m,
  },
  logoutButton: {
    marginBottom: SPACING.l,
  },
  version: {
    ...TYPOGRAPHY.caption,
    textAlign: 'center',
  },
});
