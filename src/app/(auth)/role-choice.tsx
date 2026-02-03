import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../theme';
import { Button, Card } from '../../components/ui';
import { useToast } from '../../components/ui/toast';
import { useAuthStore } from '../../stores/authStore';
import { updateUserRole } from '../../services/api/users';
import { UserRole } from '../../types/user';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants/theme';

type RoleOption = {
  id: UserRole;
  emoji: string;
  title: string;
  description: string;
};

const ROLE_OPTIONS: RoleOption[] = [
  {
    id: 'player',
    emoji: '🎮',
    title: 'Joueur',
    description: 'Je cherche des PNJ pour mes activités',
  },
  {
    id: 'pnj',
    emoji: '🗡️',
    title: 'PNJ',
    description: 'Je veux proposer mes services comme PNJ',
  },
  {
    id: 'both',
    emoji: '⚔️',
    title: 'Les deux',
    description: 'Je veux explorer les deux rôles',
  },
];

export default function RoleChoiceScreen() {
  const theme = useTheme();
  const router = useRouter();
  const toast = useToast();
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);

  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    if (!selectedRole || !user) return;

    setIsLoading(true);
    try {
      await updateUserRole(user.id, selectedRole);
      updateUser({ role: selectedRole });

      // Navigate based on role
      if (selectedRole === 'player') {
        router.replace('/(auth)/onboarding-player');
      } else if (selectedRole === 'pnj' || selectedRole === 'both') {
        router.replace('/(auth)/onboarding-pnj');
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du profil');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Title */}
      <View style={styles.titleSection}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Choisis ton rôle 🎭
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
          Tu pourras changer plus tard dans les paramètres
        </Text>
      </View>

      {/* Role Options */}
      <View style={styles.options}>
        {ROLE_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.id}
            activeOpacity={0.7}
            onPress={() => setSelectedRole(option.id)}
          >
            <View
              style={[
                styles.optionCard,
                {
                  backgroundColor:
                    selectedRole === option.id
                      ? theme.colors.primaryLight
                      : theme.colors.surface,
                  borderColor:
                    selectedRole === option.id
                      ? theme.colors.primary
                      : theme.colors.outline,
                },
              ]}
            >
              <Text style={styles.optionEmoji}>{option.emoji}</Text>
              <View style={styles.optionText}>
                <Text
                  style={[
                    styles.optionTitle,
                    {
                      color:
                        selectedRole === option.id
                          ? theme.colors.primary
                          : theme.colors.text,
                    },
                  ]}
                >
                  {option.title}
                </Text>
                <Text style={[styles.optionDescription, { color: theme.colors.textMuted }]}>
                  {option.description}
                </Text>
              </View>
              <View
                style={[
                  styles.radio,
                  {
                    borderColor:
                      selectedRole === option.id
                        ? theme.colors.primary
                        : theme.colors.outline,
                    backgroundColor:
                      selectedRole === option.id
                        ? theme.colors.primary
                        : 'transparent',
                  },
                ]}
              >
                {selectedRole === option.id && (
                  <View style={[styles.radioInner, { backgroundColor: theme.colors.onPrimary }]} />
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Continue Button */}
      <View style={styles.actions}>
        <Button
          title="Continuer"
          onPress={handleContinue}
          loading={isLoading}
          disabled={!selectedRole}
          variant="primary"
          size="large"
          fullWidth
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.l,
    paddingTop: SPACING.xxl,
  },
  titleSection: {
    marginBottom: SPACING.xl,
  },
  title: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.s,
    textAlign: 'center',
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
  },
  options: {
    flex: 1,
    gap: SPACING.m,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.m,
    borderRadius: BORDER_RADIUS.l,
    borderWidth: 2,
  },
  optionEmoji: {
    fontSize: 32,
    marginRight: SPACING.m,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    ...TYPOGRAPHY.h4,
    marginBottom: SPACING.xs,
  },
  optionDescription: {
    ...TYPOGRAPHY.bodySmall,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  actions: {
    marginTop: SPACING.l,
  },
});
