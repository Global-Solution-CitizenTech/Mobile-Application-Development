import { StyleSheet, View } from 'react-native';
import { BaseModal } from '@/components/BaseModal';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import type { BoundFieldProps, StringFieldKeys } from '@/hooks/useZodForm';
import { spacing } from '@/theme';
import { maskCepInput, maskPhoneInput } from '@/utils/formatters';
import type { ProfileEditFormData } from '@/utils/schemas';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  field: <K extends StringFieldKeys<ProfileEditFormData>>(name: K) => BoundFieldProps;
  onSave: () => void;
  saving: boolean;
}

export const EditProfileModal = ({
  visible,
  onClose,
  field,
  onSave,
  saving,
}: EditProfileModalProps) => (
  <BaseModal
    visible={visible}
    title="Editar Perfil"
    subtitle="Atualize seus dados cadastrais na API"
    onClose={onClose}
    dismissable={!saving}
  >
    <View style={styles.form}>
      <Input
        label="Nome Completo *"
        {...field('nome')}
        maxLength={100}
      />

      <Input
        label="E-mail *"
        keyboardType="email-address"
        autoCapitalize="none"
        {...field('email')}
        maxLength={100}
      />

      <Input
        label="Telefone com DDD *"
        keyboardType="phone-pad"
        mask={maskPhoneInput}
        {...field('telefone')}
        maxLength={15}
      />

      <View style={styles.row}>
        <View style={styles.flexCep}>
          <Input
            label="CEP *"
            keyboardType="number-pad"
            mask={maskCepInput}
            {...field('cep')}
            maxLength={9}
          />
        </View>
        <View style={styles.flexNum}>
          <Input
            label="Número *"
            {...field('numero')}
            maxLength={100}
          />
        </View>
      </View>

      <Input
        label="Rua / Logradouro (Opcional)"
        {...field('rua')}
        maxLength={100}
      />

      <Input
        label="Ponto de Referência *"
        {...field('referencia')}
        maxLength={50}
      />

      <Input
        label="Senha Atual ou Nova Senha *"
        placeholder="Necessária para confirmar alteração (mín. 6 caracteres)"
        isPassword
        {...field('senha')}
        maxLength={60}
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
