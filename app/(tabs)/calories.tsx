import { View, Text, ScrollView, Pressable, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../../lib/colors';

const API_BASE = 'https://packd.fit';

interface CalorieResult {
  items: Array<{ name: string; calories: number; protein: number; carbs: number; fat: number }>;
  total: { calories: number; protein: number; carbs: number; fat: number };
  insight: string;
}

export default function CaloriesScreen() {
  const [mode, setMode] = useState<'home' | 'text' | 'result'>('home');
  const [loading, setLoading] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [result, setResult] = useState<CalorieResult | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow photo access to scan meals.');
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'] as any, quality: 0.8 });
    if (!res.canceled && res.assets[0]) {
      await analyseImage(res.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow camera access to scan meals.');
      return;
    }
    const res = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!res.canceled && res.assets[0]) {
      await analyseImage(res.assets[0].uri);
    }
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
      setMode('result');
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Could not analyse image');
    } finally {
      setLoading(false);
    }
  };

  const analyseText = async () => {
    if (!textInput.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/calories/analyse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textInput }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      setMode('result');
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Could not analyse meal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <Text style={{ fontSize: 20, fontWeight: '900', color: '#fff' }}>
          🔥 Calorie Tracker
        </Text>
        <Text style={{ fontSize: 13, color: colors.gray, marginTop: 4 }}>
          Snap a photo or describe your meal to log calories instantly
        </Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <ActivityIndicator size="large" color={colors.orange} />
          <Text style={{ color: colors.gray, fontSize: 14 }}>Analysing your meal...</Text>
        </View>
      ) : mode === 'result' && result ? (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }}>
          {/* Total summary */}
          <View style={{ backgroundColor: colors.card, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: colors.border }}>
            <View style={{ height: 3, backgroundColor: colors.orange }} />
            <View style={{ padding: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: '800', color: '#fff', marginBottom: 14 }}>Meal Summary</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                {[
                  { label: 'Calories', value: result.total.calories, unit: 'kcal', color: colors.orange },
                  { label: 'Protein', value: result.total.protein, unit: 'g', color: colors.green },
                  { label: 'Carbs', value: result.total.carbs, unit: 'g', color: colors.gold },
                  { label: 'Fat', value: result.total.fat, unit: 'g', color: '#818CF8' },
                ].map(({ label, value, unit, color }) => (
                  <View key={label} style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 22, fontWeight: '900', color }}>{value}</Text>
                    <Text style={{ fontSize: 10, color: colors.gray }}>{unit}</Text>
                    <Text style={{ fontSize: 11, color: colors.gray }}>{label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Items breakdown */}
          <View style={{ backgroundColor: colors.card, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ fontSize: 14, fontWeight: '800', color: '#fff', marginBottom: 12 }}>Items Detected</Text>
            {result.items.map((item, i) => (
              <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: i < result.items.length - 1 ? 1 : 0, borderBottomColor: colors.border }}>
                <Text style={{ fontSize: 13, color: colors.text, flex: 1 }}>{item.name}</Text>
                <Text style={{ fontSize: 13, fontWeight: '700', color: colors.orange }}>{item.calories} kcal</Text>
              </View>
            ))}
          </View>

          {/* AI Insight */}
          {result.insight && (
            <View style={{ backgroundColor: `${colors.orange}12`, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: `${colors.orange}30` }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: colors.orange, marginBottom: 6 }}>💡 AI INSIGHT</Text>
              <Text style={{ fontSize: 13, color: colors.text, lineHeight: 20 }}>{result.insight}</Text>
            </View>
          )}

          <Pressable
            onPress={() => { setMode('home'); setResult(null); setTextInput(''); }}
            style={{ backgroundColor: colors.card2, borderRadius: 14, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: colors.border }}
          >
            <Text style={{ color: colors.text, fontWeight: '700' }}>Log Another Meal</Text>
          </Pressable>
        </ScrollView>
      ) : mode === 'text' ? (
        <View style={{ flex: 1, padding: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#fff', marginBottom: 8 }}>Describe your meal</Text>
          <Text style={{ fontSize: 13, color: colors.gray, marginBottom: 16 }}>
            Type what you ate — e.g. "2 rotis with dal and a glass of lassi"
          </Text>
          <TextInput
            value={textInput}
            onChangeText={setTextInput}
            placeholder="e.g. 2 rotis, dal makhani, 1 glass of lassi..."
            placeholderTextColor={colors.gray}
            multiline
            style={{
              backgroundColor: colors.card2,
              borderRadius: 14,
              padding: 16,
              color: '#fff',
              fontSize: 14,
              borderWidth: 1,
              borderColor: colors.border,
              minHeight: 120,
              textAlignVertical: 'top',
              marginBottom: 16,
            }}
          />
          <Pressable
            onPress={analyseText}
            disabled={!textInput.trim()}
            style={{ backgroundColor: textInput.trim() ? colors.orange : colors.card2, borderRadius: 14, paddingVertical: 14, alignItems: 'center' }}
          >
            <Text style={{ color: textInput.trim() ? '#fff' : colors.gray, fontWeight: '800', fontSize: 15 }}>Analyse Meal →</Text>
          </Pressable>
          <Pressable onPress={() => setMode('home')} style={{ marginTop: 12, alignItems: 'center' }}>
            <Text style={{ color: colors.gray }}>← Back</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }}>
          {/* Today's summary */}
          <View style={{ backgroundColor: colors.card, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ fontSize: 14, fontWeight: '800', color: '#fff', marginBottom: 4 }}>Today's Log</Text>
            <Text style={{ fontSize: 12, color: colors.gray, marginBottom: 14 }}>No meals logged yet</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              {[
                { label: 'Calories', value: '—', color: colors.orange },
                { label: 'Protein', value: '—', color: colors.green },
                { label: 'Carbs', value: '—', color: colors.gold },
                { label: 'Fat', value: '—', color: '#818CF8' },
              ].map(({ label, value, color }) => (
                <View key={label} style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 22, fontWeight: '900', color }}>{value}</Text>
                  <Text style={{ fontSize: 11, color: colors.gray }}>{label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Log meal options */}
          <Text style={{ fontSize: 14, fontWeight: '800', color: '#fff' }}>Log a Meal</Text>

          <Pressable
            onPress={takePhoto}
            style={{ backgroundColor: colors.card, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', gap: 14 }}
          >
            <View style={{ width: 52, height: 52, borderRadius: 14, backgroundColor: `${colors.orange}20`, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 26 }}>📸</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#fff' }}>Take a Photo</Text>
              <Text style={{ fontSize: 13, color: colors.gray, marginTop: 2 }}>Point your camera at your meal</Text>
            </View>
            <Text style={{ color: colors.orange, fontSize: 18 }}>→</Text>
          </Pressable>

          <Pressable
            onPress={pickImage}
            style={{ backgroundColor: colors.card, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', gap: 14 }}
          >
            <View style={{ width: 52, height: 52, borderRadius: 14, backgroundColor: `${colors.green}20`, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 26 }}>🖼️</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#fff' }}>Choose from Gallery</Text>
              <Text style={{ fontSize: 13, color: colors.gray, marginTop: 2 }}>Pick an existing photo</Text>
            </View>
            <Text style={{ color: colors.orange, fontSize: 18 }}>→</Text>
          </Pressable>

          <Pressable
            onPress={() => setMode('text')}
            style={{ backgroundColor: colors.card, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', gap: 14 }}
          >
            <View style={{ width: 52, height: 52, borderRadius: 14, backgroundColor: `${colors.gold}20`, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 26 }}>✏️</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#fff' }}>Describe Your Meal</Text>
              <Text style={{ fontSize: 13, color: colors.gray, marginTop: 2 }}>Type what you ate</Text>
            </View>
            <Text style={{ color: colors.orange, fontSize: 18 }}>→</Text>
          </Pressable>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
