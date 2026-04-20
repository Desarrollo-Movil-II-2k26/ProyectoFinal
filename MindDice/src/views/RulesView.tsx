import React, { useRef, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, Animated,
} from 'react-native';
import MedievalBackground from '../layout/MedievalBackground';
import Header from '../layout/Header';
import Card from '../components/common/Card';
import { COLORS, FONTS } from '../styles/Theme';
import { G } from '../styles/GlobalStyles';

interface Props {
  onVolver: () => void;
}

// ─── Secciones de reglas ─────────────────────────────────────────────────────
const SECTIONS = [
  {
    id: 'objetivo',
    icon: '🎯',
    title: 'OBJETIVO',
    content: [
      'Hacer la mayor puntuación posible jugando con solo 3 dados por jugada.',
    ],
  },
  {
    id: 'dados',
    icon: '🎲',
    title: 'DADOS Y PREPARACIÓN',
    content: [
      'Cada jugador recibe 11 dados: 9 blancos, 1 azul y 1 rojo.',
      'Al iniciar: se tiran los 9 dados blancos (visibles para todos).',
      'Los dados rojo y azul se lanzan en secreto en la tómbola de su color.',
      'Cuando todos hayan tirado, cada jugador elige una tarjeta de predicción.',
    ],
  },
  {
    id: 'prediccion',
    icon: '🔮',
    title: 'SISTEMA DE PREDICCIÓN',
    content: [
      'Al inicio de cada ronda, elige en secreto una tarjeta de predicción.',
      'No puedes cambiarla una vez enviada.',
    ],
    cards: [
      { label: 'ZERO',  desc: 'Terminar con exactamente 0 puntos',  color: '#8a2020' },
      { label: 'MIN',   desc: 'Terminar con 1 a 6 puntos',           color: '#2a5a8a' },
      { label: 'MORE',  desc: 'Terminar con 7 a 10 puntos',          color: '#2a7a3a' },
      { label: 'MAX',   desc: 'Terminar con más de 10 puntos',       color: '#8a6a10' },
    ],
  },
  {
    id: 'recompensas',
    icon: '🎁',
    title: 'RECOMPENSAS',
    content: [
      'Acertar ZERO → +40 puntos al finalizar la ronda.',
      'Acertar MIN / MORE / MAX → tus puntos de esa ronda se duplican.',
      'No acertar → recibes tus puntos sin modificar.',
    ],
  },
  {
    id: 'ronda',
    icon: '🔄',
    title: 'DESARROLLO DE LA RONDA',
    content: [
      'El juego tiene 4 rondas en total.',
      'En cada ronda se hacen 3 jugadas (combinaciones) con los 11 dados.',
      '1. Se tiran los 11 dados.',
      '2. Se seleccionan 3 → quedan 8 dados.',
      '3. Se seleccionan otros 3 → quedan 5 dados.',
      '4. Se seleccionan otros 3 → se descartan los 2 restantes.',
    ],
  },
  {
    id: 'turnos',
    icon: '⚔',
    title: 'ORDEN DE TURNOS',
    content: [
      'El jugador con mayor puntuación en la jugada anterior va primero.',
      'Los demás jugadores siguen en orden aleatorio.',
      'Este orden se recalcula al inicio de cada jugada.',
    ],
  },
  {
    id: 'seleccion',
    icon: '🧩',
    title: 'SELECCIÓN DE DADOS',
    content: [
      'Selecciona 3 dados para formar tu combinación.',
      'Puedes usar 1 o 2 dados ocultos (rojo o azul) en tu selección.',
      'Los dados ocultos se revelan al final de la jugada.',
    ],
  },
  {
    id: 'combinaciones',
    icon: '🧮',
    title: 'TIPOS DE COMBINACIONES',
    content: [],
    combos: [
      {
        name: 'TRIPLE',
        color: '#d4af37',
        desc: 'Los 3 dados muestran el mismo número.',
        example: '6 · 6 · 6',
        nota: 'Si hay empate, gana el triple con el número más alto.',
      },
      {
        name: 'ESCALERA',
        color: COLORS.dado_azul,
        desc: 'Los 3 dados van en orden consecutivo.',
        example: '1 · 2 · 3',
        nota: 'El 6 y el 1 NO son consecutivos.',
      },
      {
        name: 'DOBLE',
        color: COLORS.gold,
        desc: 'Dos dados muestran el mismo número.',
        example: '5 · 5 · 3',
        nota: 'Si hay empate en el par, gana quien tenga el dado restante más alto.',
      },
    ],
  },
  {
    id: 'puntaje',
    icon: '🏆',
    title: 'SISTEMA DE PUNTAJE',
    content: [],
    scores: [
      { pos: '1°', label: 'PRIMER LUGAR',   pts: '6 pts', color: '#d4af37' },
      { pos: '2°', label: 'SEGUNDO LUGAR',  pts: '3 pts', color: '#c0c0c0' },
      { pos: '3°', label: 'TERCER LUGAR',   pts: '1 pt',  color: '#cd7f32' },
      { pos: '4°', label: 'CUARTO LUGAR',   pts: '0 pts', color: COLORS.text_muted },
    ],
  },
  {
    id: 'especiales',
    icon: '⚖',
    title: 'REGLAS ESPECIALES',
    content: [
      'Si todos los dados son iguales → empate general.',
      'Empate en 1° y 2°: se suman los puntos (6+3=9) y se dividen → 4.5 pts cada uno.',
      'Empate en 2° y 3°: se suman (3+1=4) y se dividen → 2 pts cada uno.',
      'La división aplica para cualquier combinación de posiciones empatadas.',
    ],
  },
];

// ─── Componentes internos ─────────────────────────────────────────────────────

function SectionHeader({
  icon, title, expanded, onPress,
}: {
  icon: string; title: string; expanded: boolean; onPress: () => void;
}) {
  return (
    <TouchableOpacity style={sStyles.header} onPress={onPress} activeOpacity={0.75}>
      <Text style={sStyles.icon}>{icon}</Text>
      <Text style={sStyles.title}>{title}</Text>
      <Text style={sStyles.arrow}>{expanded ? '▲' : '▼'}</Text>
    </TouchableOpacity>
  );
}

function BulletItem({ text }: { text: string }) {
  return (
    <View style={sStyles.bulletRow}>
      <Text style={sStyles.bullet}>·</Text>
      <Text style={sStyles.bulletText}>{text}</Text>
    </View>
  );
}

function PredCard({ label, desc, color }: { label: string; desc: string; color: string }) {
  return (
    <View style={[sStyles.predCard, { borderColor: color }]}>
      <Text style={[sStyles.predLabel, { color }]}>{label}</Text>
      <Text style={sStyles.predDesc}>{desc}</Text>
    </View>
  );
}

function ComboCard({
  name, color, desc, example, nota,
}: {
  name: string; color: string; desc: string; example: string; nota: string;
}) {
  return (
    <View style={[sStyles.comboCard, { borderLeftColor: color }]}>
      <Text style={[sStyles.comboName, { color }]}>{name}</Text>
      <Text style={sStyles.comboDesc}>{desc}</Text>
      <View style={sStyles.comboExample}>
        <Text style={sStyles.comboExLabel}>Ejemplo: </Text>
        <Text style={sStyles.comboExVal}>{example}</Text>
      </View>
      <Text style={sStyles.combonota}>⚠ {nota}</Text>
    </View>
  );
}

function ScoreRow({ pos, label, pts, color }: { pos: string; label: string; pts: string; color: string }) {
  return (
    <View style={sStyles.scoreRow}>
      <Text style={[sStyles.scorePos, { color }]}>{pos}</Text>
      <Text style={sStyles.scoreLabel}>{label}</Text>
      <Text style={[sStyles.scorePts, { color }]}>{pts}</Text>
    </View>
  );
}

// ─── Vista principal ──────────────────────────────────────────────────────────

export default function RulesView({ onVolver }: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    objetivo: true,
  });

  const toggle = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <MedievalBackground variant="home">
      <SafeAreaView style={G.safe}>

       
        <Header title="REGLAS DEL JUEGO" onBack={onVolver} />

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Intro */}
          <Card style={styles.introCard}>
            <Text style={styles.introText}>
              Bienvenido, recluso. Lee con atención las reglas antes de jugar.
              La ignorancia no te absolverá.
            </Text>
          </Card>

          {/* Secciones colapsables */}
          {SECTIONS.map(section => (
            <Card key={section.id} style={styles.sectionCard} withRivets={false}>

              <SectionHeader
                icon={section.icon}
                title={section.title}
                expanded={!!expanded[section.id]}
                onPress={() => toggle(section.id)}
              />

              {expanded[section.id] && (
                <View style={styles.sectionBody}>

                  {/* Texto normal */}
                  {section.content.map((line, i) => (
                    <BulletItem key={i} text={line} />
                  ))}

                  {/* Tarjetas de predicción */}
                  {'cards' in section && section.cards && (
                    <View style={styles.predGrid}>
                      {section.cards.map(c => (
                        <PredCard key={c.label} {...c} />
                      ))}
                    </View>
                  )}

                  {/* Tipos de combinaciones */}
                  {'combos' in section && section.combos && (
                    <View style={styles.comboList}>
                      {section.combos.map(c => (
                        <ComboCard key={c.name} {...c} />
                      ))}
                    </View>
                  )}

                  {/* Tabla de puntajes */}
                  {'scores' in section && section.scores && (
                    <View style={styles.scoreTable}>
                      {section.scores.map(s => (
                        <ScoreRow key={s.pos} {...s} />
                      ))}
                    </View>
                  )}

                </View>
              )}
            </Card>
          ))}

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </MedievalBackground>
  );
}

// ─── Estilos ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scroll:       { paddingBottom: 32 },
  introCard:    { marginTop: 8, alignItems: 'center' },
  introText:    { color: COLORS.text_muted, fontSize: FONTS.sizes.sm, textAlign: 'center', fontStyle: 'italic', lineHeight: 20 },
  sectionCard:  { paddingHorizontal: 16, paddingVertical: 0, overflow: 'hidden' },
  sectionBody:  { paddingBottom: 14, paddingTop: 4 },
  predGrid:     { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  comboList:    { gap: 10, marginTop: 10 },
  scoreTable:   { marginTop: 10, gap: 6 },
  bottomSpacer: { height: 20 },
});

const sStyles = StyleSheet.create({
  // Header de sección
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(180,140,60,0.2)',
  },
  icon:  { fontSize: 18 },
  title: { flex: 1, color: COLORS.gold, fontSize: FONTS.sizes.md, fontWeight: '700', letterSpacing: 1.5 },
  arrow: { color: COLORS.gold_muted, fontSize: FONTS.sizes.sm },

  // Bullet
  bulletRow: { flexDirection: 'row', gap: 8, marginTop: 6, alignItems: 'flex-start' },
  bullet:    { color: COLORS.gold_muted, fontSize: FONTS.sizes.md, marginTop: 1 },
  bulletText:{ flex: 1, color: COLORS.text_light, fontSize: FONTS.sizes.sm, lineHeight: 20 },

  // Tarjetas predicción
  predCard: {
    width: '47%',
    borderWidth: 2,
    borderRadius: 4,
    padding: 10,
    backgroundColor: 'rgba(10,6,2,0.6)',
    alignItems: 'center',
    gap: 4,
  },
  predLabel: { fontSize: FONTS.sizes.lg, fontWeight: '700', letterSpacing: 2 },
  predDesc:  { color: COLORS.text_muted, fontSize: FONTS.sizes.xs, textAlign: 'center' },

  // Combos
  comboCard: {
    borderLeftWidth: 3,
    borderLeftColor: COLORS.gold,
    paddingLeft: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(10,6,2,0.4)',
    borderRadius: 4,
    gap: 4,
  },
  comboName:      { fontSize: FONTS.sizes.md, fontWeight: '700', letterSpacing: 2 },
  comboDesc:      { color: COLORS.text_light, fontSize: FONTS.sizes.sm },
  comboExample:   { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  comboExLabel:   { color: COLORS.text_muted, fontSize: FONTS.sizes.xs },
  comboExVal:     { color: COLORS.gold, fontSize: FONTS.sizes.md, fontWeight: '700', letterSpacing: 4 },
  combonota:      { color: COLORS.text_muted, fontSize: FONTS.sizes.xs, fontStyle: 'italic', marginTop: 2 },

  // Puntajes
  scoreRow:  { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 10, borderBottomWidth: 0.5, borderBottomColor: 'rgba(180,140,60,0.1)' },
  scorePos:  { fontSize: FONTS.sizes.lg, fontWeight: '700', width: 30 },
  scoreLabel:{ flex: 1, color: COLORS.text_light, fontSize: FONTS.sizes.md },
  scorePts:  { fontSize: FONTS.sizes.lg, fontWeight: '700' },
});