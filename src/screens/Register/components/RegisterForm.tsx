import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { borderRadius, fontSize, fontWeight, shadows, spacing } from '@/theme';
import type { AppTheme } from '@/theme/types';
import type { FormErrors, RegisterFormData } from '@/utils/schemas';

interface RegisterFormProps {
  values: RegisterFormData;
  errors: FormErrors<RegisterFormData>;
  onChangeField: <K extends keyof RegisterFormData>(field: K, value: RegisterFormData[K]) => void;
  onChangeTelefone: (text: string) => void;
  onChangeCep: (text: string) => void;
  onSubmit: () => void;
  onGoToLogin: () => void;
  submitting: boolean;
}

export const RegisterForm = ({
  values,
  errors,
  onChangeField,
  onChangeTelefone,
  onChangeCep,
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
        value={values.nome}
        onChangeText={(text) => onChangeField('nome', text)}
        maxLength={100}
        error={errors.nome}
        leftIcon={<Ionicons name="person-outline" size={18} color={theme.textMuted} />}
      />

      <Input
        label="E-mail *"
        placeholder="voce@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={values.email}
        onChangeText={(text) => onChangeField('email', text)}
        maxLength={100}
        error={errors.email}
        leftIcon={<Ionicons name="mail-outline" size={18} color={theme.textMuted} />}
      />

      <Input
        label="Telefone / WhatsApp com DDD *"
        placeholder="(11) 99999-9999"
        keyboardType="phone-pad"
        value={values.telefone}
        onChangeText={onChangeTelefone}
        maxLength={15}
        error={errors.telefone}
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
            value={values.cep}
            onChangeText={onChangeCep}
            maxLength={9}
            error={errors.cep}
          />
        </View>
        <View style={styles.numCol}>
          <Input
            label="Número *"
            placeholder="1100 ou S/N"
            value={values.numero}
            onChangeText={(text) => onChangeField('numero', text)}
            maxLength={100}
            error={errors.numero}
          />
        </View>
      </View>

      <Input
        label="Rua / Logradouro (Opcional)"
        placeholder="Av. Paulista"
        value={values.rua ?? ''}
        onChangeText={(text) => onChangeField('rua', text)}
        maxLength={100}
        error={errors.rua}
        leftIcon={<Ionicons name="location-outline" size={18} color={theme.textMuted} />}
      />

      <Input
        label="Ponto de Referência *"
        placeholder="Ex: Próx. à estação ou bloco B"
        value={values.referencia}
        onChangeText={(text) => onChangeField('referencia', text)}
        maxLength={50}
        error={errors.referencia}
      />

      <View style={styles.sectionDivider} />
      <Text style={styles.sectionEyebrow}>Segurança</Text>

      <Input
        label="Senha *"
        placeholder="Mínimo 6 caracteres"
        isPassword
        value={values.senha}
        onChangeText={(text) => onChangeField('senha', text)}
        maxLength={60}
        error={errors.senha}
        leftIcon={<Ionicons name="lock-closed-outline" size={18} color={theme.textMuted} />}
      />

      <Input
        label="Confirmar Senha *"
        placeholder="Repita a senha"
        isPassword
        value={values.confirmarSenha}
        onChangeText={(text) => onChangeField('confirmarSenha', text)}
        maxLength={60}
        error={errors.confirmarSenha}
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
