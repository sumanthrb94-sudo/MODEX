import React, { useState } from 'react';
import { View, Image, StyleSheet, ImageStyle, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { PropertyType } from '@/constants/types';

const TYPE_ICON: Record<PropertyType, any> = {
  villa: 'home',
  apartment: 'business',
  plot: 'map',
  farmland: 'leaf',
  commercial: 'storefront',
  standalone: 'key',
};

interface Props {
  uri: string;
  type?: PropertyType;
  style?: StyleProp<ImageStyle>;
  resizeMode?: 'cover' | 'contain';
  fallbackIcon?: any;
  iconSize?: number;
}

// Image with a branded placeholder fallback so the UI never shows a blank/broken
// box if a remote image fails to load on the user's network.
export default function PropertyImage({
  uri,
  type = 'apartment',
  style,
  resizeMode = 'cover',
  fallbackIcon,
  iconSize = 40,
}: Props) {
  const [failed, setFailed] = useState(false);

  if (failed || !uri) {
    return (
      <View style={[styles.fallback, style]}>
        <Ionicons name={fallbackIcon ?? TYPE_ICON[type]} size={iconSize} color={Colors.gold} />
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={style}
      resizeMode={resizeMode}
      onError={() => setFailed(true)}
    />
  );
}

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: Colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
