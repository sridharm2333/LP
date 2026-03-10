import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { peerMatchApi } from '../services/api';
import type { MatchMessage, PeerMatch } from '../services/api';

export default function PeerMatchChatScreen({ route, navigation }: {
  route: { params: { match: PeerMatch } };
  navigation: { goBack: () => void };
}) {
  const { colors } = useTheme();
  const { match } = route.params;
  const [messages, setMessages] = useState<MatchMessage[]>([]);
  const [myUserId, setMyUserId] = useState<string>('');
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const listRef = useRef<FlatList>(null);

  const timeLeft = match.endsAt
    ? Math.max(0, new Date(match.endsAt).getTime() - Date.now())
    : 0;
  const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));

  const loadMessages = useCallback(async () => {
    try {
      const res = await peerMatchApi.getMessages(match._id);
      setMessages(res.messages);
      setMyUserId(res.myUserId);
    } catch {
      // silent
    }
  }, [match._id]);

  useEffect(() => {
    loadMessages();
    // Poll every 8 seconds for new messages
    const interval = setInterval(loadMessages, 8000);
    return () => clearInterval(interval);
  }, [loadMessages]);

  const send = async () => {
    if (!text.trim()) return;
    setSending(true);
    const optimistic: MatchMessage = {
      _id: `tmp-${Date.now()}`,
      matchId: match._id,
      senderId: myUserId,
      content: text.trim(),
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setText('');
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    try {
      await peerMatchApi.sendMessage(match._id, text.trim());
      loadMessages();
    } catch {
      Alert.alert('Could not send message. Try again.');
      setMessages((prev) => prev.filter((m) => m._id !== optimistic._id));
    } finally {
      setSending(false);
    }
  };

  const endMatch = async () => {
    Alert.alert(
      'End conversation?',
      'This will close the private chat. You can always find a new peer match.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End chat',
          style: 'destructive',
          onPress: async () => {
            await peerMatchApi.endMatch(match._id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      {/* Header info bar */}
      <View style={[styles.infoBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.infoTitle, { color: colors.text }]}>🤝 Peer Chat</Text>
          <Text style={[styles.infoSub, { color: colors.textSecondary }]}>
            {match.status === 'active'
              ? `Anonymous · ${hoursLeft}h remaining`
              : 'This conversation has ended'}
          </Text>
        </View>
        {match.status === 'active' && (
          <TouchableOpacity onPress={endMatch} style={[styles.endBtn, { borderColor: '#ef4444' }]}>
            <Text style={styles.endBtnText}>End</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m._id}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        renderItem={({ item }) => {
          const isMe = item.senderId === myUserId;
          return (
            <View style={[styles.bubbleRow, isMe && styles.bubbleRowMe]}>
              <View style={[
                styles.bubble,
                { backgroundColor: isMe ? colors.primary : colors.surface, borderColor: colors.border },
                !isMe && { borderWidth: 1 },
              ]}>
                <Text style={[styles.bubbleText, { color: isMe ? '#fff' : colors.text }]}>
                  {item.content}
                </Text>
                <Text style={[styles.bubbleTime, { color: isMe ? 'rgba(255,255,255,0.7)' : colors.textSecondary }]}>
                  {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🐧</Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              You're both here anonymously.{'\n'}Say hello whenever you're ready.
            </Text>
          </View>
        }
      />

      {/* Input */}
      {match.status === 'active' && (
        <View style={[styles.inputBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
            placeholder="Say something kind..."
            placeholderTextColor={colors.textSecondary}
            value={text}
            onChangeText={setText}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            style={[styles.sendBtn, { backgroundColor: colors.primary, opacity: text.trim() ? 1 : 0.5 }]}
            onPress={send}
            disabled={sending || !text.trim()}
          >
            <Text style={styles.sendBtnText}>↑</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  infoBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderBottomWidth: 1 },
  infoTitle: { fontSize: 15, fontWeight: '700' },
  infoSub: { fontSize: 12, marginTop: 2 },
  endBtn: { borderWidth: 1.5, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  endBtnText: { color: '#ef4444', fontWeight: '600', fontSize: 13 },
  messageList: { padding: 16, gap: 10, flexGrow: 1 },
  bubbleRow: { alignItems: 'flex-start' },
  bubbleRowMe: { alignItems: 'flex-end' },
  bubble: { maxWidth: '78%', borderRadius: 16, padding: 12 },
  bubbleText: { fontSize: 15, lineHeight: 21 },
  bubbleTime: { fontSize: 10, marginTop: 4, alignSelf: 'flex-end' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { textAlign: 'center', fontSize: 14, lineHeight: 22 },
  inputBar: { flexDirection: 'row', gap: 8, padding: 12, borderTopWidth: 1, alignItems: 'flex-end' },
  input: { flex: 1, borderWidth: 1, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15, maxHeight: 100 },
  sendBtn: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  sendBtnText: { color: '#fff', fontSize: 20, fontWeight: '700' },
});
