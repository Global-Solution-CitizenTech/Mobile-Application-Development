import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useTheme } from '@/contexts/ThemeContext';
import { spacing } from '@/theme';
import type { RegisterFormData } from '@/utils/schemas';

interface RegisterFormProps {
  values: RegisterFormData;
  errors: Partial<Record<keyof RegisterFormData, string>>;
  onChangeField: <K extends keyof RegisterFormData>(field: K, value: RegisterFormData[K]) => void;
  onChangeTelefone: (text: string) => void;
  onChangeCep: (text: string) => void;
  onSubmit: () => void;
  submitting: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  values,
  errors,
  onChangeField,
  onChangeTelefone,
  onChangeCep,
  onSubmit,
  submitting,
}) => {
  const { theme } = useTheme();
  const [showPass, setShowPass] = useState(false);

  const eyeIcon = (
    <TouchableOpacity onPress={() => setShowPass((prev) => !prev)} hitSlop={8}>
      <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={20} color={theme.textMuted} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Input
        label="Nome Completo *"
        placeholder="Seu nome completo"
        value={values.nome}
        onChangeText={(text) => onChangeField('nome', text)}
        maxLength={100}
        error={errors.nome}
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
      />

      <Input
        label="Telefone / WhatsApp com DDD *"
        placeholder="(11) 99999-9999"
        keyboardType="phone-pad"
        value={values.telefone}
        onChangeText={onChangeTelefone}
        maxLength={15}
        error={errors.telefone}
      />

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
            placeholder="Ex: 1100 ou S/N"
            value={values.numero}
            onChangeText={(text) => onChangeField('numero', text)}
            maxLength={100}
            error={errors.numero}
          />
        </View>
      </View>

      <Input
        label="Rua / Logradouro (Opcional — ViaCEP preenche)"
        placeholder="Av. Paulista"
        value={values.rua ?? ''}
        onChangeText={(text) => onChangeField('rua', text)}
        maxLength={100}
        error={errors.rua}
      />

      <Input
        label="Ponto de Referência *"
        placeholder="Ex: Próx. à estação ou bloco B"
        value={values.referencia}
        onChangeText={(text) => onChangeField('referencia', text)}
        maxLength={50}
        error={errors.referencia}
      />

      <Input
        label="Senha *"
        placeholder="Mínimo 6 caracteres"
        secureTextEntry={!showPass}
        rightIcon={eyeIcon}
        value={values.senha}
        onChangeText={(text) => onChangeField('senha', text)}
        maxLength={60}
        error={errors.senha}
      />

      <Input
        label="Confirmar Senha *"
        placeholder="Repita a senha"
        secureTextEntry={!showPass}
        value={values.confirmarSenha}
        onChangeText={(text) => onChangeField('confirmarSenha', text)}
        maxLength={60}
        error={errors.confirmarSenha}
      />

      <Button title="Criar Minha Conta" onPress={onSubmit} loading={submitting} size="lg" style={styles.submitBtn} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: spacing.xs },
  row: { flexDirection: 'row', gap: spacing.sm },
  cepCol: { flex: 1.2 },
  numCol: { flex: 1 },
  submitBtn: { marginTop: spacing.sm },
});
