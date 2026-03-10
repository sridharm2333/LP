import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, TextInput, Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { moodApi, userApi } from '../services/api';
import type { MoodEntry } from '../services/api';

const MOODS: { level: MoodEntry['mood']; emoji: string; label: string; color: string }[] = [
  { level: 'great',    emoji: '😊', label: 'Great',    color: '#22c55e' },
  { level: 'okay',     emoji: '😐', label: 'Okay',     color: '#f59e0b' },
  { level: 'rough',    emoji: '😔', label: 'Rough',    color: '#f97316' },
  { level: 'terrible', emoji: '😢', label: 'Terrible', color: '#ef4444' },
];

export default function MySpaceScreen({ navigation }: { navigation: { navigate: (s: string) => void } }) {
  const { colors } = useTheme();
  const [selectedMood, setSelectedMood] = useState<MoodEntry['mood'] | null>(null);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [recentMoods, setRecentMoods] = useState<MoodEntry[]>([]);
  const [streak, setStreak] = useState<number | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [moodRes, checkInRes] = await Promise.allSettled([
        moodApi.getRecent(),
        userApi.checkIn(),
      ]);
      if (moodRes.status === 'fulfilled') setRecentMoods(moodRes.value.entries);
      if (checkInRes.status === 'fulfilled') setStreak(checkInRes.value.streak);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const saveMood = async () => {
    if (!selectedMood) { Alert.alert('Pick a mood first'); return; }
    setSaving(true);
    try {
      await moodApi.logMood({ mood: selectedMood, note: note.trim() || undefined });
      setSaved(true);
      setNote('');
      loadData();
      setTimeout(() => setSaved(false), 2500);
    } catch {
      Alert.alert('Could not save mood. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const moodColor = (m: string) => MOODS.find((x) => x.level === m)?.color ?? colors.textSecondary;
  const moodEmoji = (m: string) => MOODS.find((x) => x.level === m)?.emoji ?? '•';

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.inner}>

      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: colors.text }]}>🐧 My Space</Text>
        {streak !== null && (
          <View style={[styles.streakBadge, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.streakText, { color: colors.primary }]}>🔥 {streak}-day streak</Text>
          </View>
        )}
      </View>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Your private corner — no audience, just you.</Text>

      {/* Mood check-in */}
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>How are you feeling today?</Text>
        <View style={styles.moodRow}>
          {MOODS.map((m) => (
            <TouchableOpacity
              key={m.level}
              style={[
                styles.moodBtn,
                { borderColor: m.color },
                selectedMood === m.level && { backgroundColor: m.color },
              ]}
              onPress={() => setSelectedMood(m.level)}
            >
              <Text style={styles.moodEmoji}>{m.emoji}</Text>
              <Text style={[styles.moodLabel, { color: selectedMood === m.level ? '#fff' : m.color }]}>{m.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={[styles.noteInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
          placeholder="Add a note (optional)..."
          placeholderTextColor={colors.textSecondary}
          value={note}
          onChangeText={setNote}
          multiline
          maxLength={300}
        />

        {saved ? (
          <Text style={[styles.savedText, { color: '#22c55e' }]}>✓ Mood saved</Text>
        ) : (
          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: colors.primary }]}
            onPress={saveMood}
            disabled={saving}
          >
            <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save mood'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 7-day mood history */}
      {recentMoods.length > 0 && (
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Last 7 days</Text>
          <View style={styles.historyRow}>
            {recentMoods.map((entry) => (
              <View key={entry._id} style={styles.historyItem}>
                <Text style={styles.historyEmoji}>{moodEmoji(entry.mood)}</Text>
                <Text style={[styles.historyDate, { color: colors.textSecondary }]}>
                  {new Date(entry.createdAt).toLocaleDateString('en', { weekday: 'short' })}
                </Text>
                <View style={[styles.historyDot, { backgroundColor: moodColor(entry.mood) }]} />
              </View>
            ))}
          </View>
          {recentMoods.length > 0 && (() => {
            const rough = recentMoods.filter((e) => e.mood === 'rough' || e.mood === 'terrible').length;
            if (rough >= 3) return (
              <Text style={[styles.insightText, { color: '#f97316' }]}>
                💛 You've had a tough few days. Be gentle with yourself.
              </Text>
            );
            const great = recentMoods.filter((e) => e.mood === 'great' || e.mood === 'okay').length;
            if (great >= 4) return (
              <Text style={[styles.insightText, { color: '#22c55e' }]}>
                🌱 You're having a good stretch. Notice and hold onto that.
              </Text>
            );
            return null;
          })()}
        </View>
      )}

      {/* Quick links */}
      <View style={styles.linksRow}>
        <TouchableOpacity
          style={[styles.linkCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => navigation.navigate('Feed')}
        >
          <Text style={styles.linkEmoji}>💬</Text>
          <Text style={[styles.linkLabel, { color: colors.text }]}>Someone needs support</Text>
          <Text style={[styles.linkSub, { color: colors.textSecondary }]}>Go to feed →</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.linkCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => navigation.navigate('PeerMatch')}
        >
          <Text style={styles.linkEmoji}>🤝</Text>
          <Text style={[styles.linkLabel, { color: colors.text }]}>Talk 1-on-1</Text>
          <Text style={[styles.linkSub, { color: colors.textSecondary }]}>Find a peer →</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { padding: 20, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  title: { fontSize: 24, fontWeight: '700' },
  subtitle: { fontSize: 13, marginBottom: 20 },
  streakBadge: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 },
  streakText: { fontSize: 13, fontWeight: '600' },
  card: { borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 14 },
  moodRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  moodBtn: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 10, borderWidth: 1.5 },
  moodEmoji: { fontSize: 22, marginBottom: 2 },
  moodLabel: { fontSize: 11, fontWeight: '600' },
  noteInput: { borderWidth: 1, borderRadius: 8, padding: 10, fontSize: 14, minHeight: 60, marginBottom: 12 },
  saveBtn: { padding: 12, borderRadius: 8, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  savedText: { textAlign: 'center', fontWeight: '600', paddingVertical: 10 },
  historyRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap', marginBottom: 8 },
  historyItem: { alignItems: 'center', gap: 2 },
  historyEmoji: { fontSize: 20 },
  historyDate: { fontSize: 10 },
  historyDot: { width: 6, height: 6, borderRadius: 3 },
  insightText: { fontSize: 13, marginTop: 8, fontWeight: '500' },
  linksRow: { flexDirection: 'row', gap: 12 },
  linkCard: { flex: 1, borderRadius: 14, borderWidth: 1, padding: 14, alignItems: 'center' },
  linkEmoji: { fontSize: 28, marginBottom: 6 },
  linkLabel: { fontSize: 13, fontWeight: '600', textAlign: 'center', marginBottom: 2 },
  linkSub: { fontSize: 11 },
});
