import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
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
  roomCode:  string;
  players:   Player[];
  isLeader:  boolean;
  onIniciar: () => void;
  onSalir:   () => void;
}

export default function LobbyView({ roomCode, players, isLeader, onIniciar, onSalir }: Props) {
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
      </SafeAreaView>
    </MedievalBackground>
  );
}

const styles = StyleSheet.create({
  playersCard:  { minHeight: 160 },
  playersTitle: { color: COLORS.gold, fontSize: FONTS.sizes.sm, letterSpacing: 2, fontWeight: '700', marginBottom: 12 },
});