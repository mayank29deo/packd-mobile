import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../lib/AppContext';
import { colors } from '../lib/colors';

export default function MessagesScreen() {
  const router = useRouter();
  const { conversations, markRead } = useApp();
  const [search, setSearch] = useState('');

  const convList = Object.values(conversations as Record<string, any>).filter((c) =>
    c.user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.gray} />
        </Pressable>
        <Text style={{ flex: 1, fontSize: 18, fontWeight: '900', color: '#fff' }}>Messages</Text>
      </View>

      {/* Search */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 10 }}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search conversations..."
          placeholderTextColor={colors.gray}
          style={{ backgroundColor: colors.card2, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, color: '#fff', fontSize: 14, borderWidth: 1, borderColor: colors.border }}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {convList.map((conv) => {
          const lastMsg = conv.messages[conv.messages.length - 1];
          return (
            <Pressable
              key={conv.user.id}
              onPress={() => {
                markRead(conv.user.id);
                router.push(`/chat/${conv.user.id}` as any);
              }}
              style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border }}
            >
              {/* Avatar with online dot */}
              <View style={{ position: 'relative', marginRight: 12 }}>
                <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: conv.user.avatarColor, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: '#fff', fontWeight: '900', fontSize: 18 }}>{conv.user.initial}</Text>
                </View>
                {conv.user.online && (
                  <View style={{ position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: 6, backgroundColor: colors.green, borderWidth: 2, borderColor: colors.bg }} />
                )}
              </View>

              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
                  <Text style={{ fontWeight: '800', color: '#fff', fontSize: 14 }}>{conv.user.name}</Text>
                  <Text style={{ color: colors.gray, fontSize: 11 }}>{lastMsg?.time}</Text>
                </View>
                <Text style={{ color: conv.unread > 0 ? colors.text : colors.gray, fontSize: 13 }} numberOfLines={1}>
                  {lastMsg?.fromMe ? 'You: ' : ''}{lastMsg?.text}
                </Text>
              </View>

              {conv.unread > 0 && (
                <View style={{ backgroundColor: colors.orange, borderRadius: 10, minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center', marginLeft: 10, paddingHorizontal: 5 }}>
                  <Text style={{ color: '#fff', fontSize: 11, fontWeight: '800' }}>{conv.unread}</Text>
                </View>
              )}
            </Pressable>
          );
        })}

        {convList.length === 0 && (
          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <Ionicons name="chatbubbles-outline" size={48} color={colors.border} />
            <Text style={{ color: colors.gray, marginTop: 12, fontSize: 14 }}>No conversations yet</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
