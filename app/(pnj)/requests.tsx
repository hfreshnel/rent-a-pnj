import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'lucide-react-native';
import { colors, spacing, textStyles } from '@/theme';
import { EmptyState } from '@/components/ui';

export default function RequestsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Demandes</Text>
      </View>

      <EmptyState
        type="calendar"
        title="Aucune demande"
        description="Les demandes de réservation apparaîtront ici. Active ton profil pour être visible !"
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
