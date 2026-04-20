import { Stack } from 'expo-router';
import { View } from 'react-native';
import StorageManager from '../components/StorageManager';

export default function RootLayout() {
  return (
    <View style={{ flex: 1 }}>
      <StorageManager />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="quiz" options={{ presentation: 'modal' }} />
        <Stack.Screen name="coin/[symbol]" options={{ presentation: 'modal' }} />
        <Stack.Screen name="coin/deep-dive" options={{ presentation: 'modal' }} />
        <Stack.Screen name="lesson/[id]" options={{ presentation: 'modal', headerShown: false }} />
      </Stack>
    </View>
  );
}
