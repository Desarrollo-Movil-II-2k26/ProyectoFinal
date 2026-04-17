import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, FONTS } from '../../styles/Theme';

type Variant = 'primary' | 'secondary' | 'danger';

interface Props {
  label:     string;
  onPress:   () => void;
  variant?:  Variant;
  disabled?: boolean;
  loading?:  boolean;
  style?:    ViewStyle;
}

const CONFIG: Record<Variant, { bg: string; border: string; text: string }> = {
  primary:   { bg: COLORS.scroll_bg,          border: '#8a6020', text: COLORS.scroll_text },
  secondary: { bg: 'rgba(30,16,8,0.9)',        border: COLORS.gold_dark, text: COLORS.gold },
  danger:    { bg: 'rgba(100,20,20,0.9)',       border: '#8a2020', text: '#ffaaaa' },
};

export default function Button({
  label, onPress, variant = 'primary',
  disabled = false, loading = false, style,
}: Props) {
  const c = CONFIG[variant];
  return (
    <TouchableOpacity
      style={[
        styles.btn,
        { backgroundColor: c.bg, borderColor: c.border },
        (disabled || loading) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading
        ? <ActivityIndicator color={COLORS.gold} />
        : <Text style={[styles.text, { color: c.text }]}>{label}</Text>
      }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 48,
    borderWidth: 2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  text:     { fontSize: FONTS.sizes.md, fontWeight: '700', letterSpacing: 2 },
  disabled: { opacity: 0.5 },
});