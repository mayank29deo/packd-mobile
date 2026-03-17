import { Tabs } from 'expo-router';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../lib/colors';

function TabIcon({ focused, name, label }: { focused: boolean; name: React.ComponentProps<typeof Ionicons>['name']; label: string }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 4, width: 52 }}>
      <Ionicons name={name} size={22} color={focused ? colors.orange : colors.gray} />
      <Text style={{ fontSize: 10, color: focused ? colors.orange : colors.gray, marginTop: 3, fontWeight: focused ? '700' : '400' }}>
        {label}
      </Text>
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
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} name="home" label="Home" /> }}
      />
      <Tabs.Screen
        name="explore"
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} name="search" label="Explore" /> }}
      />
      <Tabs.Screen
        name="swipe"
        options={{
          tabBarButton: (props) => (
            <Pressable
              onPress={props.onPress}
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
            >
              <View style={{
                width: 54, height: 54, borderRadius: 17,
                backgroundColor: colors.orange,
                alignItems: 'center', justifyContent: 'center',
                marginTop: -18,
                shadowColor: colors.orange,
                shadowOpacity: 0.5,
                shadowRadius: 14,
                shadowOffset: { width: 0, height: 4 },
                elevation: 10,
              }}>
                <Ionicons name="add" size={28} color="#fff" />
              </View>
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="calories"
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} name="flame" label="Calories" /> }}
      />
      <Tabs.Screen
        name="packs"
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} name="people" label="Packs" /> }}
      />
      <Tabs.Screen
        name="me"
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} name="person" label="Me" /> }}
      />
      <Tabs.Screen
        name="events"
        options={{ href: null }}
      />
    </Tabs>
  );
}
