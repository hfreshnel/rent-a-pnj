import { Stack } from 'expo-router';
import { useTheme } from '../../../theme';

export default function OnboardingPNJLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
        animation: 'slide_from_right',
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
