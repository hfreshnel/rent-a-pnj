import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../theme';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, LEVEL_THRESHOLDS } from '../../constants/theme';

interface XPBarProps {
  currentXP: number;
  level: number;
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
}

export const XPBar: React.FC<XPBarProps> = ({
  currentXP,
  level,
  showLabel = true,
  size = 'medium',
  animated = true,
}) => {
  const theme = useTheme();
  const animatedWidth = useRef(new Animated.Value(0)).current;

  // Calculate XP for current level
  const xpForCurrentLevel = LEVEL_THRESHOLDS[level - 1] || 0;
  const xpForNextLevel = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const xpInLevel = currentXP - xpForCurrentLevel;
  const xpNeeded = xpForNextLevel - xpForCurrentLevel;
  const progress = Math.min(xpInLevel / xpNeeded, 1);

  const heights = {
    small: 4,
    medium: 8,
    large: 12,
  };

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedWidth, {
        toValue: progress,
        duration: 800,
        useNativeDriver: false,
      }).start();
    } else {
      animatedWidth.setValue(progress);
    }
  }, [progress, animated]);

  return (
    <View style={styles.container}>
      {showLabel && (
        <View style={styles.labelRow}>
          <Text style={[styles.levelText, { color: theme.colors.primary }]}>
            Niv. {level}
          </Text>
          <Text style={[styles.xpText, { color: theme.colors.textMuted }]}>
            {xpInLevel} / {xpNeeded} XP
          </Text>
        </View>
      )}
      <View
        style={[
          styles.track,
          {
            backgroundColor: theme.colors.surfaceVariant,
            height: heights[size],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.fill,
            {
              backgroundColor: theme.colors.primary,
              width: animatedWidth.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  levelText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
  },
  xpText: {
    ...TYPOGRAPHY.caption,
  },
  track: {
    width: '100%',
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.full,
  },
});

export default XPBar;
