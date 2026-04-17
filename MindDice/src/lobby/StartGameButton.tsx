import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../components/common/Button';
import { COLORS, FONTS } from '../styles/Theme';

interface Props {
  isLeader:    boolean;
  playerCount: number;
  onIniciar:   () => void;
  loading?:    boolean;
}

export default function StartGameButton({ isLeader, playerCount, onIniciar, loading }: Props) {
  if (!isLeader) {
    return (
      <View style={styles.waitBox}>
        <Text style={styles.waitText}>Esperando que el líder inicie la partida...</Text>
      </View>
    );
  }
  const canStart = playerCount >= 2;
  return (
    <Button
      label={canStart ? '⚔  INICIAR PARTIDA' : `ESPERANDO JUGADORES (${playerCount}/2)`}
      onPress={onIniciar}
      disabled={!canStart}
      loading={loading}
      style={styles.btn}
    />
  );
}

const styles = StyleSheet.create({
  btn:      { marginHorizontal: 32 },
  waitBox:  { marginHorizontal: 32, padding: 16, backgroundColor: 'rgba(20,14,4,0.7)', borderWidth: 1, borderColor: '#4a3818', borderRadius: 4, alignItems: 'center' },
  waitText: { color: COLORS.text_muted, fontSize: FONTS.sizes.sm, textAlign: 'center', fontStyle: 'italic' },
});