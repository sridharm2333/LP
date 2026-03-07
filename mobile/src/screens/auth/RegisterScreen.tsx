import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/api';

export default function RegisterScreen({ navigation }: { navigation: { navigate: (name: string) => void } }) {
  const { colors } = useTheme();
  const { setToken } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [assignedUsername, setAssignedUsername] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.register(email.trim(), password);
      setAssignedUsername(res.user.username);
      // Brief pause so user sees their new username, then sign in
      setTimeout(() => setToken(res.token), 2000);
    } catch (e) {
      Alert.alert('Registration failed', (e as Error).message);
      setLoading(false);
    }
  };

  if (assignedUsername) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={styles.logo}>🐧</Text>
        <Text style={[styles.title, { color: colors.text }]}>Welcome!</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Your anonymous username is</Text>
        <View style={[styles.usernameBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.username, { color: colors.primary }]}>u/{assignedUsername}</Text>
        </View>
        <Text style={[styles.usernameNote, { color: colors.textSecondary }]}>
          This is how others see you. You can never be identified from it.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={styles.logo}>🐧</Text>
      <Text style={[styles.title, { color: colors.text }]}>Create account</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        You'll be assigned a random anonymous username — like Reddit.
      </Text>

      <TextInput
        style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
        placeholder="Email address"
        placeholderTextColor={colors.textSecondary}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
        placeholder="Password (min 8 characters)"
        placeholderTextColor={colors.textSecondary}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Create account</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={[styles.link, { color: colors.primary }]}>Already have an account? Sign in</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  logo: { fontSize: 48, textAlign: 'center', marginBottom: 12 },
  title: { fontSize: 24, fontWeight: '800', textAlign: 'center', marginBottom: 6 },
  subtitle: { fontSize: 13, textAlign: 'center', marginBottom: 24, lineHeight: 18 },
  input: { borderWidth: 1.5, borderRadius: 10, padding: 13, fontSize: 15, marginBottom: 12 },
  primaryBtn: { padding: 14, borderRadius: 10, alignItems: 'center', marginBottom: 14 },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  link: { textAlign: 'center' },
  usernameBox: { borderWidth: 1.5, borderRadius: 14, padding: 20, alignItems: 'center', marginVertical: 20 },
  username: { fontSize: 22, fontWeight: '800', letterSpacing: 0.5 },
  usernameNote: { fontSize: 13, textAlign: 'center', lineHeight: 18 },
});
