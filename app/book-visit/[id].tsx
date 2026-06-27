import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { getProjectById } from '@/data/projects';
import { useLeadStore } from '@/store/leadStore';
import { formatPrice } from '@/utils/format';

const TIME_SLOTS = ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'];
const VISIT_TYPES = [
  { id: 'physical', label: 'Site Visit', icon: 'location' },
  { id: 'virtual', label: 'Virtual Tour', icon: 'videocam' },
];

function getDates() {
  const dates: { label: string; dayLabel: string; date: Date }[] = [];
  const today = new Date(2026, 5, 27); // June 27, 2026
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push({
      label: d.getDate().toString(),
      dayLabel: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()],
      date: d,
    });
  }
  return dates;
}

export default function BookVisitScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const project = getProjectById(id as string);
  const addLead = useLeadStore((s) => s.addLead);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [visitType, setVisitType] = useState<'physical' | 'virtual'>('physical');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const dates = getDates();

  if (!project) return null;

  const handleBook = () => {
    if (selectedDate === null || !selectedTime || name.trim().length < 2 || phone.replace(/\D/g, '').length < 10) {
      Alert.alert('Missing Details', 'Please fill in your name, a valid phone number, and pick a date & time.');
      return;
    }

    const dateObj = dates[selectedDate];
    const visitDate = `${dateObj.dayLabel}, ${dateObj.label} Jun 2026`;

    // Record into the unified lead pipeline.
    addLead({
      type: 'site_visit',
      name: name.trim(),
      phone: phone.trim(),
      projectId: project.id,
      projectName: project.name,
      visitDate,
      visitTime: selectedTime,
      visitMode: visitType,
    });

    const msg = encodeURIComponent(
      `Hi, I'd like to book a ${visitType === 'virtual' ? 'virtual tour' : 'site visit'} for *${project.name}*\n\nDate: ${visitDate}\nTime: ${selectedTime}\nName: ${name}\nPhone: ${phone}`,
    );
    const devPhone = project.developer.phone.replace(/\D/g, '');
    Linking.openURL(`https://wa.me/${devPhone}?text=${msg}`).catch(() => {});

    Alert.alert(
      'Visit Requested!',
      `Your ${visitType === 'virtual' ? 'virtual tour' : 'site visit'} for ${project.name} on ${visitDate} at ${selectedTime} has been logged. Our team will confirm shortly.`,
      [{ text: 'Done', onPress: () => router.back() }],
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book a Visit</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* Project Preview */}
        <View style={styles.projectPreview}>
          <View style={{ flex: 1 }}>
            <Text style={styles.projectName}>{project.name}</Text>
            <Text style={styles.projectLoc}>{project.location.area}, {project.location.city}</Text>
            <Text style={styles.projectPrice}>{formatPrice(project.pricing.minPrice)} onwards</Text>
          </View>
          <View style={styles.devInfo}>
            <Text style={styles.devName}>{project.developer.name}</Text>
          </View>
        </View>

        {/* Visit Type */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Visit Type</Text>
          <View style={styles.visitTypeRow}>
            {VISIT_TYPES.map((vt) => (
              <TouchableOpacity
                key={vt.id}
                style={[styles.visitTypeBtn, visitType === vt.id && styles.visitTypeBtnActive]}
                onPress={() => setVisitType(vt.id as 'physical' | 'virtual')}
              >
                <Ionicons
                  name={vt.icon as any}
                  size={18}
                  color={visitType === vt.id ? Colors.white : Colors.textSecondary}
                />
                <Text style={[styles.visitTypeBtnText, visitType === vt.id && styles.visitTypeBtnTextActive]}>
                  {vt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Date Picker */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Select Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.datePicker}>
            {dates.map((d, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.dateCard, selectedDate === i && styles.dateCardActive]}
                onPress={() => setSelectedDate(i)}
              >
                <Text style={[styles.dateDayLabel, selectedDate === i && styles.dateTextActive]}>{d.dayLabel}</Text>
                <Text style={[styles.dateNum, selectedDate === i && styles.dateTextActive]}>{d.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Time Slots */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Preferred Time</Text>
          <View style={styles.timeGrid}>
            {TIME_SLOTS.map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.timeSlot, selectedTime === t && styles.timeSlotActive]}
                onPress={() => setSelectedTime(t)}
              >
                <Text style={[styles.timeSlotText, selectedTime === t && styles.timeSlotTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Your Details</Text>
          <View style={styles.inputField}>
            <Ionicons name="person-outline" size={18} color={Colors.textMuted} />
            <TextInput
              style={styles.input}
              placeholder="Your name"
              placeholderTextColor={Colors.textMuted}
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={[styles.inputField, { marginTop: 10 }]}>
            <Ionicons name="call-outline" size={18} color={Colors.textMuted} />
            <TextInput
              style={styles.input}
              placeholder="Phone number"
              placeholderTextColor={Colors.textMuted}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.note}>
          <Ionicons name="information-circle-outline" size={16} color={Colors.info} />
          <Text style={styles.noteText}>
            Your booking request will be sent via WhatsApp to the developer. They will confirm your visit within 2 hours.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity style={styles.bookBtn} onPress={handleBook}>
          <Ionicons name="logo-whatsapp" size={20} color={Colors.white} />
          <Text style={styles.bookBtnText}>Book via WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: Colors.white, borderBottomWidth: 1, borderColor: Colors.border,
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  body: { padding: 16, gap: 16 },
  projectPreview: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: Colors.white, borderRadius: 14, padding: 14,
    gap: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  projectName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  projectLoc: { fontSize: 12, color: Colors.textMuted, marginTop: 3 },
  projectPrice: { fontSize: 15, fontWeight: '700', color: Colors.primary, marginTop: 6 },
  devInfo: {
    backgroundColor: Colors.offWhite, borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 6,
  },
  devName: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary },
  fieldGroup: {
    backgroundColor: Colors.white, borderRadius: 14, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  fieldLabel: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12 },
  visitTypeRow: { flexDirection: 'row', gap: 10 },
  visitTypeBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 12, borderRadius: 10,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  visitTypeBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  visitTypeBtnText: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  visitTypeBtnTextActive: { color: Colors.white },
  datePicker: { gap: 8 },
  dateCard: {
    alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 10, borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: Colors.offWhite, minWidth: 58,
  },
  dateCardActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  dateDayLabel: { fontSize: 11, fontWeight: '500', color: Colors.textMuted },
  dateNum: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary, marginTop: 2 },
  dateTextActive: { color: Colors.white },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  timeSlot: {
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: 8,
    borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.offWhite,
  },
  timeSlotActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  timeSlotText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  timeSlotTextActive: { color: Colors.white },
  inputField: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.offWhite, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12,
    borderWidth: 1, borderColor: Colors.border,
  },
  input: { flex: 1, fontSize: 15, color: Colors.textPrimary },
  note: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: Colors.info + '12', borderRadius: 10, padding: 12,
    borderWidth: 1, borderColor: Colors.info + '30',
  },
  noteText: { flex: 1, fontSize: 12, color: Colors.textSecondary, lineHeight: 18 },
  footer: {
    backgroundColor: Colors.white, paddingHorizontal: 16, paddingTop: 12,
    borderTopWidth: 1, borderColor: Colors.border,
  },
  bookBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: '#25D366', paddingVertical: 15, borderRadius: 14,
  },
  bookBtnText: { fontSize: 16, fontWeight: '700', color: Colors.white },
});
