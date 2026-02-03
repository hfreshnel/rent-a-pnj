import { Stack } from 'expo-router';
import { useTheme } from '../../theme';

export default function AuthLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="role-choice" />
      <Stack.Screen
        name="onboarding-player"
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="onboarding-pnj"
        options={{ gestureEnabled: false }}
      />
    </Stack>
  );
}
