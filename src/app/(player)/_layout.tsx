import { Tabs } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';
import { useTheme } from '../../theme';

export default function PlayerLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color }) => <TabIcon icon="🏠" color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Explorer',
          tabBarIcon: ({ color }) => <TabIcon icon="🔍" color={color} />,
        }}
      />
      <Tabs.Screen
        name="missions"
        options={{
          title: 'Missions',
          tabBarIcon: ({ color }) => <TabIcon icon="🎯" color={color} />,
        }}
      />
      <Tabs.Screen
        name="collection"
        options={{
          title: 'Collection',
          tabBarIcon: ({ color }) => <TabIcon icon="✨" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <TabIcon icon="👤" color={color} />,
        }}
      />

      {/* Hidden routes */}
      <Tabs.Screen name="pnj/[id]" options={{ href: null }} />
      <Tabs.Screen name="book/[pnjId]" options={{ href: null }} />
    </Tabs>
  );
}

const TabIcon = ({ icon, color }: { icon: string; color: string }) => (
  <Text style={{ fontSize: 20, opacity: color === '#845ef7' ? 1 : 0.6 }}>{icon}</Text>
);
