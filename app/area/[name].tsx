import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '@/constants/colors';
import { getAreaByName, getProjectsInArea } from '@/data/areas';
import { useFollowStore } from '@/store/followStore';
import { useSearchStore } from '@/store/searchStore';
import { livabilityCategory } from '@/data/environment';
import { formatPrice } from '@/utils/format';
import ProjectCard from '@/components/ProjectCard';
import { AreaInfra } from '@/constants/types';

const INFRA_ICON: Record<AreaInfra['type'], any> = {
  metro: 'train',
  road: 'car',
  airport: 'airplane',
  it_park: 'business',
  social: 'school',
};

const STATUS_META: Record<AreaInfra['status'], { label: string; color: string }> = {
  operational: { label: 'Operational', color: Colors.success },
  under_construction: { label: 'Under Construction', color: Colors.warning },
  planned: { label: 'Planned', color: Colors.info },
};

export default function AreaScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isFollowing, toggleFollow } = useFollowStore();

  const area = getAreaByName(name as string);
  const areaProjects = getProjectsInArea(name as string);

  if (!area) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Area not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: Colors.gold, fontWeight: '600' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const following = isFollowing(area.name);
  const liv = livabilityCategory(area.avgLivability);
  const maxTrend = Math.max(...area.priceTrend, 1);

  const openProjectsOnMap = () => {
    const store = useSearchStore.getState();
    store.resetFilters();
    store.setQuery(area.name);
    router.push('/map');
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        {/* Header */}
        <LinearGradient colors={Gradients.primaryBrand} style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={20} color={Colors.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.followBtn, following && styles.followBtnActive]}
              onPress={() => toggleFollow(area.name)}
            >
              <Ionicons name={following ? 'notifications' : 'notifications-outline'} size={15} color={following ? Colors.primary : Colors.gold} />
              <Text style={[styles.followText, following && styles.followTextActive]}>
                {following ? 'Following' : 'Follow Area'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.areaName}>{area.name}</Text>
          <Text style={styles.areaTagline}>{area.tagline}</Text>
          <View style={styles.headerStats}>
            <View style={styles.hStat}>
              <Text style={styles.hStatNum}>{area.growthScore}</Text>
              <Text style={styles.hStatLabel}>Growth Score</Text>
            </View>
            <View style={styles.hDivider} />
            <View style={styles.hStat}>
              <Text style={styles.hStatNum}>{area.avgAppreciation}%</Text>
              <Text style={styles.hStatLabel}>Appreciation p.a.</Text>
            </View>
            <View style={styles.hDivider} />
            <View style={styles.hStat}>
              <Text style={styles.hStatNum}>{area.projectCount}</Text>
              <Text style={styles.hStatLabel}>Projects</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Snapshot */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Area Snapshot</Text>
          <View style={styles.snapGrid}>
            <View style={styles.snapCard}>
              <Text style={styles.snapNum}>{area.avgPricePerSqft ? `₹${area.avgPricePerSqft.toLocaleString('en-IN')}` : '—'}</Text>
              <Text style={styles.snapLabel}>Avg / sqft</Text>
            </View>
            <View style={styles.snapCard}>
              <Text style={styles.snapNum}>{formatPrice(area.minPrice)}+</Text>
              <Text style={styles.snapLabel}>Entry Price</Text>
            </View>
            <View style={styles.snapCard}>
              <Text style={[styles.snapNum, { color: liv.color }]}>{area.avgLivability}</Text>
              <Text style={styles.snapLabel}>Livability · {liv.label}</Text>
            </View>
          </View>
          <Text style={styles.summary}>{area.summary}</Text>
        </View>

        {/* Price trend */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Trend (₹/sqft)</Text>
          <View style={styles.chart}>
            {area.priceTrend.map((val, i) => {
              const last = i === area.priceTrend.length - 1;
              return (
                <View key={i} style={styles.barCol}>
                  <Text style={styles.barVal}>{(val / 1000).toFixed(1)}k</Text>
                  <View style={[styles.bar, { height: 26 + (val / maxTrend) * 90, backgroundColor: last ? Colors.gold : Colors.primaryMuted }]} />
                  <Text style={styles.barLabel}>{['Q1', 'Q2', 'Q3', 'Q4', 'Now'][i]}</Text>
                </View>
              );
            })}
          </View>
          <Text style={styles.trendNote}>
            ↑ {area.avgAppreciation}% est. annual appreciation, driven by infrastructure & demand.
          </Text>
        </View>

        {/* Social infrastructure */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Social Infrastructure</Text>
          <View style={styles.socialRow}>
            <View style={styles.socialCard}>
              <Ionicons name="school" size={20} color={Colors.primary} />
              <Text style={styles.socialNum}>{area.schools}</Text>
              <Text style={styles.socialLabel}>Schools</Text>
            </View>
            <View style={styles.socialCard}>
              <Ionicons name="medkit" size={20} color={Colors.error} />
              <Text style={styles.socialNum}>{area.hospitals}</Text>
              <Text style={styles.socialLabel}>Hospitals</Text>
            </View>
            <View style={styles.socialCard}>
              <Ionicons name="business" size={20} color={Colors.info} />
              <Text style={styles.socialNum}>{area.itParks}</Text>
              <Text style={styles.socialLabel}>IT Parks</Text>
            </View>
          </View>
        </View>

        {/* Infrastructure & future development */}
        {area.infrastructure.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Connectivity & Future Development</Text>
            {area.infrastructure.map((infra, i) => {
              const sm = STATUS_META[infra.status];
              return (
                <View key={i} style={[styles.infraRow, i < area.infrastructure.length - 1 && styles.infraRowBorder]}>
                  <View style={styles.infraIcon}>
                    <Ionicons name={INFRA_ICON[infra.type]} size={18} color={Colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.infraName}>{infra.name}</Text>
                    {infra.impact && <Text style={styles.infraImpact}>{infra.impact}</Text>}
                  </View>
                  <View style={styles.infraStatus}>
                    <View style={[styles.statusDot, { backgroundColor: sm.color }]} />
                    <Text style={[styles.statusText, { color: sm.color }]}>{sm.label}</Text>
                    {infra.eta && <Text style={styles.etaText}>{infra.eta}</Text>}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Projects in area */}
        <View style={styles.section}>
          <View style={styles.projHeader}>
            <Text style={styles.sectionTitle}>Projects in {area.name}</Text>
            <TouchableOpacity onPress={openProjectsOnMap}>
              <Text style={styles.mapLink}>On map ›</Text>
            </TouchableOpacity>
          </View>
          {areaProjects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.bottomCta, { paddingBottom: insets.bottom + 14 }]}>
        <TouchableOpacity style={styles.followCta} onPress={() => toggleFollow(area.name)}>
          <Ionicons name={following ? 'notifications' : 'notifications-outline'} size={18} color={following ? Colors.primary : Colors.gold} />
          <Text style={[styles.followCtaText, following && { color: Colors.primary }]}>
            {following ? 'Following' : 'Follow'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.mapCta} onPress={openProjectsOnMap}>
          <Ionicons name="map" size={18} color={Colors.white} />
          <Text style={styles.mapCtaText}>Explore on Map</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  notFoundText: { fontSize: 16, color: Colors.textPrimary },
  header: { paddingHorizontal: 16, paddingBottom: 20 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  iconBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center',
  },
  followBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(201,168,76,0.15)', borderWidth: 1, borderColor: Colors.gold,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
  },
  followBtnActive: { backgroundColor: Colors.gold },
  followText: { fontSize: 13, fontWeight: '700', color: Colors.gold },
  followTextActive: { color: Colors.primary },
  areaName: { fontSize: 28, fontWeight: '800', color: Colors.white },
  areaTagline: { fontSize: 14, color: Colors.goldLight, marginTop: 4 },
  headerStats: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 14,
    paddingVertical: 14, marginTop: 18,
  },
  hStat: { flex: 1, alignItems: 'center' },
  hStatNum: { fontSize: 22, fontWeight: '800', color: Colors.white },
  hStatLabel: { fontSize: 10, color: 'rgba(255,255,255,0.65)', marginTop: 2 },
  hDivider: { width: 1, height: 34, backgroundColor: 'rgba(255,255,255,0.2)' },
  section: {
    backgroundColor: Colors.white, marginHorizontal: 16, marginTop: 12,
    borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12 },
  snapGrid: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  snapCard: {
    flex: 1, alignItems: 'center', gap: 4,
    backgroundColor: Colors.offWhite, borderRadius: 12, paddingVertical: 14,
    borderWidth: 1, borderColor: Colors.border,
  },
  snapNum: { fontSize: 16, fontWeight: '800', color: Colors.primary },
  snapLabel: { fontSize: 10, color: Colors.textMuted, textAlign: 'center' },
  summary: { fontSize: 13, color: Colors.textSecondary, lineHeight: 21 },
  chart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 150, paddingTop: 6 },
  barCol: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 5 },
  bar: { width: 28, borderRadius: 6 },
  barVal: { fontSize: 10, fontWeight: '700', color: Colors.textSecondary },
  barLabel: { fontSize: 10, color: Colors.textMuted },
  trendNote: { fontSize: 12, color: Colors.success, fontWeight: '600', marginTop: 12 },
  socialRow: { flexDirection: 'row', gap: 10 },
  socialCard: {
    flex: 1, alignItems: 'center', gap: 5,
    backgroundColor: Colors.offWhite, borderRadius: 12, paddingVertical: 16,
    borderWidth: 1, borderColor: Colors.border,
  },
  socialNum: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  socialLabel: { fontSize: 11, color: Colors.textMuted },
  infraRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  infraRowBorder: { borderBottomWidth: 1, borderColor: Colors.border },
  infraIcon: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: Colors.primary + '12', alignItems: 'center', justifyContent: 'center',
  },
  infraName: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  infraImpact: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  infraStatus: { alignItems: 'flex-end', gap: 2 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 10, fontWeight: '700' },
  etaText: { fontSize: 10, color: Colors.textMuted },
  projHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  mapLink: { fontSize: 13, fontWeight: '700', color: Colors.gold, marginBottom: 12 },
  bottomCta: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', gap: 10,
    backgroundColor: Colors.white, paddingHorizontal: 16, paddingTop: 12,
    borderTopWidth: 1, borderColor: Colors.border,
  },
  followCta: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 13, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.gold,
  },
  followCtaText: { fontSize: 14, fontWeight: '700', color: Colors.gold },
  mapCta: {
    flex: 1.6, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 13, borderRadius: 12, backgroundColor: Colors.primary,
  },
  mapCtaText: { fontSize: 14, fontWeight: '700', color: Colors.white },
});
