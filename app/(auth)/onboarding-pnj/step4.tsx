import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check } from 'lucide-react-native';
import { colors, spacing, textStyles, borderRadius } from '@/theme';
import { Button } from '@/components/ui';
import { DEFAULT_ACTIVITIES } from '@/types/activity';

export default function PNJOnboardingStep4() {
  const router = useRouter();
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  const toggleActivity = (activityId: string) => {
    setSelectedActivities((prev) =>
      prev.includes(activityId)
        ? prev.filter((id) => id !== activityId)
        : [...prev, activityId]
    );
  };

  const handleContinue = () => {
    if (selectedActivities.length > 0) {
      router.push('/(auth)/onboarding-pnj/step5');
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
                step === 4 && styles.progressDotActive,
                step < 4 && styles.progressDotCompleted,
              ]}
            />
          ))}
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.stepLabel}>Étape 4/5</Text>
          <Text style={styles.title}>Tes activités</Text>
          <Text style={styles.subtitle}>
            Sélectionne les activités que tu proposes (min. 1)
          </Text>
        </View>

        {/* Selected count */}
        {selectedActivities.length > 0 && (
          <View style={styles.selectedCount}>
            <Text style={styles.selectedCountText}>
              {selectedActivities.length} activité(s) sélectionnée(s)
            </Text>
          </View>
        )}

        {/* Categories */}
        {DEFAULT_ACTIVITIES.categories.map((category) => (
          <View key={category.id} style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryName}>{category.name}</Text>
            </View>

            <View style={styles.activitiesGrid}>
              {category.activities.map((activity) => {
                const isSelected = selectedActivities.includes(activity.id);
                return (
                  <TouchableOpacity
                    key={activity.id}
                    style={[
                      styles.activityChip,
                      isSelected && styles.activityChipSelected,
                    ]}
                    onPress={() => toggleActivity(activity.id)}
                  >
                    {isSelected && (
                      <Check size={14} color={colors.primary[400]} />
                    )}
                    <Text
                      style={[
                        styles.activityText,
                        isSelected && styles.activityTextSelected,
                      ]}
                    >
                      {activity.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        {/* Navigation */}
        <View style={styles.navigation}>
          <Button
            title="Continuer"
            onPress={handleContinue}
            variant="primary"
            size="lg"
            fullWidth
            disabled={selectedActivities.length === 0}
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
  selectedCount: {
    backgroundColor: colors.primary[500] + '20',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    marginBottom: spacing.lg,
  },
  selectedCountText: {
    ...textStyles.caption,
    color: colors.primary[400],
  },
  categorySection: {
    marginBottom: spacing.lg,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  categoryIcon: {
    fontSize: 20,
  },
  categoryName: {
    ...textStyles.bodySemiBold,
    color: colors.text.primary,
  },
  activitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  activityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg.secondary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activityChipSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[500] + '15',
  },
  activityText: {
    ...textStyles.bodySmall,
    color: colors.text.secondary,
  },
  activityTextSelected: {
    color: colors.primary[400],
  },
  navigation: {
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
});
