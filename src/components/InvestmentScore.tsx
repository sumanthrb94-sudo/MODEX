import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle, useSharedValue, withTiming, Easing,
} from 'react-native-reanimated';
import { Colors } from '@/constants/colors';

interface Props {
  score: number;
}

export default function InvestmentScore({ score }: Props) {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(score, { duration: 1000, easing: Easing.out(Easing.quad) });
  }, [score]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${width.value}%` as any,
  }));

  const color = score >= 85 ? Colors.success : score >= 70 ? Colors.warning : Colors.error;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.label}>Investment Score</Text>
        <Text style={[styles.score, { color }]}>{score}/100</Text>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.bar, barStyle, { backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
    minWidth: 120,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  score: {
    fontSize: 14,
    fontWeight: '800',
  },
  track: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 3,
  },
});
