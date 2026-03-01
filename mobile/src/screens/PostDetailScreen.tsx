import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { postsApi, commentsApi, Post, Comment } from '../services/api';
import PostCard from '../components/PostCard';
import CommentList from '../components/CommentList';

export default function PostDetailScreen({
  route,
}: {
  route: { params: { postId: string } };
}) {
  const { colors } = useTheme();
  const { postId } = route.params;
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  const load = async () => {
    try {
      const [p, c] = await Promise.all([
        postsApi.getById(postId),
        commentsApi.getByPost(postId),
      ]);
      setPost(p);
      setComments(c.comments);
    } catch {
      setPost(null);
      setComments([]);
    }
  };

  useEffect(() => {
    load();
  }, [postId]);

  if (!post) {
    return <Text style={[styles.placeholder, { color: colors.textSecondary }]}>Loading...</Text>;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <PostCard post={post} onPress={() => {}} />
      <CommentList postId={postId} comments={comments} onRefresh={load} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingBottom: 16 },
  placeholder: { textAlign: 'center', marginTop: 24 },
});
