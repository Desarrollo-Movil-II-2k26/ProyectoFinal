import React from 'react';
import { ImageBackground, View, StyleSheet, StatusBar } from 'react-native';
import { Images } from '../assets/images';
import { COLORS } from '../styles/Theme';

export type BgVariant = 'welcome' | 'home' | 'game';  ;

interface Props {
  variant?:  BgVariant;
  children:  React.ReactNode;
  dimmed?:   boolean;
}

export default function MedievalBackground({
  variant = 'home',
  children,
  dimmed = true,
}: Props) {
  return (
    <ImageBackground
      source={variant === 'welcome' ? Images.bg_welcome : variant === 'game' ? Images.bg_game : Images.bg_home}
      style={styles.bg}
      resizeMode="cover"
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      {dimmed && <View style={styles.overlay} />}
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg:      { flex: 1, width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: COLORS.overlay },
});