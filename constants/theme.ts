/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#FF5722'; // Laranja accent para modo escuro

export const Colors = {
  light: {
    text: '#11181C',
    textSecondary: '#6B7280',
    background: '#fff',
    backgroundCard: '#F9FAFB',
    backgroundCardLight: '#F3F4F6',
    tint: tintColorLight,
    accent: tintColorLight,
    accentGradientStart: '#0a7ea4',
    accentGradientEnd: '#0a7ea4',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    buttonPrimary: '#0a7ea4',
    buttonPrimaryText: '#fff',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    border: '#E5E7EB',
    purple: '#A855F7',
    blue: '#3B82F6',
    cyan: '#06B6D4',
    pink: '#EC4899',
    orange: '#F97316',
    green: '#10B981',
  },
  dark: {
    text: '#ECEDEE',
    textSecondary: '#9BA1A6',
    background: '#0A1628',
    backgroundCard: '#1A2942',
    backgroundCardLight: '#243B5A',
    tint: tintColorDark,
    accent: '#FF5722',
    accentGradientStart: '#FF6B3D',
    accentGradientEnd: '#FF4E2E',
    icon: '#9BA1A6',
    tabIconDefault: '#6B7280',
    tabIconSelected: '#FF5722',
    buttonPrimary: '#FF5722',
    buttonPrimaryText: '#fff',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    border: '#374151',
    purple: '#A855F7',
    blue: '#3B82F6',
    cyan: '#06B6D4',
    pink: '#EC4899',
    orange: '#FF5722',
    green: '#10B981',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
