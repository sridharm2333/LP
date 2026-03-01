import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { userApi, UserProfile } from '../services/api';
import OceanSoundPlayer from '../components/OceanSoundPlayer';

export default function ProfileScreen() {
  const { colors, toggleMidnightOcean, theme } = useTheme();
  const { token, setToken } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (token) {
      userApi.getProfile().then(setProfile).catch(() => setProfile(null));
    }
  }, [token]);

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: () => setToken(null) },
    ]);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
      {profile && (
        <>
          <Text style={[styles.name, { color: colors.text }]}>{profile.displayName}</Text>
          <Text style={[styles.score, { color: colors.primary }]}>Kindness score: {profile.kindnessScore}</Text>
          <Text style={[styles.streak, { color: colors.textSecondary }]}>Posting streak: {profile.postingStreakDays} days</Text>
        </>
      )}
      <OceanSoundPlayer />
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Ethical monetization (stub)</Text>
      <Text style={[styles.stubText, { color: colors.textSecondary }]}>Penguin customization · Calm Packs · Book of Becoming export — coming soon.</Text>
      <TouchableOpacity
        style={[styles.btn, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={toggleMidnightOcean}
      >
        <Text style={[styles.btnText, { color: colors.text }]}>
          {theme === 'midnight' ? '☀️ Light mode' : '🌙 Midnight Ocean mode'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.btn, { borderColor: colors.warmth }]} onPress={handleLogout}>
        <Text style={[styles.btnText, { color: colors.warmth }]}>Log out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 16 },
  name: { fontSize: 18, marginBottom: 8 },
  score: { fontSize: 14, marginBottom: 4 },
  streak: { fontSize: 14, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  stubText: { fontSize: 14, marginBottom: 24 },
  btn: { padding: 14, borderRadius: 8, borderWidth: 1, marginBottom: 12 },
  btnText: { textAlign: 'center', fontWeight: '600' },
});
