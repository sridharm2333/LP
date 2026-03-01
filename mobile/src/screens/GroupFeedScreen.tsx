import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { groupsApi, GroupPost } from '../services/api';

export default function GroupFeedScreen({
  route,
  navigation,
}: {
  route: { params: { groupId: string; groupName?: string } };
  navigation: { setOptions: (o: { title?: string }) => void; navigate: (a: string) => void };
}) {
  const { colors } = useTheme();
  const { groupId, groupName } = route.params;
  const [posts, setPosts] = useState<GroupPost[]>([]);

  useEffect(() => {
    navigation.setOptions({ title: groupName || 'Group' });
    groupsApi.getFeed(groupId).then((res) => setPosts(res.posts)).catch(() => setPosts([]));
  }, [groupId, groupName]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={posts}
        keyExtractor={(p) => p._id}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.author, { color: colors.textSecondary }]}>
              {item.isAnonymous ? 'Anonymous' : item.authorName}
            </Text>
            <Text style={[styles.content, { color: colors.text }]}>{item.content}</Text>
            <Text style={[styles.date, { color: colors.textSecondary }]}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text style={[styles.empty, { color: colors.textSecondary }]}>No posts in this group yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { padding: 16, borderRadius: 12, marginBottom: 12 },
  author: { fontSize: 12, marginBottom: 4 },
  content: { fontSize: 16 },
  date: { fontSize: 11, marginTop: 8 },
  empty: { textAlign: 'center', marginTop: 24 },
});
