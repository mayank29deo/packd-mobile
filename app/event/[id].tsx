import { View, Text, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../lib/AppContext';
import { colors } from '../../lib/colors';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { events, rsvps, toggleRsvp, packs, joinedPacks, toggleJoinPack } = useApp();

  const event = events.find((e) => e.id === id);
  if (!event) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 48, marginBottom: 12 }}>🔍</Text>
        <Text style={{ color: colors.gray, marginBottom: 16 }}>Event not found</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={{ color: colors.orange }}>← Go back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const isRsvped = !!rsvps[event.id];
  const spotsLeft = event.max - event.rsvp;
  const fillPct = Math.min((event.rsvp / event.max) * 100, 100);
  const relatedPack = packs.find((p) => p.id === event.organizerId);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <Pressable onPress={() => router.back()}>
          <Text style={{ color: colors.gray, fontSize: 22 }}>←</Text>
        </Pressable>
        <Text style={{ flex: 1, fontSize: 15, fontWeight: '800', color: '#fff' }} numberOfLines={1}>{event.title}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 14 }}>
        {/* Hero card */}
        <View style={{ backgroundColor: colors.card, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: colors.border }}>
          <View style={{ height: 4, backgroundColor: colors.orange }} />
          <View style={{ padding: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
              <Text style={{ fontSize: 11, color: colors.orange, fontWeight: '700', backgroundColor: `${colors.orange}18`, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 }}>{event.sport}</Text>
              <Text style={{ fontSize: 14, fontWeight: '800', color: event.cost === 'Free' ? colors.green : colors.gold }}>{event.cost}</Text>
            </View>
            <Text style={{ fontSize: 22, fontWeight: '900', color: '#fff', marginBottom: 16 }}>{event.title}</Text>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
              {[
                { label: 'DATE & TIME', value: event.time },
                { label: 'VENUE', value: event.venue },
                { label: 'LEVEL', value: event.level },
              ].map(({ label, value }) => (
                <View key={label} style={{ backgroundColor: colors.card2, borderRadius: 12, padding: 12, minWidth: '45%', flex: 1 }}>
                  <Text style={{ fontSize: 9, color: colors.gray, marginBottom: 2 }}>{label}</Text>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#fff' }} numberOfLines={1}>{value}</Text>
                </View>
              ))}
            </View>

            {/* Spots */}
            <View style={{ marginBottom: 14 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text style={{ fontSize: 12, color: colors.gray }}>{event.rsvp} going</Text>
                <Text style={{ fontSize: 12, color: spotsLeft <= 5 ? '#F87171' : colors.gray }}>{spotsLeft} spots left</Text>
              </View>
              <View style={{ height: 6, backgroundColor: colors.border, borderRadius: 3 }}>
                <View style={{ height: 6, width: `${fillPct}%`, backgroundColor: colors.orange, borderRadius: 3 }} />
              </View>
            </View>

            <Pressable
              onPress={() => { if (spotsLeft > 0 || isRsvped) toggleRsvp(event.id); }}
              disabled={spotsLeft === 0 && !isRsvped}
              style={{
                paddingVertical: 14, borderRadius: 14, alignItems: 'center',
                backgroundColor: isRsvped ? `${colors.green}18` : spotsLeft === 0 ? colors.card2 : colors.orange,
                borderWidth: isRsvped ? 2 : 0, borderColor: isRsvped ? colors.green : 'transparent',
              }}>
              <Text style={{ fontWeight: '800', fontSize: 15, color: isRsvped ? colors.green : spotsLeft === 0 ? colors.gray : '#fff' }}>
                {isRsvped ? '✓ You\'re going! (Cancel RSVP)' : spotsLeft === 0 ? 'Event Full' : event.cost === 'Free' ? 'RSVP — Join Event' : `RSVP — Pay ${event.cost}`}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Description */}
        {event.description && (
          <View style={{ backgroundColor: colors.card, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ fontSize: 14, fontWeight: '800', color: '#fff', marginBottom: 8 }}>About this event</Text>
            <Text style={{ fontSize: 13, color: colors.gray, lineHeight: 20 }}>{event.description}</Text>
          </View>
        )}

        {/* Location */}
        <View style={{ backgroundColor: colors.card, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.border }}>
          <Text style={{ fontSize: 14, fontWeight: '800', color: '#fff', marginBottom: 12 }}>Location</Text>
          <View style={{ backgroundColor: colors.card2, borderRadius: 14, height: 100, alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
            <Text style={{ fontSize: 28, marginBottom: 4 }}>📍</Text>
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#fff' }}>{event.venue}</Text>
          </View>
          <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text }}>{event.venue}</Text>
          <Text style={{ fontSize: 12, color: colors.gray }}>{event.area}, Bangalore</Text>
        </View>

        {/* Organizer */}
        {relatedPack && (
          <View style={{ backgroundColor: colors.card, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ fontSize: 14, fontWeight: '800', color: '#fff', marginBottom: 12 }}>Organized by</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 50, height: 50, borderRadius: 14, backgroundColor: colors.card2, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                <Text style={{ fontSize: 24 }}>{relatedPack.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Text style={{ fontSize: 14, fontWeight: '800', color: '#fff' }}>{relatedPack.name}</Text>
                  {relatedPack.verified && <Text style={{ color: colors.orange, fontSize: 12 }}>✓</Text>}
                </View>
                <Text style={{ fontSize: 12, color: colors.gray }}>{relatedPack.sport} · {relatedPack.members} members</Text>
              </View>
              <Pressable onPress={() => toggleJoinPack(relatedPack.id)}
                style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1.5, borderColor: joinedPacks[relatedPack.id] ? colors.green : colors.border }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: joinedPacks[relatedPack.id] ? colors.green : colors.gray }}>
                  {joinedPacks[relatedPack.id] ? '✓ Member' : 'Join Pack'}
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
