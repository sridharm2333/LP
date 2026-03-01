import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { postsApi, Post } from '../services/api';
import PostCard from '../components/PostCard';

export default function JourneyScreen() {
  const { colors } = useTheme();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    postsApi.getMyPosts().then((res) => setPosts(res.posts)).catch(() => setPosts([]));
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Your journey</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Chronological timeline of your posts</Text>
      <FlatList
        data={posts}
        keyExtractor={(p) => p._id}
        renderItem={({ item }) => <PostCard post={item} onPress={() => {}} />}
        ListEmptyComponent={<Text style={[styles.empty, { color: colors.textSecondary }]}>No posts yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 4 },
  subtitle: { marginBottom: 16 },
  empty: { textAlign: 'center', marginTop: 24 },
});
