import { Tabs } from 'expo-router';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../lib/colors';

const TAB_ITEMS = [
  { name: 'feed',     icon: 'home'    as const, label: 'Home' },
  { name: 'explore',  icon: 'search'  as const, label: 'Explore' },
  { name: 'swipe',    icon: 'add'     as const, label: '',        isFAB: true },
  { name: 'calories', icon: 'flame'   as const, label: 'Calories' },
  { name: 'packs',    icon: 'people'  as const, label: 'Packs' },
  { name: 'me',       icon: 'person'  as const, label: 'Me' },
];

function CustomTabBar({ state, navigation }: any) {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 8);

  return (
    <View style={{
      flexDirection: 'row',
      backgroundColor: colors.card,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingBottom: bottomPad,
      paddingTop: 6,
      height: 60 + bottomPad,
    }}>
      {TAB_ITEMS.map((tab, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: state.routes[index]?.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(state.routes[index]?.name ?? tab.name);
          }
        };

        if (tab.isFAB) {
          return (
            <Pressable key={tab.name} onPress={onPress} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
              <View style={{
                width: 52, height: 52, borderRadius: 16,
                backgroundColor: colors.orange,
                alignItems: 'center', justifyContent: 'center',
                marginTop: -20,
                shadowColor: colors.orange,
                shadowOpacity: 0.55,
                shadowRadius: 14,
                shadowOffset: { width: 0, height: 4 },
                elevation: 10,
              }}>
                <Ionicons name="add" size={28} color="#fff" />
              </View>
            </Pressable>
          );
        }

        return (
          <Pressable key={tab.name} onPress={onPress} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name={tab.icon} size={22} color={isFocused ? colors.orange : colors.gray} />
            <Text style={{ fontSize: 10, color: isFocused ? colors.orange : colors.gray, marginTop: 3, fontWeight: isFocused ? '700' : '400' }}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="feed" />
      <Tabs.Screen name="explore" />
      <Tabs.Screen name="swipe" />
      <Tabs.Screen name="calories" />
      <Tabs.Screen name="packs" />
      <Tabs.Screen name="me" />
      <Tabs.Screen name="events" options={{ href: null }} />
    </Tabs>
  );
}
