import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { PropertyType } from '@/constants/types';

const TYPES: { type: PropertyType; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { type: 'apartment', label: 'Apartments', icon: 'business' },
  { type: 'villa', label: 'Villas', icon: 'home' },
  { type: 'plot', label: 'Plots', icon: 'map' },
  { type: 'farmland', label: 'Farm Lands', icon: 'leaf' },
  { type: 'commercial', label: 'Commercial', icon: 'storefront' },
  { type: 'standalone', label: 'Standalone', icon: 'key' },
];

interface Props {
  selected: PropertyType[];
  onToggle: (type: PropertyType) => void;
}

export default function PropertyTypeFilter({ selected, onToggle }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {TYPES.map((item) => {
        const active = selected.includes(item.type);
        return (
          <TouchableOpacity
            key={item.type}
            onPress={() => onToggle(item.type)}
            style={[styles.chip, active && styles.chipActive]}
            activeOpacity={0.75}
          >
            <Ionicons
              name={item.icon}
              size={16}
              color={active ? Colors.white : Colors.textSecondary}
              style={styles.chipIcon}
            />
            <Text style={[styles.chipText, active && styles.chipTextActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

export { TYPES };

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: 'row',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipIcon: {
    marginRight: 6,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: Colors.white,
  },
});
