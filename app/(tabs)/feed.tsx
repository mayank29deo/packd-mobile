import { View, Text, ScrollView, Pressable, RefreshControl } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../lib/AppContext';
import { colors } from '../../lib/colors';

const FEED_POSTS = [
  { id: '1', user: 'Arjun M.', initial: 'A', sport: 'Running', time: '23m ago', content: 'New PB! 10K in 45:22 🔥 The 5AM crew never disappoints.', xp: '+420 XP', likes: 47, comments: 12 },
  { id: '2', user: 'Priya S.', initial: 'P', sport: 'Yoga', time: '1h ago', content: 'Morning yoga session at Lalbagh was incredibly peaceful today 🧘', xp: '+120 XP', likes: 31, comments: 8 },
  { id: '3', user: 'Rahul K.', initial: 'R', sport: 'Cycling', time: '2h ago', content: 'Nandi Hills at sunrise — nothing beats this. 45km done ✅', xp: '+380 XP', likes: 64, comments: 19 },
  { id: '4', user: 'Sneha M.', initial: 'S', sport: 'CrossFit', time: '3h ago', content: 'Hit Level 8 today 🎉 Pack Alpha title unlocked. Keep grinding!', xp: '🏅 Level 8', likes: 89, comments: 34 },
];

export default function FeedScreen() {
  const router = useRouter();
  const { events } = useApp();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <Text style={{ fontSize: 20, fontWeight: '900', color: '#fff', letterSpacing: -0.5 }}>
          PACK<Text style={{ color: colors.orange }}>D</Text>
        </Text>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          <Text style={{ fontSize: 20, color: colors.gray }}>🔔</Text>
          <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: colors.orange, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 14 }}>A</Text>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.orange} />}
      >
        {/* XP banner */}
        <View style={{ margin: 16, backgroundColor: colors.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <View>
              <Text style={{ fontSize: 10, color: colors.gray }}>YOUR XP</Text>
              <Text style={{ fontSize: 24, fontWeight: '900', color: '#fff' }}>2,840</Text>
              <Text style={{ fontSize: 11, color: colors.orange }}>Level 7 · Trailblazer</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 10, color: colors.gray }}>STREAK</Text>
              <Text style={{ fontSize: 28, fontWeight: '900', color: colors.orange }}>14🔥</Text>
            </View>
          </View>
          {/* XP bar */}
          <View style={{ height: 6, backgroundColor: colors.border, borderRadius: 3 }}>
            <View style={{ height: 6, width: '68%', backgroundColor: colors.orange, borderRadius: 3 }} />
          </View>
          <Text style={{ fontSize: 10, color: colors.gray, marginTop: 4 }}>680 / 1000 XP to Level 8</Text>
        </View>

        {/* Upcoming events strip */}
        <View style={{ marginBottom: 4 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 8 }}>
            <Text style={{ fontSize: 13, fontWeight: '800', color: '#fff' }}>Upcoming Events</Text>
            <Pressable onPress={() => router.push('/(tabs)/events')}>
              <Text style={{ fontSize: 12, color: colors.orange }}>See all →</Text>
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 16, gap: 10 }}>
            {events.slice(0, 3).map((event) => (
              <Pressable key={event.id} onPress={() => router.push(`/event/${event.id}`)}
                style={{ backgroundColor: colors.card, borderRadius: 14, padding: 12, width: 180, borderWidth: 1, borderColor: colors.border }}>
                <Text style={{ fontSize: 10, color: colors.orange, fontWeight: '700', marginBottom: 4 }}>{event.sport}</Text>
                <Text style={{ fontSize: 13, fontWeight: '800', color: '#fff', marginBottom: 6 }} numberOfLines={2}>{event.title}</Text>
                <Text style={{ fontSize: 11, color: colors.gray }}>{event.time}</Text>
                <Text style={{ fontSize: 11, color: event.cost === 'Free' ? colors.green : colors.gold, fontWeight: '700', marginTop: 4 }}>{event.cost}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Feed posts */}
        <View style={{ padding: 16, gap: 12 }}>
          <Text style={{ fontSize: 13, fontWeight: '800', color: '#fff', marginBottom: 4 }}>Community Feed</Text>
          {FEED_POSTS.map((post) => (
            <View key={post.id} style={{ backgroundColor: colors.card, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: colors.border }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.orange, alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                  <Text style={{ color: '#fff', fontWeight: '800', fontSize: 14 }}>{post.initial}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '800', color: '#fff', fontSize: 13 }}>{post.user}</Text>
                  <Text style={{ color: colors.gray, fontSize: 11 }}>{post.sport} · {post.time}</Text>
                </View>
                <Text style={{ color: colors.orange, fontWeight: '700', fontSize: 12 }}>{post.xp}</Text>
              </View>
              <Text style={{ color: colors.text, fontSize: 13, lineHeight: 20, marginBottom: 10 }}>{post.content}</Text>
              <View style={{ flexDirection: 'row', gap: 16 }}>
                <Text style={{ color: colors.gray, fontSize: 12 }}>❤️ {post.likes}</Text>
                <Text style={{ color: colors.gray, fontSize: 12 }}>💬 {post.comments}</Text>
                <Text style={{ color: colors.gray, fontSize: 12 }}>↗ Share</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
