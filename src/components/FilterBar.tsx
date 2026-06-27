import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useSearchStore } from '@/store/searchStore';
import { SortOption } from '@/constants/types';

const SORTS: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'score', label: 'Top Picks' },
  { value: 'price_asc', label: 'Price ↑' },
  { value: 'price_desc', label: 'Price ↓' },
  { value: 'newest', label: 'New Launch' },
];

interface Props {
  onOpenFilters: () => void;
  resultCount: number;
}

export default function FilterBar({ onOpenFilters, resultCount }: Props) {
  const { sortBy, setSortBy, filters } = useSearchStore();
  const activeFilterCount =
    filters.types.length + filters.possessionStatus.length + filters.areas.length +
    (filters.minPrice > 0 ? 1 : 0) + (filters.maxPrice < 150000000 ? 1 : 0);

  return (
    <View style={styles.wrapper}>
      <View style={styles.topRow}>
        <Text style={styles.count}>{resultCount} Projects</Text>
        <TouchableOpacity style={styles.filterBtn} onPress={onOpenFilters}>
          <Ionicons name="options-outline" size={16} color={Colors.primary} />
          <Text style={styles.filterText}>Filters</Text>
          {activeFilterCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortRow}>
        {SORTS.map((s) => (
          <TouchableOpacity
            key={s.value}
            onPress={() => setSortBy(s.value)}
            style={[styles.sortChip, sortBy === s.value && styles.sortChipActive]}
          >
            <Text style={[styles.sortText, sortBy === s.value && styles.sortTextActive]}>
              {s.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.surface,
    paddingTop: 12,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  count: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  badge: {
    backgroundColor: Colors.primary,
    borderRadius: 9,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.white,
  },
  sortRow: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 12,
  },
  sortChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.offWhite,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sortChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  sortText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  sortTextActive: {
    color: Colors.white,
  },
});
