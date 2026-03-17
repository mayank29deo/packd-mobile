import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../lib/colors';

const BADGES = [
  { icon: '🌄', label: 'Early Bird' },
  { icon: '🔥', label: '7-Day Streak' },
  { icon: '🚀', label: 'First Event' },
  { icon: '👥', label: 'Pack Joiner' },
];

export default function MeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile header */}
        <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <View style={{ width: 72, height: 72, borderRadius: 22, backgroundColor: colors.orange, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: `${colors.orange}60` }}>
              <Text style={{ fontSize: 30, fontWeight: '900', color: '#fff' }}>A</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 20, fontWeight: '900', color: '#fff' }}>Arjun M.</Text>
              <Text style={{ fontSize: 13, color: colors.orange, fontWeight: '700' }}>Level 7 · Trailblazer</Text>
              <Text style={{ fontSize: 12, color: colors.gray, marginTop: 2 }}>Running · Bangalore</Text>
            </View>
          </View>

          {/* XP bar */}
          <View style={{ marginTop: 16, backgroundColor: colors.card2, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: colors.border }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ fontSize: 12, color: colors.gray }}>Level 7</Text>
              <Text style={{ fontSize: 12, color: colors.gray }}>2,840 / 3,500 XP</Text>
            </View>
            <View style={{ height: 8, backgroundColor: colors.border, borderRadius: 4 }}>
              <View style={{ height: 8, width: '81%', backgroundColor: colors.orange, borderRadius: 4 }} />
            </View>
            <Text style={{ fontSize: 11, color: colors.gray, marginTop: 6 }}>660 XP to Level 8</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border }}>
          {[
            { value: '47', label: 'Events' },
            { value: '14🔥', label: 'Streak' },
            { value: '3', label: 'Packs' },
          ].map(({ value, label }) => (
            <View key={label} style={{ flex: 1, alignItems: 'center', paddingVertical: 16, borderRightWidth: 1, borderRightColor: colors.border }}>
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
        <View style={{ marginHorizontal: 16, marginBottom: 16, backgroundColor: colors.card, borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: `${colors.gold}40` }}>
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
