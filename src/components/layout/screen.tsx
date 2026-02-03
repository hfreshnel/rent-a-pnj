import React from 'react';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  View,
  Text,
  Platform,
  StyleSheet,
  ViewStyle,
  StatusBar,
} from 'react-native';
import { useTheme } from '../../theme';
import { SPACING } from '../../constants/theme';

interface ScreenProps {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  statusBarStyle?: 'light' | 'dark';
}

export const Screen: React.FC<ScreenProps> = ({
  children,
  scroll = false,
  padded = true,
  style,
  contentStyle,
  edges,
  statusBarStyle,
}) => {
  const theme = useTheme();

  // Determine status bar style based on theme if not specified
  const barStyle = statusBarStyle || (theme.mode === 'dark' ? 'light-content' : 'dark-content');

  const paddingStyle = padded ? { paddingHorizontal: SPACING.m } : {};

  const content = scroll ? (
    <ScrollView
      contentContainerStyle={[styles.scrollContent, paddingStyle, contentStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, paddingStyle, contentStyle]}>{children}</View>
  );

  return (
    <>
      <StatusBar
        barStyle={barStyle}
        backgroundColor={theme.colors.background}
        translucent={false}
      />
      <SafeAreaView
        style={[
          styles.safe,
          { backgroundColor: theme.colors.background },
          style,
        ]}
      >
        <KeyboardAvoidingView
          style={styles.keyboard}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          {content}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

// Header component for screens
interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  style?: ViewStyle;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  left,
  right,
  style,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.header, style]}>
      <View style={styles.headerLeft}>{left}</View>
      <View style={styles.headerCenter}>
        <View style={styles.titleContainer}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: theme.colors.text,
            }}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={{
                fontSize: 14,
                color: theme.colors.textMuted,
                marginTop: 2,
              }}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.headerRight}>{right}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  keyboard: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    minHeight: 56,
  },
  headerLeft: {
    minWidth: 40,
    alignItems: 'flex-start',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerRight: {
    minWidth: 40,
    alignItems: 'flex-end',
  },
  titleContainer: {
    alignItems: 'center',
  },
});

export default Screen;
