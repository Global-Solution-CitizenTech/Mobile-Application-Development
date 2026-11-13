import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

export type ThemeMode = 'light' | 'dark' | 'system';

export type IoniconName = ComponentProps<typeof Ionicons>['name'];

export interface VisualBadgeConfig {
  label: string;
  bg: string;
  text: string;
  border: string;
  iconColor: string;
  iconName: IoniconName;
}

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

export interface ThemeContextData {
  isDark: boolean;
  theme: AppTheme;
  toggleTheme: () => void;
}
