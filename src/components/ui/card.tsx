import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme';
import { SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../constants/theme';

// Card Header
interface CardHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}

const CardHeader: React.FC<CardHeaderProps> = ({ title, subtitle, right }) => {
  const theme = useTheme();
  return (
    <View style={styles.header}>
      <View style={styles.headerText}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {right && <View style={styles.headerRight}>{right}</View>}
    </View>
  );
};

// Card Body
interface CardBodyProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const CardBody: React.FC<CardBodyProps> = ({ children, style }) => (
  <View style={[styles.body, style]}>{children}</View>
);

// Card Footer
interface CardFooterProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const CardFooter: React.FC<CardFooterProps> = ({ children, style }) => {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.footer,
        { borderTopColor: theme.colors.outline },
        style,
      ]}
    >
      {children}
    </View>
  );
};

// Main Card Component
interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  elevated?: boolean;
}

interface CardComponent extends React.FC<CardProps> {
  Header: typeof CardHeader;
  Body: typeof CardBody;
  Footer: typeof CardFooter;
}

const Card: CardComponent = ({ children, style, onPress, elevated = false }) => {
  const theme = useTheme();

  const cardStyle = [
    styles.container,
    {
      backgroundColor: elevated
        ? theme.colors.surfaceElevated
        : theme.colors.surface,
      borderColor: theme.colors.outline,
    },
    elevated && theme.shadows.medium,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.7}
        accessibilityRole="button"
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.l,
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.m,
  },
  headerText: {
    flex: 1,
  },
  headerRight: {
    marginLeft: SPACING.m,
  },
  title: {
    ...TYPOGRAPHY.h4,
  },
  subtitle: {
    ...TYPOGRAPHY.caption,
    marginTop: SPACING.xs,
  },
  body: {
    padding: SPACING.m,
    paddingTop: 0,
  },
  footer: {
    padding: SPACING.m,
    borderTopWidth: 1,
  },
});

export { Card, CardHeader, CardBody, CardFooter };
export default Card;
