import React from 'react';
import { ScrollView, StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Image } from 'react-native';
import { useGame } from '../store/GameContext';
import MedievalBackground from '../layout/MedievalBackground';
import TurnIndicator from '../game/TurnIndicator';
import ScoreBoard from '../game/ScoreBoard';
import PredictionCardSelector from '../game/PredictionCardSelector';
import CombinationDisplay from '../game/CombinationDisplay';
import ProfileModal from '../components/common/ProfileModal';
import { G } from '../styles/GlobalStyles';
import { COLORS, FONTS } from '../styles/Theme';
import { PredictionCard } from '../types/GameTypes';

interface Props {
  onGoToDiceSelection: () => void;
  onSalir:             () => void;
}

export default function GameView({ onGoToDiceSelection, onSalir }: Props) {
  const { state, makePrediction, setPlayerShape, confirmShape } = useGame();
  const {
    phase, currentRound, currentPlay,
    currentTurnPlayerId, players, playerId,
    playResult, hiddenDice, playerShapes,
    shapeSelected, // ← viene del contexto, persiste aunque se re-renderice
  } = state;

  const myPlayer = players.find(p => p.id === playerId) ?? players[0];
  const isMyTurn = currentTurnPlayerId === playerId;

  const handlePrediction = (card: PredictionCard) => {
    makePrediction(card);
  };

  // Calcula dados usados por jugador del playResult
  const usedDiceIndices: Record<string, number[]> = {};
  if (playResult) {
    playResult.forEach(r => {
      usedDiceIndices[r.player_id] = r.dice_used;
    });
  }

  return (
    <MedievalBackground variant="game">
      <SafeAreaView style={G.safe}>

        {/* Botón salir */}
        <TouchableOpacity style={styles.cornerTR} onPress={onSalir}>
          <Image source={require('../assets/images/bg_exit.png')} style={{ width: 80, height: 80 }} />
        </TouchableOpacity>

        {/* Info ronda */}
        <Text style={styles.roundInfo}>
          RONDA {currentRound}/4 · JUGADA {currentPlay}/3
        </Text>

        <ScrollView contentContainerStyle={styles.scroll}>

          {/* Mesa con jugadores */}
          <ScoreBoard
            players={players}
            playerShapes={playerShapes}
            myPlayerId={playerId ?? ''}
            hiddenDice={hiddenDice}
            currentTurnPlayerId={currentTurnPlayerId}
            usedDiceIndices={usedDiceIndices}
          />

          {/* Predicciones */}
          {phase === 'MakingPredictions' && (
            <PredictionCardSelector
              onSelect={handlePrediction}
              disabled={myPlayer?.prediction_made ?? false}
            />
          )}

          {/* Turno propio */}
          {phase === 'SelectingDice' && isMyTurn && (
            <View style={styles.turnCard}>
              <Text style={styles.turnText}>ES TU TURNO</Text>
              <Text style={styles.turnSub}>
                Te quedan {myPlayer?.white_dice.length ?? 0} dados blancos
              </Text>
              {hiddenDice && (
                <Text style={styles.hiddenInfo}>
                  Dados ocultos: 🔴 {hiddenDice.red} 🔵 {hiddenDice.blue}
                </Text>
              )}
              <Text style={styles.turnAction} onPress={onGoToDiceSelection}>
                SELECCIONAR DADOS →
              </Text>
            </View>
          )}

          {/* Esperando */}
          {phase === 'SelectingDice' && !isMyTurn && (
            <View style={styles.waitCard}>
              <Text style={styles.waitText}>ESPERANDO JUGADA...</Text>
            </View>
          )}

          {/* Resultados jugada */}
          {phase === 'ShowingPlayResults' && playResult && (
            <View style={styles.resultsCard}>
              <Text style={styles.resultsTitle}>
                RESULTADO JUGADA {currentPlay - 1}
              </Text>
              {playResult.map((r) => (
                <CombinationDisplay
                  key={r.player_id}
                  playerName={r.player_name}
                  diceUsed={r.dice_used}
                  comboType={r.combo_type}
                  pointsEarned={r.points_earned}
                />
              ))}
            </View>
          )}

        </ScrollView>

        {/* Animación de turno */}
        <TurnIndicator
          currentTurnPlayerId={currentTurnPlayerId}
          myPlayerId={playerId ?? ''}
          players={players}
        />

      </SafeAreaView>

      {/* Modal figura — solo aparece UNA VEZ, cuando shapeSelected es false */}
      <ProfileModal
        visible={!shapeSelected}
        playerName={myPlayer?.name ?? ''}
        onConfirm={(shape) => {
          setPlayerShape(playerId ?? '', shape);
          confirmShape(); // ← marca en el contexto que ya eligió, nunca más aparece
        }}
      />

    </MedievalBackground>
  );
}

const styles = StyleSheet.create({
  cornerTR: {
    position: 'absolute',
    top:      8,
    right:    8,
    zIndex:   100,
  },
  roundInfo: {
    color:         COLORS.gold,
    fontSize:      FONTS.sizes.sm,
    fontWeight:    '700',
    letterSpacing: 2,
    textAlign:     'center',
    paddingTop:    12,
    paddingBottom: 4,
  },
  scroll: { paddingBottom: 24, gap: 12 },
  turnCard: {
    margin:          16,
    padding:         20,
    backgroundColor: 'rgba(196,168,74,0.12)',
    borderWidth:     2,
    borderColor:     COLORS.gold,
    borderRadius:    6,
    alignItems:      'center',
    gap:             8,
  },
  turnText:   { color: COLORS.gold, fontSize: FONTS.sizes.xl, fontWeight: '700' },
  turnSub:    { color: COLORS.text_muted },
  hiddenInfo: { color: COLORS.text_light },
  turnAction: { marginTop: 12, color: COLORS.gold, fontWeight: '700' },
  waitCard:   { margin: 16, padding: 20, alignItems: 'center' },
  waitText:   { color: COLORS.text_muted },
  resultsCard: {
    margin:      16,
    borderWidth: 1,
    borderColor: COLORS.gold,
    padding:     12,
  },
  resultsTitle: { color: COLORS.gold, textAlign: 'center' },
});