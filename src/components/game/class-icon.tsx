import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { PNJClass, getClassColor } from '../../theme/types';
import { PNJ_CLASS_INFO } from '../../types/pnj';
import { BORDER_RADIUS, TYPOGRAPHY } from '../../constants/theme';

interface ClassIconProps {
  pnjClass: PNJClass;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

export const ClassIcon: React.FC<ClassIconProps> = ({
  pnjClass,
  size = 'medium',
  showLabel = false,
}) => {
  const theme = useTheme();
  const classInfo = PNJ_CLASS_INFO[pnjClass];
  const classColor = getClassColor(theme.colors, pnjClass);

  const sizes = {
    small: { icon: 32, emoji: 16 },
    medium: { icon: 48, emoji: 24 },
    large: { icon: 64, emoji: 32 },
  };

  const { icon, emoji } = sizes[size];

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconContainer,
          {
            width: icon,
            height: icon,
            borderRadius: icon / 2,
            backgroundColor: classColor + '30',
          },
        ]}
      >
        <Text style={{ fontSize: emoji }}>{classInfo.emoji}</Text>
      </View>
      {showLabel && (
        <Text style={[styles.label, { color: classColor }]}>{classInfo.label}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
    marginTop: 4,
  },
});

export default ClassIcon;
