import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Settings,
  CreditCard,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Trophy,
  Star,
  Clock,
} from 'lucide-react-native';
import { colors, spacing, textStyles, borderRadius } from '@/theme';
import { Avatar, Card, Button } from '@/components/ui';
import { useAuthStore } from '@/stores';
import { calculateLevel } from '@/types/mission';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuthStore();

  const level = user ? calculateLevel(user.xp) : 1;

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Avatar source={user?.avatar} name={user?.displayName} size="2xl" />
          <Text style={styles.name}>{user?.displayName}</Text>
          <Text style={styles.email}>{user?.email}</Text>

          <View style={styles.levelBadge}>
            <Trophy size={16} color={colors.warning} />
            <Text style={styles.levelText}>Niveau {level}</Text>
          </View>
        </View>

        {/* Stats */}
        <Card style={styles.statsCard}>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user?.stats?.bookingsCompleted || 0}</Text>
              <Text style={styles.statLabel}>Bookings</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user?.stats?.totalHours || 0}h</Text>
              <Text style={styles.statLabel}>Passées</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user?.stats?.uniquePnjMet || 0}</Text>
              <Text style={styles.statLabel}>PNJ rencontrés</Text>
            </View>
          </View>
        </Card>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <MenuItem
            icon={<Settings size={20} color={colors.text.secondary} />}
            title="Paramètres du compte"
            onPress={() => {}}
          />
          <MenuItem
            icon={<CreditCard size={20} color={colors.text.secondary} />}
            title="Moyens de paiement"
            onPress={() => {}}
          />
          <MenuItem
            icon={<Shield size={20} color={colors.text.secondary} />}
            title="Sécurité"
            onPress={() => {}}
          />
          <MenuItem
            icon={<HelpCircle size={20} color={colors.text.secondary} />}
            title="Aide & Support"
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
  email: {
    ...textStyles.body,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning + '20',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  levelText: {
    ...textStyles.bodySemiBold,
    color: colors.warning,
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
