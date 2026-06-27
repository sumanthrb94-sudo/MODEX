import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  onFocus?: () => void;
  readOnly?: boolean;
  onPress?: () => void;
}

export default function SearchBar({ value, onChangeText, onSubmit, placeholder, onFocus, readOnly, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={readOnly ? 0.7 : 1} style={styles.container}>
      <Ionicons name="search" size={20} color={Colors.textMuted} style={styles.icon} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder ?? 'Search area, project, or developer...'}
        placeholderTextColor={Colors.textMuted}
        style={styles.input}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
        editable={!readOnly}
        onFocus={onFocus}
      />
      {value.length > 0 && !readOnly && (
        <TouchableOpacity onPress={() => onChangeText('')}>
          <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
    padding: 0,
  },
});
