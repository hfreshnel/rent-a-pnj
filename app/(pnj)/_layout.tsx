import { Tabs, Redirect } from 'expo-router';
import { Home, Calendar, MessageCircle, User, DollarSign } from 'lucide-react-native';
import { colors } from '@/theme';
import { useAuthStore } from '@/stores';
import { LoadingState } from '@/components/ui';

export default function PNJLayout() {
  const { isAuthenticated, isInitialized, user } = useAuthStore();

  // Show loading while checking auth state
  if (!isInitialized) {
    return <LoadingState fullScreen message="Chargement..." />;
  }

  // Redirect to auth if not authenticated
  if (!isAuthenticated || !user) {
    return <Redirect href="/(auth)" />;
  }

  // Redirect if not a PNJ
  if (user.role === 'player') {
    return <Redirect href="/(player)" />;
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
        tabBarActiveTintColor: colors.secondary[500],
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
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="requests"
        options={{
          title: 'Demandes',
          tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="earnings"
        options={{
          title: 'Gains',
          tabBarIcon: ({ color, size }) => <DollarSign size={size} color={color} />,
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
    </Tabs>
  );
}
