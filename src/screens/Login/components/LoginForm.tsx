import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { colors, borderRadius, spacing, fontSize, fontWeight, shadows } from '../../../theme';

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
  onFillDemo: () => void;
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
  onFillDemo,
}) => {
  return (
    <View style={[styles.card, shadows.md]}>
      <Text style={styles.formTitle}>Acesse sua conta</Text>
      <Text style={styles.formDescription}>
        Colabore para transformar nossa cidade em um espaço mais limpo, seguro e sustentável.
      </Text>

      {error && (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle" size={18} color={colors.feedback.danger} />
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
        leftIcon={<Ionicons name="mail-outline" size={20} color={colors.secondary[400]} />}
      />

      <Input
        label="Senha"
        placeholder="Digite sua senha"
        value={senha}
        onChangeText={onSenhaChange}
        isPassword
        error={senhaError}
        leftIcon={<Ionicons name="lock-closed-outline" size={20} color={colors.secondary[400]} />}
      />

      <Button
        title="Entrar"
        variant="primary"
        size="lg"
        onPress={onSubmit}
        loading={isLoading}
        style={styles.loginButton}
      />

      <TouchableOpacity
        style={styles.demoButton}
        onPress={onFillDemo}
        activeOpacity={0.7}
      >
        <Ionicons name="flash-outline" size={16} color={colors.primary[700]} />
        <Text style={styles.demoButtonText}>Preencher Acesso Demo (Avaliador FIAP)</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  formTitle: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
    color: colors.secondary[900],
    marginBottom: spacing.xs,
  },
  formDescription: {
    fontSize: fontSize.bodySmall,
    color: colors.secondary[500],
    lineHeight: 18,
    marginBottom: spacing.lg,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.feedback.dangerLight,
    padding: spacing.sm + 2,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
  },
  errorBannerText: {
    fontSize: fontSize.bodySmall,
    color: colors.feedback.danger,
    flex: 1,
    fontWeight: fontWeight.medium,
  },
  loginButton: {
    marginTop: spacing.sm,
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  demoButtonText: {
    fontSize: fontSize.bodySmall,
    fontWeight: fontWeight.semibold,
    color: colors.primary[700],
  },
});
