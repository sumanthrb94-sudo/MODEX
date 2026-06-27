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
  autoFocus?: boolean;
}

export default function SearchBar({
  value,
  onChangeText,
  onSubmit,
  placeholder,
  onFocus,
  readOnly,
  onPress,
  autoFocus,
}: Props) {
  // Read-only mode: the whole bar is a button that navigates elsewhere.
  if (readOnly) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.container}>
        <Ionicons name="search" size={20} color={Colors.textMuted} style={styles.icon} />
        <View style={styles.input}>
          <PlaceholderText text={placeholder ?? 'Search area, project, or developer...'} />
        </View>
      </TouchableOpacity>
    );
  }

  // Editable mode: render the TextInput directly (NOT wrapped in a touchable),
  // otherwise the touchable swallows focus/keystrokes on web.
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color={Colors.textMuted} style={styles.icon} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder ?? 'Search area, project, or developer...'}
        placeholderTextColor={Colors.textMuted}
        style={styles.input}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
        onFocus={onFocus}
        autoFocus={autoFocus}
        autoCorrect={false}
        autoCapitalize="none"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')} hitSlop={8}>
          <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );
}

function PlaceholderText({ text }: { text: string }) {
  return (
    <TextInput
      editable={false}
      pointerEvents="none"
      value=""
      placeholder={text}
      placeholderTextColor={Colors.textMuted}
      style={styles.placeholderInput}
    />
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
  placeholderInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
    padding: 0,
  },
});
