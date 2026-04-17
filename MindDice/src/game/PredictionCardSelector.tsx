import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { COLORS, FONTS } from '../styles/Theme';
import { PredictionCard } from '../types/GameTypes';

const CARDS: { card: PredictionCard; label: string; desc: string; color: string }[] = [
  { card: 'Zero', label: 'ZERO',  desc: '0 puntos exactos',  color: '#8a2020' },
  { card: 'Min',  label: 'MIN',   desc: '1 – 6 puntos',      color: '#2a5a8a' },
  { card: 'More', label: 'MORE',  desc: '7 – 10 puntos',     color: '#2a7a3a' },
  { card: 'Max',  label: 'MAX',   desc: 'Más de 10 puntos',  color: '#8a6a10' },
];

interface Props {
  onSelect:   (card: PredictionCard) => void;
  disabled?:  boolean;
}

export default function PredictionCardSelector({ onSelect, disabled }: Props) {
  const [chosen, setChosen] = useState<PredictionCard | null>(null);

  return (
    <Card>
      <Text style={styles.title}>ELIGE TU PREDICCIÓN</Text>
      <Text style={styles.sub}>¿Cuántos puntos crees que harás esta ronda?</Text>
      <View style={styles.grid}>
        {CARDS.map(({ card, label, desc, color }) => (
          <TouchableOpacity
            key={card}
            style={[
              styles.cardBtn,
              { borderColor: color },
              chosen === card && { backgroundColor: color + '44' },
            ]}
            onPress={() => setChosen(card)}
            disabled={disabled}
            activeOpacity={0.75}
          >
            <Text style={[styles.cardLabel, { color }]}>{label}</Text>
            <Text style={styles.cardDesc}>{desc}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Button
        label="CONFIRMAR PREDICCIÓN"
        onPress={() => chosen && onSelect(chosen)}
        disabled={!chosen || disabled}
        style={styles.btn}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  title:     { color: COLORS.gold, fontSize: FONTS.sizes.md, fontWeight: '700', letterSpacing: 2, marginBottom: 4 },
  sub:       { color: COLORS.text_muted, fontSize: FONTS.sizes.xs, marginBottom: 14 },
  grid:      { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  cardBtn: {
    width: '47%',
    borderWidth: 2,
    borderRadius: 4,
    padding: 12,
    backgroundColor: 'rgba(10,6,2,0.6)',
    alignItems: 'center',
    gap: 4,
  },
  cardLabel: { fontSize: FONTS.sizes.lg, fontWeight: '700', letterSpacing: 2 },
  cardDesc:  { color: COLORS.text_muted, fontSize: FONTS.sizes.xs, textAlign: 'center' },
  btn:       { marginTop: 0 },
});