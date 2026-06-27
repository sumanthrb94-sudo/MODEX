import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Colors, Gradients } from '@/constants/colors';
import { Project } from '@/constants/types';
import { useSavedStore } from '@/store/savedStore';
import { formatPrice, possessionLabel, possessionColor } from '@/utils/format';
import PropertyImage from '@/components/PropertyImage';

const CARD_WIDTH = Dimensions.get('window').width - 32;

interface Props {
  project: Project;
  compact?: boolean;
  horizontal?: boolean;
}

export default function ProjectCard({ project, compact, horizontal }: Props) {
  const router = useRouter();
  const { toggleSave, isSaved, toggleCompare, isInCompare } = useSavedStore();
  const saved = isSaved(project.id);
  const inCompare = isInCompare(project.id);

  const cardStyle = horizontal
    ? [styles.card, styles.cardHorizontal]
    : compact
    ? [styles.card, styles.cardCompact]
    : styles.card;

  return (
    <TouchableOpacity
      style={cardStyle}
      activeOpacity={0.92}
      onPress={() => router.push(`/project/${project.id}`)}
    >
      <View style={styles.imageContainer}>
        <PropertyImage
          uri={project.images[0]}
          type={project.type}
          style={styles.image}
        />
        <LinearGradient colors={Gradients.cardOverlay} style={styles.gradient} />

        <View style={styles.topRow}>
          <View style={[styles.badge, { backgroundColor: possessionColor(project.possession.status) }]}>
            <Text style={styles.badgeText}>{possessionLabel(project.possession.status)}</Text>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionBtn, inCompare && styles.actionBtnActive]}
              onPress={() => toggleCompare(project.id)}
            >
              <Ionicons
                name={inCompare ? 'git-compare' : 'git-compare-outline'}
                size={16}
                color={inCompare ? Colors.gold : Colors.white}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, saved && styles.actionBtnActive]}
              onPress={() => toggleSave(project.id)}
            >
              <Ionicons
                name={saved ? 'bookmark' : 'bookmark-outline'}
                size={16}
                color={saved ? Colors.gold : Colors.white}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.scoreTag}>
          <Ionicons name="trending-up" size={12} color={Colors.gold} />
          <Text style={styles.scoreText}>{project.investmentScore}</Text>
        </View>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{project.name}</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={13} color={Colors.textMuted} />
          <Text style={styles.location} numberOfLines={1}>
            {project.location.area}, {project.location.city}
          </Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatPrice(project.pricing.minPrice)}</Text>
          {project.pricing.maxPrice > project.pricing.minPrice && (
            <Text style={styles.priceSep}> – {formatPrice(project.pricing.maxPrice)}</Text>
          )}
        </View>

        {!compact && (
          <View style={styles.configRow}>
            {project.specifications.configurations.slice(0, 3).map((c) => (
              <View key={c} style={styles.configChip}>
                <Text style={styles.configText}>{c}</Text>
              </View>
            ))}
            {project.specifications.configurations.length > 3 && (
              <Text style={styles.more}>+{project.specifications.configurations.length - 3}</Text>
            )}
          </View>
        )}

        <View style={styles.developerRow}>
          <Ionicons name="business-outline" size={12} color={Colors.textMuted} />
          <Text style={styles.developer} numberOfLines={1}>{project.developer.name}</Text>
          {project.approvals.rera && (
            <View style={styles.reraTag}>
              <Text style={styles.reraText}>RERA</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  cardCompact: {
    width: 240,
    marginRight: 12,
    marginBottom: 0,
  },
  cardHorizontal: {
    width: CARD_WIDTH,
    flexDirection: 'row',
    height: 120,
    marginBottom: 12,
  },
  imageContainer: {
    height: 180,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  topRow: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.white,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnActive: {
    backgroundColor: Colors.primary,
  },
  scoreTag: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.gold,
  },
  info: {
    padding: 14,
    gap: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  location: {
    fontSize: 13,
    color: Colors.textMuted,
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.primary,
  },
  priceSep: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  configRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  configChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: Colors.offWhite,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  configText: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  more: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  developerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  developer: {
    fontSize: 12,
    color: Colors.textMuted,
    flex: 1,
  },
  reraTag: {
    backgroundColor: Colors.success + '22',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  reraText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.success,
  },
});
