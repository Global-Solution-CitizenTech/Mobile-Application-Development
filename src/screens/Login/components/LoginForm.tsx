import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme, useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { borderRadius, spacing, fontSize, fontWeight, shadows } from '@/theme';

interface LoginFormProps {
  email: string;
  senha: string;
  emailError: string | null;
  senhaError: string | null;
  error: string | null;
  isLoading: boolean;
  onEmailChange: (text: string) => void;
  onSenhaChange: (text: string) => void;
  onSubmit: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  email,
  senha,
  emailError,
  senhaError,
  error,
  isLoading,
  onEmailChange,
  onSenhaChange,
  onSubmit,
}) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={[styles.card, shadows.md]}>
      <Text style={styles.formTitle}>Acesse sua conta</Text>
      <Text style={styles.formDescription}>
        Colabore para transformar nossa cidade em um espaço mais limpo, seguro e sustentável.
      </Text>

      {error && (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle" size={18} color={theme.danger} />
          <Text style={styles.errorBannerText}>{error}</Text>
        </View>
      )}

      <Input
        label="E-mail"
        placeholder="exemplo@zelafix.com.br"
        value={email}
        onChangeText={onEmailChange}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        error={emailError}
        leftIcon={<Ionicons name="mail-outline" size={20} color={theme.textMuted} />}
      />

      <Input
        label="Senha"
        placeholder="Digite sua senha"
        value={senha}
        onChangeText={onSenhaChange}
        isPassword
        error={senhaError}
        leftIcon={<Ionicons name="lock-closed-outline" size={20} color={theme.textMuted} />}
      />

      <Button
        title="Entrar"
        variant="primary"
        size="lg"
        onPress={onSubmit}
        loading={isLoading}
        style={styles.loginButton}
      />
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.card,
      borderRadius: borderRadius.lg,
      padding: spacing.xl,
      borderWidth: 1,
      borderColor: theme.cardBorder,
    },
    formTitle: {
      fontSize: fontSize.title,
      fontWeight: fontWeight.bold,
      color: theme.text,
      marginBottom: spacing.xs,
    },
    formDescription: {
      fontSize: fontSize.bodySmall,
      color: theme.textSecondary,
      lineHeight: 18,
      marginBottom: spacing.lg,
    },
    errorBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: theme.dangerBg,
      padding: spacing.sm + 2,
      borderRadius: borderRadius.sm,
      marginBottom: spacing.md,
    },
    errorBannerText: {
      fontSize: fontSize.bodySmall,
      color: theme.dangerText,
      flex: 1,
      fontWeight: fontWeight.medium,
    },
    loginButton: {
      marginTop: spacing.sm,
    },
  });
