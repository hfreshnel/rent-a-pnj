import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, textStyles } from '@/theme';
import { EmptyState } from '@/components/ui';

export default function PNJChatsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
      </View>

      <EmptyState
        type="inbox"
        title="Pas encore de messages"
        description="Tes conversations avec les joueurs apparaîtront ici après tes premières réservations."
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.bg.tertiary,
  },
  title: {
    ...textStyles.h2,
    color: colors.white,
  },
});
