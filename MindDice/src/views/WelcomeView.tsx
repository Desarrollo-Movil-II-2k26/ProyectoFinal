import React, { useState } from 'react';
import {
  View, Text, TextInput,
  StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ImageBackground,
} from 'react-native';
import MedievalBackground from '../layout/MedievalBackground';
import Button from '../components/common/Button';
import { COLORS, FONTS, PANEL } from '../styles/Theme';
import { G } from '../styles/GlobalStyles';


interface Props {
  onEnter: (playerName: string) => void;
}

export default function WelcomeView({ onEnter }: Props) {
  const [nombre, setNombre] = useState('');
  const [error,  setError]  = useState(false);

  const handleEntrar = () => {
    if (!nombre.trim()) { setError(true); return; }
    onEnter(nombre.trim());
  };

  return (
    <MedievalBackground variant="welcome">
      <SafeAreaView style={G.safe}>
        <KeyboardAvoidingView
          style={[G.flex, { justifyContent: 'center' }]}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Título */}
          <Text style={tituloStyle.titulo}>MIND DICE</Text>

          {/* Panel central */}
          <View style={styles.panel}>
            <View style={[G.rivet, { top: 7, left: 7 }]} />
            <View style={[G.rivet, { top: 7, right: 7 }]} />
            <View style={[G.rivet, { bottom: 7, left: 7 }]} />
            <View style={[G.rivet, { bottom: 7, right: 7 }]} />

            <Text style={styles.bienvenido}>BIENVENIDO, RECLUSO!</Text>

            <Text style={styles.label}>NOMBRE DE USUARIO</Text>

            <TextInput
              style={[styles.input, error && styles.inputError]}
              value={nombre}
              onChangeText={t => { setNombre(t); setError(false); }}
              placeholder="Ingresa tu nombre..."
              placeholderTextColor="#a09060"
              autoCapitalize="words"
              maxLength={20}
            />
            {error && <Text style={styles.errorText}>Ingresa tu nombre para continuar</Text>}

            <Button label="ENTRAR AL JUEGO" onPress={handleEntrar} style={styles.btn} />
          </View>

          {/* Footer */}
          <ImageBackground
          source={require('../assets/images/bg_footer.png')}
          style={footerStyles.footer}
          resizeMode="cover"
>         
        <Text style={footerStyles.footerText}>
         PROYECTO MÓVILES  |  VERSIÓN BETA  |  MIGAJEROS INC.
        </Text>
        </ImageBackground>

        </KeyboardAvoidingView>
      </SafeAreaView>
    </MedievalBackground>
  );
}

const tituloStyle = StyleSheet.create({
  titulo: {
     marginTop: -100, marginBottom: 65,
    textAlign: 'center',
    fontSize: FONTS.sizes.xxl, 
    fontFamily: FONTS.medieval,
    color: COLORS.gold, 
    letterSpacing: 6, 
    fontWeight: '700',
    textShadowColor: '#000', 
    textShadowOffset: { width: 2, height: 2 }, 
    textShadowRadius: 8,
  },
});

const footerStyles = StyleSheet.create({
  footer: {
    position: 'absolute', bottom: -22, left: 0, right: 0,
    height: 50,
    alignItems: 'center',    
    justifyContent: 'center', 
  },
  footerText: {              
    fontSize: 8,
    letterSpacing: 0.8,
    color: COLORS.gold,
    textAlign: 'center',     
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});

const styles = StyleSheet.create({
  panel:      { ...PANEL, marginTop: 28, marginHorizontal: 32, alignSelf: 'center', marginBottom: 10, marginLeft: 40 },
  bienvenido: { textAlign: 'center', fontSize: FONTS.sizes.md, color: COLORS.gold, letterSpacing: 2, fontWeight: '700', marginBottom: 20 },
  label:      { fontSize: FONTS.sizes.xs, color: COLORS.gold_muted, letterSpacing: 2, marginBottom: 8 },
  input: {
    backgroundColor: COLORS.input_bg, borderRadius: 3,
    borderWidth: 2, borderColor: '#c4b07a',
    height: 44, paddingHorizontal: 12,
    fontSize: FONTS.sizes.md, color: COLORS.input_text, marginBottom: 8,
  },
  inputError: { borderColor: COLORS.danger },
  errorText:  { fontSize: FONTS.sizes.xs, color: '#ff6060', marginBottom: 10 },
  btn:        { marginTop: 8 },
});
