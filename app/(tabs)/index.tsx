import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList, Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Gradients } from '@/constants/colors';
import SearchBar from '@/components/SearchBar';
import PropertyTypeFilter from '@/components/PropertyTypeFilter';
import ProjectCard from '@/components/ProjectCard';
import LeadForm from '@/components/LeadForm';
import { useSearchStore } from '@/store/searchStore';
import { getFeaturedProjects, projects } from '@/data/projects';
import { PropertyType } from '@/constants/types';
import { formatPrice } from '@/utils/format';

const featured = getFeaturedProjects().slice(0, 5);
const nearby = projects.slice(0, 6);

const QUICK_SEARCHES = [
  { label: 'Ready Villas', query: 'ready villa' },
  { label: 'Under 1 Cr Flats', query: 'apartment under 1 crore' },
  { label: 'Kokapet Apartments', query: 'kokapet apartment' },
  { label: 'Plot Investment', query: 'plot' },
  { label: 'Airport Zone', query: 'shamshabad villa' },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { toggleType, filters } = useSearchStore();
  const [interiorOpen, setInteriorOpen] = useState(false);

  const goToResults = (q?: string) => {
    if (q) {
      useSearchStore.getState().setQuery(q);
    }
    router.push('/search/results');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <LinearGradient colors={Gradients.primaryBrand} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Good morning</Text>
            <Text style={styles.headline}>Find Your Dream Property</Text>
          </View>
          <TouchableOpacity style={styles.aiBtn} onPress={() => router.push('/ai-search')}>
            <Ionicons name="sparkles" size={18} color={Colors.gold} />
            <Text style={styles.aiText}>AI</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchWrapper}>
          <SearchBar
            value=""
            onChangeText={() => {}}
            readOnly
            onPress={() => router.push('/search/results')}
            placeholder="Search area, project, developer..."
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickRow}>
          {QUICK_SEARCHES.map((q) => (
            <TouchableOpacity key={q.label} style={styles.quickChip} onPress={() => goToResults(q.query)}>
              <Text style={styles.quickText}>{q.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
        {/* Property Type Filters */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Browse by Type</Text>
          <View style={styles.typeFilterWrap}>
            <PropertyTypeFilter
              selected={filters.types}
              onToggle={(t: PropertyType) => {
                toggleType(t);
                router.push('/search/results');
              }}
            />
          </View>
        </View>

        {/* Featured Projects */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Picks</Text>
            <TouchableOpacity onPress={() => router.push('/search/results')}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={featured}
            keyExtractor={(p) => p.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContent}
            renderItem={({ item }) => <ProjectCard project={item} compact />}
          />
        </View>

        {/* Stats Banner */}
        <LinearGradient colors={Gradients.goldButton} style={styles.statsBanner}>
          <View style={styles.stat}>
            <Text style={styles.statNum}>20+</Text>
            <Text style={styles.statLabel}>Live Projects</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNum}>5</Text>
            <Text style={styles.statLabel}>Top Developers</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNum}>100%</Text>
            <Text style={styles.statLabel}>Verified</Text>
          </View>
        </LinearGradient>

        {/* Interior Services */}
        <TouchableOpacity
          style={styles.interiorBanner}
          activeOpacity={0.9}
          onPress={() => setInteriorOpen(true)}
        >
          <View style={styles.interiorIcon}>
            <Ionicons name="color-palette" size={24} color={Colors.gold} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.interiorTitle}>MODEX Interiors</Text>
            <Text style={styles.interiorText}>
              Turnkey interior design for your new home. Free consultation.
            </Text>
          </View>
          <View style={styles.interiorCta}>
            <Text style={styles.interiorCtaText}>Get Quote</Text>
          </View>
        </TouchableOpacity>

        {/* Explore Nearby */}
        <View style={[styles.section, styles.sectionLast]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>New Launches</Text>
            <TouchableOpacity onPress={() => { useSearchStore.getState().togglePossessionStatus('new_launch'); router.push('/search/results'); }}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          {nearby.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </View>
      </ScrollView>

      <LeadForm visible={interiorOpen} onClose={() => setInteriorOpen(false)} type="interior" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    marginTop: 8,
  },
  greeting: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 2,
  },
  headline: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: -0.5,
  },
  aiBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.goldLight + '50',
  },
  aiText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.gold,
  },
  searchWrapper: { marginBottom: 12 },
  quickRow: { gap: 8, paddingRight: 4 },
  quickChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  quickText: { fontSize: 12, color: Colors.white, fontWeight: '500' },
  body: { paddingBottom: 24 },
  section: { marginTop: 24 },
  sectionLast: { marginBottom: 8 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  typeFilterWrap: { marginBottom: 4 },
  seeAll: { fontSize: 13, fontWeight: '600', color: Colors.gold, paddingHorizontal: 16 },
  carouselContent: { paddingHorizontal: 16, gap: 0 },
  statsBanner: {
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  stat: { alignItems: 'center', gap: 2 },
  statNum: { fontSize: 22, fontWeight: '800', color: Colors.primary },
  statLabel: { fontSize: 11, fontWeight: '500', color: Colors.primaryMuted },
  statDivider: { width: 1, height: 32, backgroundColor: Colors.primaryMuted + '40' },
  interiorBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: Colors.primary,
    marginHorizontal: 16, marginTop: 24,
    borderRadius: 16, padding: 16,
  },
  interiorIcon: {
    width: 48, height: 48, borderRadius: 12,
    backgroundColor: 'rgba(201,168,76,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  interiorTitle: { fontSize: 16, fontWeight: '700', color: Colors.white },
  interiorText: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2, lineHeight: 16 },
  interiorCta: {
    backgroundColor: Colors.gold, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 8,
  },
  interiorCtaText: { fontSize: 12, fontWeight: '700', color: Colors.primary },
});
