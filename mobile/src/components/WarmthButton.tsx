import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { commentsApi } from '../services/api';

export default function WarmthButton({
  commentId,
  warmthCount,
  onWarmth,
}: {
  commentId: string;
  warmthCount: number;
  onWarmth: () => void;
}) {
  const { colors } = useTheme();
  const [count, setCount] = useState(warmthCount);
  const [sent, setSent] = useState(false);

  const sendWarmth = async () => {
    if (sent) return;
    try {
      const updated = await commentsApi.addWarmth(commentId);
      setCount(updated.warmthCount);
      setSent(true);
      onWarmth();
    } catch {
      // already sent or error
    }
  };

  return (
    <TouchableOpacity
      style={[styles.btn, { borderColor: colors.warmth }]}
      onPress={sendWarmth}
      disabled={sent}
    >
      <Text style={[styles.text, { color: colors.warmth }]}>
        {sent ? '❤️ Sent' : '🤗'} Warmth {count > 0 ? count : ''}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { marginTop: 8, alignSelf: 'flex-start', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8, borderWidth: 1 },
  text: { fontSize: 13 },
});
