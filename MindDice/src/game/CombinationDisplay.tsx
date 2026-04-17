import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../styles/Theme';
import { ComboType } from '../types/GameTypes';

const COMBO_LABEL: Record<ComboType, string> = {
  Triple:   'TRIPLE',
  Straight: 'ESCALERA',
  Pair:     'DOBLE',
  None:     'SIN COMBO',
};

const COMBO_COLOR: Record<ComboType, string> = {
  Triple:   '#d4af37',
  Straight: COLORS.dado_azul,
  Pair:     COLORS.gold,
  None:     COLORS.text_muted,
};

interface Props {
  playerName:   string;
  diceUsed:     number[];
  comboType:    ComboType;
  pointsEarned: number;
}

export default function CombinationDisplay({
  playerName, diceUsed, comboType, pointsEarned,
}: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.player}>{playerName}</Text>
      <View style={styles.diceRow}>
        {diceUsed.map((d, i) => (
          <View key={i} style={styles.die}>
            <Text style={styles.dieVal}>{d}</Text>
          </View>
        ))}
      </View>
      <Text style={[styles.combo, { color: COMBO_COLOR[comboType] }]}>
        {COMBO_LABEL[comboType]}
      </Text>
      <Text style={styles.pts}>
        {pointsEarned % 1 === 0 ? pointsEarned : pointsEarned.toFixed(1)} pts
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap:    { alignItems: 'center', padding: 12, gap: 6 },
  player:  { color: COLORS.text_light, fontSize: FONTS.sizes.md, fontWeight: '600' },
  diceRow: { flexDirection: 'row', gap: 8 },
  die: {
    width: 40, height: 40, borderRadius: 6,
    backgroundColor: COLORS.dado_blanco,
    borderWidth: 2, borderColor: COLORS.dado_border,
    alignItems: 'center', justifyContent: 'center',
  },
  dieVal:  { fontSize: FONTS.sizes.lg, color: '#1a1008', fontWeight: '700' },
  combo:   { fontSize: FONTS.sizes.lg, fontWeight: '700', letterSpacing: 2 },
  pts:     { color: COLORS.gold, fontSize: FONTS.sizes.md, fontWeight: '700' },
});