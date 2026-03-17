import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../lib/colors';

const NOTIFICATIONS = [
  {
    id: 'n1',
    icon: '❤️',
    title: 'Arjun M. liked your post',
    body: '"First 5k done, thanks to the team..."',
    time: '2m ago',
    unread: true,
  },
  {
    id: 'n2',
    icon: '🏃',
    title: 'New event in your area',
    body: 'Sunday Long Run @ Cubbon — 22 going',
    time: '1h ago',
    unread: true,
  },
  {
    id: 'n3',
    icon: '👥',
    title: 'Koramangala Runners posted',
    body: 'Weekly recap: 312 members, 5 events this week',
    time: '3h ago',
    unread: false,
  },
  {
    id: 'n4',
    icon: '🔥',
    title: 'Streak reminder',
    body: "Don't break your 14-day streak! Log today's activity.",
    time: '5h ago',
    unread: false,
  },
  {
    id: 'n5',
    icon: '🏅',
    title: 'Badge unlocked: Early Bird',
    body: 'You attended 3 events before 7 AM',
    time: 'Yesterday',
    unread: false,
  },
];

export default function NotificationsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <Pressable onPress={() => router.back()} style={{ marginRight: 12 }}>
          <Ionicons name="arrow-back" size={22} color={colors.gray} />
        </Pressable>
        <Text style={{ flex: 1, fontSize: 18, fontWeight: '900', color: '#fff' }}>Notifications</Text>
        <Pressable>
          <Text style={{ color: colors.orange, fontSize: 13, fontWeight: '700' }}>Mark all read</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {NOTIFICATIONS.map((n, i) => (
          <Pressable key={n.id} style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            paddingHorizontal: 16,
            paddingVertical: 14,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            backgroundColor: n.unread ? `${colors.orange}08` : 'transparent',
          }}>
            {/* Icon bubble */}
            <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: colors.card2, alignItems: 'center', justifyContent: 'center', marginRight: 12, borderWidth: 1, borderColor: colors.border }}>
              <Text style={{ fontSize: 20 }}>{n.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: n.unread ? '800' : '600', color: '#fff', marginBottom: 2 }}>{n.title}</Text>
              <Text style={{ fontSize: 12, color: colors.gray, lineHeight: 17 }}>{n.body}</Text>
              <Text style={{ fontSize: 11, color: colors.gray, marginTop: 4 }}>{n.time}</Text>
            </View>
            {n.unread && (
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.orange, marginTop: 6 }} />
            )}
          </Pressable>
        ))}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
