import { Tabs, Redirect } from 'expo-router';
import { Home, Search, MessageCircle, User, Trophy } from 'lucide-react-native';
import { colors } from '@/theme';
import { useAuthStore } from '@/stores';
import { LoadingState } from '@/components/ui';

export default function PlayerLayout() {
  const { isAuthenticated, isInitialized, user } = useAuthStore();

  // Show loading while checking auth state
  if (!isInitialized) {
    return <LoadingState fullScreen message="Chargement..." />;
  }

  // Redirect to auth if not authenticated
  if (!isAuthenticated || !user) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bg.secondary,
          borderTopColor: colors.bg.tertiary,
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarActiveTintColor: colors.primary[500],
        tabBarInactiveTintColor: colors.text.tertiary,
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
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Recherche',
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="missions"
        options={{
          title: 'Missions',
          tabBarIcon: ({ color, size }) => <Trophy size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, size }) => (
            <MessageCircle size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
      {/* Hidden routes */}
      <Tabs.Screen name="pnj/[id]" options={{ href: null }} />
      <Tabs.Screen name="collection" options={{ href: null }} />
    </Tabs>
  );
}
