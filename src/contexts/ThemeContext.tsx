import { createContext, use, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Appearance } from 'react-native';
import type { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '@/theme/colors';
import type { AppTheme, ThemeContextData } from '@/theme/types';

const lightTheme: AppTheme = {
  isDark: false,
  background: colors.background,
  surface: colors.surface,
  card: colors.surface,
  cardSubtle: colors.secondary[50],
  inputBg: colors.secondary[50],
  text: colors.secondary[900],
  textSecondary: colors.secondary[600],
  textMuted: colors.secondary[400],
  inverseText: '#FFFFFF',
  border: colors.border,
  cardBorder: '#EEF2F6',
  divider: colors.divider,
  overlay: colors.overlay,
  primary: colors.primary[600],
  primaryLight: colors.primary[50],
  primaryBorder: colors.primary[200],
  primaryDark: colors.primary[700],
  danger: colors.feedback.danger,
  dangerBg: colors.feedback.dangerLight,
  dangerText: '#B91C1C',
  dangerBorder: '#FECACA',
  warning: colors.feedback.warning,
  warningBg: colors.status.pendente.bg,
  warningText: '#B45309',
  warningBorder: '#FDE68A',
  info: colors.feedback.info,
  infoBg: colors.status.emAndamento.bg,
  infoText: '#1D4ED8',
  infoBorder: '#BFDBFE',
  success: colors.feedback.success,
  successBg: colors.status.resolvido.bg,
  successText: '#047857',
  pillBg: colors.secondary[100],
  pillActiveBg: colors.secondary[900],
  pillActiveText: '#FFFFFF',
  tabBarBg: colors.surface,
  tabBarBorder: colors.border,
  tabBarActive: colors.primary[600],
  tabBarInactive: colors.secondary[400],
  secondaryButtonBg: colors.secondary[800],
};

const darkTheme: AppTheme = {
  isDark: true,
  background: '#0B1120',
  surface: '#162032',
  card: '#162032',
  cardSubtle: '#0F172A',
  inputBg: '#0F172A',
  text: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textMuted: '#64748B',
  inverseText: '#FFFFFF',
  border: '#334155',
  cardBorder: '#1E293B',
  divider: '#1E293B',
  overlay: 'rgba(2, 6, 23, 0.76)',
  primary: '#10B981',
  primaryLight: '#064E3B',
  primaryBorder: '#065F46',
  primaryDark: '#34D399',
  danger: '#F87171',
  dangerBg: '#450A0A',
  dangerText: '#FCA5A5',
  dangerBorder: '#7F1D1D',
  warning: '#FBBF24',
  warningBg: '#451A03',
  warningText: '#FCD34D',
  warningBorder: '#78350F',
  info: '#60A5FA',
  infoBg: '#172554',
  infoText: '#93C5FD',
  infoBorder: '#1E3A8A',
  success: '#34D399',
  successBg: '#022C22',
  successText: '#6EE7B7',
  pillBg: '#0F172A',
  pillActiveBg: '#10B981',
  pillActiveText: '#FFFFFF',
  tabBarBg: '#0F172A',
  tabBarBorder: '#1E293B',
  tabBarActive: '#10B981',
  tabBarInactive: '#64748B',
  secondaryButtonBg: '#334155',
};

const THEME_STORAGE_KEY = '@zelafix:theme_mode';

const ThemeContext = createContext<ThemeContextData | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(() => Appearance.getColorScheme() === 'dark');

  useEffect(() => {
    let active = true;
    async function carregarTemaSalvo() {
      try {
        const salvo = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (!active) return;
        if (salvo === 'dark' || salvo === 'light') {
          setIsDark(salvo === 'dark');
        }
      } catch {
        // Preferência local indisponível: mantém o tema do sistema.
      }
    }
    void carregarTemaSalvo();
    return () => {
      active = false;
    };
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    void AsyncStorage.setItem(THEME_STORAGE_KEY, nextDark ? 'dark' : 'light').catch(() => undefined);
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDark, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextData {
  const context = use(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser utilizado dentro de um ThemeProvider');
  }
  return context;
}

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

export function useThemedStyles<T extends NamedStyles<T>>(factory: (theme: AppTheme) => T): T {
  const { theme } = useTheme();
  return factory(theme);
}
