import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Image
} from 'react-native';
import MedievalBackground from '../layout/MedievalBackground';
import Header from '../layout/Header';
import Button from '../components/common/Button';
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
        
        <Header title={`¡Bienvenido, ${playerName}!`} />

    <TouchableOpacity style={styles.cornerTL} onPress={() => console.log('perfil')}>
    <Image source={require('../assets/images/bg_profile.png')} style={{ width: 80, height: 80 }} />
    </TouchableOpacity>

    <TouchableOpacity style={styles.cornerTR} onPress={onSalir}>
      <Image source={require('../assets/images/bg_exit.png')} style={{ width: 80, height: 80 }} />
    </TouchableOpacity>

        {/* Panel dados */}
        <View style={styles.diceCard}>
          <Text style={styles.panelTitle}>PARTIDA DE DADOS</Text>
          <View style={styles.diceBox}>
            <Image source={require('../assets/images/bg_playmode.png')} style={{ width: 130, height: 220 }} />
          </View>
          <Text style={styles.panelTitle}>MODO CLÁSICO</Text>
        </View>   

        {/* Botón crear sala */}
        <Button label="CREAR SALA" onPress={onCrearSala} style={styles.createBtn} />

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
        <View style={styles.navbar}>
          <NavBtn icon="🏠" label="HOME"   onPress={() => {}} />
          <NavBtn icon="📖" label="REGLAS" onPress={onVerReglas} />
        </View>

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
  diceCard:   { alignItems: 'center', marginTop: 200, marginHorizontal: 16 },
  panelTitle: { color: COLORS.gold, fontSize: FONTS.sizes.lg, letterSpacing: 3, fontWeight: '700', marginBottom: 14 },
  diceBox:    { backgroundColor: 'rgba(10,6,2,0.8)', borderWidth: 2, borderColor: '#6a5028', borderRadius: 4, padding: 12, width: '100%', alignItems: 'center', marginBottom: 12 },
  diceRow:    { fontSize: 22, letterSpacing: 5, marginVertical: 2 },
  modoText:   { color: COLORS.gold_muted, fontSize: FONTS.sizes.md, letterSpacing: 3, fontWeight: '700' },
  createBtn:  { marginHorizontal: 16, marginBottom: 12, marginTop: 30 },
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
  navbar:   { position: 'absolute', bottom: 0, left: 0, right: 0, height: 72, backgroundColor: 'rgba(18,12,4,0.97)', borderTopWidth: 2, borderTopColor: '#4a3818', flexDirection: 'row' },
  navItem:  { flex: 1, alignItems: 'center', justifyContent: 'center', borderRightWidth: 1, borderRightColor: '#3a2a10' },
  navIcon:  { fontSize: 24 },
  navLabel: { fontSize: FONTS.sizes.xs, color: COLORS.gold_muted, letterSpacing: 1, marginTop: 4 },

  cornerTL: {
  position: 'absolute', top: 0, left: 5,
  width: 80, height: 80,
},
cornerTR: {
  position: 'absolute', top: 0, right: 5,
  width: 80, height: 80,
  transform: [{ scaleX: -1 }],  
},

});