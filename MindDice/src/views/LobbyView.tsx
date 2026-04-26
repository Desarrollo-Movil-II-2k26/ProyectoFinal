import React from 'react';
import { Text, StyleSheet, SafeAreaView, TouchableOpacity, View, ImageBackground } from 'react-native';
import MedievalBackground from '../layout/MedievalBackground';
import Header from '../layout/Header';
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
        <View style={{ paddingTop: 32, right: 32, gap: -0 }}>
          <Header title="⛓ SALA DE ESPERA ⛓" onBack={onSalir} />
        </View>
        <RoomCode code={roomCode} />
        <PlayerList players={players} />
        <StartGameButton isLeader={isLeader} playerCount={players.length} onIniciar={onIniciar} />
        {/*<TouchableOpacity style={styles.verBtn} onPress={onVerJuego} activeOpacity={0.8}>
          <Text style={styles.verBtnText}>VER JUEGO →</Text>
        </TouchableOpacity>*/}
      </SafeAreaView>
    </MedievalBackground>
  );
}

const styles = StyleSheet.create({
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