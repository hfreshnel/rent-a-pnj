import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Settings,
  Edit,
  Eye,
  Calendar,
  CreditCard,
  Shield,
  LogOut,
  ChevronRight,
  Star,
} from 'lucide-react-native';
import { colors, spacing, textStyles, borderRadius, classNames, classEmojis } from '@/theme';
import { Avatar, Card, Badge, Button } from '@/components/ui';
import { useAuthStore } from '@/stores';
import { useCurrentPNJProfile } from '@/hooks';

export default function PNJProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuthStore();
  const { data: pnjProfile } = useCurrentPNJProfile();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Avatar source={pnjProfile?.avatar} name={pnjProfile?.displayName} size="2xl" />
          <Text style={styles.name}>{pnjProfile?.displayName}</Text>

          {pnjProfile && (
            <View style={styles.classRow}>
              <Text style={styles.classEmoji}>{classEmojis[pnjProfile.class]}</Text>
              <Text style={styles.className}>
                {classNames[pnjProfile.class]}
                {pnjProfile.secondaryClass && ` / ${classNames[pnjProfile.secondaryClass]}`}
              </Text>
            </View>
          )}

          <View style={styles.badgesRow}>
            {pnjProfile?.verified ? (
              <Badge label="Vérifié" variant="success" size="md" icon={<Shield size={12} color={colors.success} />} />
            ) : (
              <Badge label="En attente" variant="warning" size="md" />
            )}
            <Badge label={`${pnjProfile?.hourlyRate || 0}€/h`} variant="primary" size="md" />
          </View>
        </View>

        {/* Stats */}
        <Card style={styles.statsCard}>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{pnjProfile?.completedBookings || 0}</Text>
              <Text style={styles.statLabel}>Bookings</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View style={styles.ratingRow}>
                <Star size={16} color={colors.warning} fill={colors.warning} />
                <Text style={styles.statValue}>{pnjProfile?.rating?.toFixed(1) || '-'}</Text>
              </View>
              <Text style={styles.statLabel}>({pnjProfile?.reviewCount || 0} avis)</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{pnjProfile?.responseRate || 100}%</Text>
              <Text style={styles.statLabel}>Réponse</Text>
            </View>
          </View>
        </Card>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <MenuItem
            icon={<Edit size={20} color={colors.text.secondary} />}
            title="Modifier mon profil"
            onPress={() => {}}
          />
          <MenuItem
            icon={<Eye size={20} color={colors.text.secondary} />}
            title="Prévisualiser mon profil"
            onPress={() => {}}
          />
          <MenuItem
            icon={<Calendar size={20} color={colors.text.secondary} />}
            title="Gérer mes disponibilités"
            onPress={() => {}}
          />
          <MenuItem
            icon={<CreditCard size={20} color={colors.text.secondary} />}
            title="Paramètres de paiement"
            onPress={() => {}}
          />
          <MenuItem
            icon={<Settings size={20} color={colors.text.secondary} />}
            title="Paramètres du compte"
            onPress={() => {}}
          />
        </View>

        {/* Sign Out */}
        <View style={styles.signOutSection}>
          <Button
            title="Se déconnecter"
            onPress={handleSignOut}
            variant="outline"
            size="lg"
            fullWidth
            leftIcon={<LogOut size={20} color={colors.primary[400]} />}
          />
        </View>

        {/* App Version */}
        <Text style={styles.version}>PNJ Premium v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuItem({
  icon,
  title,
  onPress,
}: {
  icon: React.ReactNode;
  title: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      {icon}
      <Text style={styles.menuItemText}>{title}</Text>
      <ChevronRight size={20} color={colors.text.tertiary} />
    </TouchableOpacity>
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
  profileHeader: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  name: {
    ...textStyles.h3,
    color: colors.white,
    marginTop: spacing.md,
  },
  classRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  classEmoji: {
    fontSize: 18,
  },
  className: {
    ...textStyles.body,
    color: colors.text.secondary,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  statsCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statValue: {
    ...textStyles.h3,
    color: colors.white,
  },
  statLabel: {
    ...textStyles.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.bg.tertiary,
  },
  menuSection: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.bg.secondary,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.xl,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.bg.tertiary,
    gap: spacing.md,
  },
  menuItemText: {
    ...textStyles.body,
    color: colors.text.primary,
    flex: 1,
  },
  signOutSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  version: {
    ...textStyles.caption,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
});
