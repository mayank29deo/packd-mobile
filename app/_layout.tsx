import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AppProvider, useApp } from '../lib/AppContext';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session, authLoading, isGuest } = useApp();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (authLoading) return;
    const inAuth = segments[0] === '(auth)';
    if (!session && !isGuest && !inAuth) {
      router.replace('/(auth)/login');
    } else if ((session || isGuest) && inAuth) {
      router.replace('/(tabs)/feed');
    }
  }, [session, authLoading, isGuest, segments]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AppProvider>
      <StatusBar style="light" backgroundColor="#0A0A0A" />
      <AuthGuard>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0A0A0A' } }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="event/[id]" options={{ presentation: 'card' }} />
          <Stack.Screen name="messages" options={{ presentation: 'card' }} />
          <Stack.Screen name="notifications" options={{ presentation: 'card' }} />
          <Stack.Screen name="chat/[userId]" options={{ presentation: 'card' }} />
        </Stack>
      </AuthGuard>
    </AppProvider>
  );
}
