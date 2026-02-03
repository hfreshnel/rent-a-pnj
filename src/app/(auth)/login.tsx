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
const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const theme = useTheme();
  const router = useRouter();
  const toast = useToast();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      // Navigation is handled by useAuth
    } catch (error: unknown) {
      let message = 'Une erreur est survenue';

      const errorCode = (error as { code?: string })?.code;
      if (errorCode === 'auth/user-not-found') {
        message = 'Aucun compte avec cet email';
      } else if (errorCode === 'auth/wrong-password') {
        message = 'Mot de passe incorrect';
      } else if (errorCode === 'auth/too-many-requests') {
        message = 'Trop de tentatives. Réessayez plus tard.';
      } else if (errorCode === 'auth/invalid-credential') {
        message = 'Email ou mot de passe incorrect';
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
            Bon retour ! 👋
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
            Connecte-toi pour continuer l'aventure
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

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Mot de passe"
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
                rightIcon={
                  <Text style={{ color: theme.colors.textMuted }}>
                    {showPassword ? '🙈' : '👁️'}
                  </Text>
                }
                onRightIconPress={() => setShowPassword(!showPassword)}
              />
            )}
          />

          <TouchableOpacity
            onPress={() => router.push('/(auth)/forgot-password')}
            style={styles.forgotPassword}
          >
            <Text style={[styles.forgotPasswordText, { color: theme.colors.primary }]}>
              Mot de passe oublié ?
            </Text>
          </TouchableOpacity>
        </View>

        {/* Submit */}
        <Button
          title="Se connecter"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          loadingText="Connexion..."
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

        {/* Register Link */}
        <View style={styles.registerLink}>
          <Text style={{ color: theme.colors.textMuted }}>Pas encore de compte ?</Text>
          <TouchableOpacity onPress={() => router.replace('/(auth)/register')}>
            <Text style={[styles.registerLinkText, { color: theme.colors.primary }]}>
              {' '}Créer un compte
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -SPACING.s,
  },
  forgotPasswordText: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '500',
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
  registerLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.xl,
  },
  registerLinkText: {
    fontWeight: '600',
  },
});
