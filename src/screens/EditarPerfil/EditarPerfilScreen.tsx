import { useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { TextInputInstance } from 'react-native';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { EnderecoFormFields } from '@/components/EnderecoFormFields';
import { Header } from '@/components/Header';
import { Input } from '@/components/Input';
import { KeyboardScreenLayout } from '@/components/KeyboardScreenLayout';
import { useThemedStyles } from '@/contexts/ThemeContext';
import { useEditarPerfilForm } from '@/hooks/useEditarPerfilForm';
import { borderRadius, spacing } from '@/theme/spacing';
import { fontSize, fontWeight } from '@/theme/typography';
import type { AppStackScreenProps } from '@/types/navigation';
import type { AppTheme } from '@/types/theme';
import { maskPhoneInput } from '@/utils/formatters';
import { shadows } from '@/utils/shadow';

export const EditarPerfilScreen = ({ navigation }: AppStackScreenProps<'EditarPerfil'>) => {
  const styles = useThemedStyles(createStyles);
  const form = useEditarPerfilForm();

  const emailRef = useRef<TextInputInstance>(null);
  const telefoneRef = useRef<TextInputInstance>(null);
  const cepRef = useRef<TextInputInstance>(null);
  const senhaRef = useRef<TextInputInstance>(null);

  const handleSave = () => {
    form.handleSave(() => navigation.goBack());
  };

  const header = (
    <Header
      title="Editar Perfil"
      subtitle="Atualize seus dados cadastrais"
      showBack
      onBack={() => navigation.goBack()}
    />
  );

  if (!form.hasUsuario) {
    return (
      <KeyboardScreenLayout header={header} scrollable={false}>
        <EmptyState
          icon="person-outline"
          title="Perfil indisponível"
          description="Faça login novamente para editar seus dados cadastrais."
          actionTitle="Voltar"
          onAction={() => navigation.goBack()}
          style={styles.emptyFallback}
        />
      </KeyboardScreenLayout>
    );
  }

  return (
    <KeyboardScreenLayout header={header}>
      <View style={[styles.card, shadows.sm]}>
        <Text style={styles.sectionTitle}>Dados Pessoais</Text>

        <Input
          label="Nome Completo *"
          placeholder="Seu nome"
          maxLength={100}
          returnKeyType="next"
          blurOnSubmit={false}
          autoComplete="name"
          onSubmitEditing={() => emailRef.current?.focus()}
          {...form.field('nome')}
        />

        <Input
          ref={emailRef}
          label="E-mail *"
          placeholder="seu@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          returnKeyType="next"
          blurOnSubmit={false}
          maxLength={100}
          onSubmitEditing={() => telefoneRef.current?.focus()}
          {...form.field('email')}
        />

        <Input
          ref={telefoneRef}
          label="Telefone com DDD *"
          placeholder="(11) 99999-9999"
          keyboardType="phone-pad"
          mask={maskPhoneInput}
          maxLength={15}
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => cepRef.current?.focus()}
          {...form.field('telefone')}
        />

        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Endereço Residencial</Text>

        <EnderecoFormFields
          field={form.field}
          disabled={form.submitting}
          onUsarGps={() => void form.onUsarGps()}
          capturandoGps={form.capturandoGps}
          erroGps={form.erroGps}
          localizacaoResumo={form.localizacaoResumo}
          cepRef={cepRef}
          referenciaReturnKeyType="next"
          onSubmitReferencia={() => senhaRef.current?.focus()}
        />

        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Confirmação de Segurança</Text>

        <Input
          ref={senhaRef}
          label="Senha Atual ou Nova Senha *"
          placeholder="Digite sua senha para confirmar"
          isPassword
          maxLength={60}
          returnKeyType="done"
          onSubmitEditing={handleSave}
          helperText="Necessária para autorizar qualquer alteração cadastral."
          {...form.field('senha')}
        />

        <View style={styles.actions}>
          <Button
            title={form.submitting ? 'Salvando...' : 'Salvar Alterações'}
            onPress={handleSave}
            loading={form.submitting}
            size="lg"
          />
          <Button
            title="Cancelar"
            variant="outline"
            onPress={() => navigation.goBack()}
            disabled={form.submitting}
          />
        </View>
      </View>
    </KeyboardScreenLayout>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    emptyFallback: {
      flex: 1,
    },
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
    actions: {
      gap: spacing.sm,
      marginTop: spacing.md,
    },
  });
