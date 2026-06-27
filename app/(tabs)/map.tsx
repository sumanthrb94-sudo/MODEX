import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MapView, { UrlTile, Marker, Callout, Region } from 'react-native-maps';
import { Colors } from '@/constants/colors';
import { projects } from '@/data/projects';
import { useSearch } from '@/hooks/useSearch';
import { formatPrice } from '@/utils/format';
import { Project } from '@/constants/types';

const HYDERABAD: Region = {
  latitude: 17.385,
  longitude: 78.4867,
  latitudeDelta: 0.4,
  longitudeDelta: 0.4,
};

const TYPE_COLORS: Record<string, string> = {
  villa: '#2ECC71',
  apartment: '#3498DB',
  plot: '#F39C12',
  farmland: '#27AE60',
  commercial: '#9B59B6',
  standalone: '#E74C3C',
};

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { projects: filtered } = useSearch();
  const [selected, setSelected] = useState<Project | null>(null);
  const slideAnim = useRef(new Animated.Value(200)).current;

  const selectProject = (p: Project) => {
    setSelected(p);
    Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }).start();
  };

  const dismiss = () => {
    Animated.timing(slideAnim, { toValue: 200, duration: 200, useNativeDriver: true }).start(() =>
      setSelected(null),
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={HYDERABAD}
        mapType="none"
        showsUserLocation
      >
        <UrlTile
          urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
          tileSize={256}
          zIndex={-1}
        />

        {filtered.map((p) => (
          <Marker
            key={p.id}
            coordinate={{ latitude: p.location.coordinates.lat, longitude: p.location.coordinates.lng }}
            onPress={() => selectProject(p)}
          >
            <View style={[styles.marker, { backgroundColor: TYPE_COLORS[p.type] ?? Colors.primary }]}>
              <Text style={styles.markerText}>{formatPrice(p.pricing.minPrice)}</Text>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Attribution */}
      <View style={[styles.attribution, { bottom: insets.bottom + 80 }]}>
        <Text style={styles.attributionText}>© OpenStreetMap contributors</Text>
      </View>

      {/* Header */}
      <View style={[styles.header, { top: insets.top + 10 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="search" size={20} color={Colors.primary} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerCount}>{filtered.length} projects</Text>
          <Text style={styles.headerSub}>in Hyderabad</Text>
        </View>
      </View>

      {/* Legend */}
      <View style={[styles.legend, { top: insets.top + 70 }]}>
        {Object.entries(TYPE_COLORS).map(([type, color]) => (
          <View key={type} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: color }]} />
            <Text style={styles.legendLabel}>{type}</Text>
          </View>
        ))}
      </View>

      {/* Project Callout Card */}
      {selected && (
        <Animated.View
          style={[
            styles.callout,
            { bottom: insets.bottom + 80, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.calloutHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.calloutName}>{selected.name}</Text>
              <Text style={styles.calloutArea}>{selected.location.area} · {selected.type}</Text>
            </View>
            <TouchableOpacity onPress={dismiss}>
              <Ionicons name="close" size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>
          <View style={styles.calloutBody}>
            <View>
              <Text style={styles.calloutPrice}>{formatPrice(selected.pricing.minPrice)}</Text>
              <Text style={styles.calloutConfig}>{selected.specifications.configurations[0]} onwards</Text>
            </View>
            <TouchableOpacity
              style={styles.viewBtn}
              onPress={() => { dismiss(); router.push(`/project/${selected.id}`); }}
            >
              <Text style={styles.viewBtnText}>View Details</Text>
              <Ionicons name="arrow-forward" size={14} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  marker: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  markerText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.white,
  },
  attribution: {
    position: 'absolute',
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  attributionText: { fontSize: 10, color: Colors.textSecondary },
  header: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  headerInfo: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  headerCount: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  headerSub: { fontSize: 12, color: Colors.textMuted },
  legend: {
    position: 'absolute',
    left: 16,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 10,
    padding: 10,
    gap: 5,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendLabel: { fontSize: 11, fontWeight: '500', color: Colors.textPrimary, textTransform: 'capitalize' },
  callout: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  calloutHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  calloutName: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  calloutArea: { fontSize: 12, color: Colors.textMuted, marginTop: 2, textTransform: 'capitalize' },
  calloutBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  calloutPrice: { fontSize: 18, fontWeight: '800', color: Colors.primary },
  calloutConfig: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  viewBtnText: { fontSize: 13, fontWeight: '600', color: Colors.white },
});
