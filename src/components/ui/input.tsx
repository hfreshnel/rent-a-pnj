import React, { useState, forwardRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme';
import { SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  disabled?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      onRightIconPress,
      containerStyle,
      disabled = false,
      style,
      ...props
    },
    ref
  ) => {
    const theme = useTheme();
    const [focused, setFocused] = useState(false);
    const hasError = !!error;

    // Dynamic border color based on state
    let borderColor = theme.colors.outline;
    if (hasError) borderColor = theme.colors.danger;
    else if (focused) borderColor = theme.colors.primary;

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text
            style={[
              styles.label,
              { color: hasError ? theme.colors.danger : theme.colors.text },
            ]}
          >
            {label}
          </Text>
        )}
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: disabled
                ? theme.colors.surfaceVariant
                : theme.colors.inputBackground,
              borderColor,
            },
          ]}
        >
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <TextInput
            ref={ref}
            style={[
              styles.input,
              { color: theme.colors.text },
              leftIcon && styles.inputWithLeft,
              rightIcon && styles.inputWithRight,
              style,
            ]}
            placeholderTextColor={theme.colors.placeholder}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            editable={!disabled}
            {...props}
          />
          {rightIcon && (
            <TouchableOpacity
              style={styles.iconRight}
              onPress={onRightIconPress}
              disabled={!onRightIconPress}
            >
              {rightIcon}
            </TouchableOpacity>
          )}
        </View>
        {(error || helperText) && (
          <Text
            style={[
              styles.helperText,
              { color: hasError ? theme.colors.danger : theme.colors.textMuted },
            ]}
          >
            {error || helperText}
          </Text>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.m,
  },
  label: {
    ...TYPOGRAPHY.body,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.m,
    minHeight: 48,
  },
  input: {
    flex: 1,
    ...TYPOGRAPHY.body,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
  },
  inputWithLeft: {
    paddingLeft: SPACING.xs,
  },
  inputWithRight: {
    paddingRight: SPACING.xs,
  },
  iconLeft: {
    paddingLeft: SPACING.m,
  },
  iconRight: {
    paddingRight: SPACING.m,
  },
  helperText: {
    ...TYPOGRAPHY.caption,
    marginTop: SPACING.xs,
  },
});

export default Input;
