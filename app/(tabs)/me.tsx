import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../../lib/AppContext';
import { colors } from '../../lib/colors';

const BADGES = [
  { icon: '🌄', label: 'Early Bird' },
  { icon: '🔥', label: '7-Day Streak' },
  { icon: '🚀', label: 'First Event' },
  { icon: '👥', label: 'Pack Joiner' },
];

export default function MeScreen() {
  const { user } = useApp();
  const router = useRouter();
  const xpProgress = Math.round((user.xp % user.xpToNext) / user.xpToNext * 100);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <Pressable onPress={() => router.back()} style={{ marginRight: 12 }}>
          <Ionicons name="arrow-back" size={22} color={colors.gray} />
        </Pressable>
        <Text style={{ flex: 1, fontSize: 18, fontWeight: '900', color: '#fff' }}>Profile</Text>
        <Pressable>
          <Ionicons name="settings-outline" size={22} color={colors.gray} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile header */}
        <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <View style={{ width: 72, height: 72, borderRadius: 22, backgroundColor: user.avatarColor, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: `${user.avatarColor}60` }}>
              <Text style={{ fontSize: 30, fontWeight: '900', color: '#fff' }}>{user.initial}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 20, fontWeight: '900', color: '#fff' }}>{user.name}</Text>
              <Text style={{ fontSize: 13, color: colors.orange, fontWeight: '700' }}>Level {user.level} · {user.levelName}</Text>
              <Text style={{ fontSize: 12, color: colors.gray, marginTop: 2 }}>{user.sport} · {user.area}</Text>
            </View>
          </View>

          {/* XP bar */}
          <View style={{ marginTop: 16, backgroundColor: colors.card2, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: colors.border }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ fontSize: 12, color: colors.gray }}>Level {user.level}</Text>
              <Text style={{ fontSize: 12, color: colors.gray }}>{user.xp.toLocaleString()} / {(user.xp + user.xpToNext).toLocaleString()} XP</Text>
            </View>
            <View style={{ height: 8, backgroundColor: colors.border, borderRadius: 4 }}>
              <View style={{ height: 8, width: `${xpProgress}%`, backgroundColor: colors.orange, borderRadius: 4 }} />
            </View>
            <Text style={{ fontSize: 11, color: colors.gray, marginTop: 6 }}>{user.xpToNext} XP to Level {user.level + 1}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border }}>
          {[
            { value: '47', label: 'Events' },
            { value: `${user.streak}🔥`, label: 'Streak' },
            { value: '3', label: 'Packs' },
          ].map(({ value, label }, i, arr) => (
            <View key={label} style={{ flex: 1, alignItems: 'center', paddingVertical: 16, borderRightWidth: i < arr.length - 1 ? 1 : 0, borderRightColor: colors.border }}>
              <Text style={{ fontSize: 20, fontWeight: '900', color: '#fff' }}>{value}</Text>
              <Text style={{ fontSize: 11, color: colors.gray, marginTop: 2 }}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Badges */}
        <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <Text style={{ fontSize: 14, fontWeight: '800', color: '#fff', marginBottom: 12 }}>Badges</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {BADGES.map((b) => (
              <View key={b.label} style={{ alignItems: 'center', backgroundColor: colors.card2, borderRadius: 14, padding: 12, width: 76, borderWidth: 1, borderColor: colors.border }}>
                <Text style={{ fontSize: 24, marginBottom: 4 }}>{b.icon}</Text>
                <Text style={{ fontSize: 10, color: colors.gray, textAlign: 'center' }}>{b.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Pro upgrade */}
        <View style={{ marginHorizontal: 16, marginTop: 16, marginBottom: 8, backgroundColor: colors.card, borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: `${colors.gold}40` }}>
          <View style={{ height: 3, backgroundColor: colors.gold }} />
          <View style={{ padding: 16 }}>
            <Text style={{ fontSize: 11, color: colors.gold, fontWeight: '700', marginBottom: 4 }}>⭐ PACKD PRO</Text>
            <Text style={{ fontSize: 16, fontWeight: '900', color: '#fff', marginBottom: 4 }}>Unlock the full experience</Text>
            <Text style={{ fontSize: 12, color: colors.gray, marginBottom: 14 }}>Unlimited packs, priority RSVP, advanced analytics</Text>
            <Pressable style={{ backgroundColor: colors.gold, borderRadius: 12, paddingVertical: 12, alignItems: 'center' }}>
              <Text style={{ color: '#000', fontWeight: '800', fontSize: 14 }}>Upgrade for ₹299/mo</Text>
            </Pressable>
          </View>
        </View>

        {/* Settings rows */}
        <View style={{ marginHorizontal: 16, marginBottom: 32, backgroundColor: colors.card, borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: colors.border }}>
          {[
            { icon: '⚙️', label: 'Settings' },
            { icon: '🔔', label: 'Notifications' },
            { icon: '🎨', label: 'Appearance' },
            { icon: '🚪', label: 'Sign Out', danger: true },
          ].map(({ icon, label, danger }, i, arr) => (
            <Pressable key={label}
              style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderBottomColor: colors.border }}>
              <Text style={{ fontSize: 18, marginRight: 12 }}>{icon}</Text>
              <Text style={{ flex: 1, fontSize: 14, color: danger ? '#F87171' : colors.text, fontWeight: '600' }}>{label}</Text>
              {!danger && <Text style={{ color: colors.gray }}>›</Text>}
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
