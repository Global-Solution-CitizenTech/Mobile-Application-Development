import React, { useMemo } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { AppTheme, useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { AuthNavigator } from '@/navigation/AuthNavigator';
import { AppNavigator } from '@/navigation/AppNavigator';
import { fontSize, fontWeight } from '@/theme';

export const NavigationRouter: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  const navigationTheme = useMemo(() => {
    const base = theme.isDark ? DarkTheme : DefaultTheme;
    return {
      ...base,
      dark: theme.isDark,
      colors: {
        ...base.colors,
        primary: theme.primary,
        background: theme.background,
        card: theme.surface,
        text: theme.text,
        border: theme.border,
        notification: theme.primary,
      },
    };
  }, [theme]);

  if (isLoading) {
    return (
      <View style={styles.splashContainer}>
        <View style={styles.logoBadge}>
          <Ionicons name="leaf" size={48} color={theme.inverseText} />
        </View>
        <Text style={styles.splashTitle}>ZelaFix</Text>
        <Text style={styles.splashSubtitle}>Zeladoria Urbana Colaborativa</Text>
        <ActivityIndicator size="small" color={theme.primary} style={styles.spinner} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    splashContainer: {
      flex: 1,
      backgroundColor: theme.surface,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoBadge: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    splashTitle: {
      fontSize: fontSize.display,
      fontWeight: fontWeight.extrabold,
      color: theme.text,
    },
    splashSubtitle: {
      fontSize: fontSize.bodySmall,
      color: theme.textSecondary,
      marginTop: 4,
    },
    spinner: {
      marginTop: 24,
    },
  });
