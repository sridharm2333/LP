import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, TextInput,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { commentsApi } from '../services/api';
import type { Post } from '../services/api';

export default function PostCard({
  post,
  onPress,
}: {
  post: Post;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [localCount, setLocalCount] = useState(post.commentCount ?? 0);

  const authorLabel = post.isAnonymous
    ? 'Anonymous'
    : post.authorUsername
    ? `u/${post.authorUsername}`
    : 'Someone';

  const toggleReply = () => {
    setExpanded((v) => !v);
    setSent(false);
    setReply('');
  };

  const submitReply = async () => {
    if (!reply.trim()) return;
    setSending(true);
    try {
      await commentsApi.create(post._id, { content: reply.trim() });
      setReply('');
      setSent(true);
      setLocalCount((n) => n + 1);
      setTimeout(() => {
        setSent(false);
        setExpanded(false);
      }, 1500);
    } catch {
      // keep expanded so user can retry
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={[
      styles.card,
      { backgroundColor: colors.surface, borderColor: post.isUrgent ? '#ef4444' : colors.border },
      post.isUrgent && styles.urgentCard,
    ]}>
      {/* Urgent banner */}
      {post.isUrgent && (
        <View style={styles.urgentBanner}>
          <Text style={styles.urgentBannerText}>🆘 Needs support right now</Text>
        </View>
      )}

      {/* Tappable post body */}
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <Text style={[styles.author, { color: colors.textSecondary }]}>{authorLabel}</Text>
        <Text style={[styles.content, { color: colors.text }]}>{post.content}</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        {post.emotionTags && post.emotionTags.length > 0 && (
          <Text style={[styles.tags, { color: post.isUrgent ? '#ef4444' : colors.primary }]}>
            {post.emotionTags.join(' · ')}
          </Text>
        )}
        {post.moodEmoji && <Text style={styles.emoji}>{post.moodEmoji}</Text>}
        <Text style={[styles.date, { color: colors.textSecondary }]}>
          {new Date(post.createdAt).toLocaleDateString()}
        </Text>
        <TouchableOpacity onPress={toggleReply} style={styles.replyBtn}>
          <Text style={[styles.replyLabel, { color: expanded ? colors.primary : colors.textSecondary }]}>
            💬 {localCount > 0 ? localCount : 'Reply'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Inline quick-reply */}
      {expanded && (
        <View style={[styles.replyRow, { borderTopColor: colors.border }]}>
          {sent ? (
            <Text style={[styles.sentText, { color: colors.primary }]}>✓ Warmth sent</Text>
          ) : (
            <>
              <TextInput
                style={[styles.replyInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                placeholder={post.isUrgent ? 'Send support...' : 'Send warmth...'}
                placeholderTextColor={colors.textSecondary}
                value={reply}
                onChangeText={setReply}
                multiline
                autoFocus
              />
              <TouchableOpacity
                style={[styles.sendBtn, { backgroundColor: post.isUrgent ? '#ef4444' : colors.primary }]}
                onPress={submitReply}
                disabled={sending}
              >
                {sending
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={styles.sendText}>Send</Text>
                }
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: 16, marginVertical: 8, padding: 16, borderRadius: 12, borderWidth: 1 },
  urgentCard: { borderWidth: 2 },
  urgentBanner: { backgroundColor: '#ef4444', marginHorizontal: -16, marginTop: -16, marginBottom: 12, paddingHorizontal: 16, paddingVertical: 8, borderTopLeftRadius: 10, borderTopRightRadius: 10 },
  urgentBannerText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  author: { fontSize: 12, marginBottom: 4 },
  content: { fontSize: 16, lineHeight: 22 },
  footer: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 8 },
  tags: { fontSize: 12 },
  emoji: { fontSize: 14 },
  date: { fontSize: 11 },
  replyBtn: { marginLeft: 'auto' },
  replyLabel: { fontSize: 13, fontWeight: '500' },
  replyRow: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  replyInput: { flex: 1, borderWidth: 1, borderRadius: 8, padding: 10, fontSize: 14, maxHeight: 80 },
  sendBtn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8 },
  sendText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  sentText: { flex: 1, textAlign: 'center', fontWeight: '600', paddingVertical: 8 },
});
