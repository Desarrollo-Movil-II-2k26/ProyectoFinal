import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import MedievalBackground from '../layout/MedievalBackground';
import Header from '../layout/Header';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { COLORS, FONTS } from '../styles/Theme';
import { G } from '../styles/GlobalStyles';
import { RoundScoreEntry } from '../types/GameTypes';

interface Props {
  round:       number;
  scores:      RoundScoreEntry[];
  onContinuar: () => void;
}

export default function RoundResultView({ round, scores, onContinuar }: Props) {
  const sorted = [...scores].sort((a, b) => b.total_score - a.total_score);

  return (
    <MedievalBackground variant="home">
      <SafeAreaView style={G.safe}>
        <Header title={`RONDA ${round} — RESULTADOS`} />

        <Card>
          <View style={styles.tableHead}>
            <Text style={[styles.col, styles.colName]}>JUGADOR</Text>
            <Text style={[styles.col, styles.colMid]}>CARTA</Text>
            <Text style={[styles.col, styles.colRight]}>BONUS</Text>
            <Text style={[styles.col, styles.colRight]}>PTS</Text>
          </View>
          <View style={styles.divider} />
          <FlatList
            data={scores}
            keyExtractor={s => s.player_id}
            scrollEnabled={false}
            renderItem={({ item, index }) => (
              <View style={[styles.row, index % 2 === 0 && styles.rowAlt]}>
                <Text style={[styles.col, styles.colName]} numberOfLines={1}>{item.player_name}</Text>
                <Text style={[styles.col, styles.colMid, styles.cardText]}>{item.prediction_card}</Text>
                <Text style={[styles.col, styles.colRight, item.bonus_applied ? styles.bonusY : styles.bonusN]}>
                  {item.bonus_applied ? '✓' : '✗'}
                </Text>
                <Text style={[styles.col, styles.colRight, styles.pts]}>
                  {item.final_round_score}
                </Text>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={G.separator} />}
          />
        </Card>

        <Card>
          <Text style={styles.accumTitle}>ACUMULADO</Text>
          {sorted.map((s, i) => (
            <View key={s.player_id} style={styles.accumRow}>
              <Text style={styles.accumPos}>#{i + 1}</Text>
              <Text style={styles.accumName}>{s.player_name}</Text>
              <Text style={styles.accumScore}>{s.total_score} pts</Text>
            </View>
          ))}
        </Card>

        <Button
          label={round < 4 ? 'SIGUIENTE RONDA →' : 'VER RESULTADO FINAL'}
          onPress={onContinuar}
          style={styles.btn}
        />
      </SafeAreaView>
    </MedievalBackground>
  );
}

const styles = StyleSheet.create({
  tableHead: { flexDirection: 'row', marginBottom: 8 },
  divider:   { height: 1, backgroundColor: COLORS.gold_dark, marginBottom: 6 },
  row:       { flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 4, borderRadius: 3 },
  rowAlt:    { backgroundColor: 'rgba(255,255,255,0.03)' },
  col:       { fontSize: FONTS.sizes.sm, color: COLORS.text_light },
  colName:   { flex: 2, fontWeight: '600' },
  colMid:    { flex: 2, textAlign: 'center' },
  colRight:  { flex: 1, textAlign: 'right' },
  cardText:  { color: COLORS.gold_muted, fontSize: FONTS.sizes.xs },
  bonusY:    { color: COLORS.success, fontWeight: '700' },
  bonusN:    { color: COLORS.danger },
  pts:       { color: COLORS.gold, fontWeight: '700' },
  accumTitle:{ color: COLORS.gold, fontSize: FONTS.sizes.sm, letterSpacing: 2, fontWeight: '700', marginBottom: 10 },
  accumRow:  { flexDirection: 'row', alignItems: 'center', paddingVertical: 7, gap: 10 },
  accumPos:  { color: COLORS.gold_muted, fontSize: FONTS.sizes.md, width: 28 },
  accumName: { flex: 1, color: COLORS.text_light, fontSize: FONTS.sizes.md },
  accumScore:{ color: COLORS.gold, fontSize: FONTS.sizes.lg, fontWeight: '700' },
  btn:       { marginHorizontal: 32, marginTop: 4 },
});