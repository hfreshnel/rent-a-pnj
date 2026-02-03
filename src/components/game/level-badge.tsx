import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { TYPOGRAPHY, getTitleForLevel } from '../../constants/theme';

interface LevelBadgeProps {
  level: number;
  size?: 'small' | 'medium' | 'large';
  showTitle?: boolean;
}

export const LevelBadge: React.FC<LevelBadgeProps> = ({
  level,
  size = 'medium',
  showTitle = false,
}) => {
  const theme = useTheme();

  const sizes = {
    small: { badge: 24, font: 10 },
    medium: { badge: 32, font: 14 },
    large: { badge: 48, font: 20 },
  };

  const { badge, font } = sizes[size];

  // Get title for level
  const title = getTitleForLevel(level);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.badge,
          {
            width: badge,
            height: badge,
            borderRadius: badge / 2,
            backgroundColor: theme.colors.primary,
          },
        ]}
      >
        <Text style={[styles.level, { fontSize: font }]}>{level}</Text>
      </View>
      {showTitle && (
        <Text style={[styles.title, { color: theme.colors.primary }]}>{title}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  level: {
    color: '#fff',
    fontWeight: '700',
  },
  title: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
    marginTop: 4,
  },
});

export default LevelBadge;
