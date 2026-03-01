import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { postsApi } from '../services/api';

const EMOTION_TAGS = ['sad', 'anxious', 'lonely', 'grief', 'heartbreak', 'hopeful', 'grateful', 'other'];

export default function CreatePostScreen({ navigation }: { navigation: { goBack: () => void } }) {
  const { colors } = useTheme();
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [emotionTags, setEmotionTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleTag = (tag: string) => {
    setEmotionTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const submit = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Please write something');
      return;
    }
    setLoading(true);
    try {
      const res = await postsApi.create({ content: content.trim(), isAnonymous, emotionTags });
      if (res.groundingMessage) Alert.alert('You’re not alone', res.groundingMessage);
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <TextInput
        style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
        placeholder="How are you feeling?"
        placeholderTextColor={colors.textSecondary}
        value={content}
        onChangeText={setContent}
        multiline
      />
      <TouchableOpacity onPress={() => setIsAnonymous(!isAnonymous)}>
        <Text style={{ color: colors.text }}>{isAnonymous ? '✓ Anonymous' : 'Post anonymously'}</Text>
      </TouchableOpacity>
      <Text style={[styles.label, { color: colors.textSecondary }]}>Emotions</Text>
      <View style={styles.tagRow}>
        {EMOTION_TAGS.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={[styles.tag, emotionTags.includes(tag) && { backgroundColor: colors.primary }]}
            onPress={() => toggleTag(tag)}
          >
            <Text style={[styles.tagText, { color: emotionTags.includes(tag) ? '#fff' : colors.text }]}>{tag}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={submit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Posting...' : 'Share'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, minHeight: 100, marginBottom: 16 },
  label: { marginTop: 12, marginBottom: 8 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  tagText: { fontSize: 14 },
  button: { marginTop: 24, padding: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
});
