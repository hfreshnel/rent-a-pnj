import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
const registerSchema = z
  .object({
    displayName: z
      .string()
      .min(2, 'Minimum 2 caractères')
      .max(30, 'Maximum 30 caractères'),
    email: z.string().email('Email invalide'),
    password: z
      .string()
      .min(8, 'Minimum 8 caractères')
      .regex(/[A-Z]/, 'Au moins une majuscule')
      .regex(/[0-9]/, 'Au moins un chiffre'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const theme = useTheme();
  const router = useRouter();
  const toast = useToast();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await register(data.email, data.password, data.displayName);
      toast.success('Compte créé ! Vérifie ton email.');
      router.push('/(auth)/role-choice');
    } catch (error: unknown) {
      let message = 'Une erreur est survenue';

      const errorCode = (error as { code?: string })?.code;
      if (errorCode === 'auth/email-already-in-use') {
        message = 'Cet email est déjà utilisé';
      } else if (errorCode === 'auth/weak-password') {
        message = 'Mot de passe trop faible';
      } else if (errorCode === 'auth/invalid-email') {
        message = 'Email invalide';
      }

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: theme.colors.primary, fontSize: 24 }}>←</Text>
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Crée ton compte 🎮
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
            Rejoins la communauté et commence l'aventure
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Controller
            control={control}
            name="displayName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Pseudo"
                placeholder="Ton pseudo d'aventurier"
                autoCapitalize="words"
                autoComplete="name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.displayName?.message}
              />
            )}
          />

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

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Mot de passe"
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password-new"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
                helperText="Min. 8 caractères, 1 majuscule, 1 chiffre"
                rightIcon={
                  <Text style={{ color: theme.colors.textMuted }}>
                    {showPassword ? '🙈' : '👁️'}
                  </Text>
                }
                onRightIconPress={() => setShowPassword(!showPassword)}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Confirmer le mot de passe"
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.confirmPassword?.message}
              />
            )}
          />
        </View>

        {/* Submit */}
        <Button
          title="Créer mon compte"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          loadingText="Création..."
          variant="primary"
          size="large"
          fullWidth
        />

        {/* Divider */}
        <View style={styles.divider}>
          <View style={[styles.dividerLine, { backgroundColor: theme.colors.outline }]} />
          <Text style={[styles.dividerText, { color: theme.colors.textMuted }]}>
            ou
          </Text>
          <View style={[styles.dividerLine, { backgroundColor: theme.colors.outline }]} />
        </View>

        {/* Social Login */}
        <View style={styles.socialButtons}>
          <Button
            title="Continuer avec Google"
            onPress={() => toast.info('Google Sign-In à configurer')}
            variant="secondary"
            size="large"
            fullWidth
            leftIcon={<Text style={{ fontSize: 18 }}>🔵</Text>}
          />
        </View>

        {/* Login Link */}
        <View style={styles.loginLink}>
          <Text style={{ color: theme.colors.textMuted }}>Déjà un compte ?</Text>
          <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
            <Text style={[styles.loginLinkText, { color: theme.colors.primary }]}>
              {' '}Se connecter
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
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
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.l,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: SPACING.m,
    ...TYPOGRAPHY.caption,
  },
  socialButtons: {
    gap: SPACING.m,
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.xl,
  },
  loginLinkText: {
    fontWeight: '600',
  },
});
