import { Tabs } from 'expo-router';
import { Platform, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

function TabIcon({ emoji, focused, activeColor }: { emoji: string; focused: boolean; activeColor: string }) {
  return (
    <View style={[s.iconBox, focused && { backgroundColor: `${activeColor}18` }]}>
      <Text style={[s.iconText, { opacity: focused ? 1 : 0.4 }]}>{emoji}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  iconBox: { width: 38, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 16 },
});

export default function TabsLayout() {
  const { colors, isDark } = useTheme();

  const tabBg = isDark ? 'rgba(6,14,7,0.97)' : 'rgba(244,240,232,0.97)';
  const tabBorder = isDark ? 'rgba(143,190,126,0.12)' : 'rgba(61,122,48,0.15)';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 28 : 14,
          left: 14,
          right: 14,
          borderRadius: 24,
          height: 62,
          backgroundColor: tabBg,
          borderWidth: 1,
          borderColor: tabBorder,
          paddingBottom: 0,
          paddingTop: 0,
          elevation: 24,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.4,
          shadowRadius: 28,
        } as any,
        tabBarActiveTintColor: colors.cyan,
        tabBarInactiveTintColor: isDark ? 'rgba(237,234,224,0.28)' : 'rgba(24,34,24,0.32)',
        tabBarLabelStyle: { fontSize: 9.5, fontWeight: '600', letterSpacing: 0.3, marginTop: -2 },
        tabBarItemStyle: { paddingVertical: 6 },
      }}
    >
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="learn" options={{ title: 'Learn', tabBarIcon: ({ focused }) => <TabIcon emoji="📚" focused={focused} activeColor={colors.cyan} /> }} />
      <Tabs.Screen name="explore" options={{ title: 'Explore', tabBarIcon: ({ focused }) => <TabIcon emoji="🔭" focused={focused} activeColor={colors.cyan} /> }} />
      <Tabs.Screen name="portfolio" options={{ title: 'Portfolio', tabBarIcon: ({ focused }) => <TabIcon emoji="💼" focused={focused} activeColor={colors.cyan} /> }} />
      <Tabs.Screen name="community" options={{ title: 'Community', tabBarIcon: ({ focused }) => <TabIcon emoji="👥" focused={focused} activeColor={colors.cyan} /> }} />
      <Tabs.Screen name="home" options={{ href: null }} />
      <Tabs.Screen name="calendar" options={{ href: null }} />
      <Tabs.Screen name="roadmap" options={{ href: null }} />
      <Tabs.Screen name="events" options={{ href: null }} />
    </Tabs>
  );
}
