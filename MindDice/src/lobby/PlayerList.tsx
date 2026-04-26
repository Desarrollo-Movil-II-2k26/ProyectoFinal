import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import { Images } from '../assets/images';
import { COLORS, FONTS } from '../styles/Theme';
import { Player } from '../types/GameTypes';

const SCREEN_W  = Dimensions.get('window').width * 0.92; // ← más pequeña, no pegada a los bordes
const IMG_H     = SCREEN_W * (1024 / 1792);

const SLOT_X_PERCENT = [0.11, 0.36, 0.61, 0.86];
const SLOT_Y_PERCENT = 0.48;
const SLOT_R_PERCENT = 0.13;

const MAX_PLAYERS = 4;

export default function PlayerList({ players }: { players: Player[] }) {
  const slots: (Player | null)[] = [
    ...players.slice(0, MAX_PLAYERS),
    ...Array(Math.max(0, MAX_PLAYERS - players.length)).fill(null),
  ];

  const slotSize = SCREEN_W * SLOT_R_PERCENT * 2;
  const slotY    = IMG_H * SLOT_Y_PERCENT;

  return (
    <View style={[styles.container, { height: IMG_H }]}>
      <ImageBackground
        source={Images.bg_players}
        style={StyleSheet.absoluteFill}
        resizeMode="stretch"
      />

      {/* Badge reclusos — esquina superior izquierda dentro del marco */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>RECLUSOS</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{players.length}/4</Text>
        </View>
      </View>

      {/* Slots posicionados absolutamente sobre cada círculo */}
      {slots.map((p, i) => {
        const cx = SCREEN_W * SLOT_X_PERCENT[i] - slotSize / 2;
        const cy = slotY - slotSize / 2;

        return (
          <View
            key={i}
            style={[styles.slotWrap, { left: cx, top: cy, width: slotSize, height: slotSize }]}
          >
           
            {/* Punto conexión */}
            {p && (
              <View style={[
                styles.connDot,
                { backgroundColor: p.connected ? COLORS.success : COLORS.danger }
              ]} />
            )}

            {/* Nombre debajo del círculo */}
            {p && (
              <Text style={styles.slotName} numberOfLines={1}>
                {p.name.toUpperCase()}
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width:          SCREEN_W,        
    alignSelf:      'center',        
    position:       'relative',
    marginBottom:   16, 
  },
  headerRow: {
    position:  'absolute',
    top:       IMG_H * 0.12,
    left:      SCREEN_W * 0.06,
    flexDirection: 'row',
    alignItems:    'center',
    gap:           7,
  },
  title: {
    color:         COLORS.gold,
    fontSize:      FONTS.sizes.sm,
    fontWeight:    '700',
    letterSpacing: 3,
    textShadowColor:  '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  countBadge: {
    backgroundColor:   'rgba(201,152,58,0.3)',
    borderWidth:       1,
    borderColor:       COLORS.gold_dark,
    borderRadius:      10,
    paddingHorizontal: 6,
    paddingVertical:   1,
  },
  countText: {
    color:      COLORS.gold,
    fontSize:   FONTS.sizes.xs,
    fontWeight: '700',
  },
  slotWrap: {
    position:   'absolute',
    alignItems: 'center',
  },
  crown: {
    position:  'absolute',
    top:       -18,
    fontSize:  18,
    zIndex:    10,
  },
  connDot: {
    position:     'absolute',
    top:          2,
    right:        2,
    width:        10,
    height:       10,
    borderRadius: 5,
    borderWidth:  1.5,
    borderColor:  '#000',
    zIndex:       5,
  },
  slotName: {
    position:         'absolute',
    bottom:           -30,
    color:            COLORS.gold,
    fontSize:         FONTS.sizes.xs,
    fontWeight:       '700',
    letterSpacing:    1,
    textAlign:        'center',
    width:            80,
    left:             24,
    textShadowColor:  '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});