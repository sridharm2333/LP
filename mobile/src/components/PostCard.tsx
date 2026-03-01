import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import type { Post } from '../services/api';

export default function PostCard({
  post,
  onPress,
}: {
  post: Post;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  const name = post.isAnonymous ? 'Anonymous' : (post.authorName ?? 'Someone');
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.author, { color: colors.textSecondary }]}>{name}</Text>
      <Text style={[styles.content, { color: colors.text }]}>{post.content}</Text>
      <View style={styles.footer}>
        {post.emotionTags && post.emotionTags.length > 0 && (
          <Text style={[styles.tags, { color: colors.primary }]}>{post.emotionTags.join(' · ')}</Text>
        )}
        {post.moodEmoji && <Text style={styles.emoji}>{post.moodEmoji}</Text>}
        <Text style={[styles.date, { color: colors.textSecondary }]}>
          {new Date(post.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: 16, marginVertical: 8, padding: 16, borderRadius: 12, borderWidth: 1 },
  author: { fontSize: 12, marginBottom: 4 },
  content: { fontSize: 16, lineHeight: 22 },
  footer: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 8 },
  tags: { fontSize: 12 },
  emoji: { fontSize: 14 },
  date: { fontSize: 11, marginLeft: 'auto' },
});
