import React, { useState } from 'react';
import {
  Modal, View, Text, ScrollView, TouchableOpacity, StyleSheet, Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useSearchStore } from '@/store/searchStore';
import { PropertyType, PossessionStatus } from '@/constants/types';

const TYPES: { type: PropertyType; label: string }[] = [
  { type: 'apartment', label: 'Apartment' },
  { type: 'villa', label: 'Villa' },
  { type: 'plot', label: 'Plot' },
  { type: 'farmland', label: 'Farm Land' },
  { type: 'commercial', label: 'Commercial' },
  { type: 'standalone', label: 'Standalone' },
];

const STATUSES: { value: PossessionStatus; label: string }[] = [
  { value: 'ready', label: 'Ready to Move' },
  { value: 'under_construction', label: 'Under Construction' },
  { value: 'new_launch', label: 'New Launch' },
];

const PRICE_PRESETS = [
  { label: 'Under 50L', min: 0, max: 5000000 },
  { label: '50L–1Cr', min: 5000000, max: 10000000 },
  { label: '1–3 Cr', min: 10000000, max: 30000000 },
  { label: '3–5 Cr', min: 30000000, max: 50000000 },
  { label: '5 Cr+', min: 50000000, max: 150000000 },
];

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function FilterModal({ visible, onClose }: Props) {
  const { filters, toggleType, togglePossessionStatus, setPriceRange, resetFilters } = useSearchStore();
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);

  const applyPreset = (i: number) => {
    setSelectedPreset(i);
    const p = PRICE_PRESETS[i];
    setPriceRange(p.min, p.max);
  };

  const handleReset = () => {
    resetFilters();
    setSelectedPreset(null);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Filters</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Property Type</Text>
          <View style={styles.chips}>
            {TYPES.map((t) => {
              const active = filters.types.includes(t.type);
              return (
                <TouchableOpacity
                  key={t.type}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => toggleType(t.type)}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{t.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.sectionTitle}>Budget</Text>
          <View style={styles.chips}>
            {PRICE_PRESETS.map((p, i) => {
              const active = selectedPreset === i;
              return (
                <TouchableOpacity
                  key={p.label}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => applyPreset(i)}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{p.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.sectionTitle}>Possession Status</Text>
          <View style={styles.chips}>
            {STATUSES.map((s) => {
              const active = filters.possessionStatus.includes(s.value);
              return (
                <TouchableOpacity
                  key={s.value}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => togglePossessionStatus(s.value)}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{s.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
            <Text style={styles.resetText}>Reset All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyBtn} onPress={onClose}>
            <Text style={styles.applyText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  title: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  body: { padding: 20, gap: 8 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.offWhite,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 13, fontWeight: '500', color: Colors.textSecondary },
  chipTextActive: { color: Colors.white },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderColor: Colors.border,
  },
  resetBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignItems: 'center',
  },
  resetText: { fontSize: 15, fontWeight: '600', color: Colors.primary },
  applyBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  applyText: { fontSize: 15, fontWeight: '600', color: Colors.white },
});
