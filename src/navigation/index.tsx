import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { AuthNavigator } from './AuthNavigator';
import { AppNavigator } from './AppNavigator';
import { colors, fontSize, fontWeight } from '../theme';

export const NavigationRouter: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Tela de Inicialização / Splash enquanto recupera a sessão do storage
  if (isLoading) {
    return (
      <View style={styles.splashContainer}>
        <View style={styles.logoBadge}>
          <Ionicons name="leaf" size={48} color={colors.surface} />
        </View>
        <Text style={styles.splashTitle}>CitizenTech</Text>
        <Text style={styles.splashSubtitle}>Zeladoria Urbana Colaborativa</Text>
        <ActivityIndicator
          size="small"
          color={colors.primary[600]}
          style={styles.spinner}
        />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  splashTitle: {
    fontSize: fontSize.display,
    fontWeight: fontWeight.extrabold,
    color: colors.secondary[900],
  },
  splashSubtitle: {
    fontSize: fontSize.bodySmall,
    color: colors.secondary[500],
    marginTop: 4,
  },
  spinner: {
    marginTop: 24,
  },
});

