import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../../theme';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants/theme';

interface ChatInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  placeholder = 'Écris un message...',
  disabled = false,
}) => {
  const theme = useTheme();
  const [message, setMessage] = useState('');

  const handleSend = () => {
    const trimmed = message.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      setMessage('');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.outline,
          },
        ]}
      >
        <View
          style={[
            styles.inputContainer,
            { backgroundColor: theme.colors.surfaceVariant },
          ]}
        >
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.textMuted}
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
            editable={!disabled}
          />
        </View>
        <TouchableOpacity
          style={[
            styles.sendButton,
            {
              backgroundColor:
                message.trim() && !disabled
                  ? theme.colors.primary
                  : theme.colors.surfaceVariant,
            },
          ]}
          onPress={handleSend}
          disabled={!message.trim() || disabled}
        >
          <SendIcon
            color={
              message.trim() && !disabled
                ? theme.colors.onPrimary
                : theme.colors.textMuted
            }
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

// Simple send icon using Text
const SendIcon = ({ color }: { color: string }) => (
  <View style={styles.sendIcon}>
    <View
      style={[
        styles.sendArrow,
        { borderLeftColor: color },
      ]}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: SPACING.m,
    borderTopWidth: 1,
    gap: SPACING.s,
  },
  inputContainer: {
    flex: 1,
    borderRadius: BORDER_RADIUS.l,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    maxHeight: 120,
  },
  input: {
    ...TYPOGRAPHY.body,
    minHeight: 24,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendArrow: {
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderTopColor: 'transparent',
    borderBottomWidth: 8,
    borderBottomColor: 'transparent',
    borderLeftWidth: 12,
    marginLeft: 4,
  },
});

export default ChatInput;
