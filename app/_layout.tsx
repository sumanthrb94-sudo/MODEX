import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Platform } from 'react-native';
import { Colors } from '@/constants/colors';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        {/* On wide/desktop web, center the app in a phone-width frame. */}
        <View style={styles.outer}>
          <View style={styles.frame}>
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
  outer: {
    flex: 1,
    backgroundColor: Platform.OS === 'web' ? '#0A1628' : Colors.offWhite,
    alignItems: 'center',
  },
  frame: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 480 : undefined,
    backgroundColor: Colors.offWhite,
    // Subtle shadow to lift the phone frame on desktop web.
    ...(Platform.OS === 'web'
      ? { shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 24, shadowOffset: { width: 0, height: 0 } }
      : null),
  },
});
