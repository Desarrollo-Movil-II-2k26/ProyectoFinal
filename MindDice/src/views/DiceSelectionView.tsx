import React from 'react';
import { ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import MedievalBackground from '../layout/MedievalBackground';
import Header from '../layout/Header';
import DiceSelector from '../game/DiceSelector';
import { G } from '../styles/GlobalStyles';
import { MsgSelectDice } from '../types/GameTypes';

interface Props {
  whiteDice:  number[];
  hiddenDice: { red: number; blue: number } | null;
  onConfirm:  (msg: MsgSelectDice) => void;
  onSalir:    () => void;
}

export default function DiceSelectionView({ whiteDice, hiddenDice, onConfirm, onSalir }: Props) {
  return (
    <MedievalBackground variant="home">
      <SafeAreaView style={G.safe}>
        <Header title="SELECCIONA 3 DADOS" onBack={onSalir} />
        <ScrollView contentContainerStyle={styles.scroll}>
          <DiceSelector
            whiteDice={whiteDice}
            hiddenDice={hiddenDice}
            onConfirm={onConfirm}
          />
        </ScrollView>
      </SafeAreaView>
    </MedievalBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 24 },
});