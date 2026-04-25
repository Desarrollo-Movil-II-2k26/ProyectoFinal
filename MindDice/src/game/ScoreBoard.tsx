import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../styles/Theme';
import { Player, Shape } from '../types/GameTypes';

// ── ShapeIcon ────────────────────────────────────────────────────────────────
function ShapeIcon({ shape, size = 20, color }: { shape: Shape; size?: number; color: string }) {
  if (shape === 'circle') {
    return <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }} />;
  }
  if (shape === 'square') {
    return <View style={{ width: size, height: size, backgroundColor: color, borderRadius: 2 }} />;
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

const SHAPE_COLOR: Record<Shape, string> = {
  circle:   '#e05a3a',
  diamond:  '#4a9de0',
  square:   '#5cb85c',
  triangle: '#d4a017',
};

// ── Dados ────────────────────────────────────────────────────────────────────
function DiceRow({ dice, small = false }: { dice: number[]; small?: boolean }) {
  const size = small ? 18 : 22;
  return (
    <View style={diceStyles.row}>
      {dice.map((val, i) => (
        <View key={i} style={[diceStyles.die, { width: size, height: size, borderRadius: small ? 3 : 4 }]}>
          <Text style={[diceStyles.val, { fontSize: small ? 9 : 11 }]}>{val}</Text>
        </View>
      ))}
    </View>
  );
}

const diceStyles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 3, justifyContent: 'center', maxWidth: 120 },
  die: { backgroundColor: '#f0ead8', borderWidth: 1, borderColor: '#8a7a60', alignItems: 'center', justifyContent: 'center' },
  val: { color: '#1a1008', fontWeight: '700' },
});

// ── Tómbola oculta ───────────────────────────────────────────────────────────
function HiddenTombs({ isMe, hiddenDice }: {
  isMe: boolean;
  hiddenDice: { red: number; blue: number } | null;
}) {
  return (
    <View style={tombStyles.row}>
      <View style={[tombStyles.tomb, { backgroundColor: 'rgba(180,30,30,0.3)', borderColor: '#aa2222' }]}>
        <Text style={tombStyles.val}>{isMe && hiddenDice ? hiddenDice.red : '?'}</Text>
      </View>
      <View style={[tombStyles.tomb, { backgroundColor: 'rgba(30,80,200,0.3)', borderColor: '#2255cc' }]}>
        <Text style={tombStyles.val}>{isMe && hiddenDice ? hiddenDice.blue : '?'}</Text>
      </View>
    </View>
  );
}

const tombStyles = StyleSheet.create({
  row:  { flexDirection: 'row', gap: 4, marginTop: 4 },
  tomb: { width: 22, height: 22, borderRadius: 4, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  val:  { color: '#fff', fontSize: 10, fontWeight: '700' },
});

// ── Jugador en la mesa ───────────────────────────────────────────────────────
function PlayerSlot({
  player, shape, isMe, hiddenDice,
  isCurrentTurn, usedIndices = [],
}: {
  player:        Player;
  shape:         Shape | null;
  isMe:          boolean;
  hiddenDice:    { red: number; blue: number } | null;
  isCurrentTurn: boolean;
  usedIndices?:  number[];
}) {
  const shapeColor = shape ? SHAPE_COLOR[shape] : '#888';

  // Filtra los dados ya usados
  const remainingDice = player.white_dice.filter((_, i) => !usedIndices.includes(i));

  return (
    <View style={[
      slotStyles.wrap,
      isCurrentTurn && slotStyles.wrapActive,
    ]}>
      {/* Dados blancos restantes */}
      <DiceRow dice={remainingDice} />

      {/* Tómbolas ocultas */}
      <HiddenTombs isMe={isMe} hiddenDice={hiddenDice} />

      {/* Nombre + figura */}
      <View style={slotStyles.nameRow}>
        <View style={[slotStyles.shield, { borderColor: shapeColor }]}>
          {shape
            ? <ShapeIcon shape={shape} size={14} color={shapeColor} />
            : <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: '#555' }} />
          }
        </View>
        <Text style={[slotStyles.name, isMe && slotStyles.nameMe]}>
          {player.name.toUpperCase()}
        </Text>
        {isCurrentTurn && <View style={slotStyles.turnDot} />}
      </View>

      {/* Puntaje */}
      <Text style={slotStyles.score}>{player.total_score} pts</Text>
    </View>
  );
}

const slotStyles = StyleSheet.create({
  wrap: {
    alignItems:      'center',
    gap:             4,
    padding:         8,
    borderRadius:    6,
    borderWidth:     1,
    borderColor:     'transparent',
    backgroundColor: 'rgba(0,0,0,0.25)',
    flex:            1,
  },
  wrapActive: {
    borderColor:     '#c9983a',
    backgroundColor: 'rgba(201,152,58,0.12)',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           5,
    marginTop:     2,
  },
  shield: {
    width:           24,
    height:          24,
    borderRadius:    12,
    borderWidth:     2,
    backgroundColor: 'rgba(20,20,40,0.8)',
    alignItems:      'center',
    justifyContent:  'center',
  },
  name: {
    color:         '#f0e8d0',
    fontSize:      FONTS.sizes.sm,
    fontWeight:    '700',
    letterSpacing: 1,
  },
  nameMe:  { color: '#c9983a' },
  turnDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#c9983a' },
  score:   { color: 'rgba(201,152,58,0.7)', fontSize: FONTS.sizes.xs, marginTop: 2 },
});

// ── ScoreBoard principal ─────────────────────────────────────────────────────
interface Props {
  players:             Player[];
  playerShapes:        Record<string, Shape>;
  myPlayerId:          string | null;
  hiddenDice:          { red: number; blue: number } | null;
  currentTurnPlayerId: string;
  usedDiceIndices?:    Record<string, number[]>;
}

export default function ScoreBoard({
  players, playerShapes, myPlayerId,
  hiddenDice, currentTurnPlayerId, usedDiceIndices = {},
}: Props) {
  const top    = players.slice(0, 2);
  const bottom = players.slice(2, 4);

  return (
    <View style={tableStyles.table}>

      {/* Fila superior */}
      <View style={tableStyles.rowTop}>
        {top.map(p => (
          <PlayerSlot
            key={p.id}
            player={p}
            shape={playerShapes[p.id] ?? null}
            isMe={p.id === myPlayerId}
            hiddenDice={p.id === myPlayerId ? hiddenDice : null}
            isCurrentTurn={p.id === currentTurnPlayerId}
            usedIndices={usedDiceIndices[p.id] ?? []}
          />
        ))}
        {top.length < 2 && <View style={{ flex: 1 }} />}
      </View>

      {/* Línea divisoria */}
      <View style={tableStyles.divider}>
        <View style={tableStyles.dividerLine} />
        <Text style={tableStyles.dividerText}>✦</Text>
        <View style={tableStyles.dividerLine} />
      </View>

      {/* Fila inferior */}
      <View style={tableStyles.rowBottom}>
        {bottom.map(p => (
          <PlayerSlot
            key={p.id}
            player={p}
            shape={playerShapes[p.id] ?? null}
            isMe={p.id === myPlayerId}
            hiddenDice={p.id === myPlayerId ? hiddenDice : null}
            isCurrentTurn={p.id === currentTurnPlayerId}
            usedIndices={usedDiceIndices[p.id] ?? []}
          />
        ))}
        {bottom.length < 2 && <View style={{ flex: 1 }} />}
      </View>

    </View>
  );
}

const tableStyles = StyleSheet.create({
  table: {
    marginHorizontal: 8,
    marginTop:        230,
    gap:              8,
  },
  rowTop:    { flexDirection: 'row', gap: 8 },
  rowBottom: { flexDirection: 'row', gap: 8 },
  divider: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               8,
    paddingHorizontal: 16,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(201,152,58,0.3)' },
  dividerText: { color: 'rgba(201,152,58,0.5)', fontSize: 12 },
});