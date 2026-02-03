import React from 'react';
import { Text } from 'react-native';
import { Tabs } from 'expo-router';
import { useTheme } from '../../theme';

export default function PNJLayout() {
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
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color }) => (
            <TabIcon emoji="📊" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="requests"
        options={{
          title: 'Demandes',
          tabBarLabel: 'Demandes',
          tabBarIcon: ({ color }) => (
            <TabIcon emoji="📬" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendrier',
          tabBarLabel: 'Calendrier',
          tabBarIcon: ({ color }) => (
            <TabIcon emoji="📅" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="earnings"
        options={{
          title: 'Revenus',
          tabBarLabel: 'Revenus',
          tabBarIcon: ({ color }) => (
            <TabIcon emoji="💰" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color }) => (
            <TabIcon emoji="👤" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const TabIcon = ({ emoji, color }: { emoji: string; color: string }) => (
  <Text style={{ fontSize: 20, opacity: color === '#a0a0b8' ? 0.6 : 1 }}>
    {emoji}
  </Text>
);
