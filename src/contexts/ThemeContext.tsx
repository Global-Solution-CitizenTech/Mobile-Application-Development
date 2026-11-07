import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useColorScheme, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface AppTheme {
  isDark: boolean;
  background: string;
  surface: string;
  card: string;
  cardSubtle: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  divider: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  tabBarBg: string;
  tabBarBorder: string;
  tabBarActive: string;
  tabBarInactive: string;
}

export const lightTheme: AppTheme = {
  isDark: false,
  background: colors.background,
  surface: colors.surface,
  card: colors.surface,
  cardSubtle: colors.secondary[50],
  text: colors.secondary[900],
  textSecondary: colors.secondary[600],
  textMuted: colors.secondary[400],
  border: colors.secondary[100],
  divider: colors.divider,
  primary: colors.primary[600],
  primaryLight: colors.primary[50],
  primaryDark: colors.primary[700],
  tabBarBg: colors.surface,
  tabBarBorder: colors.border,
  tabBarActive: colors.primary[600],
  tabBarInactive: colors.secondary[400],
};

export const darkTheme: AppTheme = {
  isDark: true,
  background: '#0B1120',
  surface: '#1E293B',
  card: '#1E293B',
  cardSubtle: '#0F172A',
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  border: '#334155',
  divider: '#1E293B',
  primary: '#10B981',
  primaryLight: '#064E3B',
  primaryDark: '#34D399',
  tabBarBg: '#0F172A',
  tabBarBorder: '#1E293B',
  tabBarActive: '#10B981',
  tabBarInactive: '#64748B',
};

interface ThemeContextData {
  themeMode: ThemeMode;
  isDark: boolean;
  theme: AppTheme;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const THEME_STORAGE_KEY = '@zelafix:theme_mode';

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');

  useEffect(() => {
    async function carregarTemaSalvo() {
      try {
        const salvo = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (salvo === 'light' || salvo === 'dark' || salvo === 'system') {
          setThemeModeState(salvo);
        }
      } catch {
        // ignore
      }
    }
    carregarTemaSalvo();
  }, []);

  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      // ignore
    }
  }, []);

  const isDark = useMemo(() => {
    if (themeMode === 'system') {
      return systemColorScheme === 'dark';
    }
    return themeMode === 'dark';
  }, [themeMode, systemColorScheme]);

  const toggleTheme = useCallback(() => {
    setThemeMode(isDark ? 'light' : 'dark');
  }, [isDark, setThemeMode]);

  const activeTheme = useMemo(() => {
    return isDark ? darkTheme : lightTheme;
  }, [isDark]);

  const value = useMemo(
    () => ({
      themeMode,
      isDark,
      theme: activeTheme,
      toggleTheme,
      setThemeMode,
    }),
    [themeMode, isDark, activeTheme, toggleTheme, setThemeMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser utilizado dentro de um ThemeProvider');
  }
  return context;
}

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

export function useThemedStyles<T extends NamedStyles<T>>(
  factory: (theme: AppTheme) => T
): T {
  const { theme } = useTheme();
  return useMemo(() => factory(theme), [theme]);
}
