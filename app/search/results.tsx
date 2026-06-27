import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import SearchBar from '@/components/SearchBar';
import FilterBar from '@/components/FilterBar';
import FilterModal from '@/components/FilterModal';
import ProjectCard from '@/components/ProjectCard';
import { useSearch } from '@/hooks/useSearch';
import { useSearchStore } from '@/store/searchStore';
import { useSavedStore } from '@/store/savedStore';
import { getAreaByName } from '@/data/areas';
import { TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SearchResultsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { filters, setQuery } = useSearchStore();
  const { projects, total } = useSearch();
  const [filterVisible, setFilterVisible] = useState(false);
  const { compareIds } = useSavedStore();
  const matchedArea = filters.query ? getAreaByName(filters.query.trim()) : undefined;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Search Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.searchWrap}>
          <SearchBar
            value={filters.query}
            onChangeText={setQuery}
            onSubmit={() => {}}
            placeholder="Search area, project, developer..."
            autoFocus={!filters.query}
          />
        </View>
        <TouchableOpacity style={styles.mapBtn} onPress={() => router.push('/map')}>
          <Ionicons name="map" size={18} color={Colors.white} />
          <Text style={styles.mapBtnText}>Map</Text>
        </TouchableOpacity>
      </View>

      {matchedArea && (
        <TouchableOpacity
          style={styles.areaBanner}
          activeOpacity={0.9}
          onPress={() => router.push(`/area/${encodeURIComponent(matchedArea.name)}`)}
        >
          <View style={styles.areaBannerIcon}>
            <Ionicons name="analytics" size={18} color={Colors.gold} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.areaBannerTitle}>Explore {matchedArea.name} — Area Intelligence</Text>
            <Text style={styles.areaBannerSub}>
              Growth {matchedArea.growthScore} · +{matchedArea.avgAppreciation}% p.a. · infra, livability & trends
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.white} />
        </TouchableOpacity>
      )}

      <FilterBar onOpenFilters={() => setFilterVisible(true)} resultCount={total} />

      <FlatList
        data={projects}
        keyExtractor={(p) => p.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <ProjectCard project={item} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={56} color={Colors.border} />
            <Text style={styles.emptyTitle}>No projects found</Text>
            <Text style={styles.emptyText}>Try adjusting your filters or search query</Text>
          </View>
        }
      />

      {/* Compare FAB */}
      {compareIds.length >= 2 && (
        <TouchableOpacity style={[styles.compareFab, { bottom: insets.bottom + 16 }]} onPress={() => router.push('/compare')}>
          <Ionicons name="git-compare" size={18} color={Colors.white} />
          <Text style={styles.compareFabText}>Compare {compareIds.length}</Text>
        </TouchableOpacity>
      )}

      <FilterModal visible={filterVisible} onClose={() => setFilterVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchWrap: { flex: 1 },
  mapBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.primary, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 9,
  },
  mapBtnText: { fontSize: 13, fontWeight: '700', color: Colors.white },
  areaBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.primary, marginHorizontal: 12, marginTop: 10,
    borderRadius: 12, padding: 12,
  },
  areaBannerIcon: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: 'rgba(201,168,76,0.15)', alignItems: 'center', justifyContent: 'center',
  },
  areaBannerTitle: { fontSize: 13, fontWeight: '700', color: Colors.white },
  areaBannerSub: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  list: { padding: 16 },
  empty: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  emptyText: { fontSize: 14, color: Colors.textMuted, textAlign: 'center' },
  compareFab: {
    position: 'absolute',
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  compareFabText: { fontSize: 14, fontWeight: '700', color: Colors.white },
});
