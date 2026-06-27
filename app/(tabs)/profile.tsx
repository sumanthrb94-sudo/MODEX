import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '@/constants/colors';
import { useSavedStore } from '@/store/savedStore';
import { useLeadStore } from '@/store/leadStore';
import { LeadType } from '@/constants/types';

const MENU_ITEMS = [
  { icon: 'location-outline', label: 'Saved Locations', sub: 'Manage your commute locations' },
  { icon: 'notifications-outline', label: 'Alerts', sub: 'New listings & price drops' },
  { icon: 'calculator-outline', label: 'EMI Calculator', sub: 'Calculate your monthly EMI' },
  { icon: 'shield-checkmark-outline', label: 'Verified Listings', sub: 'RERA & HMDA verified only' },
  { icon: 'help-circle-outline', label: 'Help & Support', sub: 'FAQs and contact' },
  { icon: 'information-circle-outline', label: 'About MODEX', sub: 'Version 1.0.0' },
];

const LEAD_META: Record<LeadType, { icon: string; label: string; color: string }> = {
  enquiry: { icon: 'chatbox-ellipses', label: 'Enquiry', color: Colors.info },
  callback: { icon: 'call', label: 'Callback', color: Colors.warning },
  site_visit: { icon: 'calendar', label: 'Site Visit', color: Colors.success },
  interior: { icon: 'color-palette', label: 'Interior', color: Colors.gold },
};

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { savedIds } = useSavedStore();
  const { leads, removeLead } = useLeadStore();
  const visitCount = leads.filter((l) => l.type === 'site_visit').length;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient colors={Gradients.primaryBrand} style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>JD</Text>
        </View>
        <Text style={styles.name}>Welcome to MODEX</Text>
        <Text style={styles.tagline}>Your Premium Real Estate Companion</Text>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{savedIds.length}</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNum}>{visitCount}</Text>
            <Text style={styles.statLabel}>Site Visits</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNum}>{leads.length}</Text>
            <Text style={styles.statLabel}>Enquiries</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* My Enquiries — the unified lead pipeline */}
        {leads.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardHeader}>My Enquiries</Text>
            {leads.map((lead) => {
              const meta = LEAD_META[lead.type];
              return (
                <View key={lead.id} style={[styles.menuItem, styles.menuItemBorder]}>
                  <View style={[styles.leadIcon, { backgroundColor: meta.color + '18' }]}>
                    <Ionicons name={meta.icon as any} size={18} color={meta.color} />
                  </View>
                  <View style={styles.menuText}>
                    <Text style={styles.menuLabel}>
                      {meta.label}
                      {lead.projectName ? ` · ${lead.projectName}` : ''}
                    </Text>
                    <Text style={styles.menuSub}>
                      {lead.type === 'site_visit' && lead.visitDate
                        ? `${lead.visitDate} at ${lead.visitTime}`
                        : `Status: ${lead.status}`}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => removeLead(lead.id)} hitSlop={8}>
                    <Ionicons name="trash-outline" size={18} color={Colors.textMuted} />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}

        <View style={styles.card}>
          {MENU_ITEMS.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.menuItem, i < MENU_ITEMS.length - 1 && styles.menuItemBorder]}
              activeOpacity={0.7}
            >
              <View style={styles.menuIcon}>
                <Ionicons name={item.icon as any} size={22} color={Colors.primary} />
              </View>
              <View style={styles.menuText}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuSub}>{item.sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.footer}>MODEX · Real Estate Discovery Platform</Text>
        <Text style={styles.footerSub}>Data for Hyderabad region · build 2026.06.27-b</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  header: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 26, fontWeight: '800', color: Colors.primary },
  name: { fontSize: 20, fontWeight: '800', color: Colors.white },
  tagline: { fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 4 },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 0,
  },
  stat: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 22, fontWeight: '800', color: Colors.white },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  statDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.2)' },
  body: { padding: 16, gap: 12 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  menuItemBorder: { borderBottomWidth: 1, borderColor: Colors.border },
  cardHeader: {
    fontSize: 14, fontWeight: '700', color: Colors.textPrimary,
    paddingHorizontal: 16, paddingTop: 14, paddingBottom: 4,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leadIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: { flex: 1 },
  menuLabel: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  menuSub: { fontSize: 12, color: Colors.textMuted, marginTop: 1 },
  footer: { textAlign: 'center', fontSize: 13, fontWeight: '600', color: Colors.textMuted, marginTop: 8 },
  footerSub: { textAlign: 'center', fontSize: 11, color: Colors.textMuted, marginTop: 2, marginBottom: 12 },
});
