import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { COLORS, FONTS } from '../../styles/Theme';

// ── Tipos ─────────────────────────────────────────────────────────────────────
export type PredictionCard = 'ZERO' | 'MIN' | 'MORE' | 'MAX';

interface CardDef {
  key:         PredictionCard;
  label:       string;
  range:       string;
  description: string;
  color:       string;
  icon:        string;
}

const CARDS: CardDef[] = [
  {
    key:         'ZERO',
    label:       'ZERO',
    range:       '0',
    description: 'Predices que tu puntaje será exactamente cero.\n¡Premio: 40 puntos!',
    color:       '#6a5028',
    icon:        '⭕',
  },
  {
    key:         'MIN',
    label:       'MIN',
    range:       '0 < y < 7',
    description: 'Predices que tu puntaje estará entre 1 y 6.',
    color:       '#3a7a5a',
    icon:        '📉',
  },
  {
    key:         'MORE',
    label:       'MORE',
    range:       '7 ≤ y ≤ 10',
    description: 'Predices que tu puntaje estará entre 7 y 10.',
    color:       '#3a5a8a',
    icon:        '📊',
  },
  {
    key:         'MAX',
    label:       'MAX',
    range:       'y > 10',
    description: 'Predices que tu puntaje será mayor a 10.',
    color:       '#8a3a3a',
    icon:        '📈',
  },
];

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  visible:       boolean;
  playerName:    string;
  /** Ya fue enviada la carta en esta ronda */
  alreadySent:   boolean;
  onConfirm:     (card: PredictionCard) => void;
  onClose:       () => void;
}

// ── Componente ────────────────────────────────────────────────────────────────
export default function PredictionModal({
  visible,
  playerName,
  alreadySent,
  onConfirm,
  onClose,
}: Props) {
  const [selected, setSelected] = useState<PredictionCard | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    if (!selected) return;
    setConfirmed(true);
    onConfirm(selected);
  };

  const handleClose = () => {
    // Reset local state al cerrar
    setSelected(null);
    setConfirmed(false);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>

          {/* Header */}
          <Text style={styles.title}>🔮 PREDICCIÓN</Text>
          <Text style={styles.subtitle}>
            {alreadySent
              ? 'Ya enviaste tu predicción esta ronda'
              : `${playerName}, elige tu carta en secreto`}
          </Text>

          {/* Confirmado */}
          {(confirmed || alreadySent) ? (
            <View style={styles.confirmedBox}>
              <Text style={styles.confirmedIcon}>✅</Text>
              <Text style={styles.confirmedText}>
                Carta enviada al grouppiere.{'\n'}Se revelará al final de la ronda.
              </Text>
            </View>
          ) : (
            <>
              {/* Tarjetas */}
              <View style={styles.cardsGrid}>
                {CARDS.map((c) => {
                  const isSelected = selected === c.key;
                  return (
                    <TouchableOpacity
                      key={c.key}
                      style={[
                        styles.predCard,
                        { borderColor: c.color },
                        isSelected && { backgroundColor: c.color },
                      ]}
                      onPress={() => setSelected(c.key)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.cardIcon}>{c.icon}</Text>
                      <Text style={[styles.cardLabel, isSelected && styles.cardLabelSelected]}>
                        {c.label}
                      </Text>
                      <Text style={[styles.cardRange, isSelected && styles.cardRangeSelected]}>
                        {c.range}
                      </Text>
                      <Text style={[styles.cardDesc, isSelected && styles.cardDescSelected]}>
                        {c.description}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Botón confirmar */}
              <TouchableOpacity
                style={[styles.confirmBtn, !selected && styles.confirmBtnDisabled]}
                onPress={handleConfirm}
                disabled={!selected}
                activeOpacity={0.8}
              >
                <Text style={styles.confirmText}>
                  {selected
                    ? `ENVIAR CARTA "${selected}"`
                    : 'SELECCIONA UNA CARTA'}
                </Text>
              </TouchableOpacity>
            </>
          )}

          {/* Cerrar */}
          <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
            <Text style={styles.closeText}>CERRAR</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

// ── Estilos ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.80)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#1a1208',
    borderWidth: 2,
    borderColor: '#c4a84a',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    color: '#c4a84a',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 4,
    marginBottom: 4,
  },
  subtitle: {
    color: '#a09060',
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: 18,
    textAlign: 'center',
  },

  // Grid de tarjetas
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    marginBottom: 20,
  },
  predCard: {
    width: '46%',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 2,
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  cardIcon: {
    fontSize: 24,
    marginBottom: 2,
  },
  cardLabel: {
    color: '#c4a84a',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 3,
  },
  cardLabelSelected: {
    color: '#fff',
  },
  cardRange: {
    color: '#a09060',
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: '600',
  },
  cardRangeSelected: {
    color: 'rgba(255,255,255,0.8)',
  },
  cardDesc: {
    color: '#6a5028',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 14,
  },
  cardDescSelected: {
    color: 'rgba(255,255,255,0.7)',
  },

  // Botón confirmar
  confirmBtn: {
    width: '100%',
    height: 48,
    backgroundColor: '#c4a84a',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  confirmBtnDisabled: {
    opacity: 0.35,
  },
  confirmText: {
    color: '#1a1208',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
  },

  // Confirmado
  confirmedBox: {
    alignItems: 'center',
    paddingVertical: 30,
    gap: 12,
  },
  confirmedIcon: {
    fontSize: 48,
  },
  confirmedText: {
    color: '#a09060',
    fontSize: 13,
    textAlign: 'center',
    letterSpacing: 1,
    lineHeight: 20,
  },

  // Cerrar
  closeBtn: {
    paddingVertical: 8,
  },
  closeText: {
    color: '#6a5028',
    fontSize: 12,
    letterSpacing: 2,
  },
});