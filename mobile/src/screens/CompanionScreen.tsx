import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { userApi } from '../services/api';

export default function CompanionScreen({ navigation }: { navigation: { navigate: (name: string) => void } }) {
  const { colors } = useTheme();
  const [message, setMessage] = useState<string | null>(null);
  const [streak, setStreak] = useState<number | null>(null);

  const loadMessage = async () => {
    try {
      const res = await userApi.companionMessage();
      setMessage(res.message);
    } catch {
      setMessage("You're not alone. I'm here with you.");
    }
  };

  const checkIn = async () => {
    try {
      const res = await userApi.checkIn();
      setStreak(res.streak);
    } catch {
      setStreak(1);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.emoji, { color: colors.text }]}>🐧</Text>
      <Text style={[styles.title, { color: colors.text }]}>Penguin Companion</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Gentle check-ins and encouragement</Text>
      <TouchableOpacity style={[styles.btn, { backgroundColor: colors.primary }]} onPress={loadMessage}>
        <Text style={styles.btnText}>Get a message</Text>
      </TouchableOpacity>
      {message && (
        <View style={[styles.messageBox, { backgroundColor: colors.surface }]}>
          <Text style={[styles.messageText, { color: colors.text }]}>{message}</Text>
        </View>
      )}
      <TouchableOpacity style={[styles.btn, { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }]} onPress={checkIn}>
        <Text style={[styles.btnText, { color: colors.text }]}>Daily check-in</Text>
      </TouchableOpacity>
      {streak != null && (
        <Text style={[styles.streak, { color: colors.textSecondary }]}>Streak: {streak} day(s)</Text>
      )}
      <TouchableOpacity
        style={[styles.btn, { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }]}
        onPress={() => navigation.navigate('PenguinCircle')}
      >
        <Text style={[styles.btnText, { color: colors.text }]}>Penguin Circle (distress support)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, alignItems: 'center' },
  emoji: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 8 },
  subtitle: { marginBottom: 32 },
  btn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, marginBottom: 16 },
  btnText: { color: '#fff', fontWeight: '600' },
  messageBox: { padding: 16, borderRadius: 12, marginBottom: 24, width: '100%' },
  messageText: { fontSize: 16, fontStyle: 'italic' },
  streak: { marginTop: 8 },
});
