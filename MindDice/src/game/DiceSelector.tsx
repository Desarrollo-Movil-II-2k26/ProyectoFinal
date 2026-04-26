import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import DiceGrid from './DiceGrid';
import HiddenDice from './HiddenDice';
import { COLORS, FONTS } from '../styles/Theme';
import { ClientMessage } from '../types/GameTypes';

interface Props {
  whiteDice:  number[];
  hiddenDice: { red: number; blue: number } | null;
  /** Dados ocultos ya consumidos en la ronda actual */
  hiddenDiceUsed?: { red: boolean; blue: boolean };
  onConfirm:  (msg: ClientMessage) => void;
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

  const totalSelected = whiteSelected.length + (useRed ? 1 : 0) + (useBlue ? 1 : 0);
  const canConfirm    = totalSelected === 3;

  // Si los dos dados ocultos ya se usaron, no mostramos la card de hidden
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
    if (hiddenDiceUsed.red) return;          // ya se usó en esta ronda
    if (useRed || totalSelected < 3) setUseRed(p => !p);
  };

  const toggleBlue = () => {
    if (hiddenDiceUsed.blue) return;         // ya se usó en esta ronda
    if (useBlue || totalSelected < 3) setUseBlue(p => !p);
  };

  const handleConfirm = () => {
    onConfirm({
      type:          'select_dice',
      white_indices: whiteSelected,
      use_red:       useRed,
      use_blue:      useBlue,
    });
    // Limpia selección después de confirmar
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

      <Button
        label="CONFIRMAR SELECCIÓN"
        onPress={handleConfirm}
        disabled={!canConfirm}
        style={styles.btn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  counter:  { color: COLORS.gold, fontSize: FONTS.sizes.lg, fontWeight: '700', letterSpacing: 2, textAlign: 'center', marginBottom: 14 },
  sublabel: { color: COLORS.gold_muted, fontSize: FONTS.sizes.xs, letterSpacing: 2, marginBottom: 10, fontWeight: '700' },
  btn:      { marginHorizontal: 32, marginTop: 4 },
});