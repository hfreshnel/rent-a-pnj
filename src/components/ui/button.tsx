import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../theme';
import { Theme } from '../../theme/types';
import { SPACING, BORDER_RADIUS } from '../../constants/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const getVariantStyles = (theme: Theme, variant: ButtonVariant) => {
  const variants = {
    primary: {
      container: { backgroundColor: theme.colors.primary },
      text: { color: theme.colors.onPrimary },
      loader: theme.colors.onPrimary,
    },
    secondary: {
      container: { backgroundColor: theme.colors.surfaceVariant },
      text: { color: theme.colors.text },
      loader: theme.colors.text,
    },
    outline: {
      container: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.primary,
      },
      text: { color: theme.colors.primary },
      loader: theme.colors.primary,
    },
    danger: {
      container: { backgroundColor: theme.colors.danger },
      text: { color: theme.colors.onPrimary },
      loader: theme.colors.onPrimary,
    },
    ghost: {
      container: { backgroundColor: 'transparent' },
      text: { color: theme.colors.primary },
      loader: theme.colors.primary,
    },
  };
  return variants[variant];
};

const getSizeStyles = (size: ButtonSize) => {
  const sizes = {
    small: {
      paddingVertical: SPACING.xs + 2,
      paddingHorizontal: SPACING.m,
      minHeight: 36,
      fontSize: 14,
    },
    medium: {
      paddingVertical: SPACING.s + 4,
      paddingHorizontal: SPACING.l,
      minHeight: 48,
      fontSize: 16,
    },
    large: {
      paddingVertical: SPACING.m,
      paddingHorizontal: SPACING.xl,
      minHeight: 56,
      fontSize: 18,
    },
  };
  return sizes[size];
};

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  loadingText,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
}) => {
  const theme = useTheme();
  const variantStyles = getVariantStyles(theme, variant);
  const sizeStyles = getSizeStyles(size);
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      accessibilityLabel={title}
      style={[
        styles.base,
        {
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          minHeight: sizeStyles.minHeight,
        },
        variantStyles.container,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <>
          <ActivityIndicator size="small" color={variantStyles.loader} />
          {loadingText && (
            <Text
              style={[
                styles.text,
                { fontSize: sizeStyles.fontSize },
                variantStyles.text,
                styles.loadingText,
                textStyle,
              ]}
            >
              {loadingText}
            </Text>
          )}
        </>
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text
            style={[
              styles.text,
              { fontSize: sizeStyles.fontSize },
              variantStyles.text,
              leftIcon && styles.textWithLeftIcon,
              rightIcon && styles.textWithRightIcon,
              textStyle,
            ]}
          >
            {title}
          </Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.m,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '600',
  },
  loadingText: {
    marginLeft: SPACING.s,
  },
  textWithLeftIcon: {
    marginLeft: SPACING.s,
  },
  textWithRightIcon: {
    marginRight: SPACING.s,
  },
});

export default Button;
