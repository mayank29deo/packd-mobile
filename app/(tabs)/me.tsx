import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../../lib/AppContext';
import { MOCK_ACTIVITIES } from '../../lib/AppContext';
import { colors } from '../../lib/colors';

const WEEK_DATA = [40, 75, 20, 90, 60, 100, 45];
const WEEK_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const ALL_BADGES = [
  { id: 1, icon: '🏃', name: 'First 5K',     desc: 'Completed your first 5K run',      earned: true },
  { id: 2, icon: '🔥', name: 'Week Warrior',  desc: '7-day activity streak',             earned: true },
  { id: 3, icon: '🤝', name: 'Pack Founder',  desc: 'Created your first pack',           earned: true },
  { id: 4, icon: '⚡', name: 'Speed Demon',   desc: 'Sub-5:00/km pace achieved',         earned: true },
  { id: 5, icon: '🌄', name: 'Early Bird',    desc: '10 workouts before 7 AM',           earned: true },
  { id: 6, icon: '💯', name: '100K Club',     desc: 'Run 100K in a month',               earned: false },
  { id: 7, icon: '🏆', name: 'Podium',        desc: 'Top 3 in pack leaderboard',         earned: false },
  { id: 8, icon: '🌍', name: 'Explorer',      desc: 'Train in 10 different venues',      earned: false },
];

const PROFILE_TABS = ['Activity', 'Badges', 'Stats', 'Nutrition'] as const;
type ProfileTab = typeof PROFILE_TABS[number];

import { useState } from 'react';

export default function MeScreen() {
  const { user, packs, joinedPacks, signOut } = useApp();
  const router = useRouter();
  const [tab, setTab] = useState<ProfileTab>('Activity');

  const xpPercent = Math.min((user.xp % 1000) / 1000 * 100, 100);
  const earnedBadges = ALL_BADGES.filter(b => b.earned).length;
  const myPacks = packs.filter(p => joinedPacks[p.id]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[1]}>

        {/* ── Profile Hero ── */}
        <View style={{ backgroundColor: colors.card, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: colors.border }}>

          {/* Back + Edit row */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Pressable onPress={() => router.back()} style={{ marginRight: 10 }}>
              <Ionicons name="arrow-back" size={22} color={colors.gray} />
            </Pressable>
            <Text style={{ flex: 1, fontSize: 16, fontWeight: '800', color: '#fff' }}>Profile</Text>
            <Pressable style={{ paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10, borderWidth: 1, borderColor: colors.border }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: colors.text }}>Edit</Text>
            </Pressable>
            <Pressable onPress={signOut} style={{ marginLeft: 8, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 10, borderWidth: 1, borderColor: '#FF444420' }}>
              <Ionicons name="log-out-outline" size={16} color="#FF4444" />
            </Pressable>
          </View>

          {/* Avatar + info */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginBottom: 16 }}>
            {/* Avatar with level badge */}
            <View style={{ position: 'relative' }}>
              <View style={{ width: 80, height: 80, borderRadius: 22, backgroundColor: user.avatarColor, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: `${user.avatarColor}50` }}>
                <Text style={{ fontSize: 32, fontWeight: '900', color: '#fff' }}>{user.initial}</Text>
              </View>
              {/* Level badge */}
              <View style={{ position: 'absolute', bottom: -4, right: -4, width: 24, height: 24, borderRadius: 12, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.card }}>
                <Text style={{ fontSize: 10, fontWeight: '900', color: '#000' }}>{user.level}</Text>
              </View>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 20, fontWeight: '900', color: '#fff' }}>{user.name}</Text>
              <Text style={{ fontSize: 12, color: colors.gray, marginTop: 2 }}>Level {user.level} · {user.levelName} · @{user.username}</Text>
              <Text style={{ fontSize: 12, color: colors.orange, fontWeight: '600', marginTop: 3 }}>{user.sports.join(' · ')}</Text>
              {user.bio && <Text style={{ fontSize: 12, color: colors.gray, marginTop: 3 }}>{user.bio}</Text>}
            </View>
          </View>

          {/* XP Progress */}
          <View style={{ backgroundColor: `${colors.bg}80`, borderRadius: 16, padding: 14, marginBottom: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
                <Text style={{ fontSize: 26, fontWeight: '900', color: '#fff' }}>{user.xp.toLocaleString()}</Text>
                <Text style={{ fontSize: 14, color: colors.gray, paddingBottom: 2 }}>XP</Text>
              </View>
              <Text style={{ fontSize: 12, color: colors.gray }}>{user.xpToNext.toLocaleString()} XP to Lv {user.level + 1}</Text>
            </View>
            <View style={{ height: 6, backgroundColor: colors.border, borderRadius: 3 }}>
              <View style={{ height: 6, width: `${xpPercent}%`, backgroundColor: colors.orange, borderRadius: 3 }} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
              <Text style={{ fontSize: 10, color: colors.gray }}>Level {user.level}</Text>
              <Text style={{ fontSize: 10, color: colors.gray }}>Level {user.level + 1} · Pack Alpha</Text>
            </View>
          </View>

          {/* Quick stats — 4 columns */}
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[
              { v: `${user.streak}🔥`, l: 'Streak' },
              { v: String(user.totalSessions), l: 'Sessions' },
              { v: `${Math.round(user.totalKm)}`, l: 'km Total' },
              { v: String(earnedBadges), l: 'Badges' },
            ].map(({ v, l }) => (
              <View key={l} style={{ flex: 1, backgroundColor: `${colors.card2}80`, borderRadius: 12, paddingVertical: 8, alignItems: 'center', borderWidth: 1, borderColor: colors.border }}>
                <Text style={{ fontSize: 14, fontWeight: '900', color: '#fff' }}>{v}</Text>
                <Text style={{ fontSize: 10, color: colors.gray, marginTop: 2 }}>{l}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Sticky Tabs ── */}
        <View style={{ backgroundColor: colors.bg, borderBottomWidth: 1, borderBottomColor: colors.border, paddingHorizontal: 12, paddingVertical: 8, flexDirection: 'row', gap: 6 }}>
          {PROFILE_TABS.map((t) => (
            <Pressable key={t} onPress={() => setTab(t)}
              style={{ flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center', backgroundColor: tab === t ? colors.orange : 'transparent' }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: tab === t ? '#fff' : colors.gray }}>{t}</Text>
            </Pressable>
          ))}
        </View>

        {/* ── Tab content ── */}
        <View style={{ padding: 16, gap: 12 }}>

          {/* ACTIVITY */}
          {tab === 'Activity' && (
            <View style={{ gap: 10 }}>
              {MOCK_ACTIVITIES.length === 0 ? (
                <View style={{ alignItems: 'center', paddingVertical: 40, gap: 8 }}>
                  <Text style={{ fontSize: 36 }}>🏃</Text>
                  <Text style={{ fontSize: 13, color: colors.gray }}>No activities logged yet</Text>
                </View>
              ) : (
                MOCK_ACTIVITIES.map((a) => (
                  <View key={a.id} style={{ backgroundColor: colors.card, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
                    <View style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: colors.card2, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ fontSize: 20 }}>{a.icon}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                        <Text style={{ fontSize: 14, fontWeight: '800', color: '#fff' }}>{a.title}</Text>
                        <Text style={{ fontSize: 12, fontWeight: '700', color: colors.orange }}>+{a.xp} XP</Text>
                      </View>
                      <Text style={{ fontSize: 11, color: colors.gray }}>{a.date}</Text>
                      <View style={{ flexDirection: 'row', gap: 14, marginTop: 6 }}>
                        {a.distance && <Text style={{ fontSize: 12, color: colors.gray }}>📏 {a.distance}</Text>}
                        <Text style={{ fontSize: 12, color: colors.gray }}>⏱️ {a.pace}</Text>
                      </View>
                    </View>
                  </View>
                ))
              )}
              <Pressable style={{ backgroundColor: colors.orange, borderRadius: 14, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 }}>
                <Text style={{ fontSize: 14 }}>⚡</Text>
                <Text style={{ color: '#fff', fontWeight: '800', fontSize: 14 }}>Log Activity</Text>
              </Pressable>
            </View>
          )}

          {/* BADGES */}
          {tab === 'Badges' && (
            <View style={{ gap: 10 }}>
              <Text style={{ fontSize: 12, color: colors.gray }}>{earnedBadges} earned · {ALL_BADGES.length - earnedBadges} to unlock</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                {ALL_BADGES.map((b) => (
                  <View key={b.id} style={{ width: '47.5%', backgroundColor: colors.card, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: colors.border, opacity: b.earned ? 1 : 0.4 }}>
                    <Text style={{ fontSize: 28, marginBottom: 8 }}>{b.icon}</Text>
                    <Text style={{ fontSize: 13, fontWeight: '800', color: '#fff', marginBottom: 4 }}>{b.name}</Text>
                    <Text style={{ fontSize: 11, color: colors.gray, lineHeight: 16 }}>{b.desc}</Text>
                    <Text style={{ fontSize: 11, fontWeight: '700', marginTop: 8, color: b.earned ? colors.green : colors.gray }}>
                      {b.earned ? '✓ Earned' : '🔒 Locked'}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* STATS */}
          {tab === 'Stats' && (
            <View style={{ gap: 12 }}>
              {/* 2x2 grid */}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                {[
                  { label: 'Total Distance', value: `${Math.round(user.totalKm)} km`, icon: '📏' },
                  { label: 'Workouts',        value: String(user.totalSessions),         icon: '💪' },
                  { label: 'Events Joined',   value: String(user.eventsJoined),           icon: '📅' },
                  { label: 'Packs',           value: String(user.packsCount),             icon: '👥' },
                ].map(({ label, value, icon }) => (
                  <View key={label} style={{ width: '47.5%', backgroundColor: colors.card, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: colors.border, alignItems: 'center', gap: 4 }}>
                    <Text style={{ fontSize: 24 }}>{icon}</Text>
                    <Text style={{ fontSize: 22, fontWeight: '900', color: '#fff' }}>{value}</Text>
                    <Text style={{ fontSize: 11, color: colors.gray }}>{label}</Text>
                  </View>
                ))}
              </View>

              {/* Weekly bar chart */}
              <View style={{ backgroundColor: colors.card, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.border }}>
                <Text style={{ fontSize: 13, fontWeight: '800', color: '#fff', marginBottom: 14 }}>This Week</Text>
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 80, gap: 6 }}>
                  {WEEK_DATA.map((h, i) => (
                    <View key={i} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
                      <View style={{ width: '100%', height: (h / 100) * 70, backgroundColor: `${colors.orange}CC`, borderRadius: 4 }} />
                      <Text style={{ fontSize: 9, color: colors.gray }}>{WEEK_LABELS[i]}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* My Packs */}
              <View style={{ backgroundColor: colors.card, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.border }}>
                <Text style={{ fontSize: 13, fontWeight: '800', color: '#fff', marginBottom: 12 }}>Your Packs</Text>
                {myPacks.length === 0 ? (
                  <View style={{ alignItems: 'center', paddingVertical: 16 }}>
                    <Text style={{ fontSize: 12, color: colors.gray, marginBottom: 6 }}>You haven't joined any packs yet</Text>
                    <Pressable onPress={() => router.push('/(tabs)/explore' as any)}>
                      <Text style={{ fontSize: 12, color: colors.orange, fontWeight: '600' }}>Browse packs →</Text>
                    </Pressable>
                  </View>
                ) : (
                  <View style={{ gap: 10 }}>
                    {myPacks.map((p) => (
                      <View key={p.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: colors.card2, alignItems: 'center', justifyContent: 'center' }}>
                          <Text style={{ fontSize: 16 }}>{p.icon}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 12, fontWeight: '700', color: '#fff' }}>{p.name}</Text>
                          <Text style={{ fontSize: 10, color: colors.gray }}>Member · {p.members} members</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>
          )}

          {/* NUTRITION */}
          {tab === 'Nutrition' && (
            <View style={{ gap: 12 }}>
              <View style={{ backgroundColor: colors.card, borderRadius: 18, padding: 20, borderWidth: 1, borderColor: colors.border, alignItems: 'center', gap: 14 }}>
                <View style={{ width: 56, height: 56, borderRadius: 18, backgroundColor: `${colors.orange}18`, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="scan" size={28} color={colors.orange} />
                </View>
                <View style={{ alignItems: 'center', gap: 4 }}>
                  <Text style={{ fontSize: 16, fontWeight: '900', color: '#fff' }}>AI Calorie Tracker</Text>
                  <Text style={{ fontSize: 13, color: colors.gray, textAlign: 'center', lineHeight: 20 }}>
                    Scan food photos or describe your meals to track calories and macros
                  </Text>
                </View>
                <View style={{ backgroundColor: `${colors.orange}18`, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: `${colors.orange}35` }}>
                  <Text style={{ color: colors.orange, fontWeight: '700', fontSize: 12 }}>Powered by AI ✦</Text>
                </View>
                <Pressable onPress={() => router.push('/(tabs)/calories' as any)}
                  style={{ backgroundColor: colors.orange, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 32, alignItems: 'center' }}>
                  <Text style={{ color: '#fff', fontWeight: '900', fontSize: 14 }}>Open Calorie Tracker →</Text>
                </Pressable>
              </View>
            </View>
          )}

        </View>

        {/* ── Pro Upgrade Card ── */}
        <View style={{ marginHorizontal: 16, marginBottom: 32, backgroundColor: colors.card, borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: `${colors.border}` }}>
          <View style={{ padding: 18 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <View>
                <Text style={{ fontSize: 10, fontWeight: '700', color: colors.gray, letterSpacing: 1 }}>CURRENT PLAN</Text>
                <Text style={{ fontSize: 17, fontWeight: '900', color: '#fff', marginTop: 2 }}>Free</Text>
              </View>
              <Text style={{ fontSize: 28 }}>🆓</Text>
            </View>
            <View style={{ gap: 8, marginBottom: 16 }}>
              {[
                { f: 'Unlimited event RSVPs', pro: false },
                { f: 'AI Calorie Scanner',     pro: false },
                { f: 'Pack communities',        pro: false },
                { f: '⚡ Priority support',     pro: true },
                { f: '⚡ Exclusive Pro badge',  pro: true },
                { f: '⚡ Advanced analytics',   pro: true },
              ].map(({ f, pro }) => (
                <View key={f} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={{ fontSize: 12, color: pro ? colors.border : colors.green, fontWeight: '700' }}>✓</Text>
                  <Text style={{ fontSize: 12, color: pro ? colors.gray : colors.text }}>{f}</Text>
                </View>
              ))}
            </View>
            <Pressable style={{ backgroundColor: colors.orange, borderRadius: 14, paddingVertical: 14, alignItems: 'center', shadowColor: colors.orange, shadowOpacity: 0.35, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 6 }}>
              <Text style={{ color: '#fff', fontWeight: '900', fontSize: 14 }}>Upgrade to Pro — ₹299/mo</Text>
            </Pressable>
            <Text style={{ fontSize: 10, color: colors.gray, textAlign: 'center', marginTop: 8 }}>Cancel anytime · Secure payment via Razorpay</Text>
          </View>
        </View>

        <View style={{ height: 90 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
