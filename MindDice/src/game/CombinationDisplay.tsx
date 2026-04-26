import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS, FONTS } from '../styles/Theme';
import { ComboType } from '../types/GameTypes';

const COMBO_LABEL: Record<ComboType, string> = {
  Triple:   'TRIPLE',
  Straight: 'ESCALERA',
  Pair:     'DOBLE',
  None:     'SIN COMBO',
};

const COMBO_COLOR: Record<ComboType, string> = {
  Triple:   '#d4af37',
  Straight: COLORS.dado_azul,
  Pair:     COLORS.gold,
  None:     COLORS.text_muted,
};

const COMBO_BG: Record<ComboType, string> = {
  Triple:   'rgba(212,175,55,0.12)',
  Straight: 'rgba(68,136,255,0.12)',
  Pair:     'rgba(201,152,58,0.10)',
  None:     'rgba(255,255,255,0.04)',
};

interface Props {
  playerName:   string;
  diceUsed:     number[];
  comboType:    ComboType;
  pointsEarned: number;
}

export default function CombinationDisplay({
  playerName, diceUsed, comboType, pointsEarned,
}: Props) {
  const opacity    = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const scale      = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity,    { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, tension: 70, friction: 8, useNativeDriver: true }),
      Animated.spring(scale,      { toValue: 1, tension: 70, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  const comboColor = COMBO_COLOR[comboType];
  const comboBg    = COMBO_BG[comboType];

  return (
    <Animated.View style={[
      styles.wrap,
      { backgroundColor: comboBg, borderColor: comboColor },
      { opacity, transform: [{ translateY }, { scale }] },
    ]}>

      {/* Nombre del jugador */}
      <Text style={styles.player}>{playerName}</Text>

      {/* Línea decorativa */}
      <View style={[styles.decorLine, { backgroundColor: comboColor + '44' }]} />

      {/* Dados usados */}
      <View style={styles.diceRow}>
        {diceUsed.map((d, i) => (
          <View key={i} style={[styles.die, { borderColor: comboColor }]}>
            <Text style={styles.dieVal}>{d}</Text>
          </View>
        ))}
      </View>

      {/* Combo + puntos */}
      <View style={styles.resultRow}>
        <Text style={[styles.combo, { color: comboColor }]}>
          {COMBO_LABEL[comboType]}
        </Text>
        <View style={[styles.ptsBadge, { backgroundColor: comboColor + '22', borderColor: comboColor }]}>
          <Text style={[styles.pts, { color: comboColor }]}>
            {pointsEarned % 1 === 0 ? pointsEarned : pointsEarned.toFixed(1)} pts
          </Text>
        </View>
      </View>

    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 16,
    marginVertical:   6,
    padding:          14,
    borderRadius:     8,
    borderWidth:      1.5,
    gap:              8,
    alignItems:       'center',
  },
  player: {
    color:         COLORS.text_light,
    fontSize:      FONTS.sizes.md,
    fontWeight:    '700',
    letterSpacing: 1,
  },
  decorLine: {
    width:  '60%',
    height: 1,
  },
  diceRow: {
    flexDirection: 'row',
    gap:           10,
  },
  die: {
    width:           44,
    height:          44,
    borderRadius:    8,
    backgroundColor: COLORS.dado_blanco,
    borderWidth:     2,
    alignItems:      'center',
    justifyContent:  'center',
    shadowColor:     '#000',
    shadowOpacity:   0.3,
    shadowRadius:    4,
    shadowOffset:    { width: 0, height: 2 },
    elevation:       4,
  },
  dieVal: {
    fontSize:   FONTS.sizes.lg,
    color:      '#1a1008',
    fontWeight: '700',
  },
  resultRow: {
    flexDirection:  'row',
    alignItems:     'center',
    gap:            12,
    marginTop:      4,
  },
  combo: {
    fontSize:      FONTS.sizes.lg,
    fontWeight:    '700',
    letterSpacing: 3,
  },
  ptsBadge: {
    paddingHorizontal: 10,
    paddingVertical:   4,
    borderRadius:      20,
    borderWidth:       1,
  },
  pts: {
    fontSize:   FONTS.sizes.md,
    fontWeight: '700',
  },
});