import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../lib/colors';

function TabIcon({ focused, name, label }: { focused: boolean; name: React.ComponentProps<typeof Ionicons>['name']; label: string }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 4, width: 60 }}>
      <Ionicons name={name} size={22} color={focused ? colors.orange : colors.gray} />
      <Text style={{ fontSize: 10, color: focused ? colors.orange : colors.gray, marginTop: 3, fontWeight: focused ? '700' : '400' }}>
        {label}
      </Text>
    </View>
  );
}

function FABIcon() {
  return (
    <View style={{
      width: 54, height: 54, borderRadius: 17,
      backgroundColor: colors.orange,
      alignItems: 'center', justifyContent: 'center',
      marginBottom: 22,
      shadowColor: colors.orange, shadowOpacity: 0.5, shadowRadius: 14, shadowOffset: { width: 0, height: 4 },
      elevation: 8,
    }}>
      <Ionicons name="add" size={28} color="#fff" />
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
          height: 80,
          paddingBottom: 12,
          paddingTop: 4,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} name="home" label="Feed" /> }}
      />
      <Tabs.Screen
        name="events"
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} name="calendar" label="Events" /> }}
      />
      <Tabs.Screen
        name="swipe"
        options={{ tabBarIcon: () => <FABIcon /> }}
      />
      <Tabs.Screen
        name="packs"
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} name="people" label="Packs" /> }}
      />
      <Tabs.Screen
        name="me"
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} name="person" label="Me" /> }}
      />
    </Tabs>
  );
}
