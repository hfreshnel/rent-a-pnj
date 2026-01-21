import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react-native';
import { colors, spacing, borderRadius, textStyles, shadows } from '@/theme';
import { Toast as ToastType, ToastType as ToastVariant, useUIStore } from '@/stores/uiStore';

interface ToastItemProps {
  toast: ToastType;
}

const ICONS: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle size={20} color={colors.success} />,
  error: <AlertCircle size={20} color={colors.error} />,
  warning: <AlertTriangle size={20} color={colors.warning} />,
  info: <Info size={20} color={colors.info} />,
};

const COLORS: Record<ToastVariant, string> = {
  success: colors.success,
  error: colors.error,
  warning: colors.warning,
  info: colors.info,
};

function ToastItem({ toast }: ToastItemProps) {
  const removeToast = useUIStore((state) => state.removeToast);
  const opacity = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(-20)).current;

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
  }, []);

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
    ]).start(() => {
      removeToast(toast.id);
    });
  };

  return (
    <Animated.View
      style={[
        styles.toast,
        { borderLeftColor: COLORS[toast.type] },
        { opacity, transform: [{ translateY }] },
      ]}
    >
      <View style={styles.iconContainer}>{ICONS[toast.type]}</View>
      <Text style={styles.message} numberOfLines={2}>
        {toast.message}
      </Text>
      <TouchableOpacity onPress={handleDismiss} style={styles.closeButton}>
        <X size={16} color={colors.text.tertiary} />
      </TouchableOpacity>
    </Animated.View>
  );
}

export function ToastContainer() {
  const toasts = useUIStore((state) => state.toasts);

  if (toasts.length === 0) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: spacing.md,
    right: spacing.md,
    zIndex: 1000,
    gap: spacing.sm,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg.elevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderLeftWidth: 4,
    ...shadows.lg,
  },
  iconContainer: {
    marginRight: spacing.sm,
  },
  message: {
    flex: 1,
    ...textStyles.bodySmall,
    color: colors.text.primary,
  },
  closeButton: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
  },
});
