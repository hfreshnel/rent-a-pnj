import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '../../theme';

export default function SharedLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen name="chats/index" />
      <Stack.Screen name="chat/[id]" />
      <Stack.Screen name="booking/[id]" />
      <Stack.Screen name="settings/index" />
      <Stack.Screen name="settings/account" />
      <Stack.Screen name="settings/notifications" />
      <Stack.Screen name="settings/security" />
      <Stack.Screen name="settings/help" />
    </Stack>
  );
}
