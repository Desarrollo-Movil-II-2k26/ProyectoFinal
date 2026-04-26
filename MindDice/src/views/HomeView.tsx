import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, Image, ImageBackground, Modal
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
  onChangeName?: (nuevoNombre: string) => void;
}

export default function HomeView({ playerName, onCrearSala, onUnirse, onVerReglas, onSalir, onChangeName }: Props) {
  const [codigo,        setCodigo]        = useState('');
  const [modalVisible,  setModalVisible]  = useState(false);
  const [nuevoNombre,   setNuevoNombre]   = useState(playerName);

  const handleGuardar = () => {
    if (!nuevoNombre.trim()) return;
    onChangeName?.(nuevoNombre.trim());
    setModalVisible(false);
  };

  return (
    <MedievalBackground variant="home">
      <SafeAreaView style={[G.safe, { paddingBottom: 72 }]}>
        <View style={{ marginTop: 40 }}>
          <Header title={`¡Bienvenido, ${playerName}!`} />
        </View>

        {/* Ícono de perfil — abre modal */}
        <TouchableOpacity style={styles.cornerTL} onPress={() => {
          setNuevoNombre(playerName);
          setModalVisible(true);
        }}>
          <Image source={require('../assets/images/bg_profile.png')} style={{ width: 80, height: 80 }} />
        </TouchableOpacity>

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

      {/* Modal cambiar nombre */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>

            {/* Esquinas decorativas */}
            <View style={[styles.corner, styles.cornerTLm]} />
            <View style={[styles.corner, styles.cornerTRm]} />
            <View style={[styles.corner, styles.cornerBLm]} />
            <View style={[styles.corner, styles.cornerBRm]} />

            <Text style={styles.modalTitle}>⚔ RECLUSO</Text>

            <View style={styles.modalDivider} />

            <Text style={styles.modalLabel}>NOMBRE DE USUARIO</Text>

            <TextInput
              style={styles.modalInput}
              value={nuevoNombre}
              onChangeText={setNuevoNombre}
              placeholder="Ingresa tu nombre..."
              placeholderTextColor="#a09060"
              autoCapitalize="words"
              maxLength={20}
              autoFocus
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelBtnText}>CANCELAR</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.saveBtn, !nuevoNombre.trim() && styles.saveBtnDisabled]}
                onPress={handleGuardar}
                disabled={!nuevoNombre.trim()}
                activeOpacity={0.8}
              >
                <Text style={styles.saveBtnText}>GUARDAR</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

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
  joinBtnText:  { color: '#1a1208', fontSize: FONTS.sizes.sm, fontWeight: '700', letterSpacing: 1 },
  navbar:       { position: 'absolute', bottom: -10, left: -10, right: -10, height: 90, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  navItem:      { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navIcon:      { fontSize: 24 },
  navLabel:     { fontSize: FONTS.sizes.xs, color: COLORS.gold_muted, letterSpacing: 1, marginTop: 4 },
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
  overlayTop:    { position: 'absolute', top: 137 },
  overlayBottom: { position: 'absolute', bottom: 56 },
  createBtnImage: {
    width: '100%', height: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 37,
  },
  createBtnText: {
    color: '#1a1208', fontSize: FONTS.sizes.md, fontWeight: '700', letterSpacing: 2,
  },

  // ── Modal cambiar nombre ─────────────────────────────────
  modalBackdrop: {
    flex:            1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent:  'center',
    paddingHorizontal: 32,
  },
  modalCard: {
    backgroundColor:   'rgba(14,10,4,0.98)',
    borderWidth:       2,
    borderColor:       COLORS.gold,
    borderRadius:      6,
    paddingVertical:   28,
    paddingHorizontal: 24,
    gap:               14,
    alignItems:        'center',
  },
  corner: {
    position:    'absolute',
    width:       16,
    height:      16,
    borderColor: COLORS.gold,
    borderWidth: 2,
  },
  cornerTLm: { top: 6, left: 6,   borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 3 },
  cornerTRm: { top: 6, right: 6,  borderLeftWidth: 0,  borderBottomWidth: 0, borderTopRightRadius: 3 },
  cornerBLm: { bottom: 6, left: 6,  borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 3 },
  cornerBRm: { bottom: 6, right: 6, borderLeftWidth: 0,  borderTopWidth: 0, borderBottomRightRadius: 3 },
  modalTitle: {
    color:         COLORS.gold,
    fontSize:      FONTS.sizes.lg,
    fontWeight:    '700',
    letterSpacing: 4,
  },
  modalDivider: {
    width:           '80%',
    height:          1,
    backgroundColor: 'rgba(201,152,58,0.4)',
  },
  modalLabel: {
    color:         COLORS.gold_muted,
    fontSize:      FONTS.sizes.xs,
    letterSpacing: 3,
    alignSelf:     'flex-start',
  },
  modalInput: {
    width:           '100%',
    backgroundColor: COLORS.input_bg,
    borderRadius:    3,
    borderWidth:     2,
    borderColor:     '#c4b07a',
    height:          48,
    paddingHorizontal: 12,
    fontSize:        FONTS.sizes.lg,
    color:           COLORS.input_text,
    fontWeight:      '700',
    letterSpacing:   2,
  },
  modalButtons: {
    flexDirection: 'row',
    gap:           12,
    width:         '100%',
    marginTop:     4,
  },
  cancelBtn: {
    flex:            1,
    height:          44,
    borderWidth:     2,
    borderColor:     'rgba(201,152,58,0.4)',
    borderRadius:    4,
    alignItems:      'center',
    justifyContent:  'center',
    backgroundColor: 'transparent',
  },
  cancelBtnText: {
    color:         COLORS.text_muted,
    fontSize:      FONTS.sizes.sm,
    fontWeight:    '700',
    letterSpacing: 1,
  },
  saveBtn: {
    flex:            1,
    height:          44,
    borderWidth:     2,
    borderColor:     COLORS.gold,
    borderRadius:    4,
    alignItems:      'center',
    justifyContent:  'center',
    backgroundColor: 'rgba(201,152,58,0.15)',
  },
  saveBtnDisabled: { opacity: 0.4 },
  saveBtnText: {
    color:         COLORS.gold,
    fontSize:      FONTS.sizes.sm,
    fontWeight:    '700',
    letterSpacing: 1,
  },
});