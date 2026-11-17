import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '@/components/Button';
import { CategoryGridSelector } from '@/components/CategoryGridSelector';
import { ChamadoFormFields } from '@/components/ChamadoFormFields';
import { EmptyState } from '@/components/EmptyState';
import { FeedbackModal } from '@/components/FeedbackModal';
import { Header } from '@/components/Header';
import { KeyboardScreenLayout } from '@/components/KeyboardScreenLayout';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useThemedStyles } from '@/contexts/ThemeContext';
import { useEditarChamadoForm } from '@/hooks/useEditarChamadoForm';
import { spacing } from '@/theme/spacing';
import type { AppStackScreenProps } from '@/types/navigation';
import type { AppTheme } from '@/types/theme';

export const EditarChamadoScreen = ({ navigation, route }: AppStackScreenProps<'EditarChamado'>) => {
  const styles = useThemedStyles(createStyles);
  const chamadoId = route.params?.id ?? Number.NaN;
  const hasValidId = Number.isInteger(chamadoId) && chamadoId > 0;
  const form = useEditarChamadoForm(chamadoId);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainTabs', { screen: 'MeusChamadosTab' });
    }
  };

  const showForm = !form.loadingChamado && !form.loadError && hasValidId;

  return (
    <>
      <KeyboardScreenLayout
        scrollable={showForm}
        header={
          <Header
            title={hasValidId ? `Editar Chamado #${chamadoId}` : 'Editar Chamado'}
            subtitle="Atualize título, descrição ou endereço"
            showBack
            onBack={handleGoBack}
          />
        }
      >
        {form.loadingChamado ? (
          <LoadingSpinner message="Carregando dados da ocorrência..." />
        ) : form.loadError || !hasValidId ? (
          <EmptyState
            icon="alert-circle-outline"
            title="Erro ao carregar"
            description={form.loadError ?? 'ID de chamado inválido.'}
            actionTitle="Voltar"
            onAction={handleGoBack}
          />
        ) : (
          <>
            <CategoryGridSelector
              categorias={form.categorias}
              selectedCategoriaId={form.values.categoriaId}
              onSelectCategoriaId={(catId) => form.setFieldValue('categoriaId', catId)}
              error={form.errors.categoriaId}
              disabled={form.submitting}
            />

            <ChamadoFormFields
              field={form.field}
              disabled={form.submitting}
              onUsarGps={() => {
                void form.handleUsarGps();
              }}
              capturandoGps={form.capturandoGps}
              erroGps={form.erroGps}
              localizacaoResumo={form.localizacaoResumo}
            />

            <View style={styles.actions}>
              <Button
                title="Cancelar"
                variant="outline"
                onPress={handleGoBack}
                style={styles.btn}
                disabled={form.submitting}
              />
              <Button
                title="Salvar Alterações"
                loading={form.submitting}
                onPress={() => form.submit(() => setSavedSuccess(true))}
                style={styles.btn}
              />
            </View>
          </>
        )}
      </KeyboardScreenLayout>

      <FeedbackModal
        visible={savedSuccess}
        type="success"
        title="Chamado Atualizado!"
        message="As alterações foram salvas na API com sucesso."
        onConfirm={() => {
          setSavedSuccess(false);
          handleGoBack();
        }}
      />
    </>
  );
};

const createStyles = (_theme: AppTheme) =>
  StyleSheet.create({
    actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
    btn: { flex: 1 },
  });
