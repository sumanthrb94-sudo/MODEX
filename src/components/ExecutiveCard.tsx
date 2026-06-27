import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Executive } from '@/constants/types';

interface Props {
  executive: Executive;
  onEnquire: () => void;
}

export default function ExecutiveCard({ executive, onEnquire }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <Image source={{ uri: executive.photo }} style={styles.photo} />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{executive.name}</Text>
          <Text style={styles.role}>{executive.role}</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="star" size={12} color={Colors.gold} />
              <Text style={styles.metaText}>{executive.rating}</Text>
            </View>
            <Text style={styles.dot}>·</Text>
            <Text style={styles.metaText}>{executive.dealsClosed}+ deals</Text>
            <Text style={styles.dot}>·</Text>
            <Text style={styles.metaText}>{executive.experienceYears} yrs</Text>
          </View>
        </View>
      </View>

      <View style={styles.langRow}>
        <Ionicons name="chatbubbles-outline" size={13} color={Colors.textMuted} />
        <Text style={styles.langText}>Speaks {executive.languages.join(', ')}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.callBtn}
          onPress={() => Linking.openURL(`tel:${executive.phone}`)}
        >
          <Ionicons name="call" size={16} color={Colors.primary} />
          <Text style={styles.callText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.enquireBtn} onPress={onEnquire}>
          <Ionicons name="chatbox-ellipses" size={16} color={Colors.white} />
          <Text style={styles.enquireText}>Enquire Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: 12 },
  top: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  photo: { width: 60, height: 60, borderRadius: 30, backgroundColor: Colors.border },
  name: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  role: { fontSize: 12, color: Colors.gold, fontWeight: '600', marginTop: 1 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
  dot: { color: Colors.textMuted },
  langRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  langText: { fontSize: 12, color: Colors.textMuted },
  actions: { flexDirection: 'row', gap: 10 },
  callBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 11, borderRadius: 10, borderWidth: 1.5, borderColor: Colors.primary,
  },
  callText: { fontSize: 14, fontWeight: '600', color: Colors.primary },
  enquireBtn: {
    flex: 1.6, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 11, borderRadius: 10, backgroundColor: Colors.primary,
  },
  enquireText: { fontSize: 14, fontWeight: '700', color: Colors.white },
});
