import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { PANEL, COLORS } from '../../styles/Theme';

interface Props {
  children:    React.ReactNode;
  style?:      ViewStyle;
  withRivets?: boolean;
}

export default function Card({ children, style, withRivets = true }: Props) {
  return (
    <View style={[styles.card, style]}>
      {withRivets && (
        <>
          <View style={[styles.rivet, { top: 7, left: 7 }]} />
          <View style={[styles.rivet, { top: 7, right: 7 }]} />
          <View style={[styles.rivet, { bottom: 7, left: 7 }]} />
          <View style={[styles.rivet, { bottom: 7, right: 7 }]} />
        </>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { ...PANEL, marginHorizontal: 20, marginBottom: 14 },
  rivet: {
    position: 'absolute',
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: COLORS.rivet,
    borderWidth: 1, borderColor: COLORS.rivet_border,
  },
});