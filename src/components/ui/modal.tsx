import React from 'react';
import {
  View,
  Text,
  Modal as RNModal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme';
import { SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../constants/theme';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  closeOnBackdrop?: boolean;
  size?: 'small' | 'medium' | 'large' | 'full';
  style?: ViewStyle;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
  footer,
  closeOnBackdrop = true,
  size = 'medium',
  style,
}) => {
  const theme = useTheme();

  const sizeStyles = {
    small: { maxWidth: 300 },
    medium: { maxWidth: 400 },
    large: { maxWidth: 500 },
    full: { maxWidth: '95%' as const },
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={closeOnBackdrop ? onClose : undefined}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.container,
                  {
                    backgroundColor: theme.colors.surface,
                    ...theme.shadows.large,
                  },
                  sizeStyles[size],
                  style,
                ]}
              >
                {title && (
                  <View
                    style={[
                      styles.header,
                      { borderBottomColor: theme.colors.outline },
                    ]}
                  >
                    <Text style={[styles.title, { color: theme.colors.text }]}>
                      {title}
                    </Text>
                    <TouchableOpacity
                      onPress={onClose}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      accessibilityLabel="Close modal"
                      accessibilityRole="button"
                    >
                      <Text style={{ color: theme.colors.textMuted, fontSize: 24 }}>
                        ×
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                <View style={styles.body}>{children}</View>
                {footer && (
                  <View
                    style={[
                      styles.footer,
                      { borderTopColor: theme.colors.outline },
                    ]}
                  >
                    {footer}
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

// Confirmation Dialog
interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  confirmVariant = 'primary',
  onConfirm,
  onCancel,
  loading = false,
}) => {
  const theme = useTheme();

  return (
    <Modal
      visible={visible}
      onClose={onCancel}
      title={title}
      size="small"
      closeOnBackdrop={!loading}
    >
      <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
        {message}
      </Text>
      <View style={styles.dialogActions}>
        <TouchableOpacity
          style={[
            styles.dialogButton,
            { backgroundColor: theme.colors.surfaceVariant },
          ]}
          onPress={onCancel}
          disabled={loading}
        >
          <Text style={[styles.dialogButtonText, { color: theme.colors.text }]}>
            {cancelText}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.dialogButton,
            {
              backgroundColor:
                confirmVariant === 'danger'
                  ? theme.colors.danger
                  : theme.colors.primary,
            },
          ]}
          onPress={onConfirm}
          disabled={loading}
        >
          <Text
            style={[styles.dialogButtonText, { color: theme.colors.onPrimary }]}
          >
            {loading ? 'Chargement...' : confirmText}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.m,
  },
  keyboardView: {
    width: '100%',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.m,
    borderBottomWidth: 1,
  },
  title: {
    ...TYPOGRAPHY.h4,
    flex: 1,
  },
  body: {
    padding: SPACING.m,
  },
  footer: {
    padding: SPACING.m,
    borderTopWidth: 1,
  },
  message: {
    ...TYPOGRAPHY.body,
    marginBottom: SPACING.l,
  },
  dialogActions: {
    flexDirection: 'row',
    gap: SPACING.s,
  },
  dialogButton: {
    flex: 1,
    paddingVertical: SPACING.s + 4,
    borderRadius: BORDER_RADIUS.m,
    alignItems: 'center',
  },
  dialogButtonText: {
    ...TYPOGRAPHY.button,
  },
});

export default Modal;
