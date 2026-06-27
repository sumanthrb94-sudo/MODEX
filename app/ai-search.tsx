import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, withRepeat, withSequence, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { Colors } from '@/constants/colors';
import { useSearchStore } from '@/store/searchStore';
import { parseNaturalLanguage } from '@/hooks/useSearch';
import { SearchFilters, PropertyType, PossessionStatus } from '@/constants/types';
import { formatPrice } from '@/utils/format';

const SUGGESTIONS = [
  { label: '🏠 Villas under 3 Cr near Airport', query: 'villa under 3 crore shamshabad' },
  { label: '🏢 Apartments in Kokapet', query: 'apartment kokapet' },
  { label: '🌿 Farmland investment near Chevella', query: 'farmland chevella' },
  { label: '📈 Ready to move under 1 Cr', query: 'ready apartment under 1 crore' },
  { label: '🏗️ New launches with RERA', query: 'new launch' },
  { label: '💼 Commercial spaces Gachibowli', query: 'commercial gachibowli' },
];

function ParsedFilters({ filters }: { filters: Partial<SearchFilters> }) {
  const chips: string[] = [];
  if (filters.types?.length) chips.push(...filters.types.map((t) => `Type: ${t}`));
  if (filters.areas?.length) chips.push(...filters.areas.map((a) => `Area: ${a}`));
  if (filters.maxPrice) chips.push(`Max: ${formatPrice(filters.maxPrice)}`);
  if (filters.possessionStatus?.length) chips.push(...filters.possessionStatus.map((s) => `Status: ${s.replace('_', ' ')}`));

  if (chips.length === 0) return null;

  return (
    <View style={styles.parsedBox}>
      <Text style={styles.parsedTitle}>AI understood:</Text>
      <View style={styles.parsedChips}>
        {chips.map((chip) => (
          <View key={chip} style={styles.parsedChip}>
            <Ionicons name="checkmark-circle" size={13} color={Colors.success} />
            <Text style={styles.parsedChipText}>{chip}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function AISearchScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [parsed, setParsed] = useState<Partial<SearchFilters> | null>(null);

  const pulse = useSharedValue(1);
  pulse.value = withRepeat(
    withSequence(withTiming(1.06, { duration: 800 }), withTiming(1, { duration: 800 })),
    -1,
    true,
  );
  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

  const handleSearch = (q: string) => {
    const text = q || query;
    const result = parseNaturalLanguage(text);
    setParsed(result);
    useSearchStore.getState().applyFromNL({ ...result, query: text });
    setTimeout(() => router.push('/search/results'), 600);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <Ionicons name="close" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>AI Property Search</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.heroSection}>
            <Animated.View style={[styles.sparkleCircle, pulseStyle]}>
              <Ionicons name="sparkles" size={32} color={Colors.gold} />
            </Animated.View>
            <Text style={styles.heroTitle}>Tell me what you're looking for</Text>
            <Text style={styles.heroSub}>
              Describe your dream property in natural language
            </Text>
          </View>

          <View style={styles.inputCard}>
            <TextInput
              style={styles.input}
              placeholder="e.g. I want a 3 BHK villa near Financial District under 2 crore"
              placeholderTextColor={Colors.textMuted}
              value={query}
              onChangeText={(t) => { setQuery(t); setParsed(null); }}
              multiline
              numberOfLines={3}
              autoFocus
            />
            {parsed && <ParsedFilters filters={parsed} />}
            <TouchableOpacity style={styles.searchBtn} onPress={() => handleSearch(query)}>
              <Ionicons name="search" size={18} color={Colors.white} />
              <Text style={styles.searchBtnText}>Search Properties</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.suggestionsTitle}>Quick Searches</Text>
          <View style={styles.suggestions}>
            {SUGGESTIONS.map((s) => (
              <TouchableOpacity
                key={s.label}
                style={styles.suggestionChip}
                onPress={() => { setQuery(s.query); handleSearch(s.query); }}
              >
                <Text style={styles.suggestionText}>{s.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.examplesCard}>
            <Text style={styles.examplesTitle}>Example queries</Text>
            {[
              '"Villas with pool under 4 crore Shamshabad"',
              '"Ready to move apartments near metro"',
              '"Plots for investment Shankarpally"',
              '"Farmland 3 acres Chevella"',
            ].map((e) => (
              <TouchableOpacity key={e} onPress={() => { setQuery(e.replace(/"/g, '')); }}>
                <Text style={styles.exampleItem}>{e}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: Colors.white, borderBottomWidth: 1, borderColor: Colors.border,
  },
  closeBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  body: { padding: 16, gap: 16, paddingBottom: 40 },
  heroSection: { alignItems: 'center', paddingVertical: 20, gap: 12 },
  sparkleCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.gold, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
  heroTitle: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center' },
  heroSub: { fontSize: 14, color: Colors.textMuted, textAlign: 'center', lineHeight: 20 },
  inputCard: {
    backgroundColor: Colors.white, borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
    gap: 12,
  },
  input: {
    fontSize: 15, color: Colors.textPrimary, lineHeight: 22,
    minHeight: 80, textAlignVertical: 'top',
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10,
  },
  parsedBox: {
    backgroundColor: Colors.success + '10',
    borderRadius: 10, padding: 12,
    borderWidth: 1, borderColor: Colors.success + '30',
  },
  parsedTitle: { fontSize: 12, fontWeight: '600', color: Colors.success, marginBottom: 8 },
  parsedChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  parsedChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.white, borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 4,
    borderWidth: 1, borderColor: Colors.success + '40',
  },
  parsedChipText: { fontSize: 12, fontWeight: '500', color: Colors.textPrimary, textTransform: 'capitalize' },
  searchBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.primary, paddingVertical: 14, borderRadius: 12,
  },
  searchBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white },
  suggestionsTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  suggestions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  suggestionChip: {
    paddingHorizontal: 14, paddingVertical: 9,
    borderRadius: 20, borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  suggestionText: { fontSize: 13, fontWeight: '500', color: Colors.textPrimary },
  examplesCard: {
    backgroundColor: Colors.white, borderRadius: 14, padding: 14, gap: 10,
  },
  examplesTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  exampleItem: { fontSize: 13, color: Colors.primary, fontWeight: '500', fontStyle: 'italic' },
});
