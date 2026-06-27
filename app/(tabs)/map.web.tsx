import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useSearch } from '@/hooks/useSearch';
import { useSearchStore } from '@/store/searchStore';
import { formatPrice, propertyTypeLabel, possessionLabel, possessionColor } from '@/utils/format';
import { Project, PropertyType } from '@/constants/types';

const TYPE_COLORS: Record<string, string> = {
  villa: '#2ECC71',
  apartment: '#3498DB',
  plot: '#F39C12',
  farmland: '#27AE60',
  commercial: '#9B59B6',
  standalone: '#E74C3C',
};

const TYPE_ICONS: Record<string, any> = {
  villa: 'home',
  apartment: 'business',
  plot: 'map',
  farmland: 'leaf',
  commercial: 'storefront',
  standalone: 'key',
};

function openOSM(project: Project) {
  const { lat, lng } = project.location.coordinates;
  Linking.openURL(
    `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=15&layers=M`,
  );
}

function ProjectRow({ project }: { project: Project }) {
  const router = useRouter();
  return (
    <View style={styles.projectRow}>
      <View style={[styles.typeDot, { backgroundColor: TYPE_COLORS[project.type] ?? Colors.primary }]}>
        <Ionicons name={TYPE_ICONS[project.type]} size={14} color={Colors.white} />
      </View>
      <View style={styles.projectInfo}>
        <Text style={styles.projectName} numberOfLines={1}>{project.name}</Text>
        <Text style={styles.projectArea}>{project.location.area} · {propertyTypeLabel(project.type)}</Text>
        <Text style={styles.projectPrice}>{formatPrice(project.pricing.minPrice)} onwards</Text>
      </View>
      <View style={styles.projectActions}>
        <TouchableOpacity style={styles.mapLink} onPress={() => openOSM(project)}>
          <Ionicons name="navigate" size={14} color={Colors.primary} />
          <Text style={styles.mapLinkText}>Map</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.detailLink} onPress={() => router.push(`/project/${project.id}`)}>
          <Text style={styles.detailLinkText}>View</Text>
          <Ionicons name="chevron-forward" size={14} color={Colors.gold} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const AREAS = [
  'All', 'Kokapet', 'Financial District', 'Narsingi', 'Tukkuguda',
  'Shamshabad', 'Chevella', 'Shankarpally', 'Shadnagar', 'Gachibowli', 'Jubilee Hills',
];

export default function MapWebScreen() {
  const insets = useSafeAreaInsets();
  const { projects } = useSearch();
  const [activeArea, setActiveArea] = useState('All');
  const [localQ, setLocalQ] = useState('');
  const { setQuery } = useSearchStore();

  const displayed = projects.filter((p) => {
    const areaMatch = activeArea === 'All' || p.location.area.toLowerCase().includes(activeArea.toLowerCase());
    const qMatch = localQ === '' || p.name.toLowerCase().includes(localQ.toLowerCase()) ||
      p.location.area.toLowerCase().includes(localQ.toLowerCase());
    return areaMatch && qMatch;
  });

  const byArea = displayed.reduce<Record<string, Project[]>>((acc, p) => {
    const key = p.location.area;
    acc[key] = acc[key] ?? [];
    acc[key].push(p);
    return acc;
  }, {});

  const typeCounts = projects.reduce<Record<string, number>>((acc, p) => {
    acc[p.type] = (acc[p.type] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Ionicons name="map" size={22} color={Colors.white} />
          <Text style={styles.headerTitle}>Project Map</Text>
          <Text style={styles.headerCount}>{projects.length} projects in Hyderabad</Text>
        </View>

        {/* Search */}
        <View style={styles.searchRow}>
          <Ionicons name="search" size={16} color={Colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search projects or areas..."
            placeholderTextColor={Colors.textMuted}
            value={localQ}
            onChangeText={setLocalQ}
          />
        </View>

        {/* Type chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.typeRow}>
          {Object.entries(typeCounts).map(([type, count]) => (
            <View key={type} style={[styles.typeChip, { borderColor: TYPE_COLORS[type] }]}>
              <View style={[styles.typeChipDot, { backgroundColor: TYPE_COLORS[type] }]} />
              <Text style={styles.typeChipText}>{propertyTypeLabel(type)} ({count})</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* OSM embed notice + link */}
      <View style={styles.mapNotice}>
        <Ionicons name="information-circle-outline" size={16} color={Colors.info} />
        <Text style={styles.mapNoticeText}>
          Map view is optimised for mobile. On web, browse projects by area below or
        </Text>
        <TouchableOpacity onPress={() =>
          Linking.openURL('https://www.openstreetmap.org/#map=11/17.3850/78.4867')
        }>
          <Text style={styles.mapNoticeLink}> open Hyderabad on OpenStreetMap ↗</Text>
        </TouchableOpacity>
      </View>

      {/* Area filter pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.areaFilter}>
        {AREAS.map((a) => (
          <TouchableOpacity
            key={a}
            style={[styles.areaPill, activeArea === a && styles.areaPillActive]}
            onPress={() => setActiveArea(a)}
          >
            <Text style={[styles.areaPillText, activeArea === a && styles.areaPillTextActive]}>{a}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Project list grouped by area */}
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {Object.keys(byArea).length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={48} color={Colors.border} />
            <Text style={styles.emptyText}>No projects match your search</Text>
          </View>
        ) : (
          Object.entries(byArea).map(([area, areaProjects]) => (
            <View key={area} style={styles.areaGroup}>
              <View style={styles.areaHeader}>
                <Ionicons name="location" size={15} color={Colors.gold} />
                <Text style={styles.areaTitle}>{area}</Text>
                <Text style={styles.areaCount}>{areaProjects.length} project{areaProjects.length > 1 ? 's' : ''}</Text>
              </View>
              {areaProjects.map((p) => (
                <ProjectRow key={p.id} project={p} />
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 12,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: Colors.white, flex: 1 },
  headerCount: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: Colors.textPrimary },
  typeRow: { gap: 8 },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1.5,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  typeChipDot: { width: 8, height: 8, borderRadius: 4 },
  typeChipText: { fontSize: 12, fontWeight: '500', color: Colors.white },
  mapNotice: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: Colors.info + '12',
    borderBottomWidth: 1,
    borderColor: Colors.info + '30',
  },
  mapNoticeText: { fontSize: 12, color: Colors.textSecondary, flexShrink: 1 },
  mapNoticeLink: { fontSize: 12, fontWeight: '600', color: Colors.info },
  areaFilter: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 6,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  areaPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.offWhite,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  areaPillActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  areaPillText: { fontSize: 13, fontWeight: '500', color: Colors.textSecondary },
  areaPillTextActive: { color: Colors.white },
  list: { padding: 12, gap: 12, paddingBottom: 32 },
  areaGroup: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  areaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 11,
    backgroundColor: Colors.offWhite,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  areaTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, flex: 1 },
  areaCount: { fontSize: 12, color: Colors.textMuted },
  projectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  typeDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  projectInfo: { flex: 1 },
  projectName: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  projectArea: { fontSize: 11, color: Colors.textMuted, marginTop: 1 },
  projectPrice: { fontSize: 13, fontWeight: '700', color: Colors.primary, marginTop: 3 },
  projectActions: { flexDirection: 'column', alignItems: 'flex-end', gap: 6 },
  mapLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  mapLinkText: { fontSize: 11, fontWeight: '600', color: Colors.primary },
  detailLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  detailLinkText: { fontSize: 12, fontWeight: '600', color: Colors.gold },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, color: Colors.textMuted },
});
