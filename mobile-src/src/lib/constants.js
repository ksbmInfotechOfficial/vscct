// API Configuration
export const API_URL = 'http://192.168.31.93:5001/api';

// Premium 2026 Color Palette - Inspired by Cred/Paytm
export const COLORS = {
  // Primary Colors
  primary: '#FF6B00',
  primaryLight: '#FF8A3D',
  primaryDark: '#E55A00',
  
  // Accent Colors
  accent: '#FFB347',
  accentLight: '#FFD699',
  
  // Gradients
  gradientStart: '#FF6B00',
  gradientEnd: '#FF8A3D',
  gradientGold: '#FFD700',
  
  // Backgrounds
  background: '#FAFAFA',
  surface: '#FFFFFF',
  surfaceAlt: '#F5F5F7',
  surfaceDark: '#1A1A2E',
  
  // Text Colors
  textPrimary: '#1A1A2E',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textLight: '#D1D5DB',
  textOnPrimary: '#FFFFFF',
  
  // Status Colors
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  info: '#3B82F6',
  infoLight: '#DBEAFE',
  
  // UI Colors
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  divider: '#E5E7EB',
  
  // Common
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  
  // Shadows
  shadowLight: 'rgba(0, 0, 0, 0.05)',
  shadowMedium: 'rgba(0, 0, 0, 0.1)',
  shadowDark: 'rgba(0, 0, 0, 0.15)',
  shadowPrimary: 'rgba(255, 107, 0, 0.3)',
};

// Typography
export const FONTS = {
  // Headers
  h1: { fontSize: 32, fontWeight: '700', lineHeight: 40 },
  h2: { fontSize: 24, fontWeight: '700', lineHeight: 32 },
  h3: { fontSize: 20, fontWeight: '600', lineHeight: 28 },
  h4: { fontSize: 18, fontWeight: '600', lineHeight: 24 },
  
  // Body
  body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  bodyMedium: { fontSize: 16, fontWeight: '500', lineHeight: 24 },
  bodySemiBold: { fontSize: 16, fontWeight: '600', lineHeight: 24 },
  
  // Small
  small: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  smallMedium: { fontSize: 14, fontWeight: '500', lineHeight: 20 },
  
  // Caption
  caption: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
  captionMedium: { fontSize: 12, fontWeight: '500', lineHeight: 16 },
  
  // Tiny
  tiny: { fontSize: 10, fontWeight: '400', lineHeight: 14 },
};

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border Radius
export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

// Animation Durations
export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500,
};

// Shadows
export const SHADOWS = {
  sm: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  primary: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
};
