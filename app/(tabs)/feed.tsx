import {
  View, Text, ScrollView, Pressable, TextInput, Image,
  RefreshControl, Dimensions, Animated, PanResponder,
} from 'react-native';
import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useApp } from '../../lib/AppContext';
import { colors } from '../../lib/colors';

const FEED_TABS = ['For You', 'Following', 'Discover'];
const { width: SCREEN_W } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_W * 0.3;

const FOLLOWING_USERS = new Set(['Arjun M.', 'Priya S.']);

const SUGGESTED_ATHLETES = [
  { id: 's1', name: 'Sneha D.',  initial: 'S', avatarColor: '#059669', sport: 'Cycling',  xp: 3210 },
  { id: 's2', name: 'Vikram N.', initial: 'V', avatarColor: '#D97706', sport: 'Running',  xp: 2980 },
  { id: 's3', name: 'Ananya T.', initial: 'A', avatarColor: '#7C3AED', sport: 'Yoga',     xp: 2750 },
  { id: 's4', name: 'Rohan P.',  initial: 'R', avatarColor: '#2563EB', sport: 'Football', xp: 2600 },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning,';
  if (h < 17) return 'Good afternoon,';
  return 'Good evening,';
}

// ── Swipe Event Cards ─────────────────────────────────────────────────────────
function SwipeEventCards({ events, toggleRsvp }: any) {
  const [gone, setGone] = useState<Record<number, 'right' | 'left'>>({});
  const pan = useRef(new Animated.ValueXY()).current;

  const activeEvents = events.filter((_: any, i: number) => !gone[i]);
  const activeIndex  = events.findIndex((_: any, i: number) => !gone[i]);

  const rotate = pan.x.interpolate({
    inputRange: [-SCREEN_W / 2, 0, SCREEN_W / 2],
    outputRange: ['-12deg', '0deg', '12deg'],
    extrapolate: 'clamp',
  });

  const goOpacity = pan.x.interpolate({
    inputRange: [10, 60],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const nopeOpacity = pan.x.interpolate({
    inputRange: [-60, -10],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const swipeOff = useCallback((direction: 'right' | 'left', index: number) => {
    const toX = direction === 'right' ? SCREEN_W * 1.5 : -SCREEN_W * 1.5;
    Animated.timing(pan, {
      toValue: { x: toX, y: 0 },
      duration: 260,
      useNativeDriver: true,
    }).start(() => {
      if (direction === 'right') toggleRsvp(events[index].id);
      setGone((prev) => ({ ...prev, [index]: direction }));
      pan.setValue({ x: 0, y: 0 });
    });
  }, [pan, events, toggleRsvp]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 5,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: (_, g) => {
        if (g.dx > SWIPE_THRESHOLD) {
          swipeOff('right', activeIndex);
        } else if (g.dx < -SWIPE_THRESHOLD) {
          swipeOff('left', activeIndex);
        } else {
          Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  // All swiped
  if (activeEvents.length === 0) {
    return (
      <View style={{ alignItems: 'center', paddingVertical: 28, gap: 6 }}>
        <Text style={{ fontSize: 28 }}>🎉</Text>
        <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>You've seen all events!</Text>
        <Text style={{ fontSize: 12, color: colors.gray }}>Check Discover for more</Text>
      </View>
    );
  }

  const cardH = 200;

  return (
    <View style={{ marginHorizontal: 12, marginBottom: 14 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <Text style={{ fontSize: 15, fontWeight: '900', color: '#fff' }}>Discover Events</Text>
        <Text style={{ fontSize: 11, color: colors.gray }}>{activeEvents.length} remaining · swipe to decide</Text>
      </View>

      {/* Card stack */}
      <View style={{ height: cardH + 8, position: 'relative' }}>
        {/* Background card (next) */}
        {activeEvents.length > 1 && (
          <View style={{
            position: 'absolute', left: 6, right: 6, top: 8, height: cardH,
            backgroundColor: colors.card, borderRadius: 20, borderWidth: 1, borderColor: colors.border,
          }} />
        )}

        {/* Top card (swipeable) */}
        <Animated.View
          {...panResponder.panHandlers}
          style={{
            position: 'absolute', left: 0, right: 0, top: 0, height: cardH,
            backgroundColor: colors.card, borderRadius: 20, borderWidth: 1, borderColor: colors.border,
            transform: [{ translateX: pan.x }, { translateY: pan.y }, { rotate }],
            shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 6,
          }}
        >
          {/* GOING overlay */}
          <Animated.View style={{
            position: 'absolute', top: 16, left: 16, opacity: goOpacity,
            backgroundColor: `${colors.green}20`, borderRadius: 10, borderWidth: 2, borderColor: colors.green,
            paddingHorizontal: 12, paddingVertical: 6, zIndex: 10,
          }}>
            <Text style={{ color: colors.green, fontWeight: '900', fontSize: 18 }}>GOING ✓</Text>
          </Animated.View>

          {/* NOPE overlay */}
          <Animated.View style={{
            position: 'absolute', top: 16, right: 16, opacity: nopeOpacity,
            backgroundColor: '#EF444420', borderRadius: 10, borderWidth: 2, borderColor: '#EF4444',
            paddingHorizontal: 12, paddingVertical: 6, zIndex: 10,
          }}>
            <Text style={{ color: '#EF4444', fontWeight: '900', fontSize: 18 }}>SKIP ✗</Text>
          </Animated.View>

          {/* Card content */}
          {(() => {
            const ev = activeEvents[0];
            return (
              <View style={{ flex: 1, padding: 16, justifyContent: 'space-between' }}>
                <View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <View style={{ backgroundColor: `${colors.orange}20`, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
                      <Text style={{ fontSize: 12, fontWeight: '700', color: colors.orange }}>{ev.sport}</Text>
                    </View>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: colors.orange }}>{ev.cost}</Text>
                  </View>
                  <Text style={{ fontSize: 19, fontWeight: '900', color: '#fff', marginBottom: 6 }}>{ev.title}</Text>
                  <Text style={{ fontSize: 13, color: colors.gray, marginBottom: 2 }}>🕐 {ev.time}</Text>
                  <Text style={{ fontSize: 13, color: colors.gray }}>📍 {ev.venue} · {ev.area}</Text>
                </View>

                <View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                    <View style={{ height: 5, flex: 1, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' }}>
                      <View style={{ height: 5, width: `${(ev.rsvp / ev.max) * 100}%`, backgroundColor: colors.orange, borderRadius: 3 }} />
                    </View>
                    <Text style={{ fontSize: 11, color: colors.gray }}>{ev.rsvp}/{ev.max} going</Text>
                  </View>

                  {/* Action buttons */}
                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <Pressable onPress={() => swipeOff('left', activeIndex)}
                      style={{ flex: 1, height: 44, borderRadius: 14, backgroundColor: '#EF444418', borderWidth: 1.5, borderColor: '#EF4444', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 }}>
                      <Text style={{ fontSize: 18 }}>✗</Text>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: '#EF4444' }}>Skip</Text>
                    </Pressable>
                    <Pressable onPress={() => swipeOff('right', activeIndex)}
                      style={{ flex: 1, height: 44, borderRadius: 14, backgroundColor: `${colors.green}18`, borderWidth: 1.5, borderColor: colors.green, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 }}>
                      <Text style={{ fontSize: 18 }}>✓</Text>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: colors.green }}>I'm Going</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            );
          })()}
        </Animated.View>
      </View>
    </View>
  );
}

// ── Post Composer ─────────────────────────────────────────────────────────────
function PostComposer({ user, composerOpen, setComposerOpen, postText, setPostText, postImages, setPostImages, pickPostImage, submitPost }: any) {
  return (
    <View style={{ marginHorizontal: 12, marginBottom: 14, backgroundColor: colors.card, borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' }}>
      {!composerOpen ? (
        <Pressable onPress={() => setComposerOpen(true)} style={{ flexDirection: 'row', alignItems: 'center', padding: 12, gap: 10 }}>
          <View style={{ width: 36, height: 36, borderRadius: 11, backgroundColor: user.avatarColor, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontWeight: '900', fontSize: 14 }}>{user.initial}</Text>
          </View>
          <Text style={{ flex: 1, color: colors.gray, fontSize: 14 }}>Share a moment, workout, or recap...</Text>
          <Ionicons name="camera-outline" size={22} color={colors.gray} />
        </Pressable>
      ) : (
        <View style={{ padding: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
            <View style={{ width: 36, height: 36, borderRadius: 11, backgroundColor: user.avatarColor, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#fff', fontWeight: '900', fontSize: 14 }}>{user.initial}</Text>
            </View>
            <TextInput
              value={postText} onChangeText={setPostText}
              placeholder="What's your moment?"
              placeholderTextColor={colors.gray}
              multiline autoFocus
              style={{ flex: 1, color: '#fff', fontSize: 14, lineHeight: 20, minHeight: 60, textAlignVertical: 'top' }}
            />
          </View>
          {postImages.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
              {postImages.map((uri: string, i: number) => (
                <View key={i} style={{ marginRight: 8, position: 'relative' }}>
                  <Image source={{ uri }} style={{ width: 80, height: 80, borderRadius: 10 }} />
                  <Pressable onPress={() => setPostImages((prev: string[]) => prev.filter((_: string, idx: number) => idx !== i))}
                    style={{ position: 'absolute', top: -6, right: -6, backgroundColor: '#EF4444', borderRadius: 10, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#fff', fontSize: 11, fontWeight: '800' }}>×</Text>
                  </Pressable>
                </View>
              ))}
            </ScrollView>
          )}
          <View style={{ flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 10, gap: 10 }}>
            <Pressable onPress={pickPostImage} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="image-outline" size={20} color={colors.gray} />
              <Text style={{ color: colors.gray, fontSize: 12 }}>Photo</Text>
            </Pressable>
            <View style={{ flex: 1 }} />
            <Pressable onPress={() => { setComposerOpen(false); setPostText(''); setPostImages([]); }}>
              <Text style={{ color: colors.gray, fontSize: 13 }}>Cancel</Text>
            </Pressable>
            <Pressable onPress={submitPost} disabled={!postText.trim() && postImages.length === 0}
              style={{ backgroundColor: postText.trim() || postImages.length > 0 ? colors.orange : colors.card2, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 7 }}>
              <Text style={{ color: postText.trim() || postImages.length > 0 ? '#fff' : colors.gray, fontWeight: '800', fontSize: 13 }}>Post</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function FeedScreen() {
  const router = useRouter();
  const { user, events, posts, packs, unreadMessages, toggleLike, createPost, rsvps, toggleRsvp } = useApp();
  const [refreshing, setRefreshing]     = useState(false);
  const [feedTab, setFeedTab]           = useState('For You');
  const [composerOpen, setComposerOpen] = useState(false);
  const [postText, setPostText]         = useState('');
  const [postImages, setPostImages]     = useState<string[]>([]);
  const [postSport]                     = useState('Running');
  const [followed, setFollowed]         = useState<Record<string, boolean>>({});

  const onRefresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1000); };

  const pickPostImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'] as any, allowsMultipleSelection: true, quality: 0.8 });
    if (!res.canceled) setPostImages((prev) => [...prev, ...res.assets.map((a) => a.uri)].slice(0, 4));
  };

  const submitPost = () => {
    if (!postText.trim() && postImages.length === 0) return;
    createPost(postText, postImages, postSport);
    setPostText(''); setPostImages([]); setComposerOpen(false);
  };

  const followingPosts = posts.filter((p) => FOLLOWING_USERS.has(p.user));

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* ── Header ── */}
      <View style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ fontSize: 13, color: colors.gray }}>{getGreeting()}</Text>
            <Text style={{ fontSize: 22, fontWeight: '900', color: '#fff' }}>Hey, {user.firstName} 👋</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Pressable onPress={() => router.push('/messages' as any)} style={{ position: 'relative' }}>
              <Ionicons name="chatbubble-outline" size={24} color={colors.gray} />
              {unreadMessages > 0 && (
                <View style={{ position: 'absolute', top: -4, right: -4, backgroundColor: colors.orange, borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 }}>
                  <Text style={{ color: '#fff', fontSize: 9, fontWeight: '800' }}>{unreadMessages}</Text>
                </View>
              )}
            </Pressable>
            <Pressable onPress={() => router.push('/notifications' as any)} style={{ position: 'relative' }}>
              <Ionicons name="notifications-outline" size={24} color={colors.gray} />
              <View style={{ position: 'absolute', top: -4, right: -4, backgroundColor: colors.orange, borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 }}>
                <Text style={{ color: '#fff', fontSize: 9, fontWeight: '800' }}>2</Text>
              </View>
            </Pressable>
            <Pressable onPress={() => router.push('/(tabs)/me' as any)} style={{ width: 36, height: 36, borderRadius: 11, backgroundColor: user.avatarColor, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: `${user.avatarColor}60` }}>
              <Text style={{ color: '#fff', fontWeight: '900', fontSize: 15 }}>{user.initial}</Text>
            </Pressable>
          </View>
        </View>

        {/* XP bar */}
        <View style={{ marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.card, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: colors.border }}>
          <Text style={{ fontSize: 11, color: colors.gray, minWidth: 90 }}>Lv {user.level} · {user.levelName}</Text>
          <View style={{ flex: 1, height: 5, backgroundColor: colors.border, borderRadius: 3 }}>
            <View style={{ height: 5, width: `${Math.round((user.xp % user.xpToNext) / user.xpToNext * 100)}%`, backgroundColor: colors.orange, borderRadius: 3 }} />
          </View>
          <Text style={{ fontSize: 11, fontWeight: '700', color: colors.text }}>{user.xp.toLocaleString()} XP</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={{ fontSize: 13, fontWeight: '800', color: colors.orange }}>{user.streak}</Text>
            <Text style={{ fontSize: 13 }}>🔥</Text>
          </View>
          <Pressable style={{ backgroundColor: colors.orange, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 }}>
            <Text style={{ color: '#fff', fontSize: 11, fontWeight: '800' }}>+ Log</Text>
          </Pressable>
        </View>
      </View>

      {/* ── Tabs ── */}
      <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border }}>
        {FEED_TABS.map((tab) => (
          <Pressable key={tab} onPress={() => setFeedTab(tab)}
            style={{ flex: 1, alignItems: 'center', paddingVertical: 10, borderBottomWidth: 2, borderBottomColor: feedTab === tab ? colors.orange : 'transparent' }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: feedTab === tab ? colors.orange : colors.gray }}>{tab}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.orange} />}
      >
        {/* ══ FOR YOU ══ */}
        {feedTab === 'For You' && (
          <>
            <View style={{ height: 14 }} />

            {/* 1. Post composer first */}
            <PostComposer
              user={user} composerOpen={composerOpen} setComposerOpen={setComposerOpen}
              postText={postText} setPostText={setPostText}
              postImages={postImages} setPostImages={setPostImages}
              pickPostImage={pickPostImage} submitPost={submitPost}
            />

            {/* 2. Swipe event cards */}
            <SwipeEventCards events={events} toggleRsvp={toggleRsvp} rsvps={rsvps} />

            {/* 3. Community posts */}
            <View style={{ gap: 1 }}>
              {posts.map((post) => (
                <PostCard key={post.id} post={post} onLike={() => toggleLike(post.id)} />
              ))}
            </View>
          </>
        )}

        {/* ══ FOLLOWING ══ */}
        {feedTab === 'Following' && (
          <>
            {followingPosts.length === 0 ? (
              <View style={{ alignItems: 'center', paddingTop: 60, paddingHorizontal: 32, gap: 12 }}>
                <Text style={{ fontSize: 40 }}>👥</Text>
                <Text style={{ fontSize: 18, fontWeight: '900', color: '#fff', textAlign: 'center' }}>Follow athletes to see their posts</Text>
                <Text style={{ fontSize: 13, color: colors.gray, textAlign: 'center', lineHeight: 20 }}>Head to Discover to find athletes in your sport and area</Text>
                <Pressable onPress={() => setFeedTab('Discover')}
                  style={{ marginTop: 8, backgroundColor: colors.orange, borderRadius: 14, paddingHorizontal: 24, paddingVertical: 12 }}>
                  <Text style={{ color: '#fff', fontWeight: '800', fontSize: 14 }}>Find Athletes</Text>
                </Pressable>
              </View>
            ) : (
              <>
                <View style={{ height: 14 }} />
                <PostComposer
                  user={user} composerOpen={composerOpen} setComposerOpen={setComposerOpen}
                  postText={postText} setPostText={setPostText}
                  postImages={postImages} setPostImages={setPostImages}
                  pickPostImage={pickPostImage} submitPost={submitPost}
                />
                <View style={{ gap: 1 }}>
                  {followingPosts.map((post) => (
                    <PostCard key={post.id} post={post} onLike={() => toggleLike(post.id)} />
                  ))}
                </View>
              </>
            )}
          </>
        )}

        {/* ══ DISCOVER ══ */}
        {feedTab === 'Discover' && (
          <View style={{ padding: 12, gap: 16 }}>
            {/* Events */}
            <View>
              <Text style={{ fontSize: 16, fontWeight: '900', color: '#fff', marginBottom: 10 }}>Upcoming Events Near You</Text>
              <View style={{ gap: 10 }}>
                {events.map((ev) => (
                  <Pressable key={ev.id} onPress={() => router.push(`/event/${ev.id}`)}
                    style={{ backgroundColor: colors.card, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: colors.border }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <View style={{ backgroundColor: `${colors.orange}20`, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
                        <Text style={{ fontSize: 11, fontWeight: '700', color: colors.orange }}>{ev.sport}</Text>
                      </View>
                      <Text style={{ fontSize: 12, color: colors.orange, fontWeight: '700' }}>{ev.cost}</Text>
                    </View>
                    <Text style={{ fontSize: 15, fontWeight: '800', color: '#fff', marginBottom: 4 }}>{ev.title}</Text>
                    <Text style={{ fontSize: 12, color: colors.gray, marginBottom: 2 }}>🕐 {ev.time}</Text>
                    <Text style={{ fontSize: 12, color: colors.gray, marginBottom: 10 }}>📍 {ev.venue} · {ev.area}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <View style={{ flex: 1, marginRight: 12 }}>
                        <View style={{ height: 4, backgroundColor: colors.border, borderRadius: 2, overflow: 'hidden', marginBottom: 3 }}>
                          <View style={{ height: 4, width: `${(ev.rsvp / ev.max) * 100}%`, backgroundColor: colors.orange, borderRadius: 2 }} />
                        </View>
                        <Text style={{ fontSize: 11, color: colors.gray }}>{ev.rsvp}/{ev.max} going · {ev.level}</Text>
                      </View>
                      <Pressable onPress={() => toggleRsvp(ev.id)}
                        style={{ paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10, borderWidth: 1.5, borderColor: rsvps[ev.id] ? colors.green : colors.orange, backgroundColor: rsvps[ev.id] ? `${colors.green}15` : colors.orange }}>
                        <Text style={{ fontSize: 12, fontWeight: '700', color: rsvps[ev.id] ? colors.green : '#fff' }}>
                          {rsvps[ev.id] ? '✓ Going' : 'RSVP'}
                        </Text>
                      </Pressable>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Packs */}
            <View>
              <Text style={{ fontSize: 16, fontWeight: '900', color: '#fff', marginBottom: 10 }}>Packs in Your Area</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -12 }} contentContainerStyle={{ paddingHorizontal: 12, gap: 10 }}>
                {packs.map((pack) => (
                  <View key={pack.id} style={{ width: 160, backgroundColor: colors.card, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: colors.border }}>
                    <View style={{ width: 44, height: 44, borderRadius: 13, backgroundColor: `${colors.orange}20`, alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                      <Text style={{ fontSize: 22 }}>{pack.icon}</Text>
                    </View>
                    <Text style={{ fontSize: 13, fontWeight: '800', color: '#fff', marginBottom: 2 }} numberOfLines={1}>{pack.name}</Text>
                    <Text style={{ fontSize: 11, color: colors.gray, marginBottom: 10 }}>{pack.members} members</Text>
                    <View style={{ backgroundColor: colors.orange, borderRadius: 10, paddingVertical: 7, alignItems: 'center' }}>
                      <Text style={{ fontSize: 12, fontWeight: '700', color: '#fff' }}>View Pack</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Athletes */}
            <View>
              <Text style={{ fontSize: 16, fontWeight: '900', color: '#fff', marginBottom: 10 }}>Athletes to Follow</Text>
              <View style={{ gap: 10 }}>
                {SUGGESTED_ATHLETES.map((athlete) => (
                  <View key={athlete.id} style={{ backgroundColor: colors.card, borderRadius: 14, padding: 12, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={{ width: 44, height: 44, borderRadius: 13, backgroundColor: `${athlete.avatarColor}25`, borderWidth: 1, borderColor: `${athlete.avatarColor}50`, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ fontSize: 18, fontWeight: '800', color: athlete.avatarColor }}>{athlete.initial}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>{athlete.name}</Text>
                      <Text style={{ fontSize: 12, color: colors.gray }}>{athlete.sport} · {athlete.xp.toLocaleString()} XP</Text>
                    </View>
                    <Pressable onPress={() => setFollowed((p) => ({ ...p, [athlete.id]: !p[athlete.id] }))}
                      style={{ paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10, borderWidth: 1.5, borderColor: followed[athlete.id] ? colors.green : colors.orange, backgroundColor: followed[athlete.id] ? `${colors.green}15` : `${colors.orange}15` }}>
                      <Text style={{ fontSize: 12, fontWeight: '700', color: followed[athlete.id] ? colors.green : colors.orange }}>
                        {followed[athlete.id] ? '✓ Following' : 'Follow'}
                      </Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        <View style={{ height: 90 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── PostCard ──────────────────────────────────────────────────────────────────
function PostCard({ post, onLike }: { post: any; onLike: () => void }) {
  const [, setShowComments] = useState(false);
  const imgW = (SCREEN_W - 24 - 2) / 2;

  return (
    <View style={{ backgroundColor: colors.card, marginHorizontal: 12, marginBottom: 10, borderRadius: 18, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12, paddingBottom: 8 }}>
        <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: post.avatarColor, alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
          <Text style={{ color: '#fff', fontWeight: '900', fontSize: 16 }}>{post.initial}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ fontWeight: '800', color: '#fff', fontSize: 14 }}>{post.user}</Text>
            <View style={{ backgroundColor: `${colors.orange}20`, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
              <Text style={{ fontSize: 10, fontWeight: '700', color: colors.orange }}>{post.sport}</Text>
            </View>
          </View>
          <Text style={{ color: colors.gray, fontSize: 11, marginTop: 1 }}>{post.time}</Text>
        </View>
        <Text style={{ color: colors.orange, fontWeight: '700', fontSize: 12 }}>{post.xp}</Text>
      </View>

      <Text style={{ color: colors.text, fontSize: 14, lineHeight: 21, paddingHorizontal: 12, paddingBottom: post.images.length > 0 ? 10 : 12 }}>
        {post.content}
      </Text>

      {post.images.length === 1 && (
        <Image source={{ uri: post.images[0] }} style={{ width: '100%', height: 200 }} resizeMode="cover" />
      )}
      {post.images.length === 2 && (
        <View style={{ flexDirection: 'row', gap: 2 }}>
          {post.images.map((uri: string, i: number) => (
            <Image key={i} source={{ uri }} style={{ width: imgW, height: 160 }} resizeMode="cover" />
          ))}
        </View>
      )}
      {post.images.length >= 3 && (
        <View style={{ flexDirection: 'row', gap: 2 }}>
          <Image source={{ uri: post.images[0] }} style={{ width: imgW + 1, height: 200 }} resizeMode="cover" />
          <View style={{ gap: 2 }}>
            {post.images.slice(1, 3).map((uri: string, i: number) => (
              <View key={i} style={{ position: 'relative' }}>
                <Image source={{ uri }} style={{ width: imgW - 1, height: 99 }} resizeMode="cover" />
                {i === 1 && post.images.length > 3 && (
                  <View style={{ position: 'absolute', inset: 0, backgroundColor: '#00000080', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#fff', fontWeight: '900', fontSize: 18 }}>+{post.images.length - 3}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, gap: 18 }}>
        <Pressable onPress={onLike} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <Ionicons name={post.liked ? 'heart' : 'heart-outline'} size={18} color={post.liked ? '#EF4444' : colors.gray} />
          <Text style={{ color: colors.gray, fontSize: 13 }}>{post.likes}</Text>
        </Pressable>
        <Pressable onPress={() => setShowComments((v) => !v)} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <Ionicons name="chatbubble-outline" size={17} color={colors.gray} />
          <Text style={{ color: colors.gray, fontSize: 13 }}>{post.comments}</Text>
        </Pressable>
        <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <Ionicons name="arrow-redo-outline" size={18} color={colors.gray} />
          <Text style={{ color: colors.gray, fontSize: 13 }}>Share</Text>
        </Pressable>
      </View>
    </View>
  );
}
