import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { postsApi, Post } from '../services/api';
import PostCard from '../components/PostCard';

export default function FeedScreen({ navigation }: { navigation: { navigate: (a: string, b?: { postId: string }) => void } }) {
  const { colors } = useTheme();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const res = await postsApi.getFeed();
      setPosts(res.posts);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('CreatePost')}
      >
        <Text style={styles.fabText}>+ Post</Text>
      </TouchableOpacity>
      {loading ? (
        <Text style={[styles.placeholder, { color: colors.textSecondary }]}>Loading...</Text>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(p) => p._id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <PostCard
              post={item}
              onPress={() => navigation.navigate('PostDetail', { postId: item._id })}
            />
          )}
          ListEmptyComponent={<Text style={[styles.placeholder, { color: colors.textSecondary }]}>No posts yet. Share how you feel.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  fab: { position: 'absolute', right: 16, bottom: 24, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 24, zIndex: 1 },
  fabText: { color: '#fff', fontWeight: '600' },
  placeholder: { textAlign: 'center', marginTop: 24 },
});
