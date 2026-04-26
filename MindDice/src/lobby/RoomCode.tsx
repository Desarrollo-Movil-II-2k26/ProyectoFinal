import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import { Images } from '../assets/images';
import { COLORS, FONTS } from '../styles/Theme';

const SCREEN_W = Dimensions.get('window').width;
const IMG_H     = SCREEN_W * (325 / 767); // ratio exacto de la imagen

export default function RoomCode({ code }: { code: string }) {
  const letters = (code ?? '----').padEnd(4, '-').split('');

  return (
    <ImageBackground
      source={Images.bg_codeaccess}
      style={[styles.bg, { height: IMG_H }]}
      resizeMode="stretch"
    >
      <View style={styles.lettersRow}>
        {letters.slice(0, 4).map((char, i) => (
          <Text key={i} style={styles.letter}>{char}</Text>
        ))}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    width:          '100%',
    justifyContent: 'flex-start',  // empuja las letras hacia abajo
    alignItems:     'center',
    paddingTop:  IMG_H * 0.37, // 20% desde abajo = dentro de los cuadritos
  },
  lettersRow: {
    flexDirection:  'row',
    justifyContent: 'center',
    gap:            SCREEN_W * 0.01, // gap proporcional al ancho
  },
  letter: {
    width:          SCREEN_W * 0.13,  // ancho proporcional al cuadrito
    color:          COLORS.gold,
    fontSize:       FONTS.sizes.xxl,
    fontWeight:     '700',
    textAlign:      'center',
    textShadowColor:  '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
});