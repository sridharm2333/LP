import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { groupsApi, Group } from '../services/api';

export default function GroupsScreen({ navigation }: { navigation: { navigate: (a: string, b: { groupId: string }) => void } }) {
  const { colors } = useTheme();
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    groupsApi.list().then((res) => setGroups(res.groups)).catch(() => setGroups([]));
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Community groups</Text>
      <FlatList
        data={groups}
        keyExtractor={(g) => g._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => navigation.navigate('GroupFeed', { groupId: item._id, groupName: item.name })}
          >
            <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
            <Text style={[styles.topic, { color: colors.primary }]}>{item.topic}</Text>
            <Text style={[styles.desc, { color: colors.textSecondary }]} numberOfLines={2}>{item.description}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={[styles.empty, { color: colors.textSecondary }]}>No groups yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 16 },
  card: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 12 },
  name: { fontSize: 18, fontWeight: '600' },
  topic: { fontSize: 14, marginTop: 4 },
  desc: { fontSize: 13, marginTop: 8 },
  empty: { textAlign: 'center', marginTop: 24 },
});
