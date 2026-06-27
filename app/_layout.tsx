import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Platform, useWindowDimensions } from 'react-native';
import { Colors } from '@/constants/colors';

// Only frame the app in a centered phone-width column on genuinely wide
// (desktop) browsers. Phones — even large ones — get the full width with no
// navy side bars.
const DESKTOP_BREAKPOINT = 700;
const FRAME_WIDTH = 440;

export default function RootLayout() {
  const { width } = useWindowDimensions();
  const isDesktopWeb = Platform.OS === 'web' && width >= DESKTOP_BREAKPOINT;

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <View style={[styles.outer, isDesktopWeb && styles.outerDesktop]}>
          <View style={[styles.frame, isDesktopWeb && styles.frameDesktop]}>
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.offWhite } }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="project/[id]" options={{ presentation: 'card', animation: 'slide_from_right' }} />
              <Stack.Screen name="search/results" options={{ presentation: 'card', animation: 'slide_from_right' }} />
              <Stack.Screen name="compare/index" options={{ presentation: 'card' }} />
              <Stack.Screen name="book-visit/[id]" options={{ presentation: 'modal' }} />
              <Stack.Screen name="ai-search" options={{ presentation: 'modal' }} />
            </Stack>
          </View>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  outer: { flex: 1, backgroundColor: Colors.offWhite },
  outerDesktop: { backgroundColor: '#0A1628', alignItems: 'center' },
  frame: { flex: 1, width: '100%', backgroundColor: Colors.offWhite },
  frameDesktop: {
    maxWidth: FRAME_WIDTH,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
  },
});
