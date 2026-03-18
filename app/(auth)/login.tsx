import {
  View, Text, TextInput, Pressable, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { supabase } from '../../lib/supabase';
import { colors } from '../../lib/colors';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [mode, setMode]         = useState<'login' | 'signup'>('login');

  // ── Email / Password ─────────────────────────────────────────────────────────
  const handleEmail = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing fields', 'Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email: email.trim(), password });
        if (error) throw error;
        Alert.alert('Check your email', 'We sent a confirmation link to ' + email.trim());
        setMode('login');
        return;
      }
      router.replace('/(tabs)/feed' as any);
    } catch (e: any) {
      Alert.alert('Auth error', e.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Google OAuth ──────────────────────────────────────────────────────────────
  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      const redirectTo = AuthSession.makeRedirectUri({ scheme: 'packd' });

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo, skipBrowserRedirect: true },
      });
      if (error) throw error;

      const res = await WebBrowser.openAuthSessionAsync(data.url ?? '', redirectTo);
      if (res.type === 'success' && res.url) {
        const url  = new URL(res.url);
        const code = url.searchParams.get('code');
        if (code) {
          const { error: exchErr } = await supabase.auth.exchangeCodeForSession(code);
          if (exchErr) throw exchErr;
        }
        router.replace('/(tabs)/feed' as any);
      }
    } catch (e: any) {
      Alert.alert('Google sign-in failed', e.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }} keyboardShouldPersistTaps="handled">

          {/* Logo + headline */}
          <View style={{ alignItems: 'center', marginBottom: 40 }}>
            <View style={{ width: 72, height: 72, borderRadius: 22, backgroundColor: colors.orange, alignItems: 'center', justifyContent: 'center', marginBottom: 18, shadowColor: colors.orange, shadowOpacity: 0.5, shadowRadius: 20, shadowOffset: { width: 0, height: 6 }, elevation: 10 }}>
              <Text style={{ fontSize: 32, fontWeight: '900', color: '#fff' }}>P</Text>
            </View>
            <Text style={{ fontSize: 28, fontWeight: '900', color: '#fff' }}>PACKD</Text>
            <Text style={{ fontSize: 14, color: colors.gray, marginTop: 6 }}>
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </Text>
          </View>

          {/* Google button */}
          <Pressable onPress={handleGoogle} disabled={googleLoading}
            style={{ backgroundColor: '#fff', borderRadius: 14, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
            {googleLoading
              ? <ActivityIndicator size="small" color="#333" />
              : <>
                  <Text style={{ fontSize: 18 }}>G</Text>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: '#1a1a1a' }}>Continue with Google</Text>
                </>
            }
          </Pressable>

          {/* Divider */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
            <Text style={{ fontSize: 12, color: colors.gray }}>or</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
          </View>

          {/* Email */}
          <Text style={{ fontSize: 11, fontWeight: '700', color: colors.gray, marginBottom: 6, letterSpacing: 0.5 }}>EMAIL</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor={colors.gray}
            autoCapitalize="none"
            keyboardType="email-address"
            style={{ backgroundColor: colors.card, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, color: '#fff', fontSize: 15, borderWidth: 1, borderColor: colors.border, marginBottom: 14 }}
          />

          {/* Password */}
          <Text style={{ fontSize: 11, fontWeight: '700', color: colors.gray, marginBottom: 6, letterSpacing: 0.5 }}>PASSWORD</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor={colors.gray}
            secureTextEntry
            style={{ backgroundColor: colors.card, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, color: '#fff', fontSize: 15, borderWidth: 1, borderColor: colors.border, marginBottom: 22 }}
          />

          {/* Submit */}
          <Pressable onPress={handleEmail} disabled={loading}
            style={{ backgroundColor: colors.orange, borderRadius: 14, paddingVertical: 16, alignItems: 'center', shadowColor: colors.orange, shadowOpacity: 0.4, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 6 }}>
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={{ color: '#fff', fontWeight: '900', fontSize: 16 }}>
                  {mode === 'login' ? 'Sign In →' : 'Create Account →'}
                </Text>
            }
          </Pressable>

          {/* Toggle mode */}
          <Pressable onPress={() => setMode(mode === 'login' ? 'signup' : 'login')} style={{ marginTop: 20, alignItems: 'center' }}>
            <Text style={{ color: colors.gray, fontSize: 14 }}>
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <Text style={{ color: colors.orange, fontWeight: '700' }}>
                {mode === 'login' ? 'Sign Up' : 'Sign In'}
              </Text>
            </Text>
          </Pressable>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
