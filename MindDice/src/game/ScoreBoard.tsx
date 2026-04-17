import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../components/common/Card';
import { COLORS, FONTS } from '../styles/Theme';
import { Player } from '../types/GameTypes';

export default function ScoreBoard({ players }: { players: Player[] }) {
  return (
    <Card>
      <Text style={styles.title}>PUNTAJES</Text>
      {players.map(p => (
        <View key={p.id} style={styles.row}>
          <View style={[styles.dot, { backgroundColor: p.connected ? COLORS.success : COLORS.danger }]} />
          <Text style={styles.name}>{p.name}</Text>
          {p.prediction_made && <View style={styles.predDot} />}
          <Text style={styles.round}>{p.round_score}</Text>
          <Text style={styles.total}>{p.total_score} pts</Text>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  title:   { color: COLORS.gold, fontSize: FONTS.sizes.sm, letterSpacing: 2, fontWeight: '700', marginBottom: 10 },
  row:     { flexDirection: 'row', alignItems: 'center', paddingVertical: 7, gap: 8 },
  dot:     { width: 8, height: 8, borderRadius: 4 },
  name:    { flex: 1, color: COLORS.text_light, fontSize: FONTS.sizes.md },
  predDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.gold },
  round:   { color: COLORS.text_muted, fontSize: FONTS.sizes.sm, width: 28, textAlign: 'right' },
  total:   { color: COLORS.gold, fontSize: FONTS.sizes.md, fontWeight: '700', width: 54, textAlign: 'right' },
});