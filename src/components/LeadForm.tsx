import React, { useState } from 'react';
import {
  Modal, View, Text, StyleSheet, TextInput, TouchableOpacity, Linking, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useLeadStore } from '@/store/leadStore';
import { Executive, LeadType, Project } from '@/constants/types';
import PropertyImage from '@/components/PropertyImage';

interface Props {
  visible: boolean;
  onClose: () => void;
  type: LeadType;
  project?: Project;
  executive?: Executive;
}

const TITLES: Record<LeadType, string> = {
  enquiry: 'Enquire Now',
  callback: 'Request a Callback',
  site_visit: 'Book a Site Visit',
  interior: 'Get Interior Design Quote',
};

const SUBTITLES: Record<LeadType, string> = {
  enquiry: 'Get full details, pricing & availability',
  callback: 'Our advisor will call you back shortly',
  site_visit: 'Pick a slot and visit the property',
  interior: 'Free consultation with MODEX Interiors',
};

export default function LeadForm({ visible, onClose, type, project, executive }: Props) {
  const addLead = useLeadStore((s) => s.addLead);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const reset = () => {
    setName('');
    setPhone('');
    setMessage('');
    setSubmitted(false);
  };

  const close = () => {
    reset();
    onClose();
  };

  const valid = name.trim().length > 1 && phone.replace(/\D/g, '').length >= 10;

  const submit = () => {
    if (!valid) return;
    addLead({
      type,
      name: name.trim(),
      phone: phone.trim(),
      projectId: project?.id,
      projectName: project?.name,
      executiveId: executive?.id,
      message: message.trim() || undefined,
    });
    setSubmitted(true);

    // Also hand off to WhatsApp so the lead reaches a real human in the demo.
    const to = (executive?.phone ?? project?.developer.phone ?? '+919876543210').replace(/\D/g, '');
    const ctx = project ? ` regarding *${project.name}* (${project.location.area})` : '';
    const intro =
      type === 'interior'
        ? `Hi, I'd like an interior design consultation${ctx}.`
        : type === 'callback'
        ? `Hi, please call me back${ctx}.`
        : `Hi, I'm interested${ctx}. Please share details.`;
    const text = encodeURIComponent(`${intro}\n\nName: ${name}\nPhone: ${phone}${message ? `\nNote: ${message}` : ''}`);
    Linking.openURL(`https://wa.me/${to}?text=${text}`).catch(() => {});
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={close}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          {submitted ? (
            <View style={styles.success}>
              <View style={styles.successIcon}>
                <Ionicons name="checkmark" size={36} color={Colors.white} />
              </View>
              <Text style={styles.successTitle}>Request received!</Text>
              <Text style={styles.successText}>
                {executive ? `${executive.name} will reach out to you shortly.` : 'Our team will contact you shortly.'}
              </Text>
              <TouchableOpacity style={styles.primaryBtn} onPress={close}>
                <Text style={styles.primaryBtnText}>Done</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <View style={styles.headerRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>{TITLES[type]}</Text>
                  <Text style={styles.subtitle}>{SUBTITLES[type]}</Text>
                </View>
                <TouchableOpacity onPress={close} hitSlop={8}>
                  <Ionicons name="close" size={24} color={Colors.textMuted} />
                </TouchableOpacity>
              </View>

              {executive && (
                <View style={styles.execRow}>
                  <PropertyImage uri={executive.photo} style={styles.execPhoto} fallbackIcon="person" iconSize={20} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.execName}>{executive.name}</Text>
                    <Text style={styles.execRole}>{executive.role}</Text>
                  </View>
                  <View style={styles.execRating}>
                    <Ionicons name="star" size={12} color={Colors.gold} />
                    <Text style={styles.execRatingText}>{executive.rating}</Text>
                  </View>
                </View>
              )}

              <Text style={styles.label}>Your Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Full name"
                placeholderTextColor={Colors.textMuted}
              />

              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="10-digit mobile number"
                placeholderTextColor={Colors.textMuted}
                keyboardType="phone-pad"
              />

              <Text style={styles.label}>Message (optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={message}
                onChangeText={setMessage}
                placeholder="Anything specific you're looking for?"
                placeholderTextColor={Colors.textMuted}
                multiline
              />

              <TouchableOpacity
                style={[styles.primaryBtn, !valid && styles.primaryBtnDisabled]}
                onPress={submit}
                disabled={!valid}
              >
                <Ionicons name="logo-whatsapp" size={18} color={Colors.white} />
                <Text style={styles.primaryBtnText}>Submit & Chat on WhatsApp</Text>
              </TouchableOpacity>
              <Text style={styles.disclaimer}>
                By submitting, you agree to be contacted by MODEX about this enquiry.
              </Text>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 32,
    maxHeight: '90%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: 16,
  },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  subtitle: { fontSize: 13, color: Colors.textMuted, marginTop: 2 },
  execRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.offWhite,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  execPhoto: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.border },
  execName: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  execRole: { fontSize: 12, color: Colors.textMuted },
  execRating: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  execRatingText: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  label: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginBottom: 6, marginTop: 4 },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.textPrimary,
    backgroundColor: Colors.offWhite,
    marginBottom: 12,
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.success,
    borderRadius: 12,
    paddingVertical: 15,
    marginTop: 8,
  },
  primaryBtnDisabled: { backgroundColor: Colors.textMuted },
  primaryBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white },
  disclaimer: { fontSize: 11, color: Colors.textMuted, textAlign: 'center', marginTop: 12 },
  success: { alignItems: 'center', paddingVertical: 24, gap: 10 },
  successIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  successTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  successText: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', paddingHorizontal: 20 },
});
