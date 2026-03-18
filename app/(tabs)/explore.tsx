import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../lib/AppContext';
import { colors } from '../../lib/colors';

const SPORTS = ['All', 'Running', 'Cycling', 'Yoga', 'Football', 'Basketball', 'Tennis'];
const TABS = ['Events', 'Packs'];

export default function ExploreScreen() {
  const router = useRouter();
  const { events, rsvps, packs, joinedPacks, toggleJoinPack } = useApp();
  const [activeTab, setActiveTab] = useState('Events');
  const [activeSport, setActiveSport] = useState('All');
  const [search, setSearch] = useState('');

  const filteredEvents = events.filter((e) => {
    const matchSport = activeSport === 'All' || e.sport === activeSport;
    const matchSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.venue.toLowerCase().includes(search.toLowerCase());
    return matchSport && matchSearch;
  });

  const filteredPacks = packs.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sport.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 0, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <Text style={{ fontSize: 20, fontWeight: '900', color: '#fff', marginBottom: 10 }}>Explore</Text>

        {/* Search */}
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder={activeTab === 'Events' ? 'Search events or venues...' : 'Search packs or sports...'}
          placeholderTextColor={colors.gray}
          style={{
            backgroundColor: colors.card2,
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 10,
            color: '#fff',
            fontSize: 14,
            marginBottom: 10,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        />

        {/* Tabs */}
        <View style={{ flexDirection: 'row', gap: 0, marginBottom: 10 }}>
          {TABS.map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={{
                flex: 1,
                alignItems: 'center',
                paddingVertical: 8,
                borderBottomWidth: 2,
                borderBottomColor: activeTab === tab ? colors.orange : 'transparent',
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: '700', color: activeTab === tab ? colors.orange : colors.gray }}>
                {tab}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Sport filter pills (events only) */}
        {activeTab === 'Events' && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 10 }}>
            {SPORTS.map((s) => (
              <Pressable
                key={s}
                onPress={() => setActiveSport(s)}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 7,
                  borderRadius: 20,
                  backgroundColor: activeSport === s ? colors.orange : colors.card2,
                  borderWidth: 1,
                  borderColor: activeSport === s ? colors.orange : colors.border,
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: '700', color: activeSport === s ? '#fff' : colors.gray }}>{s}</Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Content */}
      {activeTab === 'Events' ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 90 }}>
          {filteredEvents.map((event) => {
            const spotsLeft = event.max - event.rsvp;
            const fillPct = Math.min((event.rsvp / event.max) * 100, 100);
            return (
              <Pressable
                key={event.id}
                onPress={() => router.push(`/event/${event.id}`)}
                style={{ backgroundColor: colors.card, borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: colors.border }}
              >
                <View style={{ height: 3, backgroundColor: colors.orange }} />
                <View style={{ padding: 14 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: colors.orange, backgroundColor: `${colors.orange}18`, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 }}>
                      {event.sport}
                    </Text>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: event.cost === 'Free' ? colors.green : colors.gold }}>
                      {event.cost}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 16, fontWeight: '900', color: '#fff', marginBottom: 8 }}>{event.title}</Text>
                  <View style={{ flexDirection: 'row', gap: 16, marginBottom: 10, flexWrap: 'wrap' }}>
                    <Text style={{ fontSize: 12, color: colors.gray }}>🕐 {event.time}</Text>
                    <Text style={{ fontSize: 12, color: colors.gray }}>📍 {event.venue}</Text>
                    <Text style={{ fontSize: 12, color: colors.gray }}>⚡ {event.level}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                    <Text style={{ fontSize: 11, color: colors.gray }}>{event.rsvp} going</Text>
                    <Text style={{ fontSize: 11, color: spotsLeft <= 5 ? '#F87171' : colors.gray }}>{spotsLeft} spots left</Text>
                  </View>
                  <View style={{ height: 4, backgroundColor: colors.border, borderRadius: 2 }}>
                    <View style={{ height: 4, width: `${fillPct}%`, backgroundColor: colors.orange, borderRadius: 2 }} />
                  </View>
                  {rsvps[event.id] && (
                    <Text style={{ fontSize: 11, color: colors.green, fontWeight: '700', marginTop: 8 }}>✓ You're going!</Text>
                  )}
                </View>
              </Pressable>
            );
          })}
          {filteredEvents.length === 0 && (
            <View style={{ alignItems: 'center', marginTop: 60 }}>
              <Text style={{ fontSize: 32, marginBottom: 8 }}>🔍</Text>
              <Text style={{ color: colors.gray }}>No events found</Text>
            </View>
          )}
        </ScrollView>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 90 }}>
          {Object.keys(joinedPacks).some((k) => joinedPacks[k]) && (
            <View style={{ marginBottom: 4 }}>
              <Text style={{ fontSize: 13, fontWeight: '800', color: '#fff', marginBottom: 8 }}>Your Packs</Text>
              {packs.filter((p) => joinedPacks[p.id]).map((pack) => (
                <PackCard key={pack.id} pack={pack} joined={true} onToggle={() => toggleJoinPack(pack.id)} />
              ))}
            </View>
          )}
          <Text style={{ fontSize: 13, fontWeight: '800', color: '#fff', marginBottom: 4 }}>Discover Packs</Text>
          {filteredPacks.map((pack) => (
            <PackCard key={pack.id} pack={pack} joined={!!joinedPacks[pack.id]} onToggle={() => toggleJoinPack(pack.id)} />
          ))}
          {filteredPacks.length === 0 && (
            <View style={{ alignItems: 'center', marginTop: 60 }}>
              <Text style={{ fontSize: 32, marginBottom: 8 }}>🔍</Text>
              <Text style={{ color: colors.gray }}>No packs found</Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function PackCard({ pack, joined, onToggle }: { pack: any; joined: boolean; onToggle: () => void }) {
  return (
    <View style={{ backgroundColor: colors.card, borderRadius: 18, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: joined ? colors.green : colors.border }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ width: 52, height: 52, borderRadius: 14, backgroundColor: colors.card2, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
          <Text style={{ fontSize: 26 }}>{pack.icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 }}>
            <Text style={{ fontSize: 15, fontWeight: '800', color: '#fff' }}>{pack.name}</Text>
            {pack.verified && <Text style={{ color: colors.orange, fontSize: 12 }}>✓</Text>}
          </View>
          <Text style={{ fontSize: 12, color: colors.gray }}>{pack.sport} · {pack.members} members</Text>
        </View>
        <Pressable
          onPress={onToggle}
          style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, borderWidth: 1.5, borderColor: joined ? colors.green : colors.border, backgroundColor: joined ? `${colors.green}15` : 'transparent' }}
        >
          <Text style={{ fontSize: 12, fontWeight: '700', color: joined ? colors.green : colors.gray }}>
            {joined ? '✓ Member' : 'Join'}
          </Text>
        </Pressable>
      </View>
      {pack.description && (
        <Text style={{ fontSize: 12, color: colors.gray, marginTop: 10, lineHeight: 18 }}>{pack.description}</Text>
      )}
    </View>
  );
}
