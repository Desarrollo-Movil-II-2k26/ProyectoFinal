import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../styles/Theme';

interface Props {
  title:       string;
  subtitle?:   string;
  onBack?:     () => void;
  onExit?:     () => void;
}

export default function Header({ title, subtitle, onBack, onExit }: Props) {
  return (
    <View style={styles.container}>
      {/* Izquierda*/}
      {onBack ? (
        <TouchableOpacity onPress={onBack} style={styles.side}>
          <Text style={styles.backText}> ← VOLVER</Text>
        </TouchableOpacity>
      ) : null}

      {/* Centro */}
      <View style={styles.center}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      {/* Derecha 
      {onExit ? (
        <TouchableOpacity
          onPress={onExit}
          style={[styles.side, styles.shield, { backgroundColor: '#8a1a1a' }]}
        >
          <Text style={styles.shieldIcon}>✕</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.side} />
      )}*/}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 12,
    paddingBottom: 8,
  },
  side:       { width: 80, alignItems: 'flex-start', justifyContent: 'center' },
  shield:     { height: 44, borderRadius: 22, borderWidth: 2, borderColor: COLORS.gold },
  shieldIcon: { fontSize: 18, color: COLORS.gold },
  center:     { flex: 1, alignItems: 'center' },
  title: {
    color: COLORS.gold,
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    letterSpacing: 2,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  subtitle:   { color: COLORS.gold_muted, fontSize: FONTS.sizes.xs, letterSpacing: 1, marginTop: 2 },
  backText:   { color: COLORS.gold, fontSize: FONTS.sizes.sm, letterSpacing: 1 },
});