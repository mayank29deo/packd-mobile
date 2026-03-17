import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../lib/AppContext';
import { colors } from '../../lib/colors';

export default function PacksScreen() {
  const { packs, joinedPacks, toggleJoinPack } = useApp();
  const [search, setSearch] = useState('');

  const filtered = packs.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sport.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <Text style={{ fontSize: 20, fontWeight: '900', color: '#fff', marginBottom: 10 }}>Packs</Text>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search packs or sports..."
          placeholderTextColor={colors.gray}
          style={{ backgroundColor: colors.card2, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, color: '#fff', fontSize: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.border }}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 12 }}>
        {/* Your packs section */}
        {Object.keys(joinedPacks).some((k) => joinedPacks[k]) && (
          <View style={{ marginBottom: 4 }}>
            <Text style={{ fontSize: 13, fontWeight: '800', color: '#fff', marginBottom: 8 }}>Your Packs</Text>
            {packs.filter((p) => joinedPacks[p.id]).map((pack) => (
              <PackCard key={pack.id} pack={pack} joined={true} onToggle={() => toggleJoinPack(pack.id)} />
            ))}
          </View>
        )}

        <Text style={{ fontSize: 13, fontWeight: '800', color: '#fff', marginBottom: 4 }}>Discover Packs</Text>
        {filtered.map((pack) => (
          <PackCard key={pack.id} pack={pack} joined={!!joinedPacks[pack.id]} onToggle={() => toggleJoinPack(pack.id)} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function PackCard({ pack, joined, onToggle }: { pack: any; joined: boolean; onToggle: () => void }) {
  return (
    <View style={{ backgroundColor: colors.card, borderRadius: 18, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: joined ? colors.green : colors.border }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ width: 52, height: 52, borderRadius: 14, backgroundColor: colors.card2, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
          <Text style={{ fontSize: 26 }}>{pack.icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 }}>
            <Text style={{ fontSize: 15, fontWeight: '800', color: '#fff' }}>{pack.name}</Text>
            {pack.verified && <Text style={{ color: colors.orange, fontSize: 12 }}>✓</Text>}
          </View>
          <Text style={{ fontSize: 12, color: colors.gray }}>{pack.sport} · {pack.members} members</Text>
        </View>
        <Pressable onPress={onToggle}
          style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, borderWidth: 1.5, borderColor: joined ? colors.green : colors.border, backgroundColor: joined ? `${colors.green}15` : 'transparent' }}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: joined ? colors.green : colors.gray }}>
            {joined ? '✓ Member' : 'Join'}
          </Text>
        </Pressable>
      </View>
      {pack.description && (
        <Text style={{ fontSize: 12, color: colors.gray, marginTop: 10, lineHeight: 18 }}>{pack.description}</Text>
      )}
    </View>
  );
}
