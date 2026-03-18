import { View, Text, ScrollView, Pressable, TextInput, FlatList } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../lib/AppContext';
import { colors } from '../../lib/colors';

const PACK_TABS = ['Feed', 'Events', 'Members', 'Leaderboard'];

const PACK_FEED = [
  { id: 'pf1', user: 'Arjun M.', avatar: 'A', avatarColor: '#E8451A', text: 'Set a new PB! 10K in 45:22 🔥', time: '30m ago', likes: 18, liked: false },
  { id: 'pf2', user: 'Priya S.', avatar: 'P', avatarColor: '#7C3AED', text: "Who's joining this weekend? I'm bringing energy gels 🤝", time: '2h ago', likes: 9, liked: false },
  { id: 'pf3', user: 'Rahul K.', avatar: 'R', avatarColor: '#2563EB', text: 'Completed the monthly challenge! 💯', time: '5h ago', likes: 34, liked: false },
];

const LEADERBOARD = [
  { rank: 1, name: 'Arjun M.',   xp: 4820, badge: '🏆', avatar: 'A', avatarColor: '#E8451A' },
  { rank: 2, name: 'Priya S.',   xp: 4150, badge: '🥈', avatar: 'P', avatarColor: '#7C3AED' },
  { rank: 3, name: 'Rahul K.',   xp: 3940, badge: '🥉', avatar: 'R', avatarColor: '#2563EB' },
  { rank: 4, name: 'Sneha D.',   xp: 3210, badge: null,  avatar: 'S', avatarColor: '#059669' },
  { rank: 5, name: 'Vikram N.', xp: 2980, badge: null,  avatar: 'V', avatarColor: '#D97706' },
  { rank: 6, name: 'Ananya T.', xp: 2750, badge: null,  avatar: 'A', avatarColor: '#7C3AED' },
  { rank: 7, name: 'Rohan P.',  xp: 2600, badge: null,  avatar: 'R', avatarColor: '#2563EB' },
  { rank: 8, name: 'You',       xp: 2840, badge: null,  avatar: 'Y', avatarColor: '#E8451A', isMe: true },
];

const sortedLB = [...LEADERBOARD].sort((a, b) => b.xp - a.xp);

export default function PackDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { packs, joinedPacks, toggleJoinPack, events, rsvps, toggleRsvp } = useApp();
  const [tab, setTab] = useState('Feed');
  const [feedLikes, setFeedLikes] = useState<Record<string, boolean>>({});

  const pack = packs.find((p) => p.id === id);

  if (!pack) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: colors.gray }}>Pack not found</Text>
      </SafeAreaView>
    );
  }

  const joined = !!joinedPacks[pack.id];
  const packEvents = events.filter((e) => e.organizerId === pack.id);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>

      {/* Back button */}
      <Pressable onPress={() => router.back()}
        style={{ position: 'absolute', top: 52, left: 16, zIndex: 10, width: 36, height: 36, borderRadius: 12, backgroundColor: '#00000060', alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name="arrow-back" size={20} color="#fff" />
      </Pressable>

      <ScrollView stickyHeaderIndices={[1]} showsVerticalScrollIndicator={false}>

        {/* ── Hero ── */}
        <View style={{ backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border, paddingTop: 56, paddingHorizontal: 16, paddingBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginBottom: 12 }}>
            <View style={{ width: 64, height: 64, borderRadius: 18, backgroundColor: colors.orange, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Text style={{ fontSize: 30 }}>{pack.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <Text style={{ fontSize: 18, fontWeight: '900', color: '#fff' }}>{pack.name}</Text>
                {pack.verified && <Text style={{ color: colors.orange, fontSize: 13 }}>✓</Text>}
              </View>
              <Text style={{ fontSize: 12, color: colors.gray, marginBottom: 2 }}>{pack.sport} · {(pack as any).level}</Text>
              <Text style={{ fontSize: 12, color: colors.gray }}>📍 {(pack as any).area}</Text>
            </View>
            <Pressable onPress={() => toggleJoinPack(pack.id)}
              style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, borderWidth: 1.5, borderColor: joined ? colors.green : colors.orange, backgroundColor: joined ? `${colors.green}15` : colors.orange, flexShrink: 0 }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: joined ? colors.green : '#fff' }}>
                {joined ? '✓ Member' : 'Join Pack'}
              </Text>
            </Pressable>
          </View>

          {(pack as any).tagline && (
            <Text style={{ fontSize: 13, color: colors.gray, fontStyle: 'italic', marginBottom: 14 }}>"{(pack as any).tagline}"</Text>
          )}

          {/* Stats grid */}
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[
              { v: String(pack.members), l: 'Members' },
              { v: String((pack as any).events), l: 'Events' },
              { v: `${(pack as any).streak}🔥`, l: 'Streak' },
              { v: `${((pack as any).xp / 1000).toFixed(0)}K`, l: 'Total XP' },
            ].map(({ v, l }) => (
              <View key={l} style={{ flex: 1, backgroundColor: `${colors.card2}80`, borderRadius: 12, paddingVertical: 8, alignItems: 'center', borderWidth: 1, borderColor: colors.border }}>
                <Text style={{ fontSize: 14, fontWeight: '900', color: '#fff' }}>{v}</Text>
                <Text style={{ fontSize: 10, color: colors.gray, marginTop: 1 }}>{l}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Sticky Tabs ── */}
        <View style={{ backgroundColor: colors.bg, borderBottomWidth: 1, borderBottomColor: colors.border, paddingHorizontal: 12, paddingVertical: 8 }}>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {PACK_TABS.map((t) => (
              <Pressable key={t} onPress={() => setTab(t)}
                style={{ flex: 1, paddingVertical: 8, borderRadius: 12, alignItems: 'center', backgroundColor: tab === t ? colors.orange : colors.card, borderWidth: 1, borderColor: tab === t ? colors.orange : colors.border }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: tab === t ? '#fff' : colors.gray }}>{t}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* ── Tab Content ── */}
        <View style={{ padding: 14, gap: 10 }}>

          {/* FEED */}
          {tab === 'Feed' && (
            <>
              {PACK_FEED.map((post) => (
                <View key={post.id} style={{ backgroundColor: colors.card, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: colors.border }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: `${post.avatarColor}30`, borderWidth: 1, borderColor: `${post.avatarColor}50`, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ fontSize: 13, fontWeight: '800', color: post.avatarColor }}>{post.avatar}</Text>
                    </View>
                    <View>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: '#fff' }}>{post.user}</Text>
                      <Text style={{ fontSize: 11, color: colors.gray }}>{post.time}</Text>
                    </View>
                  </View>
                  <Text style={{ fontSize: 13, color: colors.text, lineHeight: 20, marginBottom: 10 }}>{post.text}</Text>
                  <View style={{ flexDirection: 'row', gap: 16 }}>
                    <Pressable onPress={() => setFeedLikes(p => ({ ...p, [post.id]: !p[post.id] }))}
                      style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Text style={{ fontSize: 14 }}>{feedLikes[post.id] ? '❤️' : '🤍'}</Text>
                      <Text style={{ fontSize: 12, color: colors.gray }}>{post.likes + (feedLikes[post.id] ? 1 : 0)}</Text>
                    </Pressable>
                    <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Text style={{ fontSize: 14 }}>💬</Text>
                      <Text style={{ fontSize: 12, color: colors.gray }}>Reply</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
              <Pressable style={{ backgroundColor: colors.card, borderRadius: 14, paddingVertical: 13, alignItems: 'center', borderWidth: 1, borderColor: colors.border, marginTop: 2 }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: colors.orange }}>+ Post to Pack</Text>
              </Pressable>
            </>
          )}

          {/* EVENTS */}
          {tab === 'Events' && (
            <>
              {packEvents.length > 0 ? packEvents.map((ev) => (
                <Pressable key={ev.id} onPress={() => router.push(`/event/${ev.id}` as any)}
                  style={{ backgroundColor: colors.card, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: colors.border }}>
                  <Text style={{ fontSize: 14, fontWeight: '800', color: '#fff', marginBottom: 6 }}>{ev.title}</Text>
                  <Text style={{ fontSize: 12, color: colors.gray, marginBottom: 2 }}>🕐 {ev.time}</Text>
                  <Text style={{ fontSize: 12, color: colors.gray, marginBottom: 10 }}>📍 {ev.venue}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1, marginRight: 12 }}>
                      <View style={{ height: 4, backgroundColor: colors.border, borderRadius: 2, overflow: 'hidden', marginBottom: 4 }}>
                        <View style={{ height: 4, width: `${(ev.rsvp / ev.max) * 100}%`, backgroundColor: colors.orange, borderRadius: 2 }} />
                      </View>
                      <Text style={{ fontSize: 11, color: colors.gray }}>{ev.rsvp}/{ev.max} going</Text>
                    </View>
                    <Pressable onPress={(e) => { e.stopPropagation?.(); toggleRsvp(ev.id); }}
                      style={{ paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10, borderWidth: 1.5, borderColor: rsvps[ev.id] ? colors.green : colors.orange, backgroundColor: rsvps[ev.id] ? `${colors.green}15` : colors.orange }}>
                      <Text style={{ fontSize: 12, fontWeight: '700', color: rsvps[ev.id] ? colors.green : '#fff' }}>
                        {rsvps[ev.id] ? '✓ Going' : 'RSVP'}
                      </Text>
                    </Pressable>
                  </View>
                </Pressable>
              )) : (
                <View style={{ alignItems: 'center', paddingVertical: 40, gap: 8 }}>
                  <Text style={{ fontSize: 32 }}>📅</Text>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>No upcoming events</Text>
                  <Text style={{ fontSize: 12, color: colors.gray }}>Check back soon</Text>
                </View>
              )}
            </>
          )}

          {/* MEMBERS */}
          {tab === 'Members' && (
            <>
              {LEADERBOARD.map((m) => (
                <View key={m.rank} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: 14, padding: 12, borderWidth: 1, borderColor: m.isMe ? `${colors.orange}40` : colors.border }}>
                  <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: m.isMe ? colors.orange : `${m.avatarColor}25`, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 14, fontWeight: '800', color: m.isMe ? '#fff' : m.avatarColor }}>{m.avatar}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#fff' }}>{m.name}{m.isMe ? ' (You)' : ''}</Text>
                    <Text style={{ fontSize: 11, color: colors.gray }}>{m.xp.toLocaleString()} XP</Text>
                  </View>
                  {m.badge && <Text style={{ fontSize: 20 }}>{m.badge}</Text>}
                </View>
              ))}
            </>
          )}

          {/* LEADERBOARD */}
          {tab === 'Leaderboard' && (
            <>
              <View style={{ alignItems: 'center', marginBottom: 16 }}>
                <Text style={{ fontSize: 11, color: colors.gray, marginBottom: 2 }}>March Sprint</Text>
                <Text style={{ fontSize: 17, fontWeight: '900', color: '#fff' }}>Monthly Leaderboard</Text>
                <Text style={{ fontSize: 11, color: colors.gray, marginTop: 3 }}>
                  Resets Apr 1 · Your rank: <Text style={{ color: colors.orange, fontWeight: '700' }}>#8</Text>
                </Text>
              </View>

              {/* Podium */}
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 8, marginBottom: 16, height: 120 }}>
                {[sortedLB[1], sortedLB[0], sortedLB[2]].map((m, i) => {
                  const heights = [88, 120, 72];
                  const bgs = [`${colors.gray}30`, `${colors.orange}20`, `${colors.orange}15`];
                  const medals = ['🥈', '🏆', '🥉'];
                  return (
                    <View key={m.name + i} style={{ flex: 1, height: heights[i], backgroundColor: bgs[i], borderRadius: 14, borderTopLeftRadius: 14, borderTopRightRadius: 14, borderTopWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 8 }}>
                      <Text style={{ fontSize: 20 }}>{medals[i]}</Text>
                      <Text style={{ fontSize: 11, fontWeight: '800', color: '#fff', textAlign: 'center' }} numberOfLines={1}>{m.name}</Text>
                      <Text style={{ fontSize: 10, color: colors.gray }}>{(m.xp / 1000).toFixed(1)}K</Text>
                    </View>
                  );
                })}
              </View>

              {sortedLB.map((m, i) => (
                <View key={m.rank} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: 14, padding: 12, marginBottom: 6, borderWidth: 1, borderColor: m.isMe ? `${colors.orange}50` : colors.border }}>
                  <Text style={{ fontSize: 13, fontWeight: '900', width: 20, textAlign: 'center', color: i < 3 ? '#EAB308' : colors.gray }}>{i + 1}</Text>
                  <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: m.isMe ? colors.orange : `${m.avatarColor}25`, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 13, fontWeight: '800', color: m.isMe ? '#fff' : m.avatarColor }}>{m.avatar}</Text>
                  </View>
                  <Text style={{ flex: 1, fontSize: 13, fontWeight: '600', color: '#fff' }}>
                    {m.name}{m.isMe ? <Text style={{ color: colors.orange, fontSize: 11 }}> (You)</Text> : ''}
                  </Text>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#EAB308' }}>{m.xp.toLocaleString()}</Text>
                </View>
              ))}
            </>
          )}

        </View>
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
