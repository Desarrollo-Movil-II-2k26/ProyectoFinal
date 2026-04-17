import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../components/common/Card';
import { COLORS, FONTS } from '../styles/Theme';

interface Props {
  currentTurnPlayerId: string;
  myPlayerId:          string;
  players:             { id: string; name: string }[];
}

export default function TurnIndicator({ currentTurnPlayerId, myPlayerId, players }: Props) {
  const isMyTurn = currentTurnPlayerId === myPlayerId;
  const player   = players.find(p => p.id === currentTurnPlayerId);

  return (
    <Card style={styles.card}>
      <Text style={styles.label}>TURNO DE</Text>
      <Text style={[styles.name, isMyTurn && styles.nameMe]}>
        {isMyTurn ? '¡TÚ!' : player?.name ?? '...'}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card:   { alignItems: 'center', paddingVertical: 14 },
  label:  { color: COLORS.gold_muted, fontSize: FONTS.sizes.xs, letterSpacing: 3, marginBottom: 6 },
  name:   { color: COLORS.text_light, fontSize: FONTS.sizes.xl, fontWeight: '700', letterSpacing: 2 },
  nameMe: { color: COLORS.gold },
});