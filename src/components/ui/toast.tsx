import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme';
import { useUIStore, Toast as ToastType, ToastType as ToastVariant } from '../../stores/uiStore';
import { SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../constants/theme';

interface ToastItemProps {
  toast: ToastType;
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const theme = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -20,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => onDismiss(toast.id));
  };

  const getColors = (type: ToastVariant) => {
    switch (type) {
      case 'success':
        return { bg: theme.colors.successLight, text: theme.colors.success, icon: '✓' };
      case 'error':
        return { bg: theme.colors.dangerLight, text: theme.colors.danger, icon: '✕' };
      case 'warning':
        return { bg: theme.colors.warningLight, text: theme.colors.warning, icon: '!' };
      case 'info':
      default:
        return { bg: theme.colors.surfaceVariant, text: theme.colors.info, icon: 'i' };
    }
  };

  const colors = getColors(toast.type);

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor: theme.colors.surface,
          borderLeftColor: colors.text,
          ...theme.shadows.medium,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: colors.bg }]}>
        <Text style={[styles.icon, { color: colors.text }]}>{colors.icon}</Text>
      </View>
      <Text style={[styles.message, { color: theme.colors.text }]} numberOfLines={2}>
        {toast.message}
      </Text>
      <TouchableOpacity
        onPress={handleDismiss}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={[styles.dismiss, { color: theme.colors.textMuted }]}>×</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const ToastContainer: React.FC = () => {
  const toasts = useUIStore((s) => s.toasts);
  const removeToast = useUIStore((s) => s.removeToast);

  if (toasts.length === 0) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={removeToast} />
      ))}
    </View>
  );
};

// Hook for easy toast usage
export const useToast = () => {
  const addToast = useUIStore((s) => s.addToast);

  return {
    success: (message: string, duration?: number) =>
      addToast({ type: 'success', message, duration }),
    error: (message: string, duration?: number) =>
      addToast({ type: 'error', message, duration }),
    warning: (message: string, duration?: number) =>
      addToast({ type: 'warning', message, duration }),
    info: (message: string, duration?: number) =>
      addToast({ type: 'info', message, duration }),
  };
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: SPACING.m,
    right: SPACING.m,
    zIndex: 9999,
    gap: SPACING.s,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.m,
    borderRadius: BORDER_RADIUS.m,
    borderLeftWidth: 4,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.s,
  },
  icon: {
    fontSize: 12,
    fontWeight: '700',
  },
  message: {
    ...TYPOGRAPHY.bodySmall,
    flex: 1,
  },
  dismiss: {
    fontSize: 20,
    marginLeft: SPACING.s,
  },
});

export default ToastContainer;
