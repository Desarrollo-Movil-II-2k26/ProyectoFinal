import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from './Theme';

export const G = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center' },
  center: { alignItems: 'center', justifyContent: 'center' },
  rivet: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.rivet,
    borderWidth: 1,
    borderColor: COLORS.rivet_border,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(180,140,60,0.15)',
  },
  goldTitle: {
    color: COLORS.gold,
    fontFamily: FONTS.medieval,
    fontWeight: '700',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 6,
  },
});