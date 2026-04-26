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
  /** Bloqueo del dado rojo (ya consumido en la ronda) */
  disabledRed?:  boolean;
  /** Bloqueo del dado azul (ya consumido en la ronda) */
  disabledBlue?: boolean;
}

export default function HiddenDice({
  red, blue, useRed, useBlue,
  onToggleRed, onToggleBlue,
  disabled,
  disabledRed,
  disabledBlue,
}: Props) {
  const redOff  = disabled || disabledRed;
  const blueOff = disabled || disabledBlue;

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>DADOS OCULTOS</Text>
      <View style={styles.row}>

        {/* Dado rojo */}
        <View style={[styles.dieWrap, disabledRed && styles.usedWrap]}>
          <DiceComponent
            value={red}
            color="red"
            selected={useRed}
            onPress={onToggleRed}
            disabled={redOff}
          />
          <Text style={[styles.dieLabel, disabledRed && styles.usedLabel]}>
            {disabledRed ? 'YA USADO' : 'ROJO'}
          </Text>
        </View>

        {/* Dado azul */}
        <View style={[styles.dieWrap, disabledBlue && styles.usedWrap]}>
          <DiceComponent
            value={blue}
            color="blue"
            selected={useBlue}
            onPress={onToggleBlue}
            disabled={blueOff}
          />
          <Text style={[styles.dieLabel, disabledBlue && styles.usedLabel]}>
            {disabledBlue ? 'YA USADO' : 'AZUL'}
          </Text>
        </View>

      </View>
      <Text style={styles.hint}>Puedes usar hasta 2 dados ocultos por ronda</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap:      { alignItems: 'center' },
  label:     { color: COLORS.gold_muted, fontSize: FONTS.sizes.xs, letterSpacing: 2, marginBottom: 10, fontWeight: '700' },
  row:       { flexDirection: 'row', gap: 24, marginBottom: 8 },
  dieWrap:   { alignItems: 'center', gap: 6 },
  usedWrap:  { opacity: 0.35 },
  dieLabel:  { color: COLORS.text_muted, fontSize: FONTS.sizes.xs, letterSpacing: 1 },
  usedLabel: { color: '#8a2020', fontWeight: '700' },
  hint:      { color: COLORS.text_muted, fontSize: FONTS.sizes.xs, textAlign: 'center' },
});