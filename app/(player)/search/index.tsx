import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, SlidersHorizontal, MapPin, Star, X } from 'lucide-react-native';
import { colors, spacing, textStyles, borderRadius, classNames, classEmojis } from '@/theme';
import { Avatar, Badge, LoadingState, EmptyState } from '@/components/ui';
import { useFilterStore } from '@/stores';
import { usePNJSearch } from '@/hooks';
import { PNJCardData, PNJClass } from '@/types';

const CLASS_FILTERS: { id: PNJClass; name: string; emoji: string }[] = [
  { id: 'adventurer', name: classNames.adventurer, emoji: classEmojis.adventurer },
  { id: 'sage', name: classNames.sage, emoji: classEmojis.sage },
  { id: 'bard', name: classNames.bard, emoji: classEmojis.bard },
  { id: 'foodie', name: classNames.foodie, emoji: classEmojis.foodie },
  { id: 'geek', name: classNames.geek, emoji: classEmojis.geek },
  { id: 'coach', name: classNames.coach, emoji: classEmojis.coach },
];

export default function SearchScreen() {
  const router = useRouter();
  const { searchQuery, setSearchQuery, selectedClasses, toggleClass, clearAllFilters, getFilterCount } = useFilterStore();
  const { data: pnjList, isLoading, refetch } = usePNJSearch();

  const filterCount = getFilterCount();

  const renderPNJCard = ({ item }: { item: PNJCardData }) => (
    <PNJSearchCard pnj={item} onPress={() => router.push(`/(player)/pnj/${item.id}`)} />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Search Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search size={20} color={colors.text.tertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un PNJ..."
            placeholderTextColor={colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={18} color={colors.text.tertiary} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <SlidersHorizontal size={20} color={colors.white} />
          {filterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{filterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Class Filters */}
      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CLASS_FILTERS}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.filtersScroll}
          renderItem={({ item }) => {
            const isSelected = selectedClasses.includes(item.id);
            return (
              <TouchableOpacity
                style={[styles.filterChip, isSelected && styles.filterChipSelected]}
                onPress={() => toggleClass(item.id)}
              >
                <Text style={styles.filterEmoji}>{item.emoji}</Text>
                <Text style={[styles.filterText, isSelected && styles.filterTextSelected]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Results */}
      {isLoading ? (
        <LoadingState message="Recherche en cours..." />
      ) : pnjList && pnjList.length > 0 ? (
        <FlatList
          data={pnjList}
          keyExtractor={(item) => item.id}
          renderItem={renderPNJCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      ) : (
        <EmptyState
          type="search"
          title="Aucun résultat"
          description="Essaie de modifier tes filtres ou ta recherche"
          actionLabel="Réinitialiser les filtres"
          onAction={clearAllFilters}
        />
      )}
    </SafeAreaView>
  );
}

function PNJSearchCard({ pnj, onPress }: { pnj: PNJCardData; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.pnjCard} onPress={onPress} activeOpacity={0.7}>
      <Avatar source={pnj.avatar} name={pnj.displayName} size="xl" />

      <View style={styles.pnjContent}>
        <View style={styles.pnjHeader}>
          <View>
            <Text style={styles.pnjName}>{pnj.displayName}</Text>
            <View style={styles.pnjClassRow}>
              <Text style={styles.pnjClassEmoji}>
                {classEmojis[pnj.class]}
              </Text>
              <Text style={styles.pnjClassName}>
                {classNames[pnj.class]}
                {pnj.secondaryClass && ` / ${classNames[pnj.secondaryClass]}`}
              </Text>
            </View>
          </View>
          <View style={styles.pnjPriceContainer}>
            <Text style={styles.pnjPrice}>{pnj.hourlyRate}€</Text>
            <Text style={styles.pnjPriceUnit}>/heure</Text>
          </View>
        </View>

        <Text style={styles.pnjBio} numberOfLines={2}>
          {pnj.bio}
        </Text>

        <View style={styles.pnjFooter}>
          <View style={styles.pnjRating}>
            <Star size={14} color={colors.warning} fill={colors.warning} />
            <Text style={styles.pnjRatingText}>
              {pnj.rating.toFixed(1)} ({pnj.reviewCount})
            </Text>
          </View>

          {pnj.distance !== undefined && (
            <View style={styles.pnjDistance}>
              <MapPin size={14} color={colors.text.tertiary} />
              <Text style={styles.pnjDistanceText}>{pnj.distance} km</Text>
            </View>
          )}

          {pnj.verified && (
            <Badge label="Vérifié" variant="success" size="sm" />
          )}

          {pnj.isNew && (
            <Badge label="Nouveau" variant="info" size="sm" />
          )}
        </View>
      </View>
    </TouchableOpacity>
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg.secondary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...textStyles.body,
    color: colors.text.primary,
    paddingVertical: spacing.md,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.bg.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    ...textStyles.caption,
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  filtersContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.bg.tertiary,
  },
  filtersScroll: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg.secondary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterChipSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[500] + '20',
  },
  filterEmoji: {
    fontSize: 16,
  },
  filterText: {
    ...textStyles.bodySmall,
    color: colors.text.secondary,
  },
  filterTextSelected: {
    color: colors.primary[400],
  },
  listContent: {
    padding: spacing.lg,
  },
  separator: {
    height: spacing.md,
  },
  pnjCard: {
    flexDirection: 'row',
    backgroundColor: colors.bg.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    gap: spacing.md,
  },
  pnjContent: {
    flex: 1,
  },
  pnjHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  pnjName: {
    ...textStyles.bodySemiBold,
    color: colors.white,
  },
  pnjClassRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: 2,
  },
  pnjClassEmoji: {
    fontSize: 14,
  },
  pnjClassName: {
    ...textStyles.caption,
    color: colors.text.secondary,
  },
  pnjPriceContainer: {
    alignItems: 'flex-end',
  },
  pnjPrice: {
    ...textStyles.h4,
    color: colors.primary[400],
  },
  pnjPriceUnit: {
    ...textStyles.caption,
    color: colors.text.tertiary,
  },
  pnjBio: {
    ...textStyles.bodySmall,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  pnjFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flexWrap: 'wrap',
  },
  pnjRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  pnjRatingText: {
    ...textStyles.caption,
    color: colors.text.secondary,
  },
  pnjDistance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  pnjDistanceText: {
    ...textStyles.caption,
    color: colors.text.tertiary,
  },
});
