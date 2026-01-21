import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react-native';
import { useForm, Controller } from 'react-hook-form';
import { colors, spacing, textStyles } from '@/theme';
import { Button, Input } from '@/components/ui';
import { useAuthStore, useToast } from '@/stores';

type ForgotPasswordForm = {
  email: string;
};

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const toast = useToast();
  const { forgotPassword, isLoading, error, clearError } = useAuthStore();
  const [emailSent, setEmailSent] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordForm>({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      clearError();
      await forgotPassword(data.email);
      setEmailSent(true);
      toast.success('Email envoyé !');
    } catch (err) {
      // Error is already set in store
    }
  };

  if (emailSent) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.successContent}>
          <View style={styles.successIcon}>
            <CheckCircle size={64} color={colors.success} />
          </View>

          <Text style={styles.successTitle}>Email envoyé !</Text>
          <Text style={styles.successMessage}>
            Un email de réinitialisation a été envoyé à{' '}
            <Text style={styles.emailHighlight}>{getValues('email')}</Text>.
            Vérifie ta boîte de réception.
          </Text>

          <Button
            title="Retour à la connexion"
            onPress={() => router.push('/(auth)/login')}
            variant="primary"
            size="lg"
            fullWidth
            style={styles.backToLoginButton}
          />

          <TouchableOpacity
            onPress={() => setEmailSent(false)}
            style={styles.resendLink}
          >
            <Text style={styles.resendText}>
              Pas reçu ? Renvoyer l'email
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color={colors.white} />
            </TouchableOpacity>
          </View>

          {/* Title */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Mot de passe oublié</Text>
            <Text style={styles.subtitle}>
              Entre ton email pour recevoir un lien de réinitialisation
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Controller
              control={control}
              name="email"
              rules={{
                required: 'Email requis',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email invalide',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email"
                  placeholder="ton@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  leftIcon={<Mail size={20} color={colors.text.tertiary} />}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                />
              )}
            />

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Button
              title="Envoyer le lien"
              onPress={handleSubmit(onSubmit)}
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              style={styles.submitButton}
            />
          </View>

          {/* Back to Login */}
          <View style={styles.loginSection}>
            <Text style={styles.loginText}>Tu te souviens ?</Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.loginLink}>Se connecter</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  header: {
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.bg.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleSection: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
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
  form: {
    gap: spacing.sm,
  },
  errorContainer: {
    backgroundColor: colors.error + '20',
    padding: spacing.md,
    borderRadius: 8,
    marginTop: spacing.sm,
  },
  errorText: {
    ...textStyles.bodySmall,
    color: colors.error,
  },
  submitButton: {
    marginTop: spacing.lg,
  },
  loginSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
    gap: spacing.xs,
  },
  loginText: {
    ...textStyles.body,
    color: colors.text.secondary,
  },
  loginLink: {
    ...textStyles.bodySemiBold,
    color: colors.primary[400],
  },
  // Success state styles
  successContent: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIcon: {
    marginBottom: spacing.lg,
  },
  successTitle: {
    ...textStyles.h2,
    color: colors.white,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  successMessage: {
    ...textStyles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  emailHighlight: {
    color: colors.primary[400],
    fontWeight: '600',
  },
  backToLoginButton: {
    marginTop: spacing.md,
  },
  resendLink: {
    marginTop: spacing.lg,
  },
  resendText: {
    ...textStyles.bodySmall,
    color: colors.primary[400],
  },
});
