import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DiceComponent from './DiceComponent';
import { COLORS, FONTS } from '../styles/Theme';

interface Props {
  red:           number;
  blue:          number;
  useRed:        boolean;
  useBlue:       boolean;
  onToggleRed:   () => void;
  onToggleBlue:  () => void;
  /** Bloqueo global (por ejemplo, ya seleccionaste 3 dados) */
  disabled?:     boolean;
  /** Si true, el dado rojo ya se usó esta ronda y NO se renderiza */
  hideRed?:      boolean;
  /** Si true, el dado azul ya se usó esta ronda y NO se renderiza */
  hideBlue?:     boolean;
}

export default function HiddenDice({
  red, blue, useRed, useBlue,
  onToggleRed, onToggleBlue,
  disabled,
  hideRed,
  hideBlue,
}: Props) {

  // Si los dos ya se usaron, no se muestra nada (incluyendo el título y el hint)
  if (hideRed && hideBlue) return null;

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>DADOS OCULTOS</Text>
      <View style={styles.row}>

        {/* Dado rojo: solo se renderiza si NO se ha usado */}
        {!hideRed && (
          <View style={styles.dieWrap}>
            <DiceComponent
              value={red}
              color="red"
              selected={useRed}
              onPress={onToggleRed}
              disabled={disabled}
            />
            <Text style={styles.dieLabel}>ROJO</Text>
          </View>
        )}

        {/* Dado azul: solo se renderiza si NO se ha usado */}
        {!hideBlue && (
          <View style={styles.dieWrap}>
            <DiceComponent
              value={blue}
              color="blue"
              selected={useBlue}
              onPress={onToggleBlue}
              disabled={disabled}
            />
            <Text style={styles.dieLabel}>AZUL</Text>
          </View>
        )}

      </View>
      <Text style={styles.hint}>Puedes usar hasta 2 dados ocultos por ronda</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap:     { alignItems: 'center' },
  label:    { color: COLORS.gold_muted, fontSize: FONTS.sizes.xs, letterSpacing: 2, marginBottom: 10, fontWeight: '700' },
  row:      { flexDirection: 'row', gap: 24, marginBottom: 8 },
  dieWrap:  { alignItems: 'center', gap: 6 },
  dieLabel: { color: COLORS.text_muted, fontSize: FONTS.sizes.xs, letterSpacing: 1 },
  hint:     { color: COLORS.text_muted, fontSize: FONTS.sizes.xs, textAlign: 'center' },
});