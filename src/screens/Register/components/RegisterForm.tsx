import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import type { BoundFieldProps, StringFieldKeys } from '@/hooks/useZodForm';
import { borderRadius, fontSize, fontWeight, shadows, spacing } from '@/theme';
import type { AppTheme } from '@/theme/types';
import { maskCepInput, maskPhoneInput } from '@/utils/formatters';
import type { RegisterFormData } from '@/utils/schemas';

interface RegisterFormProps {
  field: <K extends StringFieldKeys<RegisterFormData>>(name: K) => BoundFieldProps;
  onSubmit: () => void;
  onGoToLogin: () => void;
  submitting: boolean;
}

export const RegisterForm = ({
  field,
  onSubmit,
  onGoToLogin,
  submitting,
}: RegisterFormProps) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={[styles.card, shadows.md]}>
      <Text style={styles.sectionEyebrow}>Dados Pessoais</Text>

      <Input
        label="Nome Completo *"
        placeholder="Seu nome completo"
        {...field('nome')}
        maxLength={100}
        leftIcon={<Ionicons name="person-outline" size={18} color={theme.textMuted} />}
      />

      <Input
        label="E-mail *"
        placeholder="voce@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        {...field('email')}
        maxLength={100}
        leftIcon={<Ionicons name="mail-outline" size={18} color={theme.textMuted} />}
      />

      <Input
        label="Telefone / WhatsApp com DDD *"
        placeholder="(11) 99999-9999"
        keyboardType="phone-pad"
        mask={maskPhoneInput}
        {...field('telefone')}
        maxLength={15}
        leftIcon={<Ionicons name="call-outline" size={18} color={theme.textMuted} />}
      />

      <View style={styles.sectionDivider} />
      <Text style={styles.sectionEyebrow}>Localização</Text>

      <View style={styles.row}>
        <View style={styles.cepCol}>
          <Input
            label="CEP *"
            placeholder="00000-000"
            keyboardType="number-pad"
            mask={maskCepInput}
            {...field('cep')}
            maxLength={9}
          />
        </View>
        <View style={styles.numCol}>
          <Input
            label="Número *"
            placeholder="1100 ou S/N"
            {...field('numero')}
            maxLength={100}
          />
        </View>
      </View>

      <Input
        label="Rua / Logradouro (Opcional)"
        placeholder="Av. Paulista"
        {...field('rua')}
        maxLength={100}
        leftIcon={<Ionicons name="location-outline" size={18} color={theme.textMuted} />}
      />

      <Input
        label="Ponto de Referência *"
        placeholder="Ex: Próx. à estação ou bloco B"
        {...field('referencia')}
        maxLength={50}
      />

      <View style={styles.sectionDivider} />
      <Text style={styles.sectionEyebrow}>Segurança</Text>

      <Input
        label="Senha *"
        placeholder="Mínimo 6 caracteres"
        isPassword
        {...field('senha')}
        maxLength={60}
        leftIcon={<Ionicons name="lock-closed-outline" size={18} color={theme.textMuted} />}
      />

      <Input
        label="Confirmar Senha *"
        placeholder="Repita a senha"
        isPassword
        {...field('confirmarSenha')}
        maxLength={60}
        leftIcon={<Ionicons name="shield-checkmark-outline" size={18} color={theme.textMuted} />}
      />

      <Button
        title={submitting ? 'Criando Conta…' : 'Criar Minha Conta'}
        onPress={onSubmit}
        loading={submitting}
        size="lg"
        style={styles.submitBtn}
      />

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Já possui uma conta?</Text>
        <TouchableOpacity onPress={onGoToLogin} activeOpacity={0.75} hitSlop={6}>
          <Text style={styles.footerLink}>Fazer Login</Text>
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
      padding: spacing.lg + 2,
      borderWidth: 1,
      borderColor: theme.cardBorder,
      gap: 2,
    },
    sectionEyebrow: {
      fontSize: fontSize.tiny + 1,
      fontWeight: fontWeight.bold,
      color: theme.primary,
      textTransform: 'uppercase',
      letterSpacing: 0.7,
      marginBottom: spacing.xs,
    },
    sectionDivider: {
      height: 1,
      backgroundColor: theme.divider,
      marginVertical: spacing.sm,
    },
    row: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    cepCol: {
      flex: 1.2,
    },
    numCol: {
      flex: 1,
    },
    submitBtn: {
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
