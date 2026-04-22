import React, { useState, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { Shape } from '../../types/GameTypes';

// ── Tipos ────────────────────────────────────────────────────────────────────
export type { Shape };

interface ShapeOption {
  key:   Shape;
  color: string;
  name:  string;
}

const SHAPES: ShapeOption[] = [
  { key: 'circle',   color: '#e05a3a', name: 'CÍRCULO'   },
  { key: 'diamond',  color: '#4a9de0', name: 'ROMBO'     },
  { key: 'square',   color: '#5cb85c', name: 'CUADRADO'  },
  { key: 'triangle', color: '#d4a017', name: 'TRIÁNGULO' },
];

// ── Figura ───────────────────────────────────────────────────────────────────
function ShapeIcon({ shape, size = 72, color }: { shape: Shape; size?: number; color: string }) {
  if (shape === 'circle') {
    return <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }} />;
  }
  if (shape === 'square') {
    return <View style={{ width: size, height: size, backgroundColor: color, borderRadius: 4 }} />;
  }
  if (shape === 'diamond') {
    return <View style={{ width: size, height: size, backgroundColor: color, transform: [{ rotate: '45deg' }] }} />;
  }
  return (
    <View style={{
      width: 0, height: 0,
      borderLeftWidth: size / 2, borderRightWidth: size / 2, borderBottomWidth: size,
      borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: color,
    }} />
  );
}

// ── Props ────────────────────────────────────────────────────────────────────
interface Props {
  visible:        boolean;
  playerName:     string;
  onConfirm:      (shape: Shape) => void;
}

// ── Componente ───────────────────────────────────────────────────────────────
export default function ProfileModal({ visible, playerName, onConfirm }: Props) {
  const [spinning,  setSpinning]  = useState(false);
  const [highlight, setHighlight] = useState<number>(-1);
  const [chosen,    setChosen]    = useState<Shape | null>(null);
  const scaleAnim                 = useRef(new Animated.Value(1)).current;

  const handleAzar = () => {
    if (spinning) return;
    setSpinning(true);
    setChosen(null);
    setHighlight(-1);

    let tick  = 0;
    const totalTicks = 24;
    let delay = 60;

    const step = () => {
      setHighlight(prev => (prev + 1) % 4);
      tick++;

      if (tick >= totalTicks) {
        const idx    = Math.floor(Math.random() * 4);
        const winner = SHAPES[idx].key;
        setHighlight(idx);
        setChosen(winner);
        setSpinning(false);

        Animated.sequence([
          Animated.timing(scaleAnim, { toValue: 1.4, duration: 150, easing: Easing.out(Easing.back(2)), useNativeDriver: true }),
          Animated.timing(scaleAnim, { toValue: 1,   duration: 200, easing: Easing.in(Easing.elastic(1)), useNativeDriver: true }),
        ]).start();
        return;
      }

      if (tick > totalTicks - 10) delay = Math.min(delay + 30, 300);
      setTimeout(step, delay);
    };

    setTimeout(step, delay);
  };

  const handleConfirm = () => {
    if (!chosen || spinning) return;
    onConfirm(chosen);
  };

  const chosenShape = chosen ? SHAPES.find(s => s.key === chosen)! : null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {}}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>

          <Text style={styles.title}>⚔️ BIENVENIDO</Text>
          <Text style={styles.name}>{playerName}</Text>
          <Text style={styles.instruction}>
            Presiona AZAR para recibir tu símbolo de batalla
          </Text>

          {/* Figura elegida */}
          <View style={styles.shapeArea}>
            {chosenShape ? (
              <Animated.View style={[styles.shapeBox, { transform: [{ scale: scaleAnim }] }]}>
                <ShapeIcon shape={chosenShape.key} size={80} color={chosenShape.color} />
                <Text style={styles.chosenLabel}>{chosenShape.name}</Text>
              </Animated.View>
            ) : (
              <View style={styles.shapesRow}>
                {SHAPES.map((s, idx) => (
                  <View
                    key={s.key}
                    style={[styles.shapeWrapper, highlight === idx && styles.shapeHighlight]}
                  >
                    <ShapeIcon shape={s.key} size={36} color={s.color} />
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Botón AZAR */}
          <TouchableOpacity
            style={[styles.azarBtn, spinning && styles.azarBtnDisabled]}
            onPress={handleAzar}
            activeOpacity={0.8}
            disabled={spinning}
          >
            <Text style={styles.azarText}>
              {spinning ? '🎲 ELIGIENDO...' : chosen ? '🎲 VOLVER A TIRAR' : '🎲 AZAR'}
            </Text>
          </TouchableOpacity>

          {/* Botón Confirmar */}
          <TouchableOpacity
            style={[styles.confirmBtn, (!chosen || spinning) && styles.confirmBtnDisabled]}
            onPress={handleConfirm}
            activeOpacity={0.8}
            disabled={!chosen || spinning}
          >
            <Text style={styles.confirmText}>
              {chosen ? '⚔️ ENTRAR A LA PARTIDA' : 'TIRA EL AZAR PRIMERO'}
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

// ── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.88)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 320,
    backgroundColor: '#1a1208',
    borderWidth: 2,
    borderColor: '#c4a84a',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
  },
  title: {
    color: '#c4a84a',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 4,
    marginBottom: 4,
  },
  name: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 2,
    marginBottom: 6,
    opacity: 0.9,
  },
  instruction: {
    color: '#a09060',
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: 24,
    textAlign: 'center',
  },
  shapeArea: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  shapeBox: {
    alignItems: 'center',
    gap: 12,
  },
  chosenLabel: {
    color: '#c4a84a',
    fontSize: 14,
    letterSpacing: 3,
    fontWeight: '700',
    marginTop: 10,
  },
  shapesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  shapeWrapper: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shapeHighlight: {
    borderColor: '#fff',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  azarBtn: {
    width: '100%',
    height: 48,
    backgroundColor: '#c4a84a',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  azarBtnDisabled: {
    opacity: 0.6,
  },
  azarText: {
    color: '#1a1208',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 2,
  },
  confirmBtn: {
    width: '100%',
    height: 48,
    backgroundColor: '#4a7a3a',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnDisabled: {
    opacity: 0.3,
  },
  confirmText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
});