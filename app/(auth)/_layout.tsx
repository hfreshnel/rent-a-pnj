import { Stack, Redirect } from 'expo-router';
import { colors } from '@/theme';
import { useAuthStore } from '@/stores';
import { LoadingState } from '@/components/ui';

export default function AuthLayout() {
  const { isAuthenticated, isInitialized, isLoading, user } = useAuthStore();

  // Show loading while checking auth state
  if (!isInitialized || isLoading) {
    return <LoadingState fullScreen message="Chargement..." />;
  }

  // Redirect authenticated users
  if (isAuthenticated && user) {
    // Redirect based on role
    if (user.role === 'pnj') {
      return <Redirect href="/(pnj)" />;
    }
    return <Redirect href="/(player)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg.primary },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="role-choice" />
      <Stack.Screen name="onboarding-player" />
      <Stack.Screen name="onboarding-pnj" />
    </Stack>
  );
}
