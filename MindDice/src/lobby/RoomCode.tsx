import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Card from '../components/common/Card';
import { COLORS, FONTS } from '../styles/Theme';

export default function RoomCode({ code }: { code: string }) {
  return (
    <Card style={styles.card}>
      <Text style={styles.label}>CÓDIGO DE SALA</Text>
      <Text style={styles.code}>{code}</Text>
      <Text style={styles.hint}>Comparte este código con tus amigos</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card:  { alignItems: 'center' },
  label: { color: COLORS.gold_muted, fontSize: FONTS.sizes.xs, letterSpacing: 2, marginBottom: 8 },
  code: {
    fontSize: 42, color: COLORS.gold, fontWeight: '700', letterSpacing: 14,
    textShadowColor: '#000', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 6,
  },
  hint:  { color: COLORS.text_muted, fontSize: FONTS.sizes.xs, marginTop: 6 },
});