import React from 'react';
import { ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import MedievalBackground from '../layout/MedievalBackground';
import Header from '../layout/Header';
import TurnIndicator from '../game/TurnIndicator';
import ScoreBoard from '../game/ScoreBoard';
import PredictionCardSelector from '../game/PredictionCardSelector';
import CombinationDisplay from '../game/CombinationDisplay';
import { G } from '../styles/GlobalStyles';
import {
  Phase, Player, MsgPlayResult,
  PredictionCard, RoundScoreEntry,
} from '../types/GameTypes';

interface Props {
  phase:               Phase;
  currentRound:        number;
  currentPlay:         number;
  players:             Player[];
  currentTurnPlayerId: string;
  myPlayerId:          string;
  playResult:          MsgPlayResult | null;
  onMakePrediction:    (card: PredictionCard) => void;
  onGoToDiceSelection: () => void;
  onSalir:             () => void;
}

export default function GameView({
  phase, currentRound, currentPlay,
  players, currentTurnPlayerId, myPlayerId,
  playResult, onMakePrediction, onGoToDiceSelection, onSalir,
}: Props) {
  const isMyTurn = currentTurnPlayerId === myPlayerId;

  return (
    <MedievalBackground variant="home">
      <SafeAreaView style={G.safe}>
        <Header
          title={`RONDA ${currentRound}/4 · JUGADA ${currentPlay}/3`}
          onExit={onSalir}
        />
        <ScrollView contentContainerStyle={styles.scroll}>

          <TurnIndicator
            currentTurnPlayerId={currentTurnPlayerId}
            myPlayerId={myPlayerId}
            players={players}
          />

          {/* Phase: making_predictions */}
          {phase === 'making_predictions' && (
            <PredictionCardSelector onSelect={onMakePrediction} />
          )}

          {/* Phase: selecting_dice — navega a DiceSelectionView */}
          {phase === 'selecting_dice' && isMyTurn && (
            <TurnIndicator
              currentTurnPlayerId={currentTurnPlayerId}
              myPlayerId={myPlayerId}
              players={players}
            />
          )}

          {/* Phase: showing_play_results */}
          {phase === 'showing_play_results' && playResult && (
            playResult.results.map(r => (
              <CombinationDisplay
                key={r.player_id}
                playerName={r.player_name}
                diceUsed={r.dice_used}
                comboType={r.combo_type}
                pointsEarned={r.points_earned}
              />
            ))
          )}

          <ScoreBoard players={players} />

        </ScrollView>
      </SafeAreaView>
    </MedievalBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 24 },
});