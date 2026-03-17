import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp, SPORT_COLORS } from '../../lib/AppContext';
import { colors } from '../../lib/colors';

const SPORTS = ['All', 'Running', 'Cycling', 'Yoga', 'Football', 'Basketball', 'Tennis'];

export default function EventsScreen() {
  const router = useRouter();
  const { events, rsvps } = useApp();
  const [activeSport, setActiveSport] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = events.filter((e) => {
    const matchSport = activeSport === 'All' || e.sport === activeSport;
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) || e.venue.toLowerCase().includes(search.toLowerCase());
    return matchSport && matchSearch;
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <Text style={{ fontSize: 20, fontWeight: '900', color: '#fff', marginBottom: 10 }}>Events</Text>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search events or venues..."
          placeholderTextColor={colors.gray}
          style={{ backgroundColor: colors.card2, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, color: '#fff', fontSize: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.border }}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 10 }}>
          {SPORTS.map((s) => (
            <Pressable key={s} onPress={() => setActiveSport(s)}
              style={{
                paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
                backgroundColor: activeSport === s ? colors.orange : colors.card2,
                borderWidth: 1, borderColor: activeSport === s ? colors.orange : colors.border,
              }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: activeSport === s ? '#fff' : colors.gray }}>{s}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 12 }}>
        {filtered.map((event) => {
          const spotsLeft = event.max - event.rsvp;
          const fillPct = Math.min((event.rsvp / event.max) * 100, 100);
          return (
            <Pressable key={event.id} onPress={() => router.push(`/event/${event.id}`)}
              style={{ backgroundColor: colors.card, borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: colors.border }}>
              <View style={{ height: 3, backgroundColor: colors.orange }} />
              <View style={{ padding: 14 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: colors.orange, backgroundColor: `${colors.orange}18`, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 }}>{event.sport}</Text>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: event.cost === 'Free' ? colors.green : colors.gold }}>{event.cost}</Text>
                </View>
                <Text style={{ fontSize: 16, fontWeight: '900', color: '#fff', marginBottom: 8 }}>{event.title}</Text>
                <View style={{ flexDirection: 'row', gap: 16, marginBottom: 10 }}>
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
        {filtered.length === 0 && (
          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <Text style={{ fontSize: 32, marginBottom: 8 }}>🔍</Text>
            <Text style={{ color: colors.gray }}>No events found</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
