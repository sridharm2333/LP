import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { postsApi } from '../services/api';

const EMOTION_TAGS = ['sad', 'anxious', 'lonely', 'grief', 'heartbreak', 'hopeful', 'grateful', 'other'];

export default function CreatePostScreen({ navigation }: { navigation: { goBack: () => void } }) {
  const { colors } = useTheme();
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true); // default anonymous
  const [emotionTags, setEmotionTags] = useState<string[]>([]);
  const [isUrgent, setIsUrgent] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleTag = (tag: string) => {
    setEmotionTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const submit = async () => {
    if (!content.trim()) {
      Alert.alert('', 'Please write something before sharing.');
      return;
    }
    setLoading(true);
    try {
      const res = await postsApi.create({ content: content.trim(), isAnonymous, emotionTags, isUrgent });
      if (res.groundingMessage) Alert.alert("You're not alone", res.groundingMessage);
      navigation.goBack();
    } catch (e) {
      Alert.alert('Could not post', (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>

      {/* Urgent toggle — at the top so it's unmissable */}
      <TouchableOpacity
        style={[
          styles.urgentToggle,
          {
            backgroundColor: isUrgent ? '#fee2e2' : colors.surface,
            borderColor: isUrgent ? '#ef4444' : colors.border,
          },
        ]}
        onPress={() => setIsUrgent((v) => !v)}
      >
        <Text style={styles.urgentEmoji}>🆘</Text>
        <View style={styles.urgentTextBlock}>
          <Text style={[styles.urgentTitle, { color: isUrgent ? '#ef4444' : colors.text }]}>
            I need support right now
          </Text>
          <Text style={[styles.urgentSub, { color: isUrgent ? '#b91c1c' : colors.textSecondary }]}>
            {isUrgent
              ? 'Your post will appear at the top of the feed. Community members will be notified.'
              : 'Tap to flag your post — the community will rally around you.'}
          </Text>
        </View>
        <View style={[styles.urgentCheck, { backgroundColor: isUrgent ? '#ef4444' : 'transparent', borderColor: isUrgent ? '#ef4444' : colors.border }]}>
          {isUrgent && <Text style={styles.urgentCheckMark}>✓</Text>}
        </View>
      </TouchableOpacity>

      {/* Content input */}
      <TextInput
        style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
        placeholder={isUrgent ? "Tell us what's happening..." : 'How are you feeling? Share freely.'}
        placeholderTextColor={colors.textSecondary}
        value={content}
        onChangeText={setContent}
        multiline
      />

      {/* Anonymous toggle */}
      <TouchableOpacity
        style={[styles.anonRow, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={() => setIsAnonymous(!isAnonymous)}
      >
        <Text style={{ fontSize: 16 }}>{isAnonymous ? '🎭' : '👤'}</Text>
        <Text style={[styles.anonText, { color: colors.text }]}>
          {isAnonymous ? 'Posting anonymously' : 'Posting as u/' + 'you'}
        </Text>
        <Text style={[styles.anonToggle, { color: colors.primary }]}>
          {isAnonymous ? 'Show username' : 'Go anonymous'}
        </Text>
      </TouchableOpacity>

      {/* Emotion tags */}
      <Text style={[styles.label, { color: colors.textSecondary }]}>What are you feeling?</Text>
      <View style={styles.tagRow}>
        {EMOTION_TAGS.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={[
              styles.tag,
              { borderColor: colors.border, backgroundColor: emotionTags.includes(tag) ? colors.primary : colors.surface },
            ]}
            onPress={() => toggleTag(tag)}
          >
            <Text style={[styles.tagText, { color: emotionTags.includes(tag) ? '#fff' : colors.text }]}>{tag}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Submit */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: isUrgent ? '#ef4444' : colors.primary }]}
        onPress={submit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Sharing...' : isUrgent ? '🆘 Share — I need support' : 'Share'}</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  urgentToggle: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 12, padding: 14, marginBottom: 14, gap: 10 },
  urgentEmoji: { fontSize: 24 },
  urgentTextBlock: { flex: 1 },
  urgentTitle: { fontSize: 14, fontWeight: '700' },
  urgentSub: { fontSize: 12, marginTop: 2, lineHeight: 16 },
  urgentCheck: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  urgentCheckMark: { color: '#fff', fontSize: 13, fontWeight: '700' },
  input: { borderWidth: 1, borderRadius: 10, padding: 14, minHeight: 120, marginBottom: 12, fontSize: 15, lineHeight: 22 },
  anonRow: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 16 },
  anonText: { flex: 1, fontSize: 14 },
  anonToggle: { fontSize: 13, fontWeight: '600' },
  label: { marginBottom: 10, fontSize: 13 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  tag: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  tagText: { fontSize: 13 },
  button: { padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
