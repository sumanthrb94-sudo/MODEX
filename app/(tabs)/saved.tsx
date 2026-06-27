import React from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '@/constants/colors';
import { useSavedStore } from '@/store/savedStore';
import { projects } from '@/data/projects';
import ProjectCard from '@/components/ProjectCard';

export default function SavedScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { savedIds, compareIds } = useSavedStore();
  const savedProjects = projects.filter((p) => savedIds.includes(p.id));
  const compareProjects = projects.filter((p) => compareIds.includes(p.id));

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient colors={Gradients.primaryBrand} style={styles.header}>
        <Text style={styles.title}>Saved Properties</Text>
        <Text style={styles.subtitle}>{savedIds.length} properties saved</Text>
      </LinearGradient>

      <FlatList
        data={savedProjects}
        keyExtractor={(p) => p.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          compareIds.length > 0 ? (
            <TouchableOpacity style={styles.compareBanner} onPress={() => router.push('/compare')}>
              <View style={styles.compareBannerLeft}>
                <Ionicons name="git-compare" size={20} color={Colors.gold} />
                <Text style={styles.compareBannerText}>
                  {compareIds.length} projects in compare list
                </Text>
              </View>
              <View style={styles.compareBannerBtn}>
                <Text style={styles.compareBannerBtnText}>Compare</Text>
              </View>
            </TouchableOpacity>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="bookmark-outline" size={60} color={Colors.border} />
            <Text style={styles.emptyTitle}>No saved properties</Text>
            <Text style={styles.emptyText}>Tap the bookmark icon on any project to save it here</Text>
            <TouchableOpacity style={styles.exploreBtn} onPress={() => router.push('/')}>
              <Text style={styles.exploreBtnText}>Explore Projects</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => <ProjectCard project={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: { fontSize: 24, fontWeight: '800', color: Colors.white },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.6)', marginTop: 4 },
  list: { padding: 16 },
  compareBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  compareBannerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  compareBannerText: { fontSize: 14, fontWeight: '600', color: Colors.white },
  compareBannerBtn: {
    backgroundColor: Colors.gold,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  compareBannerBtnText: { fontSize: 13, fontWeight: '700', color: Colors.primary },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 12,
    paddingHorizontal: 40,
  },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary },
  emptyText: { fontSize: 14, color: Colors.textMuted, textAlign: 'center', lineHeight: 20 },
  exploreBtn: {
    marginTop: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  exploreBtnText: { fontSize: 15, fontWeight: '600', color: Colors.white },
});
