import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import maplibregl from 'maplibre-gl';
import { Colors } from '@/constants/colors';
import { useSearch } from '@/hooks/useSearch';
import { useSearchStore } from '@/store/searchStore';
import { formatPrice, propertyTypeLabel } from '@/utils/format';
import { aqiCategory, noiseCategory, livabilityCategory } from '@/data/environment';
import { Project } from '@/constants/types';

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

const HYD_CENTER: [number, number] = [78.4400, 17.3600];
const STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty';

const AREAS = [
  'All', 'Kokapet', 'Financial District', 'Narsingi', 'Tukkuguda',
  'Shamshabad', 'Chevella', 'Shankarpally', 'Shadnagar', 'Gachibowli', 'Jubilee Hills',
];

function popupHTML(p: Project): string {
  const env = p.environment;
  const liv = env ? livabilityCategory(env.livabilityScore) : null;
  const aq = env ? aqiCategory(env.aqi) : null;
  const ns = env ? noiseCategory(env.noiseDb) : null;
  const chip = (label: string, value: string, color: string) =>
    `<div style="flex:1;text-align:center;padding:6px 4px;background:${color}14;border-radius:8px">
       <div style="font-size:13px;font-weight:800;color:${color}">${value}</div>
       <div style="font-size:9px;color:#5A6478;letter-spacing:.3px">${label}</div>
     </div>`;
  return `
    <div style="width:236px;font-family:system-ui,-apple-system,sans-serif">
      <div style="position:relative;height:118px">
        <img src="${p.images[0]}" style="width:100%;height:100%;object-fit:cover" />
        <div style="position:absolute;top:8px;left:8px;background:${TYPE_COLORS[p.type]};color:#fff;font-size:10px;font-weight:700;padding:3px 8px;border-radius:6px;text-transform:uppercase;letter-spacing:.4px">${propertyTypeLabel(p.type)}</div>
      </div>
      <div style="padding:10px 12px 12px">
        <div style="font-size:14px;font-weight:800;color:#0A1628">${p.name}</div>
        <div style="font-size:11px;color:#9BA3AF;margin:2px 0 6px">${p.location.area}, ${p.location.city}</div>
        <div style="font-size:15px;font-weight:800;color:#0A1628;margin-bottom:8px">${formatPrice(p.pricing.minPrice)} <span style="font-size:11px;font-weight:500;color:#9BA3AF">onwards</span></div>
        ${env ? `<div style="display:flex;gap:6px;margin-bottom:10px">
          ${chip('LIVABILITY', String(env.livabilityScore), liv!.color)}
          ${chip('AQI', String(env.aqi), aq!.color)}
          ${chip('NOISE', env.noiseDb + 'dB', ns!.color)}
        </div>` : ''}
        <button data-project="${p.id}" style="width:100%;background:#0A1628;color:#fff;border:none;border-radius:9px;padding:10px;font-size:13px;font-weight:700;cursor:pointer">View Property →</button>
      </div>
    </div>`;
}

export default function MapWebScreen() {
  const insets = useSafeAreaInsets();
  const { projects } = useSearch();
  const { filters, resetFilters } = useSearchStore();
  const router = useRouter();
  const [activeArea, setActiveArea] = useState('All');
  const [localQ, setLocalQ] = useState('');
  const [mapError, setMapError] = useState(false);

  const mapContainer = useRef<any>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [mapReady, setMapReady] = useState(false);

  const displayed = projects.filter((p) => {
    const areaMatch = activeArea === 'All' || p.location.area.toLowerCase().includes(activeArea.toLowerCase());
    const qMatch = localQ === '' || p.name.toLowerCase().includes(localQ.toLowerCase()) ||
      p.location.area.toLowerCase().includes(localQ.toLowerCase());
    return areaMatch && qMatch;
  });

  // Surface filters carried over from search so the map shows what was searched.
  const activeChips: string[] = [];
  if (filters.query) activeChips.push(`"${filters.query}"`);
  filters.types.forEach((t) => activeChips.push(propertyTypeLabel(t)));
  filters.possessionStatus.forEach((s) => activeChips.push(s.replace('_', ' ')));
  if (filters.maxPrice < 150000000) activeChips.push(`under ${formatPrice(filters.maxPrice)}`);

  // Initialise the map once.
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;
    try {
      const map = new maplibregl.Map({
        container: mapContainer.current as HTMLElement,
        style: STYLE_URL,
        center: HYD_CENTER,
        zoom: 10.2,
        pitch: 48, // 3D tilt
        bearing: -17,
        attributionControl: { compact: true },
      });
      map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');
      map.on('load', () => {
        // Reveal 3D building extrusions when zoomed in.
        try {
          const layers = map.getStyle().layers ?? [];
          const has3D = layers.some((l) => l.id === '3d-buildings');
          if (!has3D) {
            const labelLayer = layers.find((l) => l.type === 'symbol');
            map.addLayer(
              {
                id: '3d-buildings',
                source: 'openmaptiles',
                'source-layer': 'building',
                type: 'fill-extrusion',
                minzoom: 13,
                paint: {
                  'fill-extrusion-color': '#c7cdd6',
                  'fill-extrusion-height': ['coalesce', ['get', 'render_height'], 12],
                  'fill-extrusion-base': ['coalesce', ['get', 'render_min_height'], 0],
                  'fill-extrusion-opacity': 0.85,
                },
              },
              labelLayer?.id,
            );
          }
        } catch {
          /* style without building layer — fine, skip 3D buildings */
        }
        setMapReady(true);
      });
      map.on('error', () => {
        // Tile/style load failures shouldn't crash the screen.
      });
      mapRef.current = map;
    } catch {
      setMapError(true);
    }
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // (Re)draw markers when the filtered list changes.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    displayed.forEach((p) => {
      const el = document.createElement('div');
      el.style.cssText = `
        display:flex;align-items:center;gap:4px;
        background:${TYPE_COLORS[p.type] ?? '#0A1628'};
        color:#fff;font:700 11px system-ui,sans-serif;
        padding:5px 9px;border-radius:20px;cursor:pointer;
        box-shadow:0 2px 8px rgba(0,0,0,0.3);border:2px solid #fff;white-space:nowrap;`;
      el.textContent = formatPrice(p.pricing.minPrice);

      const popupEl = document.createElement('div');
      popupEl.innerHTML = popupHTML(p);
      const btn = popupEl.querySelector('button');
      if (btn) btn.addEventListener('click', () => router.push(`/project/${p.id}`));

      const popup = new maplibregl.Popup({ offset: 18, closeButton: true, maxWidth: '260px' }).setDOMContent(popupEl);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([p.location.coordinates.lng, p.location.coordinates.lat])
        .setPopup(popup)
        .addTo(map);

      el.addEventListener('click', () => {
        // Fly in close with a strong 3D tilt to reveal buildings.
        map.flyTo({
          center: [p.location.coordinates.lng, p.location.coordinates.lat],
          zoom: 15.5,
          pitch: 62,
          bearing: -20,
          duration: 1400,
        });
      });

      markersRef.current.push(marker);
    });
  }, [displayed, mapReady, router]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Ionicons name="map" size={22} color={Colors.white} />
          <Text style={styles.headerTitle}>Project Map</Text>
          <Text style={styles.headerCount}>{displayed.length} shown</Text>
        </View>
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

        {activeChips.length > 0 && (
          <View style={styles.activeBar}>
            <Ionicons name="filter" size={13} color={Colors.gold} />
            <Text style={styles.activeText} numberOfLines={1}>
              From search: {activeChips.join(' · ')}
            </Text>
            <TouchableOpacity onPress={resetFilters} hitSlop={8}>
              <Text style={styles.activeClear}>Clear</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* The 3D map */}
      <View style={styles.mapWrap}>
        {mapError ? (
          <View style={styles.mapFallback}>
            <Ionicons name="map-outline" size={40} color={Colors.border} />
            <Text style={styles.mapFallbackText}>Interactive map needs WebGL. Browse the list below.</Text>
          </View>
        ) : (
          <View ref={mapContainer} style={styles.map} />
        )}
        <View style={styles.legend}>
          {Object.entries(TYPE_COLORS).map(([type, color]) => (
            <View key={type} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: color }]} />
              <Text style={styles.legendText}>{propertyTypeLabel(type)}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Browsable list (also a fallback) */}
      <ScrollView style={styles.listWrap} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        <Text style={styles.listHeader}>Tap a marker for livability details · or browse below</Text>
        {displayed.map((p) => {
          const env = p.environment;
          const liv = env ? livabilityCategory(env.livabilityScore) : null;
          return (
            <TouchableOpacity
              key={p.id}
              style={styles.row}
              activeOpacity={0.85}
              onPress={() => {
                const map = mapRef.current;
                if (map) {
                  map.flyTo({
                    center: [p.location.coordinates.lng, p.location.coordinates.lat],
                    zoom: 15.5, pitch: 62, bearing: -20, duration: 1400,
                  });
                }
              }}
            >
              <View style={[styles.rowIcon, { backgroundColor: TYPE_COLORS[p.type] }]}>
                <Ionicons name={TYPE_ICONS[p.type]} size={15} color={Colors.white} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowName} numberOfLines={1}>{p.name}</Text>
                <Text style={styles.rowArea}>{p.location.area} · {formatPrice(p.pricing.minPrice)}</Text>
              </View>
              {env && liv && (
                <View style={[styles.livBadge, { backgroundColor: liv.color + '1A', borderColor: liv.color }]}>
                  <Text style={[styles.livNum, { color: liv.color }]}>{env.livabilityScore}</Text>
                  <Text style={styles.livLabel}>Livability</Text>
                </View>
              )}
              <TouchableOpacity style={styles.viewBtn} onPress={() => router.push(`/project/${p.id}`)}>
                <Text style={styles.viewBtnText}>View</Text>
                <Ionicons name="chevron-forward" size={14} color={Colors.gold} />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity
          style={styles.osmLink}
          onPress={() => Linking.openURL('https://www.openstreetmap.org/#map=11/17.3850/78.4867')}
        >
          <Ionicons name="open-outline" size={14} color={Colors.info} />
          <Text style={styles.osmLinkText}>Open Hyderabad on OpenStreetMap</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  header: { backgroundColor: Colors.primary, paddingHorizontal: 16, paddingBottom: 12, gap: 10 },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 12 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: Colors.white, flex: 1 },
  headerCount: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
  searchRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white,
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: Colors.textPrimary, outlineStyle: 'none' } as any,
  areaFilter: { gap: 6, paddingVertical: 2 },
  areaPill: {
    paddingHorizontal: 13, paddingVertical: 5, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  areaPillActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  areaPillText: { fontSize: 13, fontWeight: '500', color: 'rgba(255,255,255,0.85)' },
  areaPillTextActive: { color: Colors.primary, fontWeight: '700' },
  activeBar: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(201,168,76,0.15)', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 7,
  },
  activeText: { flex: 1, fontSize: 12, color: Colors.white, fontWeight: '500' },
  activeClear: { fontSize: 12, fontWeight: '700', color: Colors.gold },
  mapWrap: { flex: 1.25, position: 'relative', backgroundColor: '#dfe3e8' },
  map: { flex: 1 } as any,
  mapFallback: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, padding: 20 },
  mapFallbackText: { fontSize: 13, color: Colors.textMuted, textAlign: 'center' },
  legend: {
    position: 'absolute', left: 10, bottom: 10,
    backgroundColor: 'rgba(255,255,255,0.94)', borderRadius: 10, padding: 8, gap: 4,
    flexDirection: 'row', flexWrap: 'wrap', maxWidth: 230,
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 6,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4, width: 104 },
  legendDot: { width: 9, height: 9, borderRadius: 5 },
  legendText: { fontSize: 10, color: Colors.textSecondary, fontWeight: '500' },
  listWrap: { flex: 1, backgroundColor: Colors.offWhite },
  list: { padding: 12, paddingBottom: 28, gap: 8 },
  listHeader: { fontSize: 11, color: Colors.textMuted, marginBottom: 4, paddingHorizontal: 2 },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.white, borderRadius: 12, padding: 10,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4,
  },
  rowIcon: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  rowName: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  rowArea: { fontSize: 11, color: Colors.textMuted, marginTop: 1 },
  livBadge: { alignItems: 'center', borderRadius: 8, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 3 },
  livNum: { fontSize: 14, fontWeight: '800' },
  livLabel: { fontSize: 8, color: Colors.textMuted, letterSpacing: 0.2 },
  viewBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  viewBtnText: { fontSize: 12, fontWeight: '700', color: Colors.gold },
  osmLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12 },
  osmLinkText: { fontSize: 12, fontWeight: '600', color: Colors.info },
});
