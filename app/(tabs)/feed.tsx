import {
  View, Text, ScrollView, Pressable, TextInput, Image,
  RefreshControl, Dimensions,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useApp } from '../../lib/AppContext';
import { colors } from '../../lib/colors';

const FEED_TABS = ['For You', 'Following', 'Discover'];
const { width: SCREEN_W } = Dimensions.get('window');

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning,';
  if (h < 17) return 'Good afternoon,';
  return 'Good evening,';
}

export default function FeedScreen() {
  const router = useRouter();
  const { events, posts, unreadMessages, toggleLike, createPost } = useApp();
  const [refreshing, setRefreshing] = useState(false);
  const [feedTab, setFeedTab] = useState('For You');
  const [discoverOpen, setDiscoverOpen] = useState(true);
  const [composerOpen, setComposerOpen] = useState(false);
  const [postText, setPostText] = useState('');
  const [postImages, setPostImages] = useState<string[]>([]);
  const [postSport] = useState('Running');

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const pickPostImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'] as any,
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (!res.canceled) {
      const uris = res.assets.map((a) => a.uri).slice(0, 4);
      setPostImages((prev) => [...prev, ...uris].slice(0, 4));
    }
  };

  const submitPost = () => {
    if (!postText.trim() && postImages.length === 0) return;
    createPost(postText, postImages, postSport);
    setPostText('');
    setPostImages([]);
    setComposerOpen(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* ── Header ── */}
      <View style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ fontSize: 13, color: colors.gray }}>{getGreeting()}</Text>
            <Text style={{ fontSize: 22, fontWeight: '900', color: '#fff' }}>Hey, Mayank 👋</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            {/* Messages */}
            <Pressable onPress={() => router.push('/messages' as any)} style={{ position: 'relative' }}>
              <Ionicons name="chatbubble-outline" size={24} color={colors.gray} />
              {unreadMessages > 0 && (
                <View style={{ position: 'absolute', top: -4, right: -4, backgroundColor: colors.orange, borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 }}>
                  <Text style={{ color: '#fff', fontSize: 9, fontWeight: '800' }}>{unreadMessages}</Text>
                </View>
              )}
            </Pressable>
            {/* Notifications */}
            <Pressable style={{ position: 'relative' }}>
              <Ionicons name="notifications-outline" size={24} color={colors.gray} />
              <View style={{ position: 'absolute', top: -4, right: -4, backgroundColor: colors.orange, borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 }}>
                <Text style={{ color: '#fff', fontSize: 9, fontWeight: '800' }}>2</Text>
              </View>
            </Pressable>
            {/* Avatar */}
            <View style={{ width: 36, height: 36, borderRadius: 11, backgroundColor: colors.orange, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: `${colors.orange}60` }}>
              <Text style={{ color: '#fff', fontWeight: '900', fontSize: 15 }}>M</Text>
            </View>
          </View>
        </View>

        {/* XP bar strip */}
        <View style={{ marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.card, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: colors.border }}>
          <Text style={{ fontSize: 11, color: colors.gray, minWidth: 90 }}>Lv 7 · Trailblazer</Text>
          <View style={{ flex: 1, height: 5, backgroundColor: colors.border, borderRadius: 3 }}>
            <View style={{ height: 5, width: '68%', backgroundColor: colors.orange, borderRadius: 3 }} />
          </View>
          <Text style={{ fontSize: 11, fontWeight: '700', color: colors.text }}>3,040 XP</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={{ fontSize: 13, fontWeight: '800', color: colors.orange }}>14</Text>
            <Text style={{ fontSize: 13 }}>🔥</Text>
          </View>
          <Pressable style={{ backgroundColor: colors.orange, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 }}>
            <Text style={{ color: '#fff', fontSize: 11, fontWeight: '800' }}>+ Log</Text>
          </Pressable>
        </View>
      </View>

      {/* ── Feed tabs ── */}
      <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border }}>
        {FEED_TABS.map((tab) => (
          <Pressable key={tab} onPress={() => setFeedTab(tab)} style={{ flex: 1, alignItems: 'center', paddingVertical: 10, borderBottomWidth: 2, borderBottomColor: feedTab === tab ? colors.orange : 'transparent' }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: feedTab === tab ? colors.orange : colors.gray }}>{tab}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.orange} />}
      >
        {/* ── Discover events banner ── */}
        <Pressable onPress={() => setDiscoverOpen((v) => !v)}
          style={{ margin: 12, backgroundColor: `${colors.orange}18`, borderRadius: 16, borderWidth: 1, borderColor: `${colors.orange}40`, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12 }}>
          <View style={{ width: 38, height: 38, borderRadius: 11, backgroundColor: `${colors.orange}30`, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
            <Text style={{ fontSize: 20 }}>👆</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '800', color: '#fff' }}>Discover events — swipe to decide</Text>
            <Text style={{ fontSize: 12, color: colors.gray, marginTop: 2 }}>Swipe right = going · left = not now</Text>
          </View>
          <Ionicons name={discoverOpen ? 'chevron-up' : 'chevron-down'} size={16} color={colors.orange} />
        </Pressable>

        {/* Swipe cards preview (collapsed) */}
        {discoverOpen && (
          <View style={{ marginHorizontal: 12, marginBottom: 12, gap: 8 }}>
            {events.slice(0, 2).map((event) => (
              <Pressable key={event.id} onPress={() => router.push(`/event/${event.id}`)}
                style={{ backgroundColor: colors.card, borderRadius: 14, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 11, color: colors.orange, fontWeight: '700' }}>{event.sport}</Text>
                  <Text style={{ fontSize: 14, fontWeight: '800', color: '#fff' }} numberOfLines={1}>{event.title}</Text>
                  <Text style={{ fontSize: 11, color: colors.gray }}>{event.time} · {event.venue}</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Pressable style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: '#EF444420', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 16 }}>✗</Text>
                  </Pressable>
                  <Pressable style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: `${colors.green}20`, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 16 }}>✓</Text>
                  </Pressable>
                </View>
              </Pressable>
            ))}
          </View>
        )}

        {/* ── Post composer ── */}
        <View style={{ marginHorizontal: 12, marginBottom: 12, backgroundColor: colors.card, borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' }}>
          {!composerOpen ? (
            <Pressable onPress={() => setComposerOpen(true)} style={{ flexDirection: 'row', alignItems: 'center', padding: 12, gap: 10 }}>
              <View style={{ width: 36, height: 36, borderRadius: 11, backgroundColor: colors.orange, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#fff', fontWeight: '900', fontSize: 14 }}>M</Text>
              </View>
              <Text style={{ flex: 1, color: colors.gray, fontSize: 14 }}>Share a moment, workout, or event recap...</Text>
              <Ionicons name="camera-outline" size={22} color={colors.gray} />
            </Pressable>
          ) : (
            <View style={{ padding: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                <View style={{ width: 36, height: 36, borderRadius: 11, backgroundColor: colors.orange, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: '#fff', fontWeight: '900', fontSize: 14 }}>M</Text>
                </View>
                <TextInput
                  value={postText}
                  onChangeText={setPostText}
                  placeholder="What's your moment?"
                  placeholderTextColor={colors.gray}
                  multiline
                  autoFocus
                  style={{ flex: 1, color: '#fff', fontSize: 14, lineHeight: 20, minHeight: 60, textAlignVertical: 'top' }}
                />
              </View>

              {/* Image previews */}
              {postImages.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
                  {postImages.map((uri, i) => (
                    <View key={i} style={{ marginRight: 8, position: 'relative' }}>
                      <Image source={{ uri }} style={{ width: 80, height: 80, borderRadius: 10 }} />
                      <Pressable onPress={() => setPostImages((prev) => prev.filter((_, idx) => idx !== i))}
                        style={{ position: 'absolute', top: -6, right: -6, backgroundColor: '#EF4444', borderRadius: 10, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#fff', fontSize: 11, fontWeight: '800' }}>×</Text>
                      </Pressable>
                    </View>
                  ))}
                </ScrollView>
              )}

              {/* Toolbar */}
              <View style={{ flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 10, gap: 10 }}>
                <Pressable onPress={pickPostImage} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Ionicons name="image-outline" size={20} color={colors.gray} />
                  <Text style={{ color: colors.gray, fontSize: 12 }}>Photo</Text>
                </Pressable>
                <View style={{ flex: 1 }} />
                <Pressable onPress={() => { setComposerOpen(false); setPostText(''); setPostImages([]); }}>
                  <Text style={{ color: colors.gray, fontSize: 13 }}>Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={submitPost}
                  disabled={!postText.trim() && postImages.length === 0}
                  style={{ backgroundColor: postText.trim() || postImages.length > 0 ? colors.orange : colors.card2, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 7 }}
                >
                  <Text style={{ color: postText.trim() || postImages.length > 0 ? '#fff' : colors.gray, fontWeight: '800', fontSize: 13 }}>Post</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>

        {/* ── Community posts ── */}
        <View style={{ gap: 1 }}>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onLike={() => toggleLike(post.id)} />
          ))}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function PostCard({ post, onLike }: { post: any; onLike: () => void }) {
  const [, setShowComments] = useState(false);
  const imgW = (SCREEN_W - 24 - 2) / 2;

  return (
    <View style={{ backgroundColor: colors.card, marginHorizontal: 12, marginBottom: 10, borderRadius: 18, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' }}>
      {/* Author row */}
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

      {/* Content */}
      <Text style={{ color: colors.text, fontSize: 14, lineHeight: 21, paddingHorizontal: 12, paddingBottom: post.images.length > 0 ? 10 : 12 }}>
        {post.content}
      </Text>

      {/* Images */}
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

      {/* Reactions */}
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
