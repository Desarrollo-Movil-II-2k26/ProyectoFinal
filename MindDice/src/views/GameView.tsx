import React from 'react';
import { ScrollView, StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Image, Modal } from 'react-native';
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
  const { state, makePrediction, setPlayerShape, confirmShape, clearRoundResult } = useGame();
  const {
    phase, currentRound, currentPlay,
    currentTurnPlayerId, players, playerId,
    playResult, roundResult, gameOver,
    hiddenDice, playerShapes,
    shapeSelected,
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
          RONDA {currentRound}/2 · JUGADA {currentPlay}/3
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

          {/* Resultados de UNA jugada (3 veces por ronda) */}
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

          {/* Pantalla final del juego */}
          {phase === 'GameOver' && gameOver && (
            <View style={styles.gameOverCard}>
              <Text style={styles.gameOverTitle}>FIN DEL JUEGO</Text>
              <Text style={styles.winnerText}>
                🏆 GANADOR: {gameOver.winnerName}
              </Text>
              <View style={styles.podium}>
                {gameOver.finalScores.map((s) => (
                  <View key={s.player_id} style={styles.podiumRow}>
                    <Text style={styles.position}>{s.position}°</Text>
                    <Text style={styles.podiumName}>{s.player_name}</Text>
                    <Text style={styles.podiumScore}>{s.total_score} pts</Text>
                  </View>
                ))}
              </View>
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

      {/* Modal figura — solo aparece UNA VEZ */}
      <ProfileModal
        visible={!shapeSelected}
        playerName={myPlayer?.name ?? ''}
        onConfirm={(shape) => {
          setPlayerShape(playerId ?? '', shape);
          confirmShape();
        }}
      />

      {/* Modal RESUMEN DE RONDA — aparece cuando llega round_result, se cierra al continuar */}
      <Modal
        visible={!!roundResult}
        transparent
        animationType="fade"
        onRequestClose={clearRoundResult}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.roundCard}>
            <Text style={styles.roundTitle}>
              RESUMEN RONDA {currentRound}
            </Text>

            {roundResult?.map((r) => (
              <View key={r.player_id} style={styles.roundRow}>
                <View style={styles.roundRowHeader}>
                  <Text style={styles.playerName}>{r.player_name}</Text>
                  <Text
                    style={[
                      styles.predictionBadge,
                      r.bonus_applied ? styles.badgeOk : styles.badgeFail,
                    ]}
                  >
                    {r.bonus_applied ? '✓ ACERTÓ' : '✗ FALLÓ'}
                  </Text>
                </View>

                <Text style={styles.predictionLine}>
                  Predicción: <Text style={styles.predictionValue}>{r.prediction_card}</Text>
                </Text>

                <View style={styles.scoreLines}>
                  <Text style={styles.scoreLine}>
                    Puntos de ronda: {r.round_score}
                  </Text>
                  {r.bonus_applied && (
                    <Text style={styles.bonusLine}>+ Bonus por acertar</Text>
                  )}
                  <Text style={styles.finalLine}>
                    Total ronda: {r.final_round_score}
                  </Text>
                  <Text style={styles.totalLine}>
                    Puntaje final de la ronda: {r.total_score}
                  </Text>
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.continueBtn} onPress={clearRoundResult}>
              <Text style={styles.continueBtnText}>CONTINUAR →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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

  // ── Modal resumen de ronda ───────────────────────────────
  modalBackdrop: {
    flex:            1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent:  'center',
    padding:         20,
  },
  roundCard: {
    padding:         16,
    backgroundColor: 'rgba(20,12,4,0.98)',
    borderWidth:     2,
    borderColor:     COLORS.gold,
    borderRadius:    6,
    gap:             14,
  },
  roundTitle: {
    color:         COLORS.gold,
    fontSize:      FONTS.sizes.lg,
    fontWeight:    '700',
    letterSpacing: 2,
    textAlign:     'center',
    marginBottom:  4,
  },
  roundRow: {
    borderWidth:     1,
    borderColor:     'rgba(196,168,74,0.4)',
    borderRadius:    4,
    padding:         12,
    backgroundColor: 'rgba(196,168,74,0.08)',
    gap:             6,
  },
  roundRowHeader: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
  },
  playerName: {
    color:      COLORS.gold,
    fontSize:   FONTS.sizes.md,
    fontWeight: '700',
  },
  predictionBadge: {
    paddingHorizontal: 8,
    paddingVertical:   2,
    borderRadius:      3,
    fontSize:          FONTS.sizes.xs,
    fontWeight:        '700',
    letterSpacing:     1,
    overflow:          'hidden',
  },
  badgeOk:   { backgroundColor: '#2a7a3a', color: '#fff' },
  badgeFail: { backgroundColor: '#8a2020', color: '#fff' },
  predictionLine: {
    color:    COLORS.text_muted,
    fontSize: FONTS.sizes.sm,
  },
  predictionValue: {
    color:      COLORS.text_light,
    fontWeight: '700',
  },
  scoreLines: { gap: 2, marginTop: 4 },
  scoreLine:  { color: COLORS.text_muted, fontSize: FONTS.sizes.sm },
  bonusLine:  { color: '#7acc8a', fontSize: FONTS.sizes.sm, fontStyle: 'italic' },
  finalLine:  { color: COLORS.text_light, fontSize: FONTS.sizes.sm, fontWeight: '700' },
  totalLine:  { color: COLORS.gold, fontSize: FONTS.sizes.sm, fontWeight: '700' },
  continueBtn: {
    marginTop:       8,
    paddingVertical: 12,
    borderWidth:     2,
    borderColor:     COLORS.gold,
    borderRadius:    4,
    alignItems:      'center',
    backgroundColor: 'rgba(196,168,74,0.15)',
  },
  continueBtnText: {
    color:         COLORS.gold,
    fontWeight:    '700',
    letterSpacing: 2,
  },

  // ── Game over ────────────────────────────────────────────
  gameOverCard: {
    margin:          16,
    padding:         20,
    backgroundColor: 'rgba(10,6,2,0.8)',
    borderWidth:     2,
    borderColor:     COLORS.gold,
    borderRadius:    6,
    alignItems:      'center',
    gap:             14,
  },
  gameOverTitle: {
    color:         COLORS.gold,
    fontSize:      FONTS.sizes.xl,
    fontWeight:    '700',
    letterSpacing: 3,
  },
  winnerText: {
    color:      COLORS.text_light,
    fontSize:   FONTS.sizes.lg,
    fontWeight: '700',
  },
  podium: { width: '100%', gap: 6, marginTop: 8 },
  podiumRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    paddingVertical:   8,
    paddingHorizontal: 12,
    borderWidth:       1,
    borderColor:       'rgba(196,168,74,0.4)',
    borderRadius:      4,
  },
  position:    { color: COLORS.gold, fontSize: FONTS.sizes.md, fontWeight: '700', width: 32 },
  podiumName:  { color: COLORS.text_light, flex: 1 },
  podiumScore: { color: COLORS.gold, fontWeight: '700' },
});