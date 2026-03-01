import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { commentsApi, Comment } from '../services/api';
import WarmthButton from './WarmthButton';

export default function CommentList({ postId, comments, onRefresh }: { postId: string; comments: Comment[]; onRefresh: () => void }) {
  const { colors } = useTheme();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      await commentsApi.create(postId, { content: content.trim() });
      setContent('');
      onRefresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Comments</Text>
      <View style={[styles.inputRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Send warmth..."
          placeholderTextColor={colors.textSecondary}
          value={content}
          onChangeText={setContent}
        />
        <TouchableOpacity style={[styles.sendBtn, { backgroundColor: colors.primary }]} onPress={submit} disabled={loading}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={comments}
        keyExtractor={(c) => c._id}
        renderItem={({ item }) => (
          <View style={[styles.commentCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.commentContent, { color: colors.text }]}>{item.content}</Text>
            <WarmthButton commentId={item._id} warmthCount={item.warmthCount} onWarmth={onRefresh} />
          </View>
        )}
        ListEmptyComponent={<Text style={[styles.empty, { color: colors.textSecondary }]}>No comments yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  sectionTitle: { fontSize: 18, marginBottom: 12 },
  inputRow: { flexDirection: 'row', borderWidth: 1, borderRadius: 8, padding: 8, marginBottom: 16 },
  input: { flex: 1, padding: 8 },
  sendBtn: { paddingHorizontal: 16, justifyContent: 'center', borderRadius: 8 },
  sendText: { color: '#fff' },
  commentCard: { padding: 12, borderRadius: 8, marginBottom: 8 },
  commentContent: { fontSize: 15 },
  empty: { textAlign: 'center', marginTop: 16 },
});
