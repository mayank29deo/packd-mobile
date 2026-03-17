import {
  View, Text, ScrollView, Pressable, TextInput, ActivityIndicator, Alert,
} from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../../lib/colors';

const API_BASE = 'https://packd.fit';

interface CalorieResult {
  items: Array<{ name: string; calories: number; protein: number; carbs: number; fat: number }>;
  total: { calories: number; protein: number; carbs: number; fat: number };
  insight: string;
}

const MACROS = [
  { label: 'Calories', key: 'calories', unit: 'kcal', color: colors.orange },
  { label: 'Protein',  key: 'protein',  unit: 'g',    color: '#22C55E' },
  { label: 'Carbs',    key: 'carbs',    unit: 'g',    color: '#EAB308' },
  { label: 'Fat',      key: 'fat',      unit: 'g',    color: '#818CF8' },
];

export default function CaloriesScreen() {
  const [tab, setTab] = useState<'scan' | 'today' | 'insights'>('scan');
  const [scanMode, setScanMode] = useState<'photo' | 'voice'>('photo');
  const [loading, setLoading] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [result, setResult] = useState<CalorieResult | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow photo access to scan meals.');
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'] as any, quality: 0.8 });
    if (!res.canceled && res.assets[0]) await analyseImage(res.assets[0].uri);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow camera access to scan meals.');
      return;
    }
    const res = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!res.canceled && res.assets[0]) await analyseImage(res.assets[0].uri);
  };

  const analyseImage = async (uri: string) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', { uri, type: 'image/jpeg', name: 'meal.jpg' } as any);
      const res = await fetch(`${API_BASE}/api/calories/analyse`, { method: 'POST', body: formData });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Could not analyse image');
    } finally {
      setLoading(false);
    }
  };

  const analyseVoice = async () => {
    if (!voiceText.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/calories/analyse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: voiceText }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Could not analyse meal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>

      {/* ── Header ── */}
      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            {/* Scan icon */}
            <View style={{ width: 44, height: 44, borderRadius: 13, backgroundColor: `${colors.orange}25`, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="scan" size={22} color={colors.orange} />
            </View>
            <View>
              <Text style={{ fontSize: 18, fontWeight: '900', color: '#fff' }}>Calorie Tracker</Text>
              <Text style={{ fontSize: 12, color: colors.gray, marginTop: 1 }}>💪 Gain · 2,778 kcal/day</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {/* Streak badge */}
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card2, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: colors.border, gap: 4 }}>
              <Text style={{ fontSize: 14 }}>🔥</Text>
              <Text style={{ color: '#fff', fontWeight: '800', fontSize: 13 }}>2d</Text>
            </View>
            <Pressable style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.card2, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border }}>
              <Ionicons name="create-outline" size={18} color={colors.gray} />
            </Pressable>
          </View>
        </View>

        {/* ── Screen tabs ── */}
        <View style={{ flexDirection: 'row', marginTop: 14, gap: 0 }}>
          {([
            { key: 'scan',     label: 'Scan',     icon: 'scan-outline' },
            { key: 'today',    label: 'Today',    icon: 'time-outline' },
            { key: 'insights', label: 'Insights', icon: 'bar-chart-outline' },
          ] as const).map(({ key, label, icon }) => (
            <Pressable key={key} onPress={() => setTab(key)} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 8, borderBottomWidth: 2, borderBottomColor: tab === key ? colors.orange : 'transparent' }}>
              <Ionicons name={icon} size={15} color={tab === key ? colors.orange : colors.gray} />
              <Text style={{ fontSize: 13, fontWeight: '700', color: tab === key ? colors.orange : colors.gray }}>{label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* ── Loading overlay ── */}
      {loading && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <ActivityIndicator size="large" color={colors.orange} />
          <Text style={{ color: colors.gray, fontSize: 14 }}>Analysing your meal...</Text>
        </View>
      )}

      {/* ── Result view ── */}
      {!loading && result && (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }}>
          <View style={{ backgroundColor: colors.card, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: colors.border }}>
            <View style={{ height: 3, backgroundColor: colors.orange }} />
            <View style={{ padding: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: '800', color: '#fff', marginBottom: 14 }}>Meal Summary</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                {MACROS.map(({ label, key, unit, color }) => (
                  <View key={label} style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 22, fontWeight: '900', color }}>{(result.total as any)[key]}</Text>
                    <Text style={{ fontSize: 10, color: colors.gray }}>{unit}</Text>
                    <Text style={{ fontSize: 11, color: colors.gray }}>{label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View style={{ backgroundColor: colors.card, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ fontSize: 14, fontWeight: '800', color: '#fff', marginBottom: 12 }}>Items Detected</Text>
            {result.items.map((item, i) => (
              <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: i < result.items.length - 1 ? 1 : 0, borderBottomColor: colors.border }}>
                <Text style={{ fontSize: 13, color: colors.text, flex: 1 }}>{item.name}</Text>
                <Text style={{ fontSize: 13, fontWeight: '700', color: colors.orange }}>{item.calories} kcal</Text>
              </View>
            ))}
          </View>

          {result.insight && (
            <View style={{ backgroundColor: `${colors.orange}12`, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: `${colors.orange}30` }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: colors.orange, marginBottom: 6 }}>💡 AI INSIGHT</Text>
              <Text style={{ fontSize: 13, color: colors.text, lineHeight: 20 }}>{result.insight}</Text>
            </View>
          )}

          <Pressable onPress={() => setResult(null)}
            style={{ backgroundColor: colors.card2, borderRadius: 14, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ color: colors.text, fontWeight: '700' }}>Log Another Meal</Text>
          </Pressable>
        </ScrollView>
      )}

      {/* ── Scan tab ── */}
      {!loading && !result && tab === 'scan' && (
        <View style={{ flex: 1 }}>
          {/* Photo / Voice toggle */}
          <View style={{ flexDirection: 'row', margin: 16, backgroundColor: colors.card2, borderRadius: 14, padding: 4, borderWidth: 1, borderColor: colors.border }}>
            <Pressable onPress={() => setScanMode('photo')} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 11, backgroundColor: scanMode === 'photo' ? colors.orange : 'transparent' }}>
              <Ionicons name="camera" size={18} color={scanMode === 'photo' ? '#fff' : colors.gray} />
              <Text style={{ fontWeight: '700', fontSize: 14, color: scanMode === 'photo' ? '#fff' : colors.gray }}>Photo</Text>
            </Pressable>
            <Pressable onPress={() => setScanMode('voice')} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 11, backgroundColor: scanMode === 'voice' ? colors.orange : 'transparent' }}>
              <Ionicons name="mic" size={18} color={scanMode === 'voice' ? '#fff' : colors.gray} />
              <Text style={{ fontWeight: '700', fontSize: 14, color: scanMode === 'voice' ? '#fff' : colors.gray }}>Voice</Text>
            </Pressable>
          </View>

          {scanMode === 'photo' ? (
            <View style={{ flex: 1, paddingHorizontal: 16 }}>
              {/* Dashed drop-zone */}
              <Pressable onPress={pickImage}
                style={{ borderWidth: 1.5, borderColor: colors.border, borderStyle: 'dashed', borderRadius: 20, alignItems: 'center', justifyContent: 'center', padding: 40, gap: 14, marginBottom: 14 }}>
                <View style={{ width: 64, height: 64, borderRadius: 18, backgroundColor: `${colors.orange}20`, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="scan" size={32} color={colors.orange} />
                </View>
                <Text style={{ fontSize: 18, fontWeight: '800', color: '#fff' }}>Snap or upload a food photo</Text>
                <Text style={{ fontSize: 13, color: colors.gray, textAlign: 'center' }}>JPG, PNG, WebP · Meals, snacks, anything</Text>
                <View style={{ backgroundColor: `${colors.orange}20`, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1, borderColor: `${colors.orange}40` }}>
                  <Text style={{ color: colors.orange, fontWeight: '700', fontSize: 12 }}>Powered by AI ✦</Text>
                </View>
              </Pressable>

              {/* Camera button */}
              <Pressable onPress={takePhoto}
                style={{ backgroundColor: colors.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: `${colors.orange}20`, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="camera" size={22} color={colors.orange} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: '800', color: '#fff' }}>Take a Photo</Text>
                  <Text style={{ fontSize: 12, color: colors.gray }}>Open camera and snap your meal</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.orange} />
              </Pressable>
            </View>
          ) : (
            <View style={{ flex: 1, padding: 16 }}>
              <Text style={{ fontSize: 15, fontWeight: '800', color: '#fff', marginBottom: 6 }}>Describe your meal</Text>
              <Text style={{ fontSize: 13, color: colors.gray, marginBottom: 14 }}>
                Type what you ate — e.g. "2 rotis with dal and a glass of lassi"
              </Text>
              <TextInput
                value={voiceText}
                onChangeText={setVoiceText}
                placeholder="e.g. 2 rotis, dal makhani, 1 glass of lassi..."
                placeholderTextColor={colors.gray}
                multiline
                style={{ backgroundColor: colors.card2, borderRadius: 14, padding: 16, color: '#fff', fontSize: 14, borderWidth: 1, borderColor: colors.border, minHeight: 120, textAlignVertical: 'top', marginBottom: 14 }}
              />
              <Pressable onPress={analyseVoice} disabled={!voiceText.trim()}
                style={{ backgroundColor: voiceText.trim() ? colors.orange : colors.card2, borderRadius: 14, paddingVertical: 14, alignItems: 'center' }}>
                <Text style={{ color: voiceText.trim() ? '#fff' : colors.gray, fontWeight: '800', fontSize: 15 }}>Analyse Meal →</Text>
              </Pressable>
            </View>
          )}
        </View>
      )}

      {/* ── Today tab ── */}
      {!loading && !result && tab === 'today' && (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }}>
          {/* Macro ring summary */}
          <View style={{ backgroundColor: colors.card, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ fontSize: 14, fontWeight: '800', color: '#fff', marginBottom: 4 }}>Today's Log</Text>
            <Text style={{ fontSize: 12, color: colors.gray, marginBottom: 16 }}>No meals logged yet</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              {MACROS.map(({ label, color }) => (
                <View key={label} style={{ alignItems: 'center', gap: 6 }}>
                  <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: color }} />
                  <Text style={{ fontSize: 18, fontWeight: '900', color }}>—</Text>
                  <Text style={{ fontSize: 11, color: colors.gray }}>{label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Goal card */}
          <View style={{ backgroundColor: colors.card, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: `${colors.orange}30` }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: colors.orange, marginBottom: 4 }}>DAILY GOAL</Text>
            <Text style={{ fontSize: 22, fontWeight: '900', color: '#fff' }}>2,778 kcal</Text>
            <Text style={{ fontSize: 12, color: colors.gray, marginTop: 2 }}>💪 Gain · 0 / 2,778 kcal consumed</Text>
            <View style={{ marginTop: 12, height: 6, backgroundColor: colors.border, borderRadius: 3 }}>
              <View style={{ height: 6, width: '0%', backgroundColor: colors.orange, borderRadius: 3 }} />
            </View>
          </View>

          <Pressable onPress={() => setTab('scan')}
            style={{ backgroundColor: colors.orange, borderRadius: 14, paddingVertical: 14, alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15 }}>+ Log a Meal</Text>
          </Pressable>
        </ScrollView>
      )}

      {/* ── Insights tab ── */}
      {!loading && !result && tab === 'insights' && (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }}>
          {[
            { label: 'Avg. daily calories', value: '—', color: colors.orange, icon: '🔥' },
            { label: 'Avg. protein', value: '—', color: '#22C55E', icon: '💪' },
            { label: 'Streak', value: '2 days', color: colors.gold, icon: '🔥' },
            { label: 'Meals logged', value: '0', color: '#818CF8', icon: '📋' },
          ].map(({ label, value, color, icon }) => (
            <View key={label} style={{ backgroundColor: colors.card, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <Text style={{ fontSize: 28 }}>{icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, color: colors.gray }}>{label}</Text>
                <Text style={{ fontSize: 22, fontWeight: '900', color, marginTop: 2 }}>{value}</Text>
              </View>
            </View>
          ))}
          <View style={{ backgroundColor: `${colors.orange}10`, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: `${colors.orange}25`, alignItems: 'center' }}>
            <Text style={{ color: colors.gray, fontSize: 13, textAlign: 'center' }}>Log meals to unlock detailed insights and weekly trends</Text>
          </View>
        </ScrollView>
      )}

    </SafeAreaView>
  );
}
