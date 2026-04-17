import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal as RNModal } from 'react-native';
import { COLORS, FONTS, PANEL } from '../../styles/Theme';

interface Props {
  visible:   boolean;
  message:   string;
  onClose:   () => void;
}

export default function Modal({ visible, message, onClose }: Props) {
  return (
    <RNModal transparent visible={visible} animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.box}>
          <Text style={styles.title}>⚠ AVISO</Text>
          <Text style={styles.msg}>{message}</Text>
          <TouchableOpacity style={styles.btn} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.btnText}>CERRAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  box:      { ...PANEL, marginHorizontal: 40, minWidth: 280, alignItems: 'center' },
  title:    { color: COLORS.dado_rojo, fontSize: FONTS.sizes.lg, fontWeight: '700', letterSpacing: 2, marginBottom: 12 },
  msg:      { color: COLORS.text_light, fontSize: FONTS.sizes.md, textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  btn:      { backgroundColor: COLORS.scroll_bg, borderWidth: 2, borderColor: '#8a6020', borderRadius: 4, paddingVertical: 10, paddingHorizontal: 32 },
  btnText:  { color: COLORS.scroll_text, fontSize: FONTS.sizes.sm, fontWeight: '700', letterSpacing: 2 },
});