import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useSavedStore } from '@/store/savedStore';
import { projects } from '@/data/projects';
import { formatPrice, possessionLabel, propertyTypeLabel } from '@/utils/format';
import { Project } from '@/constants/types';

function Row({ label, values, highlight }: { label: string; values: (string | number)[]; highlight?: boolean }) {
  return (
    <View style={[styles.row, highlight && styles.rowHighlight]}>
      <Text style={styles.rowLabel}>{label}</Text>
      {values.map((v, i) => (
        <Text key={i} style={[styles.rowValue, highlight && styles.rowValueHighlight]}>
          {v}
        </Text>
      ))}
    </View>
  );
}

export default function CompareScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { compareIds, clearCompare, toggleCompare } = useSavedStore();
  const compared = projects.filter((p) => compareIds.includes(p.id));

  if (compared.length < 2) {
    return (
      <View style={[styles.empty, { paddingTop: insets.top }]}>
        <View style={styles.emptyHeader}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.emptyTitle}>Compare Projects</Text>
        </View>
        <View style={styles.emptyBody}>
          <Ionicons name="git-compare-outline" size={60} color={Colors.border} />
          <Text style={styles.emptyText}>Select at least 2 projects to compare</Text>
          <TouchableOpacity style={styles.exploreBtn} onPress={() => router.push('/search/results')}>
            <Text style={styles.exploreBtnText}>Browse Projects</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Compare Projects</Text>
        <TouchableOpacity onPress={() => { clearCompare(); router.back(); }}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Project Headers */}
        <View style={styles.projectHeaders}>
          <View style={styles.labelCol} />
          {compared.map((p) => (
            <View key={p.id} style={styles.projectHeader}>
              <Image source={{ uri: p.images[0] }} style={styles.projectThumb} />
              <Text style={styles.projectName} numberOfLines={2}>{p.name}</Text>
              <Text style={styles.projectArea}>{p.location.area}</Text>
              <TouchableOpacity style={styles.removeBtn} onPress={() => toggleCompare(p.id)}>
                <Ionicons name="close" size={14} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Comparison Table */}
        <View style={styles.table}>
          <Row
            label="Type"
            values={compared.map((p) => propertyTypeLabel(p.type))}
          />
          <Row
            label="Min Price"
            values={compared.map((p) => formatPrice(p.pricing.minPrice))}
            highlight
          />
          <Row
            label="Max Price"
            values={compared.map((p) => formatPrice(p.pricing.maxPrice))}
          />
          {compared[0].pricing.pricePerSqft && (
            <Row
              label="Price/sqft"
              values={compared.map((p) => p.pricing.pricePerSqft ? `₹${p.pricing.pricePerSqft.toLocaleString('en-IN')}` : 'N/A')}
            />
          )}
          <Row
            label="Configuration"
            values={compared.map((p) => p.specifications.configurations.join(', '))}
          />
          <Row
            label="Area"
            values={compared.map((p) => `${p.specifications.minArea}–${p.specifications.maxArea} ${p.specifications.areaUnit}`)}
          />
          <Row
            label="Possession"
            values={compared.map((p) => possessionLabel(p.possession.status))}
          />
          <Row
            label="Date"
            values={compared.map((p) => p.possession.date ?? 'TBD')}
          />
          <Row
            label="RERA"
            values={compared.map((p) => p.approvals.rera ?? '—')}
            highlight
          />
          <Row
            label="HMDA"
            values={compared.map((p) => p.approvals.hmda ?? '—')}
          />
          <Row
            label="Amenities"
            values={compared.map((p) => `${p.amenities.length} amenities`)}
          />
          <Row
            label="Invest Score"
            values={compared.map((p) => `${p.investmentScore}/100`)}
            highlight
          />
          {compared.some((p) => p.rentalYield) && (
            <Row
              label="Rental Yield"
              values={compared.map((p) => p.rentalYield ? `${p.rentalYield}%` : 'N/A')}
            />
          )}
          {compared.some((p) => p.appreciationPct) && (
            <Row
              label="Appreciation"
              values={compared.map((p) => p.appreciationPct ? `${p.appreciationPct}% p.a.` : 'N/A')}
            />
          )}
          <Row
            label="Developer"
            values={compared.map((p) => p.developer.name)}
          />
        </View>

        {/* View Project Buttons */}
        <View style={styles.viewBtns}>
          {compared.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={styles.viewBtn}
              onPress={() => router.push(`/project/${p.id}`)}
            >
              <Text style={styles.viewBtnText} numberOfLines={1}>{p.name}</Text>
              <Ionicons name="arrow-forward" size={14} color={Colors.gold} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  empty: { flex: 1, backgroundColor: Colors.offWhite },
  emptyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  emptyBody: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 40 },
  emptyText: { fontSize: 15, color: Colors.textMuted, textAlign: 'center' },
  exploreBtn: {
    backgroundColor: Colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12,
  },
  exploreBtnText: { fontSize: 15, fontWeight: '600', color: Colors.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.primary,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.white },
  clearText: { fontSize: 14, fontWeight: '600', color: Colors.gold },
  projectHeaders: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  labelCol: { width: 110 },
  projectHeader: { flex: 1, alignItems: 'center', padding: 12, position: 'relative' },
  projectThumb: { width: 72, height: 54, borderRadius: 8, marginBottom: 8 },
  projectName: {
    fontSize: 12, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center',
  },
  projectArea: { fontSize: 11, color: Colors.textMuted, textAlign: 'center', marginTop: 2 },
  removeBtn: {
    position: 'absolute', top: 8, right: 8,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  table: { backgroundColor: Colors.white, margin: 12, borderRadius: 12, overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  rowHighlight: { backgroundColor: Colors.offWhite },
  rowLabel: {
    width: 110, paddingVertical: 12, paddingHorizontal: 14,
    fontSize: 12, fontWeight: '600', color: Colors.textSecondary,
  },
  rowValue: {
    flex: 1, paddingVertical: 12, paddingHorizontal: 8, textAlign: 'center',
    fontSize: 12, color: Colors.textPrimary, fontWeight: '500',
  },
  rowValueHighlight: { fontWeight: '700', color: Colors.primary },
  viewBtns: { flexDirection: 'row', gap: 8, padding: 12 },
  viewBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: Colors.primary, borderRadius: 10, padding: 12,
  },
  viewBtnText: { fontSize: 12, fontWeight: '600', color: Colors.white, flex: 1, textAlign: 'center' },
});
