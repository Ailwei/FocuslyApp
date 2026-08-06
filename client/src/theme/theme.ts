export const colors = {
  // Backgrounds
  background: "#0B1220",
  backgroundDark: "#030613",

  // Cards
  cardDark: "#111827",
  cardMid: "#1F2937",
  cardLight: "#374151",

  // Navigation
  tabBar: "rgba(17,24,39,0.9)",

  // Text
  textPrimary: "#F8FAFC",
  textSecondary: "#CBD5E1",
  textMuted: "#94A3B8",

  // Brand
  accent: "#7C5CFF",
  accentLight: "#9A86FF",
  accentGreen: "#22C55E",
  gold: "#D4AF37",
  goldLight: "#F0DF9B",

  // Status
  warning: "#F59E0B",
  danger: "#EF4444",
  success: "#22C55E",

  // Base
  white: "#FFFFFF",
  black: "#000000",

  // Inputs
  inputBackground: "#1E293B",
  inputBorder: "#334155",
  border: "#334155",

  // Misc
  divider: "#233043",
  overlay: "rgba(2,6,23,0.7)",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const radius = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  pill: 999,
};

export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  display: 40,
};

export const fontWeights = {
  normal: '400',
  medium: '600',
  strong: '700',
  heavy: '800',
} as const;

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  button: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
};