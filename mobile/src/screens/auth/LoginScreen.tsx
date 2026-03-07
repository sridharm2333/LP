import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/api';

export default function LoginScreen({ navigation }: { navigation: { navigate: (name: string) => void } }) {
  const { colors } = useTheme();
  const { setToken } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'choose' | 'email'>('choose');

  const handleEmailLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.login(email.trim(), password);
      await setToken(res.token);
    } catch (e) {
      Alert.alert('Login failed', (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider: 'google' | 'apple') => {
    // Stub: integrate Google/Apple native SDK and call authApi.oauth()
    Alert.alert(
      `${provider === 'google' ? 'Google' : 'Apple'} Sign-In`,
      'OAuth flow not yet configured. Set up the native SDK to enable this.',
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={styles.logo}>🐧</Text>
      <Text style={[styles.title, { color: colors.text }]}>Lonely Penguin</Text>
      <Text style={[styles.tagline, { color: colors.textSecondary }]}>
        A safe space for loneliness,{'\n'}heartbreak &amp; healing
      </Text>

      {mode === 'choose' ? (
        <>
          <TouchableOpacity
            style={[styles.oauthBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => handleOAuth('google')}
          >
            <Text style={styles.oauthIcon}>🔵</Text>
            <Text style={[styles.oauthText, { color: colors.text }]}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.oauthBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => handleOAuth('apple')}
          >
            <Text style={styles.oauthIcon}>🍎</Text>
            <Text style={[styles.oauthText, { color: colors.text }]}>Continue with Apple</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.textSecondary }]}>or</Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: colors.primary }]} onPress={() => setMode('email')}>
            <Text style={styles.primaryBtnText}>Continue with email</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={[styles.registerLink, { color: colors.textSecondary }]}>
              Don't have an account?{' '}
              <Text style={{ color: colors.primary, fontWeight: '600' }}>Create one</Text>
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
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
            placeholder="Password"
            placeholderTextColor={colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
            onPress={handleEmailLogin}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Sign in</Text>}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMode('choose')}>
            <Text style={[styles.backLink, { color: colors.textSecondary }]}>← Back to sign-in options</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={[styles.registerLink, { color: colors.primary }]}>Create an account</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  logo: { fontSize: 56, textAlign: 'center', marginBottom: 12 },
  title: { fontSize: 26, fontWeight: '800', textAlign: 'center', marginBottom: 6 },
  tagline: { fontSize: 14, textAlign: 'center', marginBottom: 36, lineHeight: 20 },
  oauthBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 10, borderWidth: 1.5, marginBottom: 12, gap: 10 },
  oauthIcon: { fontSize: 18 },
  oauthText: { fontSize: 15, fontWeight: '600' },
  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 10 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 12 },
  input: { borderWidth: 1.5, borderRadius: 10, padding: 13, fontSize: 15, marginBottom: 12 },
  primaryBtn: { padding: 14, borderRadius: 10, alignItems: 'center', marginBottom: 14 },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  backLink: { textAlign: 'center', marginBottom: 12 },
  registerLink: { textAlign: 'center', marginTop: 4 },
});
