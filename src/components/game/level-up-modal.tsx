import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useTheme } from '../../theme';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { SPACING, TYPOGRAPHY, LEVEL_TITLES } from '../../constants/theme';

interface LevelUpModalProps {
  visible: boolean;
  newLevel: number;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  visible,
  newLevel,
  onClose,
}) => {
  const theme = useTheme();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Get new title if achieved
  const newTitleName = LEVEL_TITLES[newLevel];

  useEffect(() => {
    if (visible) {
      // Animate badge
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      rotateAnim.setValue(0);
    }
  }, [visible]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Modal visible={visible} onClose={onClose}>
      <View style={styles.container}>
        {/* Confetti effect placeholder */}
        <View style={styles.confetti}>
          <Text style={styles.confettiEmoji}>🎉</Text>
          <Text style={styles.confettiEmoji}>✨</Text>
          <Text style={styles.confettiEmoji}>🎊</Text>
        </View>

        {/* Animated Level Badge */}
        <Animated.View
          style={[
            styles.badgeContainer,
            {
              transform: [{ scale: scaleAnim }, { rotate: spin }],
            },
          ]}
        >
          <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.levelNumber}>{newLevel}</Text>
          </View>
        </Animated.View>

        {/* Title */}
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Niveau {newLevel} !
        </Text>

        <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
          Félicitations, tu as atteint un nouveau niveau !
        </Text>

        {/* New Title Unlocked */}
        {newTitleName && (
          <View style={[styles.titleCard, { backgroundColor: theme.colors.primaryLight }]}>
            <Text style={styles.unlockEmoji}>🏆</Text>
            <View style={styles.unlockInfo}>
              <Text style={[styles.unlockLabel, { color: theme.colors.textMuted }]}>
                Nouveau titre débloqué
              </Text>
              <Text style={[styles.unlockTitle, { color: theme.colors.primary }]}>
                {newTitleName}
              </Text>
            </View>
          </View>
        )}

        {/* Rewards preview */}
        <View style={styles.rewards}>
          <Text style={[styles.rewardsTitle, { color: theme.colors.text }]}>
            Récompenses
          </Text>
          <View style={styles.rewardsList}>
            <RewardItem icon="🎁" text="Nouveaux badges disponibles" theme={theme} />
            <RewardItem icon="🔓" text="Fonctionnalités débloquées" theme={theme} />
          </View>
        </View>

        {/* Continue Button */}
        <Button
          title="Super !"
          onPress={onClose}
          variant="primary"
          size="large"
          fullWidth
        />
      </View>
    </Modal>
  );
};

const RewardItem = ({
  icon,
  text,
  theme,
}: {
  icon: string;
  text: string;
  theme: ReturnType<typeof useTheme>;
}) => (
  <View style={styles.rewardItem}>
    <Text style={styles.rewardIcon}>{icon}</Text>
    <Text style={[styles.rewardText, { color: theme.colors.textMuted }]}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: SPACING.l,
  },
  confetti: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.l,
    marginBottom: SPACING.m,
  },
  confettiEmoji: {
    fontSize: 32,
  },
  badgeContainer: {
    marginBottom: SPACING.l,
  },
  badge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#845ef7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  levelNumber: {
    color: '#fff',
    fontSize: 40,
    fontWeight: '700',
  },
  title: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    marginBottom: SPACING.l,
  },
  titleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.m,
    borderRadius: 12,
    marginBottom: SPACING.l,
    width: '100%',
  },
  unlockEmoji: {
    fontSize: 32,
    marginRight: SPACING.m,
  },
  unlockInfo: {
    flex: 1,
  },
  unlockLabel: {
    ...TYPOGRAPHY.caption,
  },
  unlockTitle: {
    ...TYPOGRAPHY.h4,
  },
  rewards: {
    width: '100%',
    marginBottom: SPACING.l,
  },
  rewardsTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    marginBottom: SPACING.s,
  },
  rewardsList: {
    gap: SPACING.xs,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardIcon: {
    fontSize: 16,
    marginRight: SPACING.s,
  },
  rewardText: {
    ...TYPOGRAPHY.body,
  },
});

export default LevelUpModal;
