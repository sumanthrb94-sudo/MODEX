import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList, Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '@/constants/colors';
import { getProjectById } from '@/data/projects';
import { useSavedStore } from '@/store/savedStore';
import { formatPrice, possessionLabel, possessionColor, propertyTypeLabel } from '@/utils/format';
import InvestmentScore from '@/components/InvestmentScore';
import TravelTimeWidget from '@/components/TravelTimeWidget';

const NEARBY_ICONS: Record<string, any> = {
  airport: 'airplane',
  it_park: 'laptop',
  school: 'school',
  hospital: 'medkit',
  metro: 'train',
  mall: 'cart',
  highway: 'car',
};

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { toggleSave, isSaved } = useSavedStore();
  const { savedLocations } = useSavedStore();
  const [activeImage, setActiveImage] = useState(0);

  const project = getProjectById(id as string);

  if (!project) {
    return (
      <View style={styles.notFound}>
        <Text>Project not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: Colors.primary }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const saved = isSaved(project.id);

  const callDeveloper = () => {
    Linking.openURL(`tel:${project.developer.phone}`);
  };

  const whatsApp = () => {
    const phone = project.developer.phone.replace(/\D/g, '');
    const msg = encodeURIComponent(`Hi, I'm interested in ${project.name}. Please share more details.`);
    Linking.openURL(`https://wa.me/${phone}?text=${msg}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Image Gallery */}
        <View style={styles.gallery}>
          <FlatList
            data={project.images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => String(i)}
            onMomentumScrollEnd={(e) => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width);
              setActiveImage(idx);
            }}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.galleryImage} resizeMode="cover" />
            )}
          />
          <LinearGradient colors={Gradients.heroOverlay} style={styles.galleryGradient} />

          {/* Dots */}
          <View style={styles.dots}>
            {project.images.map((_, i) => (
              <View key={i} style={[styles.dot, i === activeImage && styles.dotActive]} />
            ))}
          </View>

          {/* Header Buttons */}
          <View style={[styles.galleryHeader, { top: insets.top + 10 }]}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={20} color={Colors.white} />
            </TouchableOpacity>
            <View style={styles.galleryHeaderRight}>
              <TouchableOpacity style={styles.iconBtn} onPress={() => toggleSave(project.id)}>
                <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={20} color={saved ? Colors.gold : Colors.white} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Type + Status Badge */}
          <View style={styles.galleryBadges}>
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>{propertyTypeLabel(project.type)}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: possessionColor(project.possession.status) }]}>
              <Text style={styles.statusText}>{possessionLabel(project.possession.status)}</Text>
            </View>
          </View>
        </View>

        {/* Title + Price */}
        <View style={styles.section}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.projectName}>{project.name}</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location" size={14} color={Colors.gold} />
                <Text style={styles.locationText}>{project.location.address}</Text>
              </View>
            </View>
            <InvestmentScore score={project.investmentScore} />
          </View>

          <View style={styles.priceRow}>
            <View>
              <Text style={styles.priceLabel}>Starting from</Text>
              <Text style={styles.price}>{formatPrice(project.pricing.minPrice)}</Text>
              {project.pricing.maxPrice > project.pricing.minPrice && (
                <Text style={styles.priceTo}>up to {formatPrice(project.pricing.maxPrice)}</Text>
              )}
            </View>
            {project.pricing.pricePerSqft && (
              <View style={styles.psf}>
                <Text style={styles.psfNum}>₹{project.pricing.pricePerSqft.toLocaleString('en-IN')}</Text>
                <Text style={styles.psfLabel}>per sqft</Text>
              </View>
            )}
          </View>
        </View>

        {/* Configurations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurations</Text>
          <View style={styles.configGrid}>
            {project.specifications.configurations.map((c) => (
              <View key={c} style={styles.configCard}>
                <Text style={styles.configName}>{c}</Text>
                <Text style={styles.configArea}>
                  {project.specifications.minArea}–{project.specifications.maxArea} {project.specifications.areaUnit}
                </Text>
              </View>
            ))}
          </View>
          {project.specifications.totalUnits && (
            <View style={styles.unitsRow}>
              <View style={styles.unitStat}>
                <Text style={styles.unitNum}>{project.specifications.totalUnits}</Text>
                <Text style={styles.unitLabel}>Total Units</Text>
              </View>
              <View style={styles.unitStat}>
                <Text style={[styles.unitNum, { color: Colors.success }]}>
                  {project.specifications.availableUnits}
                </Text>
                <Text style={styles.unitLabel}>Available</Text>
              </View>
              {project.possession.constructionPct !== undefined && (
                <View style={styles.unitStat}>
                  <Text style={[styles.unitNum, { color: Colors.warning }]}>
                    {project.possession.constructionPct}%
                  </Text>
                  <Text style={styles.unitLabel}>Complete</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About this Project</Text>
          <Text style={styles.description}>{project.description}</Text>
          <View style={styles.highlights}>
            {project.highlights.map((h) => (
              <View key={h} style={styles.highlightRow}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                <Text style={styles.highlightText}>{h}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Approvals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Approvals & Certifications</Text>
          <View style={styles.approvals}>
            {project.approvals.rera && (
              <View style={styles.approvalCard}>
                <Ionicons name="shield-checkmark" size={20} color={Colors.success} />
                <View>
                  <Text style={styles.approvalType}>RERA Registered</Text>
                  <Text style={styles.approvalNum}>{project.approvals.rera}</Text>
                </View>
              </View>
            )}
            {project.approvals.hmda && (
              <View style={styles.approvalCard}>
                <Ionicons name="shield-checkmark" size={20} color={Colors.success} />
                <View>
                  <Text style={styles.approvalType}>HMDA Approved</Text>
                  <Text style={styles.approvalNum}>{project.approvals.hmda}</Text>
                </View>
              </View>
            )}
            {project.approvals.dtcp && (
              <View style={styles.approvalCard}>
                <Ionicons name="shield-checkmark" size={20} color={Colors.success} />
                <View>
                  <Text style={styles.approvalType}>DTCP Approved</Text>
                  <Text style={styles.approvalNum}>{project.approvals.dtcp}</Text>
                </View>
              </View>
            )}
            {!project.approvals.rera && !project.approvals.hmda && !project.approvals.dtcp && (
              <View style={styles.approvalCard}>
                <Ionicons name="time" size={20} color={Colors.warning} />
                <Text style={styles.approvalType}>Approvals in process</Text>
              </View>
            )}
          </View>
        </View>

        {/* Amenities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesGrid}>
            {project.amenities.map((a) => (
              <View key={a} style={styles.amenityChip}>
                <Ionicons name="checkmark" size={12} color={Colors.primary} />
                <Text style={styles.amenityText}>{a}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Investment Metrics */}
        {(project.rentalYield || project.appreciationPct) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Investment Potential</Text>
            <View style={styles.investRow}>
              {project.rentalYield && (
                <View style={styles.investCard}>
                  <Ionicons name="trending-up" size={24} color={Colors.gold} />
                  <Text style={styles.investNum}>{project.rentalYield}%</Text>
                  <Text style={styles.investLabel}>Rental Yield</Text>
                </View>
              )}
              {project.appreciationPct && (
                <View style={styles.investCard}>
                  <Ionicons name="stats-chart" size={24} color={Colors.success} />
                  <Text style={styles.investNum}>{project.appreciationPct}%</Text>
                  <Text style={styles.investLabel}>Appreciation p.a.</Text>
                </View>
              )}
              <View style={styles.investCard}>
                <Ionicons name="star" size={24} color={Colors.gold} />
                <Text style={styles.investNum}>{project.investmentScore}/100</Text>
                <Text style={styles.investLabel}>Invest. Score</Text>
              </View>
            </View>
          </View>
        )}

        {/* Nearby Places */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nearby Landmarks</Text>
          {project.nearbyPlaces.map((place) => (
            <View key={place.name} style={styles.nearbyRow}>
              <View style={styles.nearbyIcon}>
                <Ionicons name={NEARBY_ICONS[place.type] ?? 'location'} size={18} color={Colors.primary} />
              </View>
              <View style={styles.nearbyInfo}>
                <Text style={styles.nearbyName}>{place.name}</Text>
                <Text style={styles.nearbyDist}>{place.distanceKm} km away</Text>
              </View>
              {place.travelTimeMinutes && (
                <View style={styles.nearbyTime}>
                  <Ionicons name="car-outline" size={14} color={Colors.textMuted} />
                  <Text style={styles.nearbyTimeText}>{place.travelTimeMinutes} min</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Travel Time from Saved Locations */}
        <View style={styles.section}>
          <TravelTimeWidget
            destination={project.location.coordinates}
            savedLocations={savedLocations}
          />
        </View>

        {/* Developer */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Developer</Text>
          <View style={styles.developerCard}>
            <View style={styles.devAvatarWrap}>
              <Text style={styles.devAvatar}>{project.developer.name[0]}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.devName}>{project.developer.name}</Text>
              <Text style={styles.devTagline}>{project.developer.tagline}</Text>
              <View style={styles.devStats}>
                <Text style={styles.devStat}>{project.developer.yearsOfExperience} yrs</Text>
                <Text style={styles.devStatSep}>·</Text>
                <Text style={styles.devStat}>{project.developer.completedProjects} projects</Text>
                <Text style={styles.devStatSep}>·</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                  <Ionicons name="star" size={12} color={Colors.gold} />
                  <Text style={styles.devStat}>{project.developer.rating}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.bottomCta, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity style={styles.callBtn} onPress={callDeveloper}>
          <Ionicons name="call" size={18} color={Colors.primary} />
          <Text style={styles.callBtnText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.waBtn} onPress={whatsApp}>
          <Ionicons name="logo-whatsapp" size={18} color={Colors.white} />
          <Text style={styles.waBtnText}>WhatsApp</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.visitBtn}
          onPress={() => router.push(`/book-visit/${project.id}`)}
        >
          <Ionicons name="calendar" size={18} color={Colors.white} />
          <Text style={styles.visitBtnText}>Book Visit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  gallery: { height: 300, position: 'relative' },
  galleryImage: { width: 375, height: 300 },
  galleryGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 100 },
  dots: {
    position: 'absolute', bottom: 14, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'center', gap: 5,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.4)' },
  dotActive: { backgroundColor: Colors.white, width: 18 },
  galleryHeader: {
    position: 'absolute', left: 16, right: 16,
    flexDirection: 'row', justifyContent: 'space-between',
  },
  galleryHeaderRight: { flexDirection: 'row', gap: 8 },
  iconBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.38)',
    alignItems: 'center', justifyContent: 'center',
  },
  galleryBadges: {
    position: 'absolute', bottom: 14, left: 14,
    flexDirection: 'row', gap: 8,
  },
  typeBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 8,
  },
  typeBadgeText: { fontSize: 11, fontWeight: '600', color: Colors.white, textTransform: 'capitalize' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '600', color: Colors.white },
  section: {
    backgroundColor: Colors.white, marginHorizontal: 16, marginTop: 12,
    borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 14 },
  projectName: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, marginBottom: 5 },
  locationRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 4 },
  locationText: { fontSize: 12, color: Colors.textMuted, flex: 1, lineHeight: 17 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  priceLabel: { fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  price: { fontSize: 26, fontWeight: '800', color: Colors.primary },
  priceTo: { fontSize: 14, color: Colors.textSecondary, marginTop: 2 },
  psf: { alignItems: 'flex-end' },
  psfNum: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  psfLabel: { fontSize: 11, color: Colors.textMuted },
  configGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  configCard: {
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 10,
  },
  configName: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  configArea: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  unitsRow: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: 12, borderTopWidth: 1, borderColor: Colors.border },
  unitStat: { alignItems: 'center', gap: 3 },
  unitNum: { fontSize: 22, fontWeight: '800', color: Colors.primary },
  unitLabel: { fontSize: 11, color: Colors.textMuted },
  description: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },
  highlights: { gap: 8, marginTop: 14 },
  highlightRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  highlightText: { fontSize: 13, color: Colors.textPrimary, fontWeight: '500', flex: 1 },
  approvals: { gap: 10 },
  approvalCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.success + '10',
    borderRadius: 10, padding: 12,
    borderWidth: 1, borderColor: Colors.success + '30',
  },
  approvalType: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  approvalNum: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  amenitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  amenityChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 8, backgroundColor: Colors.offWhite,
    borderWidth: 1, borderColor: Colors.border,
  },
  amenityText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
  investRow: { flexDirection: 'row', gap: 12 },
  investCard: {
    flex: 1, alignItems: 'center', gap: 6,
    backgroundColor: Colors.offWhite, borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: Colors.border,
  },
  investNum: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  investLabel: { fontSize: 11, color: Colors.textMuted, textAlign: 'center' },
  nearbyRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 10, borderBottomWidth: 1, borderColor: Colors.border,
  },
  nearbyIcon: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: Colors.primary + '12',
    alignItems: 'center', justifyContent: 'center',
  },
  nearbyInfo: { flex: 1 },
  nearbyName: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  nearbyDist: { fontSize: 12, color: Colors.textMuted },
  nearbyTime: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  nearbyTimeText: { fontSize: 12, fontWeight: '500', color: Colors.textSecondary },
  developerCard: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  devAvatarWrap: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  devAvatar: { fontSize: 20, fontWeight: '800', color: Colors.gold },
  devName: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  devTagline: { fontSize: 12, color: Colors.textMuted, marginTop: 2, fontStyle: 'italic' },
  devStats: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6 },
  devStat: { fontSize: 12, fontWeight: '500', color: Colors.textSecondary },
  devStatSep: { color: Colors.textMuted },
  bottomCta: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', gap: 10,
    backgroundColor: Colors.white,
    paddingHorizontal: 16, paddingTop: 12,
    borderTopWidth: 1, borderColor: Colors.border,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 8,
  },
  callBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 13, borderRadius: 12,
    borderWidth: 1.5, borderColor: Colors.primary,
  },
  callBtnText: { fontSize: 14, fontWeight: '600', color: Colors.primary },
  waBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 13, borderRadius: 12, backgroundColor: '#25D366',
  },
  waBtnText: { fontSize: 14, fontWeight: '600', color: Colors.white },
  visitBtn: {
    flex: 1.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 13, borderRadius: 12, backgroundColor: Colors.primary,
  },
  visitBtnText: { fontSize: 14, fontWeight: '700', color: Colors.white },
});
