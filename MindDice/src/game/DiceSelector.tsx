import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import DiceGrid from './DiceGrid';
import HiddenDice from './HiddenDice';
import { COLORS, FONTS } from '../styles/Theme';
import { SelectDiceMessage } from '../types/GameTypes';

interface Props {
  whiteDice:       number[];
  hiddenDice:      { red: number; blue: number } | null;
  hiddenDiceUsed?: { red: boolean; blue: boolean };
  onConfirm:       (msg: SelectDiceMessage) => void;
}

export default function DiceSelector({
  whiteDice,
  hiddenDice,
  hiddenDiceUsed = { red: false, blue: false },
  onConfirm,
}: Props) {
  const [whiteSelected, setWhiteSelected] = useState<number[]>([]);
  const [useRed,        setUseRed]        = useState(false);
  const [useBlue,       setUseBlue]       = useState(false);
  const [confirmed,     setConfirmed]     = useState(false);

  const totalSelected = whiteSelected.length + (useRed ? 1 : 0) + (useBlue ? 1 : 0);
  const canConfirm    = totalSelected === 3;

  const showHiddenCard =
    !!hiddenDice && !(hiddenDiceUsed.red && hiddenDiceUsed.blue);

  const toggleWhite = (i: number) => {
    if (whiteSelected.includes(i)) {
      setWhiteSelected(prev => prev.filter(x => x !== i));
    } else if (totalSelected < 3) {
      setWhiteSelected(prev => [...prev, i]);
    }
  };

  const toggleRed = () => {
    if (hiddenDiceUsed.red) return;
    if (useRed || totalSelected < 3) setUseRed(p => !p);
  };

  const toggleBlue = () => {
    if (hiddenDiceUsed.blue) return;
    if (useBlue || totalSelected < 3) setUseBlue(p => !p);
  };

  const handleConfirm = () => {
    setConfirmed(true);
  };

  const handleFinalConfirm = () => {
    onConfirm({
      type:          'select_dice',
      white_indices: whiteSelected,
      use_red:       useRed,
      use_blue:      useBlue,
    });
    setWhiteSelected([]);
    setUseRed(false);
    setUseBlue(false);
    setConfirmed(false);
  };

  const handleRehacer = () => {
    setConfirmed(false);
    setWhiteSelected([]);
    setUseRed(false);
    setUseBlue(false);
  };

  return (
    <View>
      <Card>
        <Text style={styles.counter}>{totalSelected}/3 dados seleccionados</Text>
        <Text style={styles.sublabel}>DADOS BLANCOS</Text>
        <DiceGrid
          dice={whiteDice}
          selected={whiteSelected}
          onToggle={toggleWhite}
          disabled={totalSelected >= 3 && !whiteSelected.length}
          large
        />
      </Card>

      {showHiddenCard && hiddenDice && (
        <Card>
          <HiddenDice
            red={hiddenDice.red}
            blue={hiddenDice.blue}
            useRed={useRed}
            useBlue={useBlue}
            onToggleRed={toggleRed}
            onToggleBlue={toggleBlue}
            hideRed={hiddenDiceUsed.red}
            hideBlue={hiddenDiceUsed.blue}
          />
        </Card>
      )}

      {/* Botón inicial */}
      {!confirmed && (
        <Button
          label="CONFIRMAR SELECCIÓN"
          onPress={handleConfirm}
          disabled={!canConfirm}
          style={styles.btn}
        />
      )}

      {/* Resumen de combinación */}
      {confirmed && (
        <Card style={styles.confirmCard}>
          <Text style={styles.confirmTitle}>✦  TU COMBINACIÓN  ✦</Text>
          <View style={styles.confirmDiceRow}>
            {whiteSelected.map(i => (
              <Text key={i} style={styles.confirmDie}>⚪ {whiteDice[i]}</Text>
            ))}
            {useRed  && <Text style={styles.confirmDie}>🔴 {hiddenDice?.red}</Text>}
            {useBlue && <Text style={styles.confirmDie}>🔵 {hiddenDice?.blue}</Text>}
          </View>

          <Button
            label="CONFIRMAR →"
            onPress={handleFinalConfirm}
            style={styles.btn}
          />

          <Button
            label="↩ REHACER COMBINACIÓN"
            onPress={handleRehacer}
            variant="secondary"
            style={styles.btnRehacer}
          />
        </Card>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  counter:        { color: COLORS.gold, fontSize: FONTS.sizes.lg, fontWeight: '700', letterSpacing: 2, textAlign: 'center', marginBottom: 14 },
  sublabel:       { color: COLORS.gold_muted, fontSize: FONTS.sizes.xs, letterSpacing: 2, marginBottom: 10, fontWeight: '700' },
  btn:            { marginHorizontal: 32, marginTop: 4 },
  btnRehacer:     { marginHorizontal: 32, marginTop: 4, marginBottom: 8 },
  confirmCard:    { alignItems: 'center', gap: 12, marginTop: 8 },
  confirmTitle:   { color: COLORS.gold, fontSize: FONTS.sizes.md, fontWeight: '700', letterSpacing: 3, textAlign: 'center' },
  confirmDiceRow: { flexDirection: 'row', gap: 12, justifyContent: 'center', flexWrap: 'wrap' },
  confirmDie:     { color: COLORS.text_light, fontSize: FONTS.sizes.xl, fontWeight: '700', letterSpacing: 2 },
});