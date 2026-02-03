import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';

import { LevelUpModal } from '../components/game';
import { ToastContainer } from '../components/ui/toast';
import { useAuth } from '../hooks/utils/useAuth';
import { useAuthStore } from '../stores/authStore';
import { useGameStore } from '../stores/gameStore';
import { useUIStore } from '../stores/uiStore';
import { useTheme } from '../theme';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

// Auth navigation guard
function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const { user, isLoading, isInitialized } = useAuthStore();
  const theme = useTheme();

  // Initialize auth (triggers Firebase subscription or offline mode)
  useAuth();

  useEffect(() => {
    if (!isInitialized) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inPlayerGroup = segments[0] === '(player)';
    const inPNJGroup = segments[0] === '(pnj)';

    if (!user && !inAuthGroup) {
      // Redirect to auth if not logged in
      router.replace('/(auth)');
    } else if (user && inAuthGroup) {
      // Redirect to appropriate dashboard based on role
      if (user.role === 'pnj') {
        router.replace('/(pnj)');
      } else {
        router.replace('/(player)');
      }
    }
  }, [user, segments, isInitialized]);

  if (!isInitialized || isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return <>{children}</>;
}

// Level Up Modal Handler
function LevelUpHandler() {
  const { showLevelUpModal, levelUpData, hideLevelUp } = useGameStore();

  return (
    <LevelUpModal
      visible={showLevelUpModal}
      newLevel={levelUpData?.newLevel ?? 1}
      onClose={hideLevelUp}
    />
  );
}

// Root layout with providers
function RootLayoutNav() {
  const theme = useTheme();
  const themeMode = useUIStore((s) => s.theme);

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(player)" />
        <Stack.Screen name="(pnj)" />
        <Stack.Screen name="(shared)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />
      <LevelUpHandler />
    </>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthGuard>
        <RootLayoutNav />
      </AuthGuard>
      <ToastContainer />
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
