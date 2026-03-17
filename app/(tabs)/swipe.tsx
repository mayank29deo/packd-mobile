import {
  View, Text, ScrollView, Pressable, TextInput, Alert,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../lib/colors';

const SPORTS = ['Running', 'Cycling', 'Yoga', 'Football', 'Basketball', 'Tennis', 'Swimming', 'Hiking', 'CrossFit', 'Badminton'];
const LEVELS = ['All levels', 'Beginner', 'Intermediate', 'Advanced'];
const COSTS = ['Free', '₹100', '₹200', '₹300', '₹500'];

export default function CreateScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [sport, setSport] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [area, setArea] = useState('');
  const [level, setLevel] = useState('All levels');
  const [maxSpots, setMaxSpots] = useState('20');
  const [cost, setCost] = useState('Free');
  const [description, setDescription] = useState('');
  const [done, setDone] = useState(false);

  const canNext = () => {
    if (step === 0) return !!sport;
    if (step === 1) return !!title && !!date && !!time;
    if (step === 2) return !!venue && !!area;
    return true;
  };

  const progressPct = (step / 4) * 100;

  if (done) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ fontSize: 56 }}>🎉</Text>
        <Text style={{ fontSize: 26, fontWeight: '900', color: '#fff', marginTop: 16, textAlign: 'center' }}>Event Created!</Text>
        <Text style={{ fontSize: 14, color: colors.gray, marginTop: 8, textAlign: 'center' }}>Your event is live. The community can now find and join it.</Text>
        <View style={{ marginTop: 20, backgroundColor: `${colors.orange}18`, borderRadius: 14, paddingHorizontal: 20, paddingVertical: 10, borderWidth: 1, borderColor: `${colors.orange}40` }}>
          <Text style={{ color: colors.orange, fontWeight: '800', fontSize: 14 }}>🏅 +200 XP earned!</Text>
        </View>
        <View style={{ marginTop: 14, backgroundColor: colors.card, borderRadius: 18, padding: 16, width: '100%', borderWidth: 1, borderColor: colors.border }}>
          <Text style={{ fontSize: 11, color: colors.orange, fontWeight: '700', marginBottom: 4 }}>{sport}</Text>
          <Text style={{ fontSize: 18, fontWeight: '900', color: '#fff', marginBottom: 6 }}>{title}</Text>
          <Text style={{ fontSize: 13, color: colors.gray }}>📍 {venue}, {area}</Text>
          <Text style={{ fontSize: 13, color: colors.gray, marginTop: 2 }}>🕐 {date} · {time}</Text>
          <Text style={{ fontSize: 13, color: cost === 'Free' ? colors.green : colors.gold, fontWeight: '700', marginTop: 2 }}>{cost}</Text>
        </View>
        <Pressable onPress={() => router.push('/(tabs)/explore' as any)}
          style={{ marginTop: 20, backgroundColor: colors.card2, borderRadius: 14, paddingVertical: 13, paddingHorizontal: 32, borderWidth: 1, borderColor: colors.border }}>
          <Text style={{ color: colors.text, fontWeight: '700' }}>View in Explore</Text>
        </Pressable>
        <Pressable onPress={() => { setDone(false); setStep(0); setSport(''); setTitle(''); setDate(''); setTime(''); setVenue(''); setArea(''); setDescription(''); }}>
          <Text style={{ color: colors.orange, fontWeight: '700', marginTop: 10 }}>Create another event</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        {step > 0 ? (
          <Pressable onPress={() => setStep((s) => s - 1)} style={{ marginRight: 12 }}>
            <Ionicons name="arrow-back" size={22} color={colors.gray} />
          </Pressable>
        ) : (
          <View style={{ width: 34 }} />
        )}
        <Text style={{ flex: 1, fontSize: 18, fontWeight: '900', color: '#fff' }}>
          {step === 0 ? 'Choose a Sport' : step === 1 ? 'Event Details' : step === 2 ? 'Location' : 'Settings & Preview'}
        </Text>
        <Text style={{ color: colors.gray, fontSize: 13 }}>{step + 1} / 4</Text>
      </View>

      {/* Progress bar */}
      <View style={{ height: 3, backgroundColor: colors.border }}>
        <View style={{ height: 3, width: `${progressPct}%`, backgroundColor: colors.orange }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }} showsVerticalScrollIndicator={false}>

        {/* Step 0: Sport */}
        {step === 0 && (
          <View style={{ gap: 10 }}>
            <Text style={{ fontSize: 14, color: colors.gray }}>What sport is this event for?</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {SPORTS.map((s) => (
                <Pressable key={s} onPress={() => setSport(s)}
                  style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14, borderWidth: 1.5,
                    backgroundColor: sport === s ? colors.orange : colors.card,
                    borderColor: sport === s ? colors.orange : colors.border }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: sport === s ? '#fff' : colors.text }}>{s}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Step 1: Details */}
        {step === 1 && (
          <View style={{ gap: 14 }}>
            <Field label="Event Title" value={title} onChange={setTitle} placeholder="e.g. Sunday Long Run @ Cubbon" />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Field label="Date" value={date} onChange={setDate} placeholder="e.g. Sun 15 Jun" />
              </View>
              <View style={{ flex: 1 }}>
                <Field label="Time" value={time} onChange={setTime} placeholder="e.g. 6:30 AM" />
              </View>
            </View>
            <Field label="Description (optional)" value={description} onChange={setDescription} placeholder="Tell people what to expect..." multiline />
          </View>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <View style={{ gap: 14 }}>
            <Field label="Venue Name" value={venue} onChange={setVenue} placeholder="e.g. Cubbon Park, Nandi Hills" />
            <Field label="Area / Neighbourhood" value={area} onChange={setArea} placeholder="e.g. Central Bangalore" />
            <View style={{ backgroundColor: colors.card2, borderRadius: 14, padding: 20, borderWidth: 1, borderColor: colors.border, alignItems: 'center' }}>
              <Ionicons name="map-outline" size={40} color={colors.border} />
              <Text style={{ color: colors.gray, fontSize: 12, marginTop: 8 }}>Map view coming soon</Text>
            </View>
          </View>
        )}

        {/* Step 3: Settings + Preview */}
        {step === 3 && (
          <View style={{ gap: 16 }}>
            {/* Level */}
            <View>
              <Text style={{ fontSize: 12, fontWeight: '700', color: colors.gray, marginBottom: 8 }}>SKILL LEVEL</Text>
              <View style={{ gap: 8 }}>
                {LEVELS.map((l) => (
                  <Pressable key={l} onPress={() => setLevel(l)}
                    style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 12, padding: 12, borderWidth: 1.5, borderColor: level === l ? colors.orange : colors.border }}>
                    <View style={{ width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: level === l ? colors.orange : colors.gray, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                      {level === l && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.orange }} />}
                    </View>
                    <Text style={{ color: level === l ? '#fff' : colors.text, fontWeight: level === l ? '700' : '400' }}>{l}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Max spots */}
            <View>
              <Text style={{ fontSize: 12, fontWeight: '700', color: colors.gray, marginBottom: 6 }}>MAX SPOTS</Text>
              <TextInput
                value={maxSpots}
                onChangeText={setMaxSpots}
                keyboardType="number-pad"
                style={{ backgroundColor: colors.card, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, color: '#fff', fontSize: 15, borderWidth: 1, borderColor: colors.border }}
              />
            </View>

            {/* Cost */}
            <View>
              <Text style={{ fontSize: 12, fontWeight: '700', color: colors.gray, marginBottom: 8 }}>COST PER PERSON</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {COSTS.map((c) => (
                  <Pressable key={c} onPress={() => setCost(c)}
                    style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1.5,
                      backgroundColor: cost === c ? colors.orange : colors.card,
                      borderColor: cost === c ? colors.orange : colors.border }}>
                    <Text style={{ fontWeight: '700', color: cost === c ? '#fff' : colors.text }}>{c}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Preview card */}
            <View>
              <Text style={{ fontSize: 12, fontWeight: '700', color: colors.gray, marginBottom: 8 }}>PREVIEW</Text>
              <View style={{ backgroundColor: colors.card, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.border }}>
                <Text style={{ fontSize: 11, color: colors.orange, fontWeight: '700', marginBottom: 4 }}>{sport}</Text>
                <Text style={{ fontSize: 17, fontWeight: '900', color: '#fff', marginBottom: 6 }}>{title}</Text>
                <Text style={{ fontSize: 13, color: colors.gray }}>📍 {venue}{area ? `, ${area}` : ''}</Text>
                <Text style={{ fontSize: 13, color: colors.gray, marginTop: 2 }}>🕐 {date} · {time}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                  <Text style={{ fontSize: 13, color: colors.gray }}>⚡ {level} · {maxSpots} spots</Text>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: cost === 'Free' ? colors.green : colors.gold }}>{cost}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

      </ScrollView>

      {/* Bottom CTA */}
      <View style={{ paddingHorizontal: 16, paddingBottom: 16, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border }}>
        {step < 3 ? (
          <Pressable
            onPress={() => canNext() && setStep((s) => s + 1)}
            style={{ backgroundColor: canNext() ? colors.orange : colors.card2, borderRadius: 16, paddingVertical: 16, alignItems: 'center', borderWidth: 1, borderColor: canNext() ? colors.orange : colors.border }}
          >
            <Text style={{ color: canNext() ? '#fff' : colors.gray, fontWeight: '900', fontSize: 16 }}>Continue →</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => {
              if (!title || !venue || !date) {
                Alert.alert('Missing info', 'Please fill in all required fields.');
                return;
              }
              setDone(true);
            }}
            style={{ backgroundColor: colors.orange, borderRadius: 16, paddingVertical: 16, alignItems: 'center', shadowColor: colors.orange, shadowOpacity: 0.4, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 6 }}
          >
            <Text style={{ color: '#fff', fontWeight: '900', fontSize: 16 }}>🚀 Publish Event</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

function Field({ label, value, onChange, placeholder, multiline }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; multiline?: boolean;
}) {
  return (
    <View>
      <Text style={{ fontSize: 12, fontWeight: '700', color: colors.gray, marginBottom: 6 }}>{label.toUpperCase()}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.gray}
        multiline={multiline}
        style={{
          backgroundColor: colors.card,
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 12,
          color: '#fff',
          fontSize: 14,
          borderWidth: 1,
          borderColor: colors.border,
          minHeight: multiline ? 80 : undefined,
          textAlignVertical: multiline ? 'top' : undefined,
        }}
      />
    </View>
  );
}
