import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="project/[id]" options={{ presentation: 'card', animation: 'slide_from_right' }} />
          <Stack.Screen name="search/results" options={{ presentation: 'card', animation: 'slide_from_right' }} />
          <Stack.Screen name="compare/index" options={{ presentation: 'card' }} />
          <Stack.Screen name="book-visit/[id]" options={{ presentation: 'modal' }} />
          <Stack.Screen name="ai-search" options={{ presentation: 'modal' }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
