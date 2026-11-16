import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { AppNavigator } from '@/navigation/AppNavigator';
import { AuthNavigator } from '@/navigation/AuthNavigator';
import { fontSize, fontWeight } from '@/theme/typography';
import type { AppTheme } from '@/types/theme';

export const NavigationRouter = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  const base = theme.isDark ? DarkTheme : DefaultTheme;
  const navigationTheme = {
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

  if (isLoading) {
    return (
      <View style={styles.splashContainer}>
        <View style={styles.logoBadge}>
          <Image
            source={require('../../assets/logo-mark.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
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
    logoImage: { width: 36, height: 56 },
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
