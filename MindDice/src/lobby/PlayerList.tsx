import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../styles/Theme';
import { Player } from '../types/GameTypes';

export default function PlayerList({ players }: { players: Player[] }) {
  return (
    <FlatList
      data={players}
      keyExtractor={p => p.id}
      scrollEnabled={false}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <View style={[styles.dot, { backgroundColor: item.connected ? COLORS.success : COLORS.danger }]} />
          <Text style={styles.name}>{item.name}</Text>
          {item.is_leader && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>LÍDER</Text>
            </View>
          )}
        </View>
      )}
      ItemSeparatorComponent={() => <View style={styles.sep} />}
    />
  );
}

const styles = StyleSheet.create({
  row:       { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 10 },
  dot:       { width: 10, height: 10, borderRadius: 5 },
  name:      { flex: 1, color: COLORS.text_light, fontSize: FONTS.sizes.md, fontWeight: '600' },
  badge:     { backgroundColor: 'rgba(180,130,30,0.3)', borderWidth: 1, borderColor: COLORS.gold_dark, borderRadius: 3, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { color: COLORS.gold, fontSize: FONTS.sizes.xs, letterSpacing: 1, fontWeight: '700' },
  sep:       { height: 1, backgroundColor: 'rgba(180,140,60,0.15)' },
});