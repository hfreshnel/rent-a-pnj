import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../theme';
import { Screen } from '../../components/layout/screen';
import { Input, Card, Avatar, Badge, Button } from '../../components/ui';
import { useFilterStore } from '../../stores/filterStore';
import { PNJ_CLASS_INFO } from '../../types/pnj';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants/theme';
import { PNJClass } from '../../theme/types';
import { MOCK_PNJ_LIST, MockPNJListItem } from '../../mocks';

export default function SearchScreen() {
  const theme = useTheme();
  const router = useRouter();
  const searchQuery = useFilterStore((s) => s.searchQuery);
  const setSearchQuery = useFilterStore((s) => s.setSearchQuery);
  const selectedClasses = useFilterStore((s) => s.selectedClasses);
  const toggleClass = useFilterStore((s) => s.toggleClass);

  const filteredPNJs = MOCK_PNJ_LIST.filter((pnj) => {
    if (searchQuery && !pnj.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedClasses.length > 0 && !selectedClasses.includes(pnj.class)) {
      return false;
    }
    return true;
  });

  const renderPNJCard = ({ item }: { item: MockPNJListItem }) => {
    const classInfo = PNJ_CLASS_INFO[item.class];

    return (
      <TouchableOpacity onPress={() => router.push(`/(player)/pnj/${item.id}`)}>
        <Card style={styles.pnjCard}>
          <Card.Body>
            <View style={styles.pnjHeader}>
              <Avatar name={item.name} size="lg" />
              <View style={styles.pnjInfo}>
                <View style={styles.pnjNameRow}>
                  <Text style={[styles.pnjName, { color: theme.colors.text }]}>
                    {item.name}
                  </Text>
                  <Badge
                    label={classInfo.label}
                    variant="primary"
                    size="small"
                    icon={<Text>{classInfo.emoji}</Text>}
                  />
                </View>
                <Text style={[styles.pnjCity, { color: theme.colors.textMuted }]}>
                  📍 {item.city}
                </Text>
                <View style={styles.pnjStats}>
                  <Text style={{ color: theme.colors.warning }}>⭐ {item.rating}</Text>
                  <Text style={{ color: theme.colors.primary, fontWeight: '700' }}>
                    {item.price}€/h
                  </Text>
                </View>
              </View>
            </View>
            <Text
              style={[styles.pnjBio, { color: theme.colors.textSecondary }]}
              numberOfLines={2}
            >
              {item.bio}
            </Text>
          </Card.Body>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <Screen>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Explorer 🔍
          </Text>
        </View>

        {/* Search Input */}
        <Input
          placeholder="Rechercher un PNJ..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          containerStyle={{ marginBottom: SPACING.m }}
        />

        {/* Class Filter */}
        <View style={styles.classFilters}>
          {(Object.keys(PNJ_CLASS_INFO) as PNJClass[]).slice(0, 5).map((classKey) => {
            const info = PNJ_CLASS_INFO[classKey];
            const isSelected = selectedClasses.includes(classKey);

            return (
              <TouchableOpacity
                key={classKey}
                onPress={() => toggleClass(classKey)}
                style={[
                  styles.classChip,
                  {
                    backgroundColor: isSelected
                      ? theme.colors.primary
                      : theme.colors.surface,
                    borderColor: isSelected
                      ? theme.colors.primary
                      : theme.colors.outline,
                  },
                ]}
              >
                <Text style={styles.classEmoji}>{info.emoji}</Text>
                <Text
                  style={[
                    styles.classLabel,
                    { color: isSelected ? theme.colors.onPrimary : theme.colors.text },
                  ]}
                >
                  {info.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Results */}
        <FlatList
          data={filteredPNJs}
          renderItem={renderPNJCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>
                Aucun PNJ trouvé
              </Text>
            </View>
          }
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: SPACING.m,
  },
  header: {
    marginBottom: SPACING.m,
  },
  title: {
    ...TYPOGRAPHY.h2,
  },
  classFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.s,
    marginBottom: SPACING.m,
  },
  classChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
  },
  classEmoji: {
    fontSize: 14,
    marginRight: SPACING.xs,
  },
  classLabel: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
  },
  list: {
    gap: SPACING.m,
    paddingBottom: SPACING.xxl,
  },
  pnjCard: {},
  pnjHeader: {
    flexDirection: 'row',
    marginBottom: SPACING.s,
  },
  pnjInfo: {
    flex: 1,
    marginLeft: SPACING.m,
  },
  pnjNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.s,
    marginBottom: SPACING.xs,
  },
  pnjName: {
    ...TYPOGRAPHY.h4,
  },
  pnjCity: {
    ...TYPOGRAPHY.caption,
    marginBottom: SPACING.xs,
  },
  pnjStats: {
    flexDirection: 'row',
    gap: SPACING.m,
  },
  pnjBio: {
    ...TYPOGRAPHY.bodySmall,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: SPACING.m,
  },
  emptyText: {
    ...TYPOGRAPHY.body,
  },
});
