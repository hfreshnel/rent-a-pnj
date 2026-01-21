import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Camera } from 'lucide-react-native';
import { useForm, Controller } from 'react-hook-form';
import { colors, spacing, textStyles, borderRadius } from '@/theme';
import { Button, Input, Avatar } from '@/components/ui';

type Step1Form = {
  displayName: string;
  bio: string;
};

export default function PNJOnboardingStep1() {
  const router = useRouter();
  const [avatar, setAvatar] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Step1Form>({
    defaultValues: {
      displayName: '',
      bio: '',
    },
  });

  const onSubmit = (data: Step1Form) => {
    // Store data temporarily (in a real app, use context or store)
    router.push('/(auth)/onboarding-pnj/step2');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Progress */}
          <View style={styles.progressContainer}>
            {[1, 2, 3, 4, 5].map((step) => (
              <View
                key={step}
                style={[
                  styles.progressDot,
                  step === 1 && styles.progressDotActive,
                ]}
              />
            ))}
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.stepLabel}>Étape 1/5</Text>
            <Text style={styles.title}>Ton profil</Text>
            <Text style={styles.subtitle}>
              Commence par les informations de base
            </Text>
          </View>

          {/* Avatar Upload */}
          <TouchableOpacity style={styles.avatarContainer} onPress={() => {}}>
            <Avatar source={avatar} name="?" size="2xl" />
            <View style={styles.avatarBadge}>
              <Camera size={16} color={colors.white} />
            </View>
            <Text style={styles.avatarHint}>Ajouter une photo</Text>
          </TouchableOpacity>

          {/* Form */}
          <View style={styles.form}>
            <Controller
              control={control}
              name="displayName"
              rules={{
                required: 'Nom requis',
                minLength: { value: 2, message: 'Nom trop court' },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Nom d'affichage"
                  placeholder="Comment veux-tu être appelé(e) ?"
                  autoCapitalize="words"
                  leftIcon={<User size={20} color={colors.text.tertiary} />}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.displayName?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="bio"
              rules={{
                required: 'Bio requise',
                minLength: { value: 20, message: 'Bio trop courte (min 20 caractères)' },
                maxLength: { value: 500, message: 'Bio trop longue (max 500 caractères)' },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Input
                    label="Ta bio"
                    placeholder="Décris-toi en quelques mots... Qu'est-ce qui te rend unique ?"
                    multiline
                    numberOfLines={4}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.bio?.message}
                    inputStyle={styles.bioInput}
                  />
                  <Text style={styles.charCount}>{value.length}/500</Text>
                </View>
              )}
            />
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
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  keyboardView: {
    flex: 1,
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
  avatarContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 24,
    right: '35%',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.bg.primary,
  },
  avatarHint: {
    ...textStyles.bodySmall,
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
  form: {
    gap: spacing.md,
  },
  bioInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    ...textStyles.caption,
    color: colors.text.tertiary,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  navigation: {
    marginTop: 'auto',
    paddingTop: spacing.xl,
  },
});
