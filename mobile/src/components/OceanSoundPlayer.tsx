import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

/**
 * Stub: Ocean sound player for Midnight Ocean mode.
 * In production, use expo-av to play an ocean/ambient sound asset.
 */
export default function OceanSoundPlayer() {
  const { colors } = useTheme();
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    setPlaying((p) => !p);
    // TODO: Audio.Sound.createAsync(require('../assets/ocean.mp3')) and play/pause
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.label, { color: colors.text }]}>🌊 Ocean sounds</Text>
      <TouchableOpacity style={[styles.btn, { backgroundColor: colors.primary }]} onPress={toggle}>
        <Text style={styles.btnText}>{playing ? 'Pause' : 'Play'}</Text>
      </TouchableOpacity>
      <Text style={[styles.hint, { color: colors.textSecondary }]}>Stub: connect expo-av for audio</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, borderRadius: 12, marginBottom: 16 },
  label: { fontSize: 16, marginBottom: 8 },
  btn: { padding: 10, borderRadius: 8, alignSelf: 'flex-start' },
  btnText: { color: '#fff' },
  hint: { fontSize: 12, marginTop: 8 },
});
