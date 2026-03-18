import { View, Text, TextInput, Pressable, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../lib/AppContext';
import { colors } from '../../lib/colors';

export default function ChatScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const router = useRouter();
  const { conversations, sendMessage, markRead, user } = useApp();
  const [text, setText] = useState('');

  const convo = conversations[userId as string];
  if (!convo) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: colors.gray }}>Conversation not found</Text>
      </SafeAreaView>
    );
  }

  const send = () => {
    if (!text.trim()) return;
    sendMessage(userId as string, text.trim());
    setText('');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.card }}>
        <Pressable onPress={() => router.back()} style={{ marginRight: 12 }}>
          <Ionicons name="arrow-back" size={22} color={colors.gray} />
        </Pressable>
        <View style={{ width: 36, height: 36, borderRadius: 11, backgroundColor: convo.user.avatarColor, alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
          <Text style={{ color: '#fff', fontWeight: '800', fontSize: 14 }}>{convo.user.initial}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15 }}>{convo.user.name}</Text>
          <Text style={{ color: convo.user.online ? colors.green : colors.gray, fontSize: 11 }}>
            {convo.user.online ? 'Online' : 'Offline'} · {convo.user.sport}
          </Text>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        data={convo.messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        renderItem={({ item }) => (
          <View style={{ alignItems: item.fromMe ? 'flex-end' : 'flex-start' }}>
            <View style={{
              maxWidth: '75%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18,
              backgroundColor: item.fromMe ? colors.orange : colors.card,
              borderBottomRightRadius: item.fromMe ? 4 : 18,
              borderBottomLeftRadius: item.fromMe ? 18 : 4,
            }}>
              <Text style={{ color: '#fff', fontSize: 14 }}>{item.text}</Text>
              <Text style={{ color: item.fromMe ? 'rgba(255,255,255,0.6)' : colors.gray, fontSize: 10, marginTop: 4, textAlign: 'right' }}>{item.time}</Text>
            </View>
          </View>
        )}
      />

      {/* Input */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12, gap: 10, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.card }}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Message..."
            placeholderTextColor={colors.gray}
            style={{ flex: 1, backgroundColor: colors.bg, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, color: '#fff', fontSize: 14, borderWidth: 1, borderColor: colors.border }}
            multiline
          />
          <Pressable onPress={send} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.orange, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="send" size={18} color="#fff" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
