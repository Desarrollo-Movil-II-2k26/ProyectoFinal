import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, FONTS } from '../styles/Theme';

type DiceColor = 'white' | 'red' | 'blue';

interface Props {
  value:      number;
  color?:     DiceColor;
  selected?:  boolean;
  onPress?:   () => void;
  disabled?:  boolean;
  style?:     ViewStyle;
}

const BG: Record<DiceColor, string> = {
  white: COLORS.dado_blanco,
  red:   COLORS.dado_rojo,
  blue:  COLORS.dado_azul,
};

const BORDER: Record<DiceColor, string> = {
  white: COLORS.dado_border,
  red:   '#aa2222',
  blue:  '#2255cc',
};

export default function DiceComponent({
  value, color = 'white', selected = false,
  onPress, disabled = false, style,
}: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.die,
        { backgroundColor: BG[color], borderColor: selected ? COLORS.gold : BORDER[color] },
        selected && styles.selected,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || !onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.val, color !== 'white' && styles.valLight]}>{value}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  die: {
    width: 54, height: 54,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    borderWidth: 3,
    borderColor: COLORS.gold,
    transform: [{ scale: 1.08 }],
  },
  disabled: { opacity: 0.5 },
  val:      { fontSize: FONTS.sizes.xl, color: '#1a1008', fontWeight: '700' },
  valLight: { color: '#ffffff' },
});