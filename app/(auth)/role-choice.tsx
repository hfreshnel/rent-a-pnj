import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, UserCog, ArrowRight, Check } from 'lucide-react-native';
import { colors, spacing, textStyles, borderRadius } from '@/theme';
import { Button } from '@/components/ui';
import { useUpdateUserRole } from '@/hooks/queries/useUser';
import { useToast } from '@/stores';
import { UserRole } from '@/types';

type RoleOption = {
  id: UserRole;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
};

const ROLE_OPTIONS: RoleOption[] = [
  {
    id: 'player',
    title: 'Joueur',
    description: 'Je cherche des PNJ pour des activités',
    icon: <Users size={32} color={colors.primary[400]} />,
    features: [
      'Trouve des compagnons pour tes activités',
      'Gagne de l\'XP et des récompenses',
      'Collectionne des souvenirs',
    ],
  },
  {
    id: 'pnj',
    title: 'PNJ',
    description: 'Je veux proposer mes services',
    icon: <UserCog size={32} color={colors.secondary[400]} />,
    features: [
      'Crée ton profil unique',
      'Fixe tes disponibilités et tarifs',
      'Gagne de l\'argent en rencontrant des gens',
    ],
  },
  {
    id: 'both',
    title: 'Les deux',
    description: 'Je veux être Joueur ET PNJ',
    icon: (
      <View style={styles.bothIcon}>
        <Users size={24} color={colors.primary[400]} />
        <UserCog size={24} color={colors.secondary[400]} />
      </View>
    ),
    features: [
      'Accès à toutes les fonctionnalités',
      'Switch entre les modes facilement',
      'Double les opportunités',
    ],
  },
];

export default function RoleChoiceScreen() {
  const router = useRouter();
  const toast = useToast();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const updateRole = useUpdateUserRole();

  const handleContinue = async () => {
    if (!selectedRole) return;

    try {
      await updateRole.mutateAsync({ role: selectedRole });
      toast.success('Rôle enregistré !');

      // Navigate to appropriate onboarding
      if (selectedRole === 'pnj' || selectedRole === 'both') {
        router.push('/(auth)/onboarding-pnj');
      } else {
        router.push('/(auth)/onboarding-player');
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du rôle');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Qui es-tu ?</Text>
          <Text style={styles.subtitle}>
            Choisis ton rôle dans l'aventure PNJ Premium
          </Text>
        </View>

        {/* Role Options */}
        <View style={styles.optionsContainer}>
          {ROLE_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                selectedRole === option.id && styles.optionCardSelected,
              ]}
              onPress={() => setSelectedRole(option.id)}
              activeOpacity={0.7}
            >
              <View style={styles.optionHeader}>
                <View style={styles.optionIcon}>{option.icon}</View>
                <View style={styles.optionTitleContainer}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionDescription}>
                    {option.description}
                  </Text>
                </View>
                {selectedRole === option.id && (
                  <View style={styles.checkIcon}>
                    <Check size={20} color={colors.white} />
                  </View>
                )}
              </View>

              {selectedRole === option.id && (
                <View style={styles.featuresContainer}>
                  {option.features.map((feature, index) => (
                    <View key={index} style={styles.featureRow}>
                      <View style={styles.featureDot} />
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Continue Button */}
        <View style={styles.footer}>
          <Button
            title="Continuer"
            onPress={handleContinue}
            variant="primary"
            size="lg"
            fullWidth
            disabled={!selectedRole}
            loading={updateRole.isPending}
            rightIcon={<ArrowRight size={20} color={colors.white} />}
          />

          <Text style={styles.hint}>
            Tu pourras changer de rôle plus tard dans les paramètres
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    ...textStyles.h1,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...textStyles.body,
    color: colors.text.secondary,
  },
  optionsContainer: {
    flex: 1,
    gap: spacing.md,
  },
  optionCard: {
    backgroundColor: colors.bg.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[500] + '10',
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.bg.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  bothIcon: {
    flexDirection: 'row',
    gap: -8,
  },
  optionTitleContainer: {
    flex: 1,
  },
  optionTitle: {
    ...textStyles.h4,
    color: colors.white,
    marginBottom: 2,
  },
  optionDescription: {
    ...textStyles.bodySmall,
    color: colors.text.secondary,
  },
  checkIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuresContainer: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.bg.tertiary,
    gap: spacing.sm,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary[400],
  },
  featureText: {
    ...textStyles.bodySmall,
    color: colors.text.secondary,
  },
  footer: {
    marginTop: spacing.lg,
  },
  hint: {
    ...textStyles.caption,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
