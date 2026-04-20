import React, { useState } from 'react';
import { ScrollView, StyleSheet, SafeAreaView, View, Text } from 'react-native';
import { useGame } from '../store/GameContext';
import MedievalBackground from '../layout/MedievalBackground';
import Header from '../layout/Header';
import TurnIndicator from '../game/TurnIndicator';
import ScoreBoard from '../game/ScoreBoard';
import PredictionCardSelector from '../game/PredictionCardSelector';
import CombinationDisplay from '../game/CombinationDisplay';
import ProfileModal, { Shape } from '../components/common/ProfileModal';
import { G } from '../styles/GlobalStyles';
import { COLORS, FONTS } from '../styles/Theme';
import { PredictionCard } from '../types/GameTypes';

interface Props {
  onGoToDiceSelection: () => void;
  onSalir:             () => void;
}

export default function GameView({ onGoToDiceSelection, onSalir }: Props) {
  const { state, makePrediction } = useGame();
  const {
    phase, currentRound, currentPlay,
    currentTurnPlayerId, players, playerId,
    playResult, hiddenDice,
  } = state;

  const myPlayer  = players.find(p => p.id === playerId);
  const isMyTurn  = currentTurnPlayerId === playerId;

  // Modal de figura — visible al entrar por primera vez
  const [shapeModalVisible, setShapeModalVisible] = useState(true);
  const [playerShape,       setPlayerShape]       = useState<Shape | null>(null);

  // Si el modal aún no fue confirmado, no mostramos nada detrás
  const showContent = !shapeModalVisible;

  const handlePrediction = (card: PredictionCard) => {
    makePrediction(card);
  };

  return (
    <MedievalBackground variant="home">
      <SafeAreaView style={G.safe}>
        <Header
          title={`RONDA ${currentRound}/4 · JUGADA ${currentPlay}/3`}
          onExit={onSalir}
        />

        {showContent && (
          <ScrollView contentContainerStyle={styles.scroll}>

            {/* Indicador de turno */}
            <TurnIndicator
              currentTurnPlayerId={currentTurnPlayerId}
              myPlayerId={playerId ?? ''}
              players={players}
            />

            {/* Fase: eligiendo predicciones */}
            {phase === 'making_predictions' && (
              <PredictionCardSelector
                onSelect={handlePrediction}
                disabled={myPlayer?.prediction_made ?? false}
              />
            )}

            {/* Fase: seleccionando dados — solo muestra botón si es mi turno */}
            {phase === 'selecting_dice' && isMyTurn && (
              <View style={styles.turnCard}>
                <Text style={styles.turnText}>ES TU TURNO</Text>
                <Text style={styles.turnSub}>
                  Te quedan {myPlayer?.white_dice.length ?? 0} dados blancos
                </Text>
                {hiddenDice && (
                  <Text style={styles.hiddenInfo}>
                    Dados ocultos: 🔴 {hiddenDice.red}  🔵 {hiddenDice.blue}
                  </Text>
                )}
                <Text style={styles.turnAction} onPress={onGoToDiceSelection}>
                  SELECCIONAR DADOS →
                </Text>
              </View>
            )}

            {/* Fase: seleccionando dados — esperando a otro jugador */}
            {phase === 'selecting_dice' && !isMyTurn && (
              <View style={styles.waitCard}>
                <Text style={styles.waitText}>ESPERANDO JUGADA...</Text>
              </View>
            )}

            {/* Resultado de jugada */}
            {phase === 'showing_play_results' && playResult && (
              <View style={styles.resultsCard}>
                <Text style={styles.resultsTitle}>RESULTADO JUGADA {currentPlay - 1}</Text>
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

            {/* Puntajes */}
            <ScoreBoard players={players} />

          </ScrollView>
        )}
      </SafeAreaView>

      {/* Modal de figura — obligatorio al entrar */}
      <ProfileModal
        visible={shapeModalVisible}
        playerName={myPlayer?.name ?? ''}
        onConfirm={(shape) => {
          setPlayerShape(shape);
          setShapeModalVisible(false);
        }}
      />

    </MedievalBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 24, gap: 12 },

  turnCard: {
    margin: 16,
    padding: 20,
    backgroundColor: 'rgba(196,168,74,0.12)',
    borderWidth: 2,
    borderColor: COLORS.gold,
    borderRadius: 6,
    alignItems: 'center',
    gap: 8,
  },
  turnText:   { color: COLORS.gold, fontSize: FONTS.sizes.xl, fontWeight: '700', letterSpacing: 3 },
  turnSub:    { color: COLORS.text_muted, fontSize: FONTS.sizes.sm },
  hiddenInfo: { color: COLORS.text_light, fontSize: FONTS.sizes.md, marginTop: 4 },
  turnAction: {
    marginTop: 12,
    color: COLORS.gold,
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    letterSpacing: 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gold,
    paddingBottom: 2,
  },

  waitCard: {
    margin: 16,
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 6,
    alignItems: 'center',
  },
  waitText: { color: COLORS.text_muted, fontSize: FONTS.sizes.md, letterSpacing: 2 },

  resultsCard: {
    margin: 16,
    backgroundColor: 'rgba(10,6,2,0.8)',
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderRadius: 6,
    paddingVertical: 12,
  },
  resultsTitle: {
    color: COLORS.gold,
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 8,
  },
});