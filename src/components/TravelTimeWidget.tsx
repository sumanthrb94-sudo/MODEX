import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { calcTravelTime } from '@/hooks/useTravelTime';
import { Coordinates, SavedLocation } from '@/constants/types';

interface Props {
  destination: Coordinates;
  savedLocations: SavedLocation[];
}

export default function TravelTimeWidget({ destination, savedLocations }: Props) {
  if (savedLocations.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Travel Times</Text>
      {savedLocations.map((loc) => {
        const times = calcTravelTime(loc.coordinates, destination);
        return (
          <View key={loc.id} style={styles.row}>
            <View style={styles.locInfo}>
              <Ionicons
                name={loc.icon as any}
                size={16}
                color={Colors.primary}
                style={styles.locIcon}
              />
              <Text style={styles.locLabel}>{loc.label}</Text>
              <Text style={styles.distance}>{times.distanceKm}</Text>
            </View>
            <View style={styles.modes}>
              <ModeItem icon="car-outline" time={times.car} />
              <ModeItem icon="bicycle-outline" time={times.auto} />
            </View>
          </View>
        );
      })}
    </View>
  );
}

function ModeItem({ icon, time }: { icon: any; time: string }) {
  return (
    <View style={styles.modeItem}>
      <Ionicons name={icon} size={14} color={Colors.textSecondary} />
      <Text style={styles.modeTime}>{time}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  locInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 6,
  },
  locIcon: {},
  locLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  distance: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  modes: {
    flexDirection: 'row',
    gap: 12,
  },
  modeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  modeTime: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
});
