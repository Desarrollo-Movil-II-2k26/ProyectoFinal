export const COLORS = {
  bg_dark: '#0d0a06',
  bg_panel: '#1e1408',
  gold: '#c9983a',
  gold_muted: '#a08848',
  gold_dark: '#7a5a20',
  border_panel: '#4a3818',
  input_bg: '#e8dfc8',
  input_text: '#3a2a0a',
  dado_azul: '#4488ff',
  dado_rojo: '#ff4444',
  dado_blanco: '#f0ead8',
  dado_border: '#8a7a60',
  scroll_bg: '#d4b06a',
  scroll_text: '#2a1a04',
  rivet: '#5a4020',
  rivet_border: '#2a1a08',
  text_light: '#f0e8d0',
  text_muted: '#a09070',
  success: '#4a9a4a',
  danger: '#9a3a3a',
  overlay: 'rgba(0,0,0,0.22)',
} as const;

export const FONTS = {
  medieval: 'serif' as const,
  sizes: {
    xs: 9,
    sm: 11,
    md: 13,
    lg: 16,
    xl: 22,
    xxl: 32,
  },
} as const;

export const PANEL = {
  backgroundColor: 'rgba(30, 20, 8, 0.93)',
  borderWidth: 3,
  borderColor: '#4a3818',
  borderRadius: 4,
  padding: 20,
} as const;