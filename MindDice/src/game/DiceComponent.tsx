import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, Animated } from 'react-native';
import { COLORS, FONTS } from '../styles/Theme';

type DiceColor = 'white' | 'red' | 'blue';

interface Props {
  value:     number;
  color?:    DiceColor;
  selected?: boolean;
  onPress?:  () => void;
  disabled?: boolean;
  style?:    ViewStyle;
  large?:    boolean;
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
  onPress, disabled = false, style, large = false,
}: Props) {
  const translateY = useRef(new Animated.Value(0)).current;
  const scale      = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (selected) {
      Animated.parallel([
        Animated.spring(translateY, { toValue: -12, useNativeDriver: true, tension: 80, friction: 6 }),
        Animated.spring(scale,      { toValue: 1.18, useNativeDriver: true, tension: 80, friction: 6 }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, tension: 80, friction: 6 }),
        Animated.spring(scale,      { toValue: 1, useNativeDriver: true, tension: 80, friction: 6 }),
      ]).start();
    }
  }, [selected]);

  const size = large ? 64 : 54;

  return (
    <Animated.View style={{ transform: [{ translateY }, { scale }] }}>
      <TouchableOpacity
        style={[
          styles.die,
          {
            width:           size,
            height:          size,
            backgroundColor: BG[color],
            borderColor:     selected ? COLORS.gold : BORDER[color],
          },
          selected  && styles.selected,
          disabled  && styles.disabled,
          style,
        ]}
        onPress={onPress}
        disabled={disabled || !onPress}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.val,
          color !== 'white' && styles.valLight,
          large && styles.valLarge,
        ]}>
          {value}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  die: {
    borderRadius:   8,
    borderWidth:    2,
    alignItems:     'center',
    justifyContent: 'center',
  },
  selected: {
    borderWidth:   3,
    borderColor:   COLORS.gold,
    shadowColor:   COLORS.gold,
    shadowOpacity: 0.8,
    shadowRadius:  10,
    shadowOffset:  { width: 0, height: 0 },
    elevation:     12,
  },
  disabled: { opacity: 0.5 },
  val:      { fontSize: FONTS.sizes.xl,  color: '#1a1008', fontWeight: '700' },
  valLight: { color: '#ffffff' },
  valLarge: { fontSize: FONTS.sizes.xxl },
});