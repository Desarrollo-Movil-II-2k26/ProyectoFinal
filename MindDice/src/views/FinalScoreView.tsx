import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import MedievalBackground from '../layout/MedievalBackground';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { COLORS, FONTS } from '../styles/Theme';
import { G } from '../styles/GlobalStyles';
import { FinalScoreEntry } from '../types/GameTypes';

interface Props {
  winnerName:  string;
  finalScores: FinalScoreEntry[];
  onVolver:    () => void;
}

const POS_COLOR = ['#d4af37', '#c0c0c0', '#cd7f32', COLORS.text_muted];
const POS_LABEL = ['CAMPEÓN', '2° LUGAR', '3° LUGAR', '4° LUGAR'];

export default function FinalScoreView({ winnerName, finalScores, onVolver }: Props) {
  return (
    <MedievalBackground variant="home">
      <SafeAreaView style={G.safe}>

        <Card style={styles.winCard}>
          <Text style={styles.winLabel}>RECLUSO VICTORIOSO</Text>
          <Text style={styles.winName}>{winnerName}</Text>
          <Text style={styles.crown}>👑</Text>
        </Card>

        <Card>
          <Text style={styles.rankTitle}>CLASIFICACIÓN FINAL</Text>
          <FlatList
            data={finalScores}
            keyExtractor={s => s.player_id}
            scrollEnabled={false}
            renderItem={({ item }) => {
              const idx   = item.position - 1;
              const color = POS_COLOR[idx] ?? COLORS.text_muted;
              return (
                <View style={styles.rankRow}>
                  <Text style={[styles.rankPos, { color }]}>{POS_LABEL[idx] ?? `${item.position}°`}</Text>
                  <Text style={styles.rankName}>{item.player_name}</Text>
                  <Text style={[styles.rankScore, { color }]}>{item.total_score} pts</Text>
                </View>
              );
            }}
            ItemSeparatorComponent={() => <View style={G.separator} />}
          />
        </Card>

        <Button label="VOLVER AL INICIO" onPress={onVolver} style={styles.btn} />
      </SafeAreaView>
    </MedievalBackground>
  );
}

const styles = StyleSheet.create({
  winCard:   { alignItems: 'center', marginTop: 32 },
  winLabel:  { color: COLORS.gold_muted, fontSize: FONTS.sizes.xs, letterSpacing: 3, marginBottom: 6 },
  winName:   { color: '#d4af37', fontSize: FONTS.sizes.xl, fontWeight: '700', letterSpacing: 2, textShadowColor: '#000', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 6 },
  crown:     { fontSize: 42, marginTop: 8 },
  rankTitle: { color: COLORS.gold, fontSize: FONTS.sizes.sm, letterSpacing: 2, fontWeight: '700', marginBottom: 12 },
  rankRow:   { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 8 },
  rankPos:   { fontSize: FONTS.sizes.xs, fontWeight: '700', letterSpacing: 1, width: 80 },
  rankName:  { flex: 1, color: COLORS.text_light, fontSize: FONTS.sizes.md },
  rankScore: { fontSize: FONTS.sizes.md, fontWeight: '700' },
  btn:       { marginHorizontal: 32, marginTop: 8 },
});