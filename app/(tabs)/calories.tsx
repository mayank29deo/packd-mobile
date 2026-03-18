'use client';
import {
  View, Text, ScrollView, Pressable, TextInput,
  ActivityIndicator, Alert, Image, Animated,
} from 'react-native';
import { useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { Audio } from 'expo-av';
import { colors } from '../../lib/colors';

const API_BASE = 'https://packd-lovat.vercel.app';

// ─── Types ────────────────────────────────────────────────────────────────────
interface ScanResult {
  meal: string;
  totalCalories: number;
  macros: { protein: number; carbs: number; fat: number };
  items?: Array<{ name: string; calories: number; portion?: string }>;
  confidence?: 'high' | 'medium' | 'low';
  servingNote?: string;
  athleteTip?: string;
}

interface MealLog {
  id: string;
  meal_name: string;
  total_calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  logged_at: string;
}

const LANGS = [
  { code: 'en-IN', label: 'EN' },
  { code: 'hi-IN', label: 'हिं' },
  { code: 'ta-IN', label: 'தமிழ்' },
  { code: 'te-IN', label: 'తెలుగు' },
];

// ─── MacroBar ─────────────────────────────────────────────────────────────────
function MacroBar({ label, grams, color }: { label: string; grams: number; color: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <Text style={{ fontSize: 11, color: colors.gray, width: 50 }}>{label}</Text>
      <View style={{ flex: 1, height: 7, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden' }}>
        <View style={{ height: 7, width: `${Math.min((grams / 60) * 100, 100)}%`, backgroundColor: color, borderRadius: 4 }} />
      </View>
      <Text style={{ fontSize: 11, fontWeight: '600', color: colors.text, width: 36, textAlign: 'right' }}>{grams}g</Text>
    </View>
  );
}

// ─── Result Card ──────────────────────────────────────────────────────────────
function ResultCard({ result, onReset, label }: { result: ScanResult; onReset: () => void; label: string }) {
  const maxMacro = Math.max(result.macros.protein, result.macros.carbs, result.macros.fat, 1);
  const confColor = result.confidence === 'high' ? '#3fb950'
    : result.confidence === 'medium' ? '#d4ac0d' : colors.gray;
  const confLabel = result.confidence === 'high' ? 'High confidence'
    : result.confidence === 'medium' ? 'Approx' : 'Estimate';

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }} showsVerticalScrollIndicator={false}>
      {/* Main calorie card */}
      <View style={{ backgroundColor: colors.card, borderRadius: 18, padding: 18, borderWidth: 1, borderColor: colors.border }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4, gap: 8 }}>
          <Text style={{ fontSize: 15, fontWeight: '800', color: '#fff', flex: 1 }}>{result.meal}</Text>
          {result.confidence && (
            <View style={{ backgroundColor: `${confColor}20`, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: `${confColor}40` }}>
              <Text style={{ fontSize: 10, fontWeight: '700', color: confColor }}>{confLabel}</Text>
            </View>
          )}
        </View>
        {result.servingNote && (
          <Text style={{ fontSize: 12, color: colors.gray, marginBottom: 12 }}>{result.servingNote}</Text>
        )}
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginBottom: 18 }}>
          <Text style={{ fontSize: 52, fontWeight: '900', color: colors.orange, lineHeight: 58 }}>{result.totalCalories}</Text>
          <Text style={{ fontSize: 14, color: colors.gray, paddingBottom: 6 }}>kcal</Text>
        </View>
        <View style={{ gap: 10 }}>
          {[
            { label: 'Protein', grams: result.macros.protein, color: colors.orange },
            { label: 'Carbs',   grams: result.macros.carbs,   color: '#EAB308' },
            { label: 'Fat',     grams: result.macros.fat,      color: '#3fb950' },
          ].map(({ label, grams, color }) => {
            const pct = Math.min((grams / maxMacro) * 100, 100);
            return (
              <View key={label} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontSize: 11, color: colors.gray, width: 50 }}>{label}</Text>
                <View style={{ flex: 1, height: 7, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden' }}>
                  <View style={{ height: 7, width: `${pct}%`, backgroundColor: color, borderRadius: 4 }} />
                </View>
                <Text style={{ fontSize: 11, fontWeight: '600', color: colors.text, width: 36, textAlign: 'right' }}>{grams}g</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Breakdown */}
      {result.items && result.items.length > 0 && (
        <View style={{ backgroundColor: colors.card, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.border }}>
          <Text style={{ fontSize: 10, fontWeight: '700', color: colors.gray, letterSpacing: 1, marginBottom: 12 }}>BREAKDOWN</Text>
          <View style={{ gap: 10 }}>
            {result.items.map((item, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, color: '#fff' }}>{item.name}</Text>
                  {item.portion && <Text style={{ fontSize: 11, color: colors.gray }}>{item.portion}</Text>}
                </View>
                <Text style={{ fontSize: 13, fontWeight: '600', color: colors.orange }}>{item.calories} kcal</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Athlete Tip */}
      {result.athleteTip && (
        <View style={{ backgroundColor: `${colors.orange}10`, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: `${colors.orange}25` }}>
          <Text style={{ fontSize: 10, fontWeight: '700', color: colors.orange, letterSpacing: 1, marginBottom: 6 }}>ATHLETE TIP</Text>
          <Text style={{ fontSize: 13, color: colors.text, lineHeight: 20 }}>{result.athleteTip}</Text>
        </View>
      )}

      {/* Logged confirmation */}
      <View style={{ backgroundColor: '#3fb95010', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#3fb95030', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text style={{ color: '#3fb950', fontWeight: '800' }}>✓</Text>
        <Text style={{ fontSize: 12, color: '#3fb950', fontWeight: '600' }}>Meal logged — check Today tab for your daily totals</Text>
      </View>

      {/* Reset */}
      <Pressable onPress={onReset} style={{ backgroundColor: colors.card2, borderRadius: 14, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: colors.border }}>
        <Text style={{ color: colors.text, fontWeight: '700' }}>{label}</Text>
      </Pressable>
      <View style={{ height: 8 }} />
    </ScrollView>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function CaloriesScreen() {
  const [tab, setTab] = useState<'scan' | 'today' | 'insights'>('scan');
  const [scanMode, setScanMode] = useState<'photo' | 'voice'>('photo');

  // Photo state
  const [preview, setPreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [scanLoading, setScanLoading] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  // Voice state
  const [voiceText, setVoiceText] = useState('');
  const [voiceLang, setVoiceLang] = useState('en-IN');
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [voiceResult, setVoiceResult] = useState<ScanResult | null>(null);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  // Recording state
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [sttFailed, setSttFailed] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseLoop = useRef<Animated.CompositeAnimation | null>(null);
  const voiceInputRef = useRef<any>(null);

  // Meal log (in-memory)
  const [logs, setLogs] = useState<MealLog[]>([]);
  const streak = logs.length > 0 ? 2 : 0;
  const dailyTarget = 2778;

  // Derived today stats
  const todayLogs = logs;
  const todayCalories = todayLogs.reduce((s, l) => s + l.total_calories, 0);
  const todayMacros = todayLogs.reduce(
    (acc, l) => ({ protein: acc.protein + (l.protein_g || 0), carbs: acc.carbs + (l.carbs_g || 0), fat: acc.fat + (l.fat_g || 0) }),
    { protein: 0, carbs: 0, fat: 0 }
  );
  const calPct = Math.min((todayCalories / dailyTarget) * 100, 100);

  // ── Pick image ───────────────────────────────────────────────────────────────
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission needed', 'Please allow photo access.'); return; }
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'] as any, quality: 0.8 });
    if (!res.canceled && res.assets[0]) {
      const asset = res.assets[0];
      setPreview(asset.uri);
      setScanResult(null); setScanError(null);
      const base64 = await FileSystem.readAsStringAsync(asset.uri, { encoding: 'base64' as any });
      setImageBase64(base64);
      setMimeType(asset.mimeType || 'image/jpeg');
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission needed', 'Please allow camera access.'); return; }
    const res = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!res.canceled && res.assets[0]) {
      const asset = res.assets[0];
      setPreview(asset.uri);
      setScanResult(null); setScanError(null);
      const base64 = await FileSystem.readAsStringAsync(asset.uri, { encoding: 'base64' as any });
      setImageBase64(base64);
      setMimeType(asset.mimeType || 'image/jpeg');
    }
  };

  const resetScan = () => { setPreview(null); setImageBase64(null); setScanResult(null); setScanError(null); };
  const resetVoice = () => { setVoiceText(''); setVoiceResult(null); setVoiceError(null); setSttFailed(false); };

  // ── Recording ─────────────────────────────────────────────────────────────
  const startPulse = () => {
    pulseLoop.current = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,   duration: 600, useNativeDriver: true }),
      ])
    );
    pulseLoop.current.start();
  };
  const stopPulse = () => { pulseLoop.current?.stop(); pulseAnim.setValue(1); };

  const WAV_OPTIONS: Audio.RecordingOptions = {
    android: {
      extension: '.wav',
      outputFormat: Audio.AndroidOutputFormat.DEFAULT,
      audioEncoder: Audio.AndroidAudioEncoder.DEFAULT,
      sampleRate: 16000, numberOfChannels: 1, bitRate: 256000,
    },
    ios: {
      extension: '.wav',
      outputFormat: Audio.IOSOutputFormat.LINEARPCM,
      audioQuality: Audio.IOSAudioQuality.HIGH,
      sampleRate: 16000, numberOfChannels: 1, bitRate: 256000,
      linearPCMBitDepth: 16, linearPCMIsBigEndian: false, linearPCMIsFloat: false,
    },
    web: {},
  };

  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) { Alert.alert('Permission needed', 'Allow microphone access.'); return; }
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording: rec } = await Audio.Recording.createAsync(WAV_OPTIONS);
      setRecording(rec);
      setIsRecording(true);
      setSttFailed(false);
      setVoiceError(null);
      startPulse();
    } catch (e: any) { Alert.alert('Recording failed', e.message); }
  };

  const stopRecording = async () => {
    if (!recording) return;
    stopPulse();
    setIsRecording(false);
    setTranscribing(true);
    try {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      const uri = recording.getURI();
      setRecording(null);
      if (!uri) throw new Error('No audio file found');
      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' as any });
      const res = await fetch(`${API_BASE}/api/calories/voice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioData: base64, mimeType: 'audio/wav', lang: voiceLang }),
      });
      const json = await res.json();
      if (json.sttFailed) { setSttFailed(true); setVoiceError('Speech recognition unavailable'); return; }
      if (!res.ok || !json.success) throw new Error(json.error || 'Transcription failed');
      setVoiceText(json.transcript || '');
    } catch (e: any) {
      // STT failed — surface error and show keyboard fallback
      setSttFailed(true);
      setVoiceError(e.message || 'Transcription failed');
    } finally { setTranscribing(false); }
  };

  // ── Analyse image ────────────────────────────────────────────────────────────
  const analyse = async () => {
    if (!imageBase64) return;
    setScanLoading(true); setScanError(null);
    try {
      const res = await fetch(`${API_BASE}/api/calories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData: imageBase64, mimeType }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Analysis failed');
      setScanResult(json.data);
      addLog(json.data);
    } catch (e: any) {
      setScanError(e.message || 'Could not analyse image');
    } finally {
      setScanLoading(false);
    }
  };

  // ── Analyse voice ────────────────────────────────────────────────────────────
  const analyseVoice = async () => {
    if (!voiceText.trim()) return;
    setVoiceLoading(true); setVoiceError(null);
    try {
      const res = await fetch(`${API_BASE}/api/calories/voice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: voiceText }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Voice analysis failed');
      setVoiceResult(json.data);
      addLog(json.data);
    } catch (e: any) {
      setVoiceError(e.message || 'Could not analyse meal');
    } finally {
      setVoiceLoading(false);
    }
  };

  const addLog = (data: ScanResult) => {
    setLogs(prev => [{
      id: 'local_' + Date.now(),
      meal_name: data.meal,
      total_calories: data.totalCalories,
      protein_g: data.macros.protein,
      carbs_g: data.macros.carbs,
      fat_g: data.macros.fat,
      logged_at: new Date().toISOString(),
    }, ...prev]);
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.bg }}>

      {/* ── Sticky header + tabs ── */}
      <View style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: `${colors.orange}18`, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="scan" size={18} color={colors.orange} />
            </View>
            <View>
              <Text style={{ fontSize: 16, fontWeight: '900', color: '#fff' }}>Calorie Tracker</Text>
              <Text style={{ fontSize: 11, color: colors.gray, marginTop: 1 }}>💪 Gain · {dailyTarget.toLocaleString()} kcal/day</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {streak > 0 && (
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: `${colors.orange}15`, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: `${colors.orange}25`, gap: 3 }}>
                <Text style={{ fontSize: 13 }}>🔥</Text>
                <Text style={{ fontSize: 11, fontWeight: '700', color: colors.orange }}>{streak}d</Text>
              </View>
            )}
            <Pressable style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border }}>
              <Ionicons name="create-outline" size={15} color={colors.gray} />
            </Pressable>
          </View>
        </View>

        {/* Tabs */}
        <View style={{ flexDirection: 'row' }}>
          {([
            { key: 'scan',     label: 'Scan',     icon: 'scan-outline' as const },
            { key: 'today',    label: 'Today',    icon: 'time-outline' as const },
            { key: 'insights', label: 'Insights', icon: 'bar-chart-outline' as const },
          ]).map(({ key, label, icon }) => (
            <Pressable key={key} onPress={() => setTab(key as any)}
              style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 10, borderBottomWidth: 2, borderBottomColor: tab === key ? colors.orange : 'transparent' }}>
              <Ionicons name={icon} size={13} color={tab === key ? colors.orange : colors.gray} />
              <Text style={{ fontSize: 12, fontWeight: '600', color: tab === key ? colors.orange : colors.gray }}>{label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* ── SCAN TAB ── */}
      {tab === 'scan' && (
        <>
          {/* Showing scan result */}
          {scanMode === 'photo' && scanResult && (
            <ResultCard result={scanResult} onReset={resetScan} label="Scan another meal" />
          )}
          {scanMode === 'voice' && voiceResult && (
            <ResultCard result={voiceResult} onReset={resetVoice} label="Log another meal" />
          )}

          {/* Scan UI */}
          {!scanResult && !voiceResult && (
            <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 90 }} showsVerticalScrollIndicator={false}>

              {/* Photo / Voice toggle */}
              <View style={{ flexDirection: 'row', backgroundColor: colors.card, borderRadius: 14, padding: 4, borderWidth: 1, borderColor: colors.border, gap: 4 }}>
                <Pressable onPress={() => { setScanMode('photo'); resetVoice(); }}
                  style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 11, backgroundColor: scanMode === 'photo' ? colors.orange : 'transparent' }}>
                  <Ionicons name="camera" size={16} color={scanMode === 'photo' ? '#fff' : colors.gray} />
                  <Text style={{ fontWeight: '700', fontSize: 14, color: scanMode === 'photo' ? '#fff' : colors.gray }}>Photo</Text>
                </Pressable>
                <Pressable onPress={() => { setScanMode('voice'); resetScan(); }}
                  style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 11, backgroundColor: scanMode === 'voice' ? colors.orange : 'transparent' }}>
                  <Ionicons name="mic" size={16} color={scanMode === 'voice' ? '#fff' : colors.gray} />
                  <Text style={{ fontWeight: '700', fontSize: 14, color: scanMode === 'voice' ? '#fff' : colors.gray }}>Voice</Text>
                </Pressable>
              </View>

              {/* ── PHOTO MODE ── */}
              {scanMode === 'photo' && (
                <>
                  {!preview ? (
                    /* Drop zone */
                    <Pressable onPress={pickImage}
                      style={{ borderWidth: 1.5, borderColor: colors.border, borderStyle: 'dashed', borderRadius: 20, alignItems: 'center', justifyContent: 'center', padding: 44, gap: 14 }}>
                      <View style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: `${colors.orange}18`, alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons name="scan" size={30} color={colors.orange} />
                      </View>
                      <View style={{ alignItems: 'center', gap: 4 }}>
                        <Text style={{ fontSize: 15, fontWeight: '800', color: '#fff' }}>Snap or upload a food photo</Text>
                        <Text style={{ fontSize: 12, color: colors.gray }}>JPG, PNG, WebP · Meals, snacks, anything</Text>
                      </View>
                      <View style={{ backgroundColor: `${colors.orange}18`, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: `${colors.orange}35` }}>
                        <Text style={{ color: colors.orange, fontWeight: '700', fontSize: 12 }}>Powered by AI ✦</Text>
                      </View>
                    </Pressable>
                  ) : (
                    /* Image preview */
                    <View style={{ borderRadius: 18, overflow: 'hidden', position: 'relative' }}>
                      <Image source={{ uri: preview }} style={{ width: '100%', height: 220 }} resizeMode="cover" />
                      <Pressable onPress={resetScan}
                        style={{ position: 'absolute', top: 10, right: 10, width: 32, height: 32, backgroundColor: '#00000099', borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>✕</Text>
                      </Pressable>
                    </View>
                  )}

                  {/* Scan error */}
                  {scanError && (
                    <View style={{ backgroundColor: '#EF444410', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#EF444430' }}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: '#F87171' }}>Analysis failed</Text>
                      <Text style={{ fontSize: 12, color: colors.gray, marginTop: 2 }}>{scanError}</Text>
                      <Pressable onPress={resetScan}><Text style={{ fontSize: 12, color: colors.orange, marginTop: 6, fontWeight: '600' }}>Try again</Text></Pressable>
                    </View>
                  )}

                  {/* Analyse button (shown after pick) */}
                  {imageBase64 && !scanLoading && (
                    <Pressable onPress={analyse}
                      style={{ backgroundColor: colors.orange, borderRadius: 16, paddingVertical: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, shadowColor: colors.orange, shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 6 }}>
                      <Ionicons name="scan" size={18} color="#fff" />
                      <Text style={{ color: '#fff', fontWeight: '900', fontSize: 15 }}>Analyse Calories</Text>
                    </Pressable>
                  )}

                  {/* Loading */}
                  {scanLoading && (
                    <View style={{ backgroundColor: colors.card, borderRadius: 18, padding: 36, alignItems: 'center', gap: 14, borderWidth: 1, borderColor: colors.border }}>
                      <ActivityIndicator size="large" color={colors.orange} />
                      <View style={{ alignItems: 'center', gap: 4 }}>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: '#fff' }}>Analysing your meal…</Text>
                        <Text style={{ fontSize: 12, color: colors.gray }}>AI is crunching the macros</Text>
                      </View>
                    </View>
                  )}

                  {/* Camera shortcut */}
                  {!preview && !scanLoading && (
                    <Pressable onPress={takePhoto}
                      style={{ backgroundColor: colors.card, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: `${colors.orange}18`, alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons name="camera" size={20} color={colors.orange} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 14, fontWeight: '800', color: '#fff' }}>Take a Photo</Text>
                        <Text style={{ fontSize: 12, color: colors.gray }}>Open camera and snap your meal</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={16} color={colors.orange} />
                    </Pressable>
                  )}
                </>
              )}

              {/* ── VOICE MODE ── */}
              {scanMode === 'voice' && (
                <>
                  {/* Language selector */}
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                    {LANGS.map(({ code, label }) => (
                      <Pressable key={code} onPress={() => setVoiceLang(code)}
                        style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1,
                          backgroundColor: voiceLang === code ? colors.orange : `${colors.orange}12`,
                          borderColor: voiceLang === code ? colors.orange : `${colors.orange}35` }}>
                        <Text style={{ fontSize: 12, fontWeight: '700', color: voiceLang === code ? '#fff' : colors.orange }}>{label}</Text>
                      </Pressable>
                    ))}
                  </View>

                  {/* Primary: mic record button */}
                  <View style={{ backgroundColor: colors.card, borderRadius: 18, padding: 24, borderWidth: 1, borderColor: isRecording ? colors.orange : colors.border, alignItems: 'center', gap: 14 }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>
                      {isRecording ? 'Recording… tap to stop' : transcribing ? 'Transcribing…' : 'Tap mic to record your meal'}
                    </Text>

                    <Pressable onPress={isRecording ? stopRecording : startRecording} disabled={transcribing || voiceLoading}>
                      <Animated.View style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: isRecording ? `${colors.orange}22` : 'transparent', alignItems: 'center', justifyContent: 'center', transform: [{ scale: pulseAnim }] }}>
                        <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: isRecording ? colors.orange : `${colors.orange}18`, borderWidth: 2, borderColor: colors.orange, alignItems: 'center', justifyContent: 'center' }}>
                          {transcribing
                            ? <ActivityIndicator size="small" color={colors.orange} />
                            : <Ionicons name={isRecording ? 'stop' : 'mic'} size={32} color={isRecording ? '#fff' : colors.orange} />}
                        </View>
                      </Animated.View>
                    </Pressable>

                    <Text style={{ fontSize: 12, color: colors.gray, textAlign: 'center', lineHeight: 18 }}>
                      {isRecording ? 'Speak clearly — "I had 2 rotis, dal and a banana"' : 'AI will transcribe & estimate your calories'}
                    </Text>
                  </View>

                  {/* Fallback: shown after STT fails OR always as secondary option */}
                  {(sttFailed || voiceText.length > 0) && (
                    <View style={{ backgroundColor: `${colors.orange}08`, borderRadius: 14, padding: 12, borderWidth: 1, borderColor: `${colors.orange}25`, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <Ionicons name="information-circle-outline" size={16} color={colors.orange} />
                      <Text style={{ fontSize: 12, color: colors.gray, flex: 1, lineHeight: 17 }}>
                        {sttFailed ? 'Auto-transcription failed. ' : ''}
                        <Text style={{ color: colors.orange }} onPress={() => voiceInputRef.current?.focus()}>
                          Tap here
                        </Text>{' '}then use the 🎤 mic on your keyboard to dictate.
                      </Text>
                    </View>
                  )}

                  {/* Editable transcript / manual input */}
                  <TextInput
                    ref={voiceInputRef}
                    value={voiceText}
                    onChangeText={setVoiceText}
                    placeholder='Transcript appears here — or type / dictate manually…'
                    placeholderTextColor={colors.gray}
                    multiline
                    style={{ backgroundColor: colors.card, borderRadius: 14, padding: 14, color: '#fff', fontSize: 14, borderWidth: 1, borderColor: voiceText ? colors.orange : colors.border, minHeight: 100, textAlignVertical: 'top' }}
                  />

                  {voiceError && (
                    <View style={{ backgroundColor: '#EF444410', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#EF444430' }}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: '#F87171' }}>Transcription failed</Text>
                      <Text style={{ fontSize: 12, color: colors.gray, marginTop: 2 }}>{voiceError}</Text>
                      <Pressable onPress={resetVoice}><Text style={{ fontSize: 12, color: colors.orange, marginTop: 6 }}>Try again</Text></Pressable>
                    </View>
                  )}

                  {voiceLoading ? (
                    <View style={{ backgroundColor: colors.card, borderRadius: 18, padding: 32, alignItems: 'center', gap: 14, borderWidth: 1, borderColor: colors.border }}>
                      <ActivityIndicator size="large" color={colors.orange} />
                      <View style={{ alignItems: 'center', gap: 4 }}>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: '#fff' }}>Analysing your meal…</Text>
                        <Text style={{ fontSize: 12, color: colors.gray }}>Estimating calories & macros</Text>
                      </View>
                    </View>
                  ) : (
                    <Pressable onPress={analyseVoice} disabled={!voiceText.trim() || transcribing}
                      style={{ backgroundColor: voiceText.trim() ? colors.orange : colors.card2, borderRadius: 16, paddingVertical: 16, alignItems: 'center', borderWidth: 1, borderColor: voiceText.trim() ? colors.orange : colors.border }}>
                      <Text style={{ color: voiceText.trim() ? '#fff' : colors.gray, fontWeight: '900', fontSize: 15 }}>Analyse Meal →</Text>
                    </Pressable>
                  )}
                </>
              )}

            </ScrollView>
          )}
        </>
      )}

      {/* ── TODAY TAB ── */}
      {tab === 'today' && (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 90 }} showsVerticalScrollIndicator={false}>

          {/* Calorie progress */}
          <View style={{ backgroundColor: colors.card, borderRadius: 20, padding: 18, borderWidth: 1, borderColor: colors.border, alignItems: 'center', gap: 10 }}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: colors.gray, letterSpacing: 1 }}>TODAY'S CALORIES</Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6 }}>
              <Text style={{ fontSize: 48, fontWeight: '900', color: colors.orange, lineHeight: 54 }}>{todayCalories}</Text>
              <Text style={{ fontSize: 14, color: colors.gray, paddingBottom: 6 }}>/ {dailyTarget.toLocaleString()} kcal</Text>
            </View>
            <View style={{ width: '100%', height: 8, backgroundColor: colors.border, borderRadius: 4 }}>
              <View style={{ height: 8, width: `${calPct}%`, backgroundColor: colors.orange, borderRadius: 4 }} />
            </View>
            {todayCalories === 0
              ? <Text style={{ fontSize: 12, color: colors.gray }}>Scan a meal to start your day</Text>
              : <Text style={{ fontSize: 12, color: colors.gray }}>{(dailyTarget - todayCalories).toLocaleString()} kcal remaining</Text>
            }
          </View>

          {/* Macro bars */}
          <View style={{ backgroundColor: colors.card, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: colors.gray, letterSpacing: 1, marginBottom: 14 }}>MACROS TODAY</Text>
            <View style={{ gap: 12 }}>
              <MacroBar label="Protein" grams={Math.round(todayMacros.protein)} color={colors.orange} />
              <MacroBar label="Carbs"   grams={Math.round(todayMacros.carbs)}   color="#EAB308" />
              <MacroBar label="Fat"     grams={Math.round(todayMacros.fat)}      color="#3fb950" />
            </View>
          </View>

          {/* Meals list */}
          <View style={{ backgroundColor: colors.card, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: colors.gray, letterSpacing: 1, marginBottom: 12 }}>
              TODAY'S MEALS {todayLogs.length > 0 && <Text style={{ color: colors.orange }}>({todayLogs.length})</Text>}
            </Text>
            {todayLogs.length === 0 ? (
              <View style={{ alignItems: 'center', paddingVertical: 24 }}>
                <Text style={{ fontSize: 13, color: colors.gray }}>No meals logged today</Text>
                <Text style={{ fontSize: 11, color: colors.gray, marginTop: 4, opacity: 0.6 }}>Switch to Scan tab to log your first meal</Text>
              </View>
            ) : (
              <View style={{ gap: 0 }}>
                {todayLogs.map((log, i) => (
                  <View key={log.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: i < todayLogs.length - 1 ? 1 : 0, borderBottomColor: colors.border }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, fontWeight: '600', color: '#fff' }}>{log.meal_name}</Text>
                      <Text style={{ fontSize: 11, color: colors.gray, marginTop: 2 }}>
                        P {Math.round(log.protein_g)}g · C {Math.round(log.carbs_g)}g · F {Math.round(log.fat_g)}g
                      </Text>
                    </View>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: colors.orange }}>{log.total_calories} kcal</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          <Pressable onPress={() => setTab('scan')}
            style={{ backgroundColor: colors.orange, borderRadius: 14, paddingVertical: 14, alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15 }}>+ Log a Meal</Text>
          </Pressable>
          <View style={{ height: 8 }} />
        </ScrollView>
      )}

      {/* ── INSIGHTS TAB ── */}
      {tab === 'insights' && (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 90 }} showsVerticalScrollIndicator={false}>

          {logs.length === 0 ? (
            /* Empty state */
            <View style={{ alignItems: 'center', paddingVertical: 48, gap: 12 }}>
              <View style={{ width: 56, height: 56, borderRadius: 18, backgroundColor: `${colors.orange}18`, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="bar-chart-outline" size={28} color={colors.orange} />
              </View>
              <Text style={{ fontSize: 15, fontWeight: '800', color: '#fff' }}>No insights yet</Text>
              <Text style={{ fontSize: 13, color: colors.gray, textAlign: 'center', lineHeight: 20, maxWidth: 260 }}>
                Log meals over a couple of days and your AI coach will analyse your weekly progress here.
              </Text>
            </View>
          ) : (
            /* Stats */
            <>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                {[
                  { label: 'Avg Daily',  value: Math.round(todayCalories).toLocaleString(), unit: 'kcal' },
                  { label: 'Target',     value: dailyTarget.toLocaleString(),                unit: 'kcal' },
                  { label: 'Meals',      value: String(logs.length),                         unit: 'logged' },
                ].map((s) => (
                  <View key={s.label} style={{ flex: 1, backgroundColor: colors.card, borderRadius: 14, padding: 12, borderWidth: 1, borderColor: colors.border, alignItems: 'center', gap: 2 }}>
                    <Text style={{ fontSize: 18, fontWeight: '900', color: '#fff' }}>{s.value}</Text>
                    <Text style={{ fontSize: 10, color: colors.gray }}>{s.unit}</Text>
                    <Text style={{ fontSize: 10, color: colors.gray, marginTop: 2, letterSpacing: 0.5 }}>{s.label.toUpperCase()}</Text>
                  </View>
                ))}
              </View>

              {[
                { label: 'Avg. daily calories', value: Math.round(todayCalories / Math.max(logs.length, 1)).toLocaleString() + ' kcal', color: colors.orange, icon: '🔥' },
                { label: 'Avg. protein',         value: Math.round(todayMacros.protein / Math.max(logs.length, 1)) + 'g',               color: '#22C55E',    icon: '💪' },
                { label: 'Streak',               value: streak + ' days',                                                                 color: colors.gold,  icon: '🏅' },
                { label: 'Meals logged',          value: String(logs.length),                                                              color: '#818CF8',    icon: '📋' },
              ].map(({ label, value, color, icon }) => (
                <View key={label} style={{ backgroundColor: colors.card, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                  <Text style={{ fontSize: 26 }}>{icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 12, color: colors.gray }}>{label}</Text>
                    <Text style={{ fontSize: 20, fontWeight: '900', color, marginTop: 2 }}>{value}</Text>
                  </View>
                </View>
              ))}
            </>
          )}

          <View style={{ backgroundColor: `${colors.orange}08`, borderRadius: 18, padding: 14, borderWidth: 1, borderColor: `${colors.orange}20`, alignItems: 'center' }}>
            <Text style={{ color: colors.gray, fontSize: 12 }}>Powered by AI ✦</Text>
          </View>
          <View style={{ height: 8 }} />
        </ScrollView>
      )}

    </SafeAreaView>
  );
}
