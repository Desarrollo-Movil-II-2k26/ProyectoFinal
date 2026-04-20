import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Image, ImageBackground
} from 'react-native';
import MedievalBackground from '../layout/MedievalBackground';
import Header from '../layout/Header';
import Card from '../components/common/Card';
import { COLORS, FONTS } from '../styles/Theme';
import { G } from '../styles/GlobalStyles';

interface Props {
  playerName:  string;
  onCrearSala: () => void;
  onUnirse:    (codigo: string) => void;
  onVerReglas: () => void;
  onSalir:     () => void;
}

export default function HomeView({ playerName, onCrearSala, onUnirse, onVerReglas, onSalir }: Props) {
  const [codigo, setCodigo] = useState('');

  return (
    <MedievalBackground variant="home">
      <SafeAreaView style={[G.safe, { paddingBottom: 72 }]}>

        <View style={{ marginTop: 40 }}>
          <Header title={`¡Bienvenido, ${playerName}!`} />
        </View>
      

        <View style={styles.cornerTL}>
          <Image source={require('../assets/images/bg_profile.png')} style={{ width: 80, height: 80 }} />
        </View>

        {/* Ícono de perfil — decorativo, sin funcionalidad */}
        <View style={styles.cornerTL}>
          <Image source={require('../assets/images/bg_profile.png')} style={{ width: 80, height: 80 }} />
        </View>

        <TouchableOpacity style={styles.cornerTR} onPress={onSalir}>
          <Image source={require('../assets/images/bg_exit.png')} style={{ width: 80, height: 80 }} />
        </TouchableOpacity>

        {/* Panel dados */}
        <View style={styles.diceCard}>
          <View style={styles.imageContainer}>
            <Image
              source={require('../assets/images/bg_playmode.png')}
              style={styles.diceImage}
              resizeMode="contain"
            />
            <Text style={[styles.panelTitle, styles.overlayTop]}>
              PARTIDA DE DADOS
            </Text>
            <Text style={[styles.panelTitle, styles.overlayBottom]}>
              MODO CLÁSICO
            </Text>
          </View>
        </View>

        {/* Botón crear sala */}
        <TouchableOpacity style={styles.createBtn} onPress={onCrearSala} activeOpacity={0.85}>
          <ImageBackground
            source={require('../assets/images/bg_createroom.png')}
            style={styles.createBtnImage}
            resizeMode="stretch"
          >
            <Text style={styles.createBtnText}>CREAR SALA</Text>
          </ImageBackground>
        </TouchableOpacity>

        {/* Unirse a sala */}
        <Card style={styles.joinCard}>
          <Text style={styles.joinLabel}>UNIRSE CON CÓDIGO</Text>
          <View style={styles.joinRow}>
            <TextInput
              style={styles.joinInput}
              value={codigo}
              onChangeText={t => setCodigo(t.toUpperCase())}
              placeholder="XKQP"
              placeholderTextColor="#a09060"
              maxLength={4}
              autoCapitalize="characters"
            />
            <TouchableOpacity
              style={styles.joinBtn}
              onPress={() => onUnirse(codigo)}
              activeOpacity={0.8}
            >
              <Text style={styles.joinBtnText}>ENTRAR</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Navbar inferior */}
        <ImageBackground
          source={require('../assets/images/bg_navigationhome.png')}
          style={styles.navbar}
          resizeMode="stretch"
        >
          <NavBtn icon="🏠" label="HOME"   onPress={() => {}} />
          <NavBtn icon="📖" label="REGLAS" onPress={onVerReglas} />
        </ImageBackground>

      </SafeAreaView>
    </MedievalBackground>
  );
}

function NavBtn({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.navItem} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.navIcon}>{icon}</Text>
      <Text style={styles.navLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  diceImage:  { width: 300, height: 400 },
  panelTitle: { color: COLORS.gold, fontSize: FONTS.sizes.lg, letterSpacing: 3, fontWeight: '700', marginBottom: 14, marginVertical: 8, textAlign: 'center' },
  createBtn:  { marginBottom: 12, marginTop: -30, alignSelf: 'flex-end', marginRight: 60, width: '60%', aspectRatio: 3 },
  joinCard:   { paddingVertical: 14, marginHorizontal: 16, marginTop: 12 },
  joinLabel:  { color: COLORS.gold_muted, fontSize: FONTS.sizes.xs, letterSpacing: 2, marginBottom: 8 },
  joinRow:    { flexDirection: 'row', gap: 10, alignItems: 'center' },
  joinInput: {
    flex: 1, backgroundColor: COLORS.input_bg, borderRadius: 3,
    borderWidth: 2, borderColor: '#c4b07a', height: 48,
    paddingHorizontal: 12, fontSize: FONTS.sizes.lg,
    color: COLORS.input_text, fontWeight: '700', letterSpacing: 6, textAlign: 'center',
  },
  joinBtn: {
    width: 100, height: 48, backgroundColor: COLORS.gold,
    borderRadius: 3, alignItems: 'center', justifyContent: 'center',
  },
  joinBtnText: {
    color: '#1a1208', fontSize: FONTS.sizes.sm, fontWeight: '700', letterSpacing: 1,
  },
  navbar:   { position: 'absolute', bottom: -10, left: -10, right: -10, height: 90, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  navItem:  { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navIcon:  { fontSize: 24 },
  navLabel: { fontSize: FONTS.sizes.xs, color: COLORS.gold_muted, letterSpacing: 1, marginTop: 4 },
  cornerTL: {
    position: 'absolute', top: 20, left: 5,
    width: 80, height: 80,
  },
  cornerTR: {
    position: 'absolute', top: 20, right: 5,
    width: 80, height: 80,
    transform: [{ scaleX: -1 }],
  },
  diceCard: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
    marginHorizontal: 16,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  overlayTop: {
    position: 'absolute',
    top: 137,
  },
  overlayBottom: {
    position: 'absolute',
    bottom: 56,
  },
  createBtnImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 37,
  },
  createBtnText: {
    color: '#1a1208',
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    letterSpacing: 2,
  },
});