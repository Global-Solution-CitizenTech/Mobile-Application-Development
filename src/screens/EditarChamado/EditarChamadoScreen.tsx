import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { ChamadoFormFields } from '@/components/ChamadoFormFields';
import { EmptyState } from '@/components/EmptyState';
import { FeedbackModal } from '@/components/FeedbackModal';
import { Header } from '@/components/Header';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useThemedStyles } from '@/contexts/ThemeContext';
import type { AppTheme } from '@/theme/types';
import { useChamadoForm } from '@/hooks/useChamadoForm';
import type { AppStackParamList } from '@/navigation/types';
import { CategoryGridSelector } from '@/components/CategoryGridSelector';
import { spacing } from '@/theme';

type Props = NativeStackScreenProps<AppStackParamList, 'EditarChamado'>;

export const EditarChamadoScreen = ({ navigation, route }: Props) => {
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();
  const { id } = route.params;
  const form = useChamadoForm({ mode: 'edit', chamadoId: id });
  const [savedSuccess, setSavedSuccess] = useState(false);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Header title={`Editar Chamado #${id}`} subtitle="Atualize título, descrição ou endereço" showBack onBack={() => navigation.goBack()} />

      {form.loadingChamado ? (
        <LoadingSpinner message="Carregando dados da ocorrência..." />
      ) : form.loadError ? (
        <EmptyState icon="alert-circle-outline" title="Erro ao carregar" description={form.loadError} actionTitle="Voltar" onAction={() => navigation.goBack()} />
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingBottom: Math.max(insets.bottom, spacing.xl) + spacing.lg,
              paddingLeft: Math.max(insets.left, spacing.md),
              paddingRight: Math.max(insets.right, spacing.md),
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <CategoryGridSelector
            categorias={form.categorias}
            selectedCategoriaId={form.values.categoriaId}
            onSelectCategoriaId={(catId) => form.setFieldValue('categoriaId', catId)}
            error={form.errors.categoriaId}
          />

          <ChamadoFormFields
            titulo={form.values.titulo}
            onChangeTitulo={(v) => form.setFieldValue('titulo', v)}
            descricao={form.values.descricao}
            onChangeDescricao={(v) => form.setFieldValue('descricao', v)}
            cep={form.values.cep}
            onChangeCep={(v) => form.setFieldValue('cep', v)}
            rua={form.values.rua}
            onChangeRua={(v) => form.setFieldValue('rua', v)}
            numero={form.values.numero}
            onChangeNumero={(v) => form.setFieldValue('numero', v)}
            referencia={form.values.referencia}
            onChangeReferencia={(v) => form.setFieldValue('referencia', v)}
            errors={form.errors}
            onUsarGps={form.handleUsarGps}
            capturandoGps={form.capturandoGps}
            erroGps={form.erroGps}
          />

          <View style={styles.actions}>
            <Button title="Cancelar" variant="outline" onPress={() => navigation.goBack()} style={styles.btn} disabled={form.submitting} />
            <Button
              title="Salvar Alterações"
              loading={form.submitting}
              onPress={() => {
                void form.submit(() => setSavedSuccess(true));
              }}
              style={styles.btn}
            />
          </View>
        </ScrollView>
      )}

      <FeedbackModal
        visible={savedSuccess}
        type="success"
        title="Chamado Atualizado!"
        message="As alterações foram salvas na API com sucesso."
        onConfirm={() => {
          setSavedSuccess(false);
          navigation.goBack();
        }}
      />

      <FeedbackModal
        visible={Boolean(form.erroModal)}
        type="error"
        title="Erro ao salvar"
        message={form.erroModal ?? ''}
        onConfirm={form.clearErroModal}
      />
    </KeyboardAvoidingView>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    scrollContent: { padding: spacing.md, paddingBottom: spacing.xxxl, gap: spacing.xs },
    actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
    btn: { flex: 1 },
  });
