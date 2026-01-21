import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check } from 'lucide-react-native';
import { colors, spacing, textStyles, borderRadius, classNames, classEmojis } from '@/theme';
import { Button } from '@/components/ui';
import { PNJClass } from '@/types';

const CLASSES: { id: PNJClass; name: string; emoji: string; description: string }[] = [
  { id: 'adventurer', name: classNames.adventurer, emoji: classEmojis.adventurer, description: 'Activités outdoor, exploration, voyages' },
  { id: 'sage', name: classNames.sage, emoji: classEmojis.sage, description: 'Culture, apprentissage, discussions profondes' },
  { id: 'bard', name: classNames.bard, emoji: classEmojis.bard, description: 'Musique, spectacles, sorties culturelles' },
  { id: 'tank', name: classNames.tank, emoji: classEmojis.tank, description: 'Protection, accompagnement, soutien' },
  { id: 'foodie', name: classNames.foodie, emoji: classEmojis.foodie, description: 'Gastronomie, restaurants, food tours' },
  { id: 'geek', name: classNames.geek, emoji: classEmojis.geek, description: 'Jeux vidéo, jeux de société, tech' },
  { id: 'artist', name: classNames.artist, emoji: classEmojis.artist, description: 'Créativité, art, ateliers DIY' },
  { id: 'coach', name: classNames.coach, emoji: classEmojis.coach, description: 'Sport, fitness, motivation' },
];

export default function PNJOnboardingStep2() {
  const router = useRouter();
  const [primaryClass, setPrimaryClass] = useState<PNJClass | null>(null);
  const [secondaryClass, setSecondaryClass] = useState<PNJClass | null>(null);

  const handleClassSelect = (classId: PNJClass) => {
    if (primaryClass === classId) {
      setPrimaryClass(null);
    } else if (secondaryClass === classId) {
      setSecondaryClass(null);
    } else if (!primaryClass) {
      setPrimaryClass(classId);
    } else if (!secondaryClass) {
      setSecondaryClass(classId);
    } else {
      // Replace secondary with new selection
      setSecondaryClass(classId);
    }
  };

  const handleContinue = () => {
    if (primaryClass) {
      router.push('/(auth)/onboarding-pnj/step3');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Progress */}
        <View style={styles.progressContainer}>
          {[1, 2, 3, 4, 5].map((step) => (
            <View
              key={step}
              style={[
                styles.progressDot,
                step === 2 && styles.progressDotActive,
                step < 2 && styles.progressDotCompleted,
              ]}
            />
          ))}
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.stepLabel}>Étape 2/5</Text>
          <Text style={styles.title}>Ta classe</Text>
          <Text style={styles.subtitle}>
            Choisis ta classe principale et une secondaire (optionnel)
          </Text>
        </View>

        {/* Selected Classes */}
        {(primaryClass || secondaryClass) && (
          <View style={styles.selectedContainer}>
            {primaryClass && (
              <View style={styles.selectedBadge}>
                <Text style={styles.selectedEmoji}>{classEmojis[primaryClass]}</Text>
                <Text style={styles.selectedText}>Principal</Text>
              </View>
            )}
            {secondaryClass && (
              <View style={[styles.selectedBadge, styles.selectedBadgeSecondary]}>
                <Text style={styles.selectedEmoji}>{classEmojis[secondaryClass]}</Text>
                <Text style={styles.selectedText}>Secondaire</Text>
              </View>
            )}
          </View>
        )}

        {/* Class Grid */}
        <View style={styles.classGrid}>
          {CLASSES.map((cls) => {
            const isPrimary = primaryClass === cls.id;
            const isSecondary = secondaryClass === cls.id;
            const isSelected = isPrimary || isSecondary;

            return (
              <TouchableOpacity
                key={cls.id}
                style={[
                  styles.classCard,
                  isSelected && styles.classCardSelected,
                  isPrimary && styles.classCardPrimary,
                ]}
                onPress={() => handleClassSelect(cls.id)}
                activeOpacity={0.7}
              >
                <View style={styles.classHeader}>
                  <Text style={styles.classEmoji}>{cls.emoji}</Text>
                  {isSelected && (
                    <View style={[styles.checkBadge, isPrimary && styles.checkBadgePrimary]}>
                      <Check size={12} color={colors.white} />
                    </View>
                  )}
                </View>
                <Text style={styles.className}>{cls.name}</Text>
                <Text style={styles.classDescription}>{cls.description}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Navigation */}
        <View style={styles.navigation}>
          <Button
            title="Continuer"
            onPress={handleContinue}
            variant="primary"
            size="lg"
            fullWidth
            disabled={!primaryClass}
          />
          <Button
            title="Retour"
            onPress={() => router.back()}
            variant="ghost"
            size="md"
            fullWidth
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.bg.tertiary,
  },
  progressDotActive: {
    backgroundColor: colors.primary[500],
    width: 24,
  },
  progressDotCompleted: {
    backgroundColor: colors.primary[500],
  },
  header: {
    marginBottom: spacing.lg,
  },
  stepLabel: {
    ...textStyles.caption,
    color: colors.primary[400],
    marginBottom: spacing.xs,
  },
  title: {
    ...textStyles.h2,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...textStyles.body,
    color: colors.text.secondary,
  },
  selectedContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  selectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[500] + '30',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    gap: spacing.sm,
  },
  selectedBadgeSecondary: {
    backgroundColor: colors.secondary[500] + '30',
  },
  selectedEmoji: {
    fontSize: 18,
  },
  selectedText: {
    ...textStyles.caption,
    color: colors.text.primary,
  },
  classGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  classCard: {
    width: '47%',
    backgroundColor: colors.bg.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  classCardSelected: {
    borderColor: colors.secondary[500],
    backgroundColor: colors.secondary[500] + '10',
  },
  classCardPrimary: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[500] + '10',
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  classEmoji: {
    fontSize: 32,
  },
  checkBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.secondary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBadgePrimary: {
    backgroundColor: colors.primary[500],
  },
  className: {
    ...textStyles.bodySemiBold,
    color: colors.text.primary,
    marginBottom: 2,
  },
  classDescription: {
    ...textStyles.caption,
    color: colors.text.secondary,
  },
  navigation: {
    marginTop: 'auto',
    gap: spacing.sm,
  },
});
