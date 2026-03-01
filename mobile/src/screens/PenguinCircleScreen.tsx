import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { penguinCircleApi } from '../services/api';

export default function PenguinCircleScreen() {
  const { colors } = useTheme();
  const [circle, setCircle] = useState<{ _id: string; status: string; expiresAt: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const requestCircle = async () => {
    Alert.alert(
      'Penguin Circle',
      'If you\'re in distress, we can connect you with a small circle of supportive community members (5–10 people with high kindness scores) who can offer support. The circle dissolves after 24 hours. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, request support',
          onPress: async () => {
            setLoading(true);
            try {
              const res = await penguinCircleApi.request();
              setCircle(res.circle);
            } catch (e) {
              Alert.alert('Unable to create circle', (e as Error).message);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const loadMyCircle = async () => {
    setLoading(true);
    try {
      const res = await penguinCircleApi.my();
      setCircle(res.circle ?? null);
    } catch {
      setCircle(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Penguin Circle</Text>
      <Text style={[styles.desc, { color: colors.textSecondary }]}>
        Distress support: consent-based circle of kind users. Dissolves after 24 hours.
      </Text>
      <TouchableOpacity style={[styles.btn, { backgroundColor: colors.primary }]} onPress={requestCircle} disabled={loading}>
        <Text style={styles.btnText}>Request support circle</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.btn, { borderColor: colors.border, borderWidth: 1 }]} onPress={loadMyCircle} disabled={loading}>
        <Text style={[styles.btnText, { color: colors.text }]}>View my circle</Text>
      </TouchableOpacity>
      {circle && (
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Your circle</Text>
          <Text style={[styles.cardText, { color: colors.textSecondary }]}>Status: {circle.status}</Text>
          <Text style={[styles.cardText, { color: colors.textSecondary }]}>
            Expires: {new Date(circle.expiresAt).toLocaleString()}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 8 },
  desc: { marginBottom: 24 },
  btn: { padding: 14, borderRadius: 8, marginBottom: 12 },
  btnText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
  card: { marginTop: 24, padding: 16, borderRadius: 12 },
  cardTitle: { fontSize: 18, marginBottom: 8 },
  cardText: { fontSize: 14 },
});
