import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTheme } from '../../theme';
import { Button, Input } from '../../components/ui';
import { useToast } from '../../components/ui/toast';
import { useAuth } from '../../hooks/utils/useAuth';
import { SPACING, TYPOGRAPHY } from '../../constants/theme';

// Validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email('Email invalide'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordScreen() {
  const theme = useTheme();
  const router = useRouter();
  const toast = useToast();
  const { forgotPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      await forgotPassword(data.email);
      setEmailSent(true);
      toast.success('Email envoyé !');
    } catch (error: unknown) {
      let message = 'Une erreur est survenue';

      const errorCode = (error as { code?: string })?.code;
      if (errorCode === 'auth/user-not-found') {
        message = 'Aucun compte avec cet email';
      }

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={{ color: theme.colors.primary, fontSize: 24 }}>←</Text>
            </TouchableOpacity>
          </View>

          {/* Success State */}
          <View style={styles.successContainer}>
            <Text style={styles.successEmoji}>📧</Text>
            <Text style={[styles.successTitle, { color: theme.colors.text }]}>
              Email envoyé !
            </Text>
            <Text style={[styles.successText, { color: theme.colors.textMuted }]}>
              Nous avons envoyé un lien de réinitialisation à{' '}
              <Text style={{ fontWeight: '600', color: theme.colors.text }}>
                {getValues('email')}
              </Text>
            </Text>
            <Text style={[styles.successHint, { color: theme.colors.textMuted }]}>
              Vérifie tes spams si tu ne vois pas l'email.
            </Text>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <Button
              title="Retour à la connexion"
              onPress={() => router.replace('/(auth)/login')}
              variant="primary"
              size="large"
              fullWidth
            />
            <Button
              title="Renvoyer l'email"
              onPress={handleSubmit(onSubmit)}
              variant="ghost"
              size="medium"
              fullWidth
              style={{ marginTop: SPACING.m }}
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={{ color: theme.colors.primary, fontSize: 24 }}>←</Text>
            </TouchableOpacity>
          </View>

          {/* Title */}
          <View style={styles.titleSection}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Mot de passe oublié ? 🔐
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
              Pas de panique ! Entre ton email et on t'envoie un lien pour le
              réinitialiser.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email"
                  placeholder="ton@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                />
              )}
            />
          </View>

          {/* Submit */}
          <Button
            title="Envoyer le lien"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            loadingText="Envoi..."
            variant="primary"
            size="large"
            fullWidth
          />

          {/* Login Link */}
          <View style={styles.loginLink}>
            <Text style={{ color: theme.colors.textMuted }}>Tu t'en souviens ?</Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
              <Text style={[styles.loginLinkText, { color: theme.colors.primary }]}>
                {' '}Se connecter
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: SPACING.l,
    paddingTop: SPACING.xl,
  },
  header: {
    marginBottom: SPACING.l,
  },
  titleSection: {
    marginBottom: SPACING.xl,
  },
  title: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.s,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
  },
  form: {
    marginBottom: SPACING.l,
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.xl,
  },
  loginLinkText: {
    fontWeight: '600',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.l,
  },
  successEmoji: {
    fontSize: 64,
    marginBottom: SPACING.l,
  },
  successTitle: {
    ...TYPOGRAPHY.h2,
    textAlign: 'center',
    marginBottom: SPACING.m,
  },
  successText: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    marginBottom: SPACING.m,
  },
  successHint: {
    ...TYPOGRAPHY.caption,
    textAlign: 'center',
  },
  actions: {
    marginBottom: SPACING.xl,
  },
});
