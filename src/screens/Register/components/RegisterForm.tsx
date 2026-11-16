import { useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { TextInputInstance } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/Button';
import { EnderecoFormFields } from '@/components/EnderecoFormFields';
import { Input } from '@/components/Input';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { borderRadius, spacing } from '@/theme/spacing';
import { fontSize, fontWeight } from '@/theme/typography';
import type { AppTheme } from '@/types/theme';
import type { RegisterFormProps } from '@/types/ui';
import { maskPhoneInput } from '@/utils/formatters';
import { shadows } from '@/utils/shadow';

export const RegisterForm = ({
  field,
  onSubmit,
  onGoToLogin,
  submitting,
  onUsarGps,
  capturandoGps,
  erroGps,
  localizacaoResumo,
}: RegisterFormProps) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  const emailRef = useRef<TextInputInstance>(null);
  const telefoneRef = useRef<TextInputInstance>(null);
  const cepRef = useRef<TextInputInstance>(null);
  const senhaRef = useRef<TextInputInstance>(null);
  const confirmarSenhaRef = useRef<TextInputInstance>(null);

  return (
    <View style={[styles.card, shadows.md]}>
      <Text style={styles.sectionEyebrow}>Dados Pessoais</Text>

      <Input
        label="Nome Completo *"
        placeholder="Seu nome completo"
        {...field('nome')}
        maxLength={100}
        returnKeyType="next"
        blurOnSubmit={false}
        autoComplete="name"
        textContentType="name"
        onSubmitEditing={() => emailRef.current?.focus()}
        leftIcon={<Ionicons name="person-outline" size={18} color={theme.textMuted} />}
      />

      <Input
        ref={emailRef}
        label="E-mail *"
        placeholder="voce@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
        blurOnSubmit={false}
        maxLength={100}
        onSubmitEditing={() => telefoneRef.current?.focus()}
        leftIcon={<Ionicons name="mail-outline" size={18} color={theme.textMuted} />}
        {...field('email')}
      />

      <Input
        ref={telefoneRef}
        label="Telefone / WhatsApp com DDD *"
        placeholder="(11) 99999-9999"
        keyboardType="phone-pad"
        mask={maskPhoneInput}
        maxLength={15}
        returnKeyType="next"
        blurOnSubmit={false}
        onSubmitEditing={() => cepRef.current?.focus()}
        leftIcon={<Ionicons name="call-outline" size={18} color={theme.textMuted} />}
        {...field('telefone')}
      />

      <View style={styles.sectionDivider} />
      <Text style={styles.sectionEyebrow}>Localização</Text>

      <EnderecoFormFields
        field={field}
        onUsarGps={onUsarGps}
        capturandoGps={capturandoGps}
        erroGps={erroGps}
        localizacaoResumo={localizacaoResumo}
        cepRef={cepRef}
        referenciaReturnKeyType="next"
        onSubmitReferencia={() => senhaRef.current?.focus()}
      />

      <View style={styles.sectionDivider} />
      <Text style={styles.sectionEyebrow}>Segurança</Text>

      <Input
        ref={senhaRef}
        label="Senha *"
        placeholder="Mínimo 6 caracteres"
        isPassword
        maxLength={60}
        returnKeyType="next"
        blurOnSubmit={false}
        autoComplete="new-password"
        textContentType="newPassword"
        onSubmitEditing={() => confirmarSenhaRef.current?.focus()}
        leftIcon={<Ionicons name="lock-closed-outline" size={18} color={theme.textMuted} />}
        {...field('senha')}
      />

      <Input
        ref={confirmarSenhaRef}
        label="Confirmar Senha *"
        placeholder="Repita a senha"
        isPassword
        maxLength={60}
        returnKeyType="done"
        autoComplete="new-password"
        textContentType="newPassword"
        onSubmitEditing={onSubmit}
        leftIcon={<Ionicons name="shield-checkmark-outline" size={18} color={theme.textMuted} />}
        {...field('confirmarSenha')}
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
      borderRadius: borderRadius.cardLg,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: theme.cardBorder,
      gap: spacing.sm + 2,
    },
    sectionEyebrow: {
      fontSize: fontSize.caption,
      fontWeight: fontWeight.bold,
      color: theme.primary,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginTop: spacing.xs,
      marginBottom: 2,
    },
    sectionDivider: {
      height: 1,
      backgroundColor: theme.border,
      marginVertical: spacing.md - 2,
    },
    submitBtn: {
      marginTop: spacing.md,
    },
    footerRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: spacing.xs,
      marginTop: spacing.md,
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
