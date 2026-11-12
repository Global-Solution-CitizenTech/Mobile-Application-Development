import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BaseModal } from '@/components/BaseModal';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { spacing } from '@/theme';
import { maskCepInput, maskPhoneInput } from '@/utils/formatters';
import type { ProfileEditFormData } from '@/utils/schemas';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  values: ProfileEditFormData;
  errors: Partial<Record<keyof ProfileEditFormData, string>>;
  onChangeField: <K extends keyof ProfileEditFormData>(field: K, value: ProfileEditFormData[K]) => void;
  onSave: () => void;
  saving: boolean;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  onClose,
  values,
  errors,
  onChangeField,
  onSave,
  saving,
}) => (
  <BaseModal visible={visible} title="Editar Perfil" subtitle="Atualize seus dados cadastrais na API" onClose={onClose}>
    <View style={styles.form}>
      <Input
        label="Nome Completo *"
        value={values.nome}
        onChangeText={(text) => onChangeField('nome', text)}
        maxLength={100}
        error={errors.nome}
      />

      <Input
        label="E-mail *"
        keyboardType="email-address"
        autoCapitalize="none"
        value={values.email}
        onChangeText={(text) => onChangeField('email', text)}
        maxLength={100}
        error={errors.email}
      />

      <Input
        label="Telefone com DDD *"
        keyboardType="phone-pad"
        value={values.telefone}
        onChangeText={(text) => onChangeField('telefone', maskPhoneInput(text))}
        maxLength={15}
        error={errors.telefone}
      />

      <View style={styles.row}>
        <View style={styles.flexCep}>
          <Input
            label="CEP *"
            keyboardType="number-pad"
            value={values.cep}
            onChangeText={(text) => onChangeField('cep', maskCepInput(text))}
            maxLength={9}
            error={errors.cep}
          />
        </View>
        <View style={styles.flexNum}>
          <Input
            label="Número *"
            value={values.numero}
            onChangeText={(text) => onChangeField('numero', text)}
            maxLength={100}
            error={errors.numero}
          />
        </View>
      </View>

      <Input
        label="Rua / Logradouro (Opcional)"
        value={values.rua ?? ''}
        onChangeText={(text) => onChangeField('rua', text)}
        maxLength={100}
        error={errors.rua}
      />

      <Input
        label="Ponto de Referência *"
        value={values.referencia}
        onChangeText={(text) => onChangeField('referencia', text)}
        maxLength={50}
        error={errors.referencia}
      />

      <Input
        label="Senha Atual ou Nova Senha *"
        placeholder="Necessária para confirmar alteração (mín. 6 caracteres)"
        secureTextEntry
        value={values.senha}
        onChangeText={(text) => onChangeField('senha', text)}
        maxLength={60}
        error={errors.senha}
      />

      <View style={styles.actions}>
        <Button title="Cancelar" variant="outline" onPress={onClose} style={styles.btn} disabled={saving} />
        <Button title="Salvar Dados" onPress={onSave} loading={saving} style={styles.btn} />
      </View>
    </View>
  </BaseModal>
);

const styles = StyleSheet.create({
  form: { gap: spacing.xs },
  row: { flexDirection: 'row', gap: spacing.sm },
  flexCep: { flex: 1.2 },
  flexNum: { flex: 1 },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  btn: { flex: 1 },
});
