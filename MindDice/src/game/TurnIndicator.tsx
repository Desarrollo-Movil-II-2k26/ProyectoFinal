import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, View } from 'react-native';
import { COLORS, FONTS } from '../styles/Theme';

interface Props {
  currentTurnPlayerId: string;
  myPlayerId:          string;
  players:             { id: string; name: string }[];
}

export default function TurnIndicator({ currentTurnPlayerId, myPlayerId, players }: Props) {
  const isMyTurn = currentTurnPlayerId === myPlayerId;
  const player   = players.find(p => p.id === currentTurnPlayerId);

  const opacity    = useRef(new Animated.Value(0)).current;
  const scale      = useRef(new Animated.Value(0.6)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    opacity.setValue(0);
    scale.setValue(0.6);
    translateY.setValue(30);

    Animated.parallel([
      Animated.spring(scale,      { toValue: 1,  useNativeDriver: true, tension: 60, friction: 7 }),
      Animated.spring(translateY, { toValue: 0,  useNativeDriver: true, tension: 60, friction: 7 }),
      Animated.timing(opacity,    { toValue: 1,  useNativeDriver: true, duration: 300 }),
    ]).start(() => {
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity,    { toValue: 0,   useNativeDriver: true, duration: 500 }),
          Animated.timing(translateY, { toValue: -20, useNativeDriver: true, duration: 500 }),
          Animated.timing(scale,      { toValue: 0.8, useNativeDriver: true, duration: 500 }),
        ]).start();
      }, 2200);
    });
  }, [currentTurnPlayerId]);

  return (
    <View style={styles.overlay} pointerEvents="none">
      <Animated.View style={[
        styles.banner,
        { opacity, transform: [{ scale }, { translateY }] },
        isMyTurn && styles.bannerMe,
      ]}>

        {/* Esquinas decorativas */}
        <View style={[styles.corner, styles.cornerTL]} />
        <View style={[styles.corner, styles.cornerTR]} />
        <View style={[styles.corner, styles.cornerBL]} />
        <View style={[styles.corner, styles.cornerBR]} />

        {/* Línea superior */}
        <View style={styles.decorRow}>
          <View style={styles.decorDot} />
          <View style={styles.decorLine} />
          <View style={styles.decorDot} />
        </View>

        {/* Contenido */}
        <View style={styles.content}>
          <Text style={styles.label}>✦  TURNO DE  ✦</Text>
          <Text style={[styles.name, isMyTurn && styles.nameMe]}>
            {isMyTurn ? '¡TÚ!' : player?.name ?? '...'}
          </Text>
          {isMyTurn && (
            <Text style={styles.sub}>— Prepárate para jugar —</Text>
          )}
        </View>

        {/* Línea inferior */}
        <View style={styles.decorRow}>
          <View style={styles.decorDot} />
          <View style={styles.decorLine} />
          <View style={styles.decorDot} />
        </View>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position:       'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems:     'center',
    justifyContent: 'center',
    zIndex:         99,
  },

  banner: {
    marginHorizontal:  32,
    minWidth:          280,
    paddingVertical:   28,
    paddingHorizontal: 32,
    alignItems:        'center',
    gap:               12,
    // Fondo transparente — se ve la mesa morada detrás
    backgroundColor:   'rgba(0, 0, 0, 0)',
    // Sin card, sin borde café — solo el contenido flota
  },

  bannerMe: {
    // sin cambios de fondo — solo el texto cambia de color
  },

  // Esquinas doradas estilo pergamino
  corner: {
    position: 'absolute',
    width:    18,
    height:   18,
    borderColor: '#c9983a',
    borderWidth: 2,
  },
  cornerTL: { top: 0, left: 0,  borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 3 },
  cornerTR: { top: 0, right: 0, borderLeftWidth: 0,  borderBottomWidth: 0, borderTopRightRadius: 3 },
  cornerBL: { bottom: 0, left: 0,  borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 3 },
  cornerBR: { bottom: 0, right: 0, borderLeftWidth: 0,  borderTopWidth: 0, borderBottomRightRadius: 3 },

  // Líneas decorativas con puntos
  decorRow: {
    flexDirection:  'row',
    alignItems:     'center',
    gap:            6,
    width:          '100%',
    paddingHorizontal: 8,
  },
  decorLine: {
    flex:            1,
    height:          1,
    backgroundColor: 'rgba(201,152,58,0.5)',
  },
  decorDot: {
    width:           5,
    height:          5,
    borderRadius:    2.5,
    backgroundColor: '#c9983a',
  },

  content: {
    alignItems: 'center',
    gap:        8,
  },
  label: {
    color:         '#c9983a',
    fontSize:      FONTS.sizes.sm,
    letterSpacing: 6,
    textShadowColor:  'rgba(201,152,58,0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  name: {
    color:            '#ffffff',
    fontSize:         FONTS.sizes.xxl + 6,
    fontWeight:       '700',
    letterSpacing:    6,
    textShadowColor:  'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 16,
  },
  nameMe: {
    color:            '#f5d060',
    textShadowColor:  'rgba(245,208,96,0.7)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 24,
  },
  sub: {
    color:            'rgba(220,180,80,0.9)',
    fontSize:         FONTS.sizes.sm,
    letterSpacing:    4,
    fontStyle:        'italic',
    textShadowColor:  'rgba(201,152,58,0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
});