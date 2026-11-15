import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { Input } from '@/components/Input';
import { useAuth } from '@/contexts/AuthContext';
import { useFeedback } from '@/contexts/FeedbackContext';
import { useThemedStyles } from '@/contexts/ThemeContext';
import { useZodForm } from '@/hooks/useZodForm';
import type { AppStackParamList } from '@/navigation/types';
import { buildUsuarioRequest } from '@/services/authService';
import type { AppTheme } from '@/theme/types';
import { borderRadius, fontSize, fontWeight, shadows, spacing } from '@/theme';
import type { UsuarioRequest } from '@/types/auth';
import type { ProfileEditFormData } from '@/types/form';
import { getApiErrorMessage } from '@/utils/apiError';
import { maskCepInput, maskPhoneInput } from '@/utils/formatters';
import { ProfileEditSchema } from '@/utils/schemas';

type Props = NativeStackScreenProps<AppStackParamList, 'EditarPerfil'>;

export const EditarPerfilScreen = ({ navigation }: Props) => {
  const { usuario, updateProfile } = useAuth();
  const { showError, showSuccess } = useFeedback();
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();

  const initialValues: ProfileEditFormData = {
    nome: usuario?.nome ?? '',
    email: usuario?.email ?? '',
    telefone: usuario ? maskPhoneInput(`${usuario.ddd}${usuario.numeroTelefone}`) : '',
    cep: usuario?.endereco ? maskCepInput(usuario.endereco.cep) : '',
    rua: usuario?.endereco?.rua ?? '',
    numero: usuario?.endereco?.numero ?? '',
    referencia: usuario?.endereco?.referencia ?? '',
    senha: '',
  };

  const form = useZodForm(ProfileEditSchema, initialValues);

  const saveMutation = useMutation({
    mutationFn: (payload: UsuarioRequest) => updateProfile(payload),
    onSuccess: () => {
      showSuccess('Perfil Atualizado', 'Seus dados foram atualizados com sucesso!');
      navigation.goBack();
    },
    onError: (error) => {
      showError('Ops!', getApiErrorMessage(error, 'Falha ao atualizar perfil.'));
    },
  });

  const handleSave = () => {
    const parsed = form.validate();
    if (!parsed) return;
    saveMutation.mutate(buildUsuarioRequest(parsed));
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Header
        title="Editar Perfil"
        subtitle="Atualize seus dados cadastrais"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: Math.max(insets.bottom, spacing.xl) + spacing.xl,
            paddingLeft: Math.max(insets.left, spacing.md),
            paddingRight: Math.max(insets.right, spacing.md),
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, shadows.sm]}>
          <Text style={styles.sectionTitle}>Dados Pessoais</Text>

          <Input
            label="Nome Completo *"
            placeholder="Seu nome"
            {...form.field('nome')}
            maxLength={100}
            returnKeyType="next"
            autoComplete="name"
          />

          <Input
            label="E-mail *"
            placeholder="seu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            returnKeyType="next"
            {...form.field('email')}
            maxLength={100}
          />

          <Input
            label="Telefone com DDD *"
            placeholder="(11) 99999-9999"
            keyboardType="phone-pad"
            mask={maskPhoneInput}
            {...form.field('telefone')}
            maxLength={15}
          />

          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Endereço Residencial</Text>

          <View style={styles.row}>
            <View style={styles.flexCep}>
              <Input
                label="CEP *"
                placeholder="00000-000"
                keyboardType="number-pad"
                mask={maskCepInput}
                {...form.field('cep')}
                maxLength={9}
              />
            </View>
            <View style={styles.flexNum}>
              <Input
                label="Número *"
                placeholder="100 ou S/N"
                {...form.field('numero')}
                maxLength={100}
              />
            </View>
          </View>

          <Input
            label="Rua / Logradouro (Opcional)"
            placeholder="Nome da sua rua"
            {...form.field('rua')}
            maxLength={100}
          />

          <Input
            label="Ponto de Referência *"
            placeholder="Ex: Próximo à padaria"
            {...form.field('referencia')}
            maxLength={50}
          />

          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Confirmação de Segurança</Text>

          <Input
            label="Senha Atual ou Nova Senha *"
            placeholder="Digite sua senha para confirmar"
            isPassword
            {...form.field('senha')}
            maxLength={60}
            returnKeyType="done"
            onSubmitEditing={handleSave}
            helperText="Necessária para autorizar qualquer alteração cadastral."
          />

          <View style={styles.actions}>
            <Button
              title={saveMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
              onPress={handleSave}
              loading={saveMutation.isPending}
              size="lg"
            />
            <Button
              title="Cancelar"
              variant="outline"
              onPress={() => navigation.goBack()}
              disabled={saveMutation.isPending}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    scrollContent: { padding: spacing.md, gap: spacing.md },
    card: {
      backgroundColor: theme.surface,
      borderRadius: borderRadius.cardLg,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: theme.border,
      gap: spacing.sm + 2,
    },
    sectionTitle: {
      fontSize: fontSize.bodySmall,
      fontWeight: fontWeight.bold,
      color: theme.primary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginTop: spacing.xs,
    },
    divider: {
      height: 1,
      backgroundColor: theme.border,
      marginVertical: spacing.xs,
    },
    row: { flexDirection: 'row', gap: spacing.sm },
    flexCep: { flex: 3 },
    flexNum: { flex: 2 },
    actions: { gap: spacing.sm, marginTop: spacing.md },
  });
