import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import type { BoundFieldProps, StringFieldKeys } from '@/hooks/useZodForm';
import { borderRadius, fontSize, fontWeight, shadows, spacing } from '@/theme';
import type { AppTheme } from '@/theme/types';
import type { LoginFormData } from '@/utils/schemas';

interface LoginFormProps {
  field: <K extends StringFieldKeys<LoginFormData>>(name: K) => BoundFieldProps;
  isLoading: boolean;
  onSubmit: () => void;
  onGoToRegister: () => void;
}

export const LoginForm = ({
  field,
  isLoading,
  onSubmit,
  onGoToRegister,
}: LoginFormProps) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={[styles.card, shadows.md]}>
      <Text style={styles.formTitle}>Acesse sua conta</Text>
      <Text style={styles.formDescription}>
        Colabore com sua comunidade e acompanhe cada ocorrência urbana em tempo real.
      </Text>

      <View style={styles.fieldsGap}>
        <Input
          label="E-mail"
          placeholder="exemplo@zelafix.com.br"
          {...field('email')}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          leftIcon={<Ionicons name="mail-outline" size={18} color={theme.textMuted} />}
        />

        <Input
          label="Senha"
          placeholder="Digite sua senha"
          {...field('senha')}
          isPassword
          leftIcon={<Ionicons name="lock-closed-outline" size={18} color={theme.textMuted} />}
        />
      </View>

      <Button
        title={isLoading ? 'Entrando…' : 'Entrar na Plataforma'}
        variant="primary"
        size="lg"
        onPress={onSubmit}
        loading={isLoading}
        style={styles.loginButton}
      />

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Ainda não tem conta?</Text>
        <TouchableOpacity onPress={onGoToRegister} activeOpacity={0.75} hitSlop={6}>
          <Text style={styles.footerLink}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.card,
      borderRadius: borderRadius.xl,
      padding: spacing.lg + 4,
      borderWidth: 1,
      borderColor: theme.cardBorder,
    },
    formTitle: {
      fontSize: fontSize.title,
      fontWeight: fontWeight.extrabold,
      color: theme.text,
      marginBottom: 6,
    },
    formDescription: {
      fontSize: fontSize.bodySmall,
      color: theme.textSecondary,
      lineHeight: 19,
      marginBottom: spacing.lg,
    },
    fieldsGap: {
      gap: spacing.xs,
    },
    loginButton: {
      marginTop: spacing.sm,
    },
    footerRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: spacing.xs,
      marginTop: spacing.lg,
      paddingTop: spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.divider,
    },
    footerText: {
      fontSize: fontSize.bodySmall,
      color: theme.textSecondary,
    },
    footerLink: {
      fontSize: fontSize.bodySmall,
      fontWeight: fontWeight.bold,
      color: theme.primary,
    },
  });
