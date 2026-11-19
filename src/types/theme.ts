import type { ComponentProps } from 'react';
import type { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import type { Ionicons } from '@expo/vector-icons';

export type IoniconName = ComponentProps<typeof Ionicons>['name'];

export type CategoryColorKey = 'warning' | 'info' | 'danger' | 'primary';

export interface VisualBadgeConfig {
  label: string;
  bg: string;
  text: string;
  border: string;
  iconColor: string;
  iconName: IoniconName;
}

export interface ShadowOptions {
  offsetY: number;
  blur: number;
  opacity: number;
}

export type NamedStyles<T> = {
  [P in keyof T]: ViewStyle | TextStyle | ImageStyle;
};

export interface AppTheme {
  isDark: boolean;
  background: string;
  surface: string;
  card: string;
  cardSubtle: string;
  inputBg: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  inverseText: string;
  border: string;
  cardBorder: string;
  divider: string;
  overlay: string;
  primary: string;
  primaryLight: string;
  primaryBorder: string;
  primaryDark: string;
  danger: string;
  dangerBg: string;
  dangerText: string;
  dangerBorder: string;
  warning: string;
  warningBg: string;
  warningText: string;
  warningBorder: string;
  info: string;
  infoBg: string;
  infoText: string;
  infoBorder: string;
  success: string;
  successBg: string;
  successText: string;
  pillBg: string;
  pillActiveBg: string;
  pillActiveText: string;
  tabBarBg: string;
  tabBarBorder: string;
  tabBarActive: string;
  tabBarInactive: string;
  secondaryButtonBg: string;
}

export type ThemeMode = 'system' | 'light' | 'dark';

export interface ThemeContextData {
  themeMode: ThemeMode;
  isDark: boolean;
  theme: AppTheme;
  setThemeMode: (mode: ThemeMode) => void;
}
