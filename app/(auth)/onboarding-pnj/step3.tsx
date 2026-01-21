import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Euro, MapPin, Navigation } from 'lucide-react-native';
import { useForm, Controller } from 'react-hook-form';
import { colors, spacing, textStyles, borderRadius } from '@/theme';
import { Button, Input } from '@/components/ui';

type Step3Form = {
  hourlyRate: string;
  city: string;
  maxDistance: string;
};

const RATE_PRESETS = [15, 25, 35, 50];
const DISTANCE_PRESETS = [5, 10, 20, 50];

export default function PNJOnboardingStep3() {
  const router = useRouter();
  const [selectedRate, setSelectedRate] = useState<number | null>(null);
  const [selectedDistance, setSelectedDistance] = useState<number | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Step3Form>({
    defaultValues: {
      hourlyRate: '',
      city: '',
      maxDistance: '',
    },
  });

  const handleRateSelect = (rate: number) => {
    setSelectedRate(rate);
    setValue('hourlyRate', rate.toString());
  };

  const handleDistanceSelect = (distance: number) => {
    setSelectedDistance(distance);
    setValue('maxDistance', distance.toString());
  };

  const onSubmit = (data: Step3Form) => {
    router.push('/(auth)/onboarding-pnj/step4');
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
                step === 3 && styles.progressDotActive,
                step < 3 && styles.progressDotCompleted,
              ]}
            />
          ))}
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.stepLabel}>Étape 3/5</Text>
          <Text style={styles.title}>Tarif & Localisation</Text>
          <Text style={styles.subtitle}>
            Définis ton tarif horaire et ta zone d'activité
          </Text>
        </View>

        {/* Hourly Rate */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tarif horaire</Text>
          <Text style={styles.sectionHint}>
            Entre 15€ et 100€/heure (commission de 20%)
          </Text>

          <View style={styles.presetsRow}>
            {RATE_PRESETS.map((rate) => (
              <TouchableOpacity
                key={rate}
                style={[
                  styles.presetButton,
                  selectedRate === rate && styles.presetButtonSelected,
                ]}
                onPress={() => handleRateSelect(rate)}
              >
                <Text
                  style={[
                    styles.presetText,
                    selectedRate === rate && styles.presetTextSelected,
                  ]}
                >
                  {rate}€
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Controller
            control={control}
            name="hourlyRate"
            rules={{
              required: 'Tarif requis',
              min: { value: 15, message: 'Minimum 15€' },
              max: { value: 100, message: 'Maximum 100€' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Ou entre un montant personnalisé"
                keyboardType="numeric"
                leftIcon={<Euro size={20} color={colors.text.tertiary} />}
                value={value}
                onChangeText={(text) => {
                  onChange(text);
                  setSelectedRate(null);
                }}
                onBlur={onBlur}
                error={errors.hourlyRate?.message}
              />
            )}
          />
        </View>

        {/* City */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ville</Text>

          <Controller
            control={control}
            name="city"
            rules={{ required: 'Ville requise' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Dans quelle ville es-tu ?"
                leftIcon={<MapPin size={20} color={colors.text.tertiary} />}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.city?.message}
              />
            )}
          />
        </View>

        {/* Max Distance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Distance maximale</Text>
          <Text style={styles.sectionHint}>
            Jusqu'où es-tu prêt(e) à te déplacer ?
          </Text>

          <View style={styles.presetsRow}>
            {DISTANCE_PRESETS.map((distance) => (
              <TouchableOpacity
                key={distance}
                style={[
                  styles.presetButton,
                  selectedDistance === distance && styles.presetButtonSelected,
                ]}
                onPress={() => handleDistanceSelect(distance)}
              >
                <Text
                  style={[
                    styles.presetText,
                    selectedDistance === distance && styles.presetTextSelected,
                  ]}
                >
                  {distance}km
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Controller
            control={control}
            name="maxDistance"
            rules={{
              required: 'Distance requise',
              min: { value: 1, message: 'Minimum 1km' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Ou entre une distance personnalisée"
                keyboardType="numeric"
                leftIcon={<Navigation size={20} color={colors.text.tertiary} />}
                value={value}
                onChangeText={(text) => {
                  onChange(text);
                  setSelectedDistance(null);
                }}
                onBlur={onBlur}
                error={errors.maxDistance?.message}
              />
            )}
          />
        </View>

        {/* Earnings Preview */}
        <View style={styles.earningsPreview}>
          <Text style={styles.earningsTitle}>Estimation de gains</Text>
          <Text style={styles.earningsAmount}>
            {selectedRate ? `${(selectedRate * 0.8).toFixed(0)}€` : '--€'}/heure net
          </Text>
          <Text style={styles.earningsHint}>
            (après commission plateforme de 20%)
          </Text>
        </View>

        {/* Navigation */}
        <View style={styles.navigation}>
          <Button
            title="Continuer"
            onPress={handleSubmit(onSubmit)}
            variant="primary"
            size="lg"
            fullWidth
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
    marginBottom: spacing.xl,
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
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...textStyles.bodySemiBold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  sectionHint: {
    ...textStyles.caption,
    color: colors.text.tertiary,
    marginBottom: spacing.md,
  },
  presetsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  presetButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.bg.secondary,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  presetButtonSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[500] + '20',
  },
  presetText: {
    ...textStyles.bodySemiBold,
    color: colors.text.secondary,
  },
  presetTextSelected: {
    color: colors.primary[400],
  },
  earningsPreview: {
    backgroundColor: colors.bg.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  earningsTitle: {
    ...textStyles.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  earningsAmount: {
    ...textStyles.h2,
    color: colors.success,
    marginBottom: spacing.xs,
  },
  earningsHint: {
    ...textStyles.caption,
    color: colors.text.tertiary,
  },
  navigation: {
    marginTop: 'auto',
    gap: spacing.sm,
  },
});
