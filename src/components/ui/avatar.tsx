import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '../../theme';
import { BORDER_RADIUS } from '../../constants/theme';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  source?: string | null;
  name?: string;
  size?: AvatarSize;
  badge?: React.ReactNode;
  badgePosition?: 'top-right' | 'bottom-right';
  style?: ViewStyle;
}

const SIZE_MAP: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
};

const FONT_SIZE_MAP: Record<AvatarSize, number> = {
  xs: 10,
  sm: 12,
  md: 18,
  lg: 24,
  xl: 36,
};

// Get initials from name
const getInitials = (name?: string): string => {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

// Generate a consistent color based on name
const getColorFromName = (name?: string): string => {
  const colors = [
    '#ff6b6b', '#339af0', '#fcc419', '#51cf66',
    '#845ef7', '#f06595', '#ff922b', '#20c997',
  ];
  if (!name) return colors[0];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 'md',
  badge,
  badgePosition = 'bottom-right',
  style,
}) => {
  const theme = useTheme();
  const dimension = SIZE_MAP[size];
  const fontSize = FONT_SIZE_MAP[size];
  const initials = getInitials(name);
  const backgroundColor = getColorFromName(name);

  return (
    <View style={[styles.container, { width: dimension, height: dimension }, style]}>
      {source ? (
        <Image
          source={{ uri: source }}
          style={[
            styles.image,
            { width: dimension, height: dimension, borderRadius: dimension / 2 },
          ]}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <View
          style={[
            styles.placeholder,
            {
              width: dimension,
              height: dimension,
              borderRadius: dimension / 2,
              backgroundColor,
            },
          ]}
        >
          <Text style={[styles.initials, { fontSize, color: theme.colors.onPrimary }]}>
            {initials}
          </Text>
        </View>
      )}
      {badge && (
        <View
          style={[
            styles.badge,
            badgePosition === 'top-right' ? styles.badgeTopRight : styles.badgeBottomRight,
          ]}
        >
          {badge}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    backgroundColor: '#ccc',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
  },
  badgeTopRight: {
    top: -2,
    right: -2,
  },
  badgeBottomRight: {
    bottom: -2,
    right: -2,
  },
});

export default Avatar;
