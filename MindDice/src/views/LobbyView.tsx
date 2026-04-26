import React from 'react';
import { Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import MedievalBackground from '../layout/MedievalBackground';
import Header from '../layout/Header';
import Card from '../components/common/Card';
import RoomCode from '../lobby/RoomCode';
import PlayerList from '../lobby/PlayerList';
import StartGameButton from '../lobby/StartGameButton';
import { COLORS, FONTS } from '../styles/Theme';
import { G } from '../styles/GlobalStyles';
import { Player } from '../types/GameTypes';

interface Props {
  roomCode:   string;
  players:    Player[];
  isLeader:   boolean;
  onIniciar:  () => void;
  onSalir:    () => void;
  onVerJuego: () => void;
}

export default function LobbyView({ roomCode, players, isLeader, onIniciar, onSalir, onVerJuego }: Props) {
  return (
    <MedievalBackground variant="home">
      <SafeAreaView style={G.safe}>
        <Header title="SALA DE ESPERA" onBack={onSalir} />
        <RoomCode code={roomCode} />
        <Card style={styles.playersCard}>
          <Text style={styles.playersTitle}>RECLUSOS ({players.length}/4)</Text>
          <PlayerList players={players} />
        </Card>
        <StartGameButton isLeader={isLeader} playerCount={players.length} onIniciar={onIniciar} />

        {/*<TouchableOpacity style={styles.verBtn} onPress={onVerJuego} activeOpacity={0.8}>
          <Text style={styles.verBtnText}>VER JUEGO →</Text>
        </TouchableOpacity>*/}

      </SafeAreaView>
    </MedievalBackground>
  );
}

const styles = StyleSheet.create({
  playersCard:  { minHeight: 160 },
  playersTitle: { color: COLORS.gold, fontSize: FONTS.sizes.sm, letterSpacing: 2, fontWeight: '700', marginBottom: 12 },
  verBtn: {
    marginHorizontal: 32,
    marginTop: 12,
    height: 48,
    backgroundColor: 'rgba(30,16,8,0.9)',
    borderWidth: 2,
    borderColor: COLORS.gold_dark,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verBtnText: {
    color: COLORS.gold,
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    letterSpacing: 2,
  },
});