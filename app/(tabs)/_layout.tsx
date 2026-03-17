import { Tabs } from 'expo-router';
import { View, Text, Pressable } from 'react-native';
import { colors } from '../../lib/colors';

function TabIcon({ focused, emoji, label }: { focused: boolean; emoji: string; label: string }) {
  return (
    <View className="items-center justify-center pt-1">
      <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.45 }}>{emoji}</Text>
      <Text style={{ fontSize: 10, color: focused ? colors.orange : colors.gray, marginTop: 2, fontWeight: focused ? '700' : '400' }}>
        {label}
      </Text>
    </View>
  );
}

function FABIcon() {
  return (
    <View style={{
      width: 52, height: 52, borderRadius: 16,
      backgroundColor: colors.orange,
      alignItems: 'center', justifyContent: 'center',
      marginBottom: 20,
      shadowColor: colors.orange, shadowOpacity: 0.5, shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
      elevation: 8,
    }}>
      <Text style={{ color: '#fff', fontSize: 26, lineHeight: 30 }}>+</Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 72,
          paddingBottom: 8,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} emoji="🏠" label="Feed" /> }}
      />
      <Tabs.Screen
        name="events"
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} emoji="📅" label="Events" /> }}
      />
      <Tabs.Screen
        name="swipe"
        options={{ tabBarIcon: () => <FABIcon /> }}
      />
      <Tabs.Screen
        name="packs"
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} emoji="👥" label="Packs" /> }}
      />
      <Tabs.Screen
        name="me"
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} emoji="⚡" label="Me" /> }}
      />
    </Tabs>
  );
}
