import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sparkles } from 'lucide-react-native';
import { colors, spacing, textStyles } from '@/theme';
import { EmptyState } from '@/components/ui';

export default function CollectionScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Sparkles size={24} color={colors.primary[400]} />
        <Text style={styles.title}>Ma Collection</Text>
      </View>

      <EmptyState
        title="Pas encore de souvenirs"
        description="Après chaque rencontre, tu obtiendras une carte souvenir unique. Complete ta première réservation pour débloquer ta première carte !"
        icon={<Sparkles size={64} color={colors.text.tertiary} />}
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
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
