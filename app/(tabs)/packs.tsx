import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../lib/AppContext';
import { colors } from '../../lib/colors';

const PACK_TABS = ['Feed', 'Events', 'Members', 'Board'];

const PACK_FEED = [
  { id: 'pf1', user: 'Arjun M.',  avatar: 'A', avatarColor: '#E8451A', text: 'Set a new PB! 10K in 45:22 🔥', time: '30m ago', likes: 18 },
  { id: 'pf2', user: 'Priya S.',  avatar: 'P', avatarColor: '#7C3AED', text: "Who's joining this weekend? I'm bringing energy gels 🤝", time: '2h ago', likes: 9 },
  { id: 'pf3', user: 'Rahul K.',  avatar: 'R', avatarColor: '#2563EB', text: 'Completed the monthly challenge! 💯', time: '5h ago', likes: 34 },
];

const LEADERBOARD = [
  { rank: 1, name: 'Arjun M.',  xp: 4820, badge: '🏆', avatar: 'A', avatarColor: '#E8451A' },
  { rank: 2, name: 'Priya S.',  xp: 4150, badge: '🥈', avatar: 'P', avatarColor: '#7C3AED' },
  { rank: 3, name: 'Rahul K.',  xp: 3940, badge: '🥉', avatar: 'R', avatarColor: '#2563EB' },
  { rank: 4, name: 'Sneha D.',  xp: 3210, badge: null,  avatar: 'S', avatarColor: '#059669' },
  { rank: 5, name: 'Vikram N.', xp: 2980, badge: null,  avatar: 'V', avatarColor: '#D97706' },
  { rank: 6, name: 'Ananya T.', xp: 2750, badge: null,  avatar: 'A', avatarColor: '#7C3AED' },
  { rank: 7, name: 'Rohan P.',  xp: 2600, badge: null,  avatar: 'R', avatarColor: '#2563EB' },
  { rank: 8, name: 'You',       xp: 2840, badge: null,  avatar: 'Y', avatarColor: '#E8451A', isMe: true },
];
const sortedLB = [...LEADERBOARD].sort((a, b) => b.xp - a.xp);

export default function PacksScreen() {
  const { packs, joinedPacks, toggleJoinPack, events, rsvps, toggleRsvp } = useApp();
  const [tab, setTab]       = useState('Feed');
  const [search, setSearch] = useState('');
  const [feedLikes, setFeedLikes] = useState<Record<string, boolean>>({});

  // Pick first joined pack as active
  const joinedList = packs.filter((p) => joinedPacks[p.id]);
  const activePack = joinedList[0] ?? null;

  // ── DISCOVER MODE (no packs joined yet) ──────────────────────────────────────
  if (!activePack) {
    const filtered = packs.filter(
      (p) => p.name.toLowerCase().includes(search.toLowerCase()) ||
             p.sport.toLowerCase().includes(search.toLowerCase())
    );
    return (
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.bg }}>
        <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <Text style={{ fontSize: 20, fontWeight: '900', color: '#fff' }}>Packs</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 90 }}>
          <TextInput
            value={search} onChangeText={setSearch}
            placeholder="Search packs or sports..."
            placeholderTextColor={colors.gray}
            style={{ backgroundColor: colors.card, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, color: '#fff', fontSize: 14, marginBottom: 4, borderWidth: 1, borderColor: colors.border }}
          />
          {joinedList.length > 0 && (
            <>
              <Text style={{ fontSize: 12, fontWeight: '800', color: '#fff', marginTop: 4 }}>Your Packs</Text>
              {joinedList.map((pack) => (
                <PackCard key={pack.id} pack={pack} joined onToggle={() => toggleJoinPack(pack.id)} />
              ))}
              <Text style={{ fontSize: 12, fontWeight: '800', color: '#fff', marginTop: 8 }}>Discover More</Text>
            </>
          )}
          {filtered.filter((p) => !joinedPacks[p.id]).map((pack) => (
            <PackCard key={pack.id} pack={pack} joined={false} onToggle={() => toggleJoinPack(pack.id)} />
          ))}
          {!activePack && filtered.filter((p) => joinedPacks[p.id]).map((pack) => (
            <PackCard key={pack.id} pack={pack} joined onToggle={() => toggleJoinPack(pack.id)} />
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── PACK DETAIL VIEW ──────────────────────────────────────────────────────────
  const packEvents = events.filter((e) => e.organizerId === activePack.id);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView stickyHeaderIndices={[1]} showsVerticalScrollIndicator={false}>

        {/* ── Hero ── */}
        <View style={{ backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16 }}>

          {/* Pack switcher chips */}
          {joinedList.length > 1 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {joinedList.map((p) => (
                  <View key={p.id}
                    style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, backgroundColor: p.id === activePack.id ? colors.orange : colors.card2, borderWidth: 1, borderColor: p.id === activePack.id ? colors.orange : colors.border }}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: p.id === activePack.id ? '#fff' : colors.gray }}>{p.name}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          )}

          {/* Pack info */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginBottom: 10 }}>
            <View style={{ width: 64, height: 64, borderRadius: 18, backgroundColor: colors.orange, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Text style={{ fontSize: 30 }}>{activePack.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: '900', color: '#fff', marginBottom: 2 }}>
                {activePack.name}{activePack.verified ? <Text style={{ color: colors.orange, fontSize: 14 }}> ✓</Text> : ''}
              </Text>
              <Text style={{ fontSize: 12, color: colors.gray, marginBottom: 2 }}>{activePack.sport} · {(activePack as any).level}</Text>
              <Text style={{ fontSize: 12, color: colors.gray }}>📍 {(activePack as any).area}</Text>
            </View>
            <Pressable onPress={() => toggleJoinPack(activePack.id)}
              style={{ paddingHorizontal: 12, paddingVertical: 7, borderRadius: 12, borderWidth: 1.5, borderColor: colors.green, backgroundColor: `${colors.green}15`, flexShrink: 0 }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: colors.green }}>✓ Member</Text>
            </Pressable>
          </View>

          {(activePack as any).tagline && (
            <Text style={{ fontSize: 13, color: colors.gray, fontStyle: 'italic', marginBottom: 12 }}>"{(activePack as any).tagline}"</Text>
          )}

          {/* Stats grid */}
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[
              { v: String(activePack.members),                          l: 'Members'  },
              { v: String((activePack as any).events),                  l: 'Events'   },
              { v: `${(activePack as any).streak}🔥`,                   l: 'Streak'   },
              { v: `${((activePack as any).xp / 1000).toFixed(0)}K`,   l: 'Total XP' },
            ].map(({ v, l }) => (
              <View key={l} style={{ flex: 1, backgroundColor: `${colors.bg}80`, borderRadius: 12, paddingVertical: 8, alignItems: 'center', borderWidth: 1, borderColor: colors.border }}>
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
              <Pressable style={{ backgroundColor: colors.card, borderRadius: 14, paddingVertical: 13, alignItems: 'center', borderWidth: 1, borderColor: colors.border }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: colors.orange }}>+ Post to Pack</Text>
              </Pressable>
            </>
          )}

          {/* EVENTS */}
          {tab === 'Events' && (
            <>
              {packEvents.length > 0 ? packEvents.map((ev) => (
                <View key={ev.id} style={{ backgroundColor: colors.card, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: colors.border }}>
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
                    <Pressable onPress={() => toggleRsvp(ev.id)}
                      style={{ paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10, borderWidth: 1.5, borderColor: rsvps[ev.id] ? colors.green : colors.orange, backgroundColor: rsvps[ev.id] ? `${colors.green}15` : colors.orange }}>
                      <Text style={{ fontSize: 12, fontWeight: '700', color: rsvps[ev.id] ? colors.green : '#fff' }}>
                        {rsvps[ev.id] ? '✓ Going' : 'RSVP'}
                      </Text>
                    </Pressable>
                  </View>
                </View>
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
          {tab === 'Members' && LEADERBOARD.map((m) => (
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

          {/* LEADERBOARD */}
          {tab === 'Board' && (
            <>
              <View style={{ alignItems: 'center', marginBottom: 14 }}>
                <Text style={{ fontSize: 11, color: colors.gray, marginBottom: 2 }}>March Sprint</Text>
                <Text style={{ fontSize: 17, fontWeight: '900', color: '#fff' }}>Monthly Leaderboard</Text>
                <Text style={{ fontSize: 11, color: colors.gray, marginTop: 3 }}>
                  Resets Apr 1 · Your rank: <Text style={{ color: colors.orange, fontWeight: '700' }}>#8</Text>
                </Text>
              </View>

              {/* Podium */}
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 8, marginBottom: 14, height: 116 }}>
                {[sortedLB[1], sortedLB[0], sortedLB[2]].map((m, i) => {
                  const heights = [88, 116, 72];
                  const bgs = [`${colors.gray}25`, `${colors.orange}20`, `${colors.orange}12`];
                  const medals = ['🥈', '🏆', '🥉'];
                  return (
                    <View key={m.name + i} style={{ flex: 1, height: heights[i], backgroundColor: bgs[i], borderRadius: 14, borderTopWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 8 }}>
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
        <View style={{ height: 90 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function PackCard({ pack, joined, onToggle }: { pack: any; joined: boolean; onToggle: () => void }) {
  return (
    <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: joined ? colors.green : colors.border }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: `${colors.orange}20`, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
          <Text style={{ fontSize: 24 }}>{pack.icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 }}>
            <Text style={{ fontSize: 14, fontWeight: '800', color: '#fff' }}>{pack.name}</Text>
            {pack.verified && <Text style={{ color: colors.orange, fontSize: 12 }}>✓</Text>}
          </View>
          <Text style={{ fontSize: 12, color: colors.gray }}>{pack.sport} · {pack.members} members</Text>
        </View>
        <Pressable onPress={onToggle}
          style={{ paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10, borderWidth: 1.5, borderColor: joined ? colors.green : colors.border, backgroundColor: joined ? `${colors.green}15` : 'transparent' }}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: joined ? colors.green : colors.gray }}>
            {joined ? '✓ Member' : 'Join'}
          </Text>
        </Pressable>
      </View>
      {pack.description && (
        <Text style={{ fontSize: 12, color: colors.gray, marginTop: 8, lineHeight: 18 }}>{pack.description}</Text>
      )}
    </View>
  );
}
