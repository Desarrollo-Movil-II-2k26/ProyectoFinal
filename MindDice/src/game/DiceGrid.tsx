import React from 'react';
import { View, StyleSheet } from 'react-native';
import DiceComponent from './DiceComponent';

interface Props {
  dice:        number[];           // 9 valores
  selected:    number[];           // índices seleccionados
  onToggle?:   (index: number) => void;
  disabled?:   boolean;
}

export default function DiceGrid({ dice, selected, onToggle, disabled }: Props) {
  return (
    <View style={styles.grid}>
      {dice.map((val, i) => (
        <DiceComponent
          key={i}
          value={val}
          color="white"
          selected={selected.includes(i)}
          onPress={onToggle ? () => onToggle(i) : undefined}
          disabled={disabled}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
});