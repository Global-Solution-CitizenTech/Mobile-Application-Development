import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { colors, borderRadius, spacing, fontSize, fontWeight, shadows } from '../../../theme';

interface RegisterFormProps {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  bairro: string;
  senha: string;
  confirmSenha: string;
  errors: Record<string, string>;
  error: string | null;
  isLoading: boolean;
  onNomeChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onCpfChange: (v: string) => void;
  onTelefoneChange: (v: string) => void;
  onBairroChange: (v: string) => void;
  onSenhaChange: (v: string) => void;
  onConfirmSenhaChange: (v: string) => void;
  onSubmit: () => void;
  onFillExample: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  nome,
  email,
  cpf,
  telefone,
  bairro,
  senha,
  confirmSenha,
  errors,
  error,
  isLoading,
  onNomeChange,
  onEmailChange,
  onCpfChange,
  onTelefoneChange,
  onBairroChange,
  onSenhaChange,
  onConfirmSenhaChange,
  onSubmit,
  onFillExample,
}) => {
  return (
    <View style={[styles.card, shadows.md]}>
      <Text style={styles.formTitle}>Junte-se à Rede ZelaFix</Text>
      <Text style={styles.formDescription}>
        Tenha voz ativa na gestão urbana do seu bairro e ajude a zelar pelo patrimônio público.
      </Text>

      {error && (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle" size={18} color={colors.feedback.danger} />
          <Text style={styles.errorBannerText}>{error}</Text>
        </View>
      )}

      <Input
        label="Nome Completo *"
        placeholder="Ex: Ana Clara Souza"
        value={nome}
        onChangeText={onNomeChange}
        error={errors.nome}
        leftIcon={<Ionicons name="person-outline" size={20} color={colors.secondary[400]} />}
      />

      <Input
        label="E-mail *"
        placeholder="seuemail@exemplo.com"
        value={email}
        onChangeText={onEmailChange}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        error={errors.email}
        leftIcon={<Ionicons name="mail-outline" size={20} color={colors.secondary[400]} />}
      />

      <View style={styles.rowTwoInputs}>
        <View style={{ flex: 1, marginRight: spacing.xs }}>
          <Input
            label="CPF *"
            placeholder="000.000.000-00"
            value={cpf}
            onChangeText={onCpfChange}
            keyboardType="numeric"
            error={errors.cpf}
          />
        </View>
        <View style={{ flex: 1, marginLeft: spacing.xs }}>
          <Input
            label="Telefone *"
            placeholder="(11) 99999-9999"
            value={telefone}
            onChangeText={onTelefoneChange}
            keyboardType="phone-pad"
            error={errors.telefone}
          />
        </View>
      </View>

      <Input
        label="Bairro de Residência *"
        placeholder="Ex: Bela Vista, Pinheiros, Sé"
        value={bairro}
        onChangeText={onBairroChange}
        error={errors.bairro}
        leftIcon={<Ionicons name="business-outline" size={20} color={colors.secondary[400]} />}
      />

      <Input
        label="Senha de Acesso *"
        placeholder="Mínimo 6 caracteres"
        value={senha}
        onChangeText={onSenhaChange}
        isPassword
        error={errors.senha}
        leftIcon={<Ionicons name="lock-closed-outline" size={20} color={colors.secondary[400]} />}
      />

      <Input
        label="Confirmação de Senha *"
        placeholder="Repita sua senha"
        value={confirmSenha}
        onChangeText={onConfirmSenhaChange}
        isPassword
        error={errors.confirmSenha}
        leftIcon={<Ionicons name="checkmark-done-outline" size={20} color={colors.secondary[400]} />}
      />

      <Button
        title="Concluir Cadastro"
        variant="primary"
        size="lg"
        onPress={onSubmit}
        loading={isLoading}
        style={styles.submitButton}
      />

      <TouchableOpacity
        style={styles.fillExampleBtn}
        onPress={onFillExample}
        activeOpacity={0.7}
      >
        <Ionicons name="sparkles-outline" size={16} color={colors.secondary[700]} />
        <Text style={styles.fillExampleText}>Auto-preencher Dados de Teste</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
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
  },
  rowTwoInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  submitButton: {
    marginTop: spacing.sm,
  },
  fillExampleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.secondary[100],
    borderRadius: borderRadius.md,
  },
  fillExampleText: {
    fontSize: fontSize.bodySmall,
    fontWeight: fontWeight.semibold,
    color: colors.secondary[700],
  },
});
