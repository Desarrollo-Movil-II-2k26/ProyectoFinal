import React from 'react';
import { View, StyleSheet } from 'react-native';
import DiceComponent from './DiceComponent';

interface Props {
  dice:      number[];
  selected:  number[];
  onToggle?: (index: number) => void;
  disabled?: boolean;
  large?:    boolean;
}

export default function DiceGrid({ dice, selected, onToggle, disabled, large = false }: Props) {
  return (
    <View style={[styles.grid, large && styles.gridLarge]}>
      {dice.map((val, i) => (
        <DiceComponent
          key={i}
          value={val}
          color="white"
          selected={selected.includes(i)}
          onPress={onToggle ? () => onToggle(i) : undefined}
          disabled={disabled}
          large={large}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid:      { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  gridLarge: { gap: 14 },
});