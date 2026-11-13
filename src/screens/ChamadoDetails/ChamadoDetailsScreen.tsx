import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EmptyState } from '@/components/EmptyState';
import { FeedbackModal } from '@/components/FeedbackModal';
import { Header } from '@/components/Header';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import type { AppTheme } from '@/theme/types';
import { useChamadoDetails } from '@/hooks/useChamadoDetails';
import type { AppStackParamList } from '@/navigation/types';
import { ChamadoActionBar } from '@/screens/ChamadoDetails/components/ChamadoActionBar';
import { ChamadoLocationCard } from '@/screens/ChamadoDetails/components/ChamadoLocationCard';
import { ChamadoSummaryCard } from '@/screens/ChamadoDetails/components/ChamadoSummaryCard';
import { ChamadoTimelineCard } from '@/screens/ChamadoDetails/components/ChamadoTimelineCard';
import { StatusChangeModal } from '@/screens/ChamadoDetails/components/StatusChangeModal';
import { spacing } from '@/theme';

type Props = NativeStackScreenProps<AppStackParamList, 'ChamadoDetails'>;

export const ChamadoDetailsScreen = ({ navigation, route }: Props) => {
  const { id } = route.params;
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();
  const details = useChamadoDetails(id);
  const chamado = details.chamado;

  return (
    <View style={styles.container}>
      <Header
        title={chamado ? `Protocolo #${chamado.idChamado}` : 'Detalhes do Chamado'}
        subtitle={chamado?.categoriaNome || 'Acompanhamento oficial'}
        showBack
        onBack={() => navigation.goBack()}
      />

      {details.isLoading ? (
        <LoadingSpinner message="Carregando ocorrência..." />
      ) : details.fetchError || !chamado ? (
        <EmptyState
          icon="alert-circle-outline"
          title="Chamado não disponível"
          description={details.fetchError ?? 'Não foi possível localizar esta ocorrência.'}
          actionTitle="Tentar Novamente"
          onAction={() => { void details.refetch(); }}
        />
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingBottom: Math.max(insets.bottom, spacing.xl) + spacing.md,
              paddingLeft: Math.max(insets.left, spacing.md),
              paddingRight: Math.max(insets.right, spacing.md),
            },
          ]}
          refreshControl={<RefreshControl refreshing={details.isRefetching} onRefresh={() => { void details.refetch(); }} tintColor={theme.primary} />}
          showsVerticalScrollIndicator={false}
        >
          <ChamadoSummaryCard
            chamado={chamado}
            onAskAi={() => navigation.navigate('MainTabs', { screen: 'ZelaBotTab', params: { chamadoId: chamado.idChamado } })}
          />

          <ChamadoLocationCard endereco={chamado.endereco} />
          <ChamadoTimelineCard historico={chamado.historico} />

          <ChamadoActionBar
            chamado={chamado}
            podeApoiar={details.podeApoiar}
            podeEditar={details.podeEditar}
            podeAlterarStatus={details.podeAlterarStatus}
            podeExcluir={details.podeExcluir}
            isSupporting={details.isSupporting}
            onApoiar={details.handleApoiar}
            onEditar={() => navigation.navigate('EditarChamado', { id: chamado.idChamado })}
            onAlterarStatus={() => details.setStatusModalVisible(true)}
            onExcluir={() => details.setDeleteModalVisible(true)}
          />
        </ScrollView>
      )}

      {chamado && (
        <StatusChangeModal
          visible={details.statusModalVisible}
          currentStatus={chamado.status}
          onClose={() => details.setStatusModalVisible(false)}
          onSubmit={details.handleAlterarStatus}
          submitting={details.isChangingStatus}
        />
      )}

      <FeedbackModal
        visible={details.deleteModalVisible}
        type="warning"
        title="Excluir Ocorrência?"
        message="Esta ação remove permanentemente o chamado e não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        confirmLoading={details.isDeleting}
        onConfirm={() => details.handleConfirmDelete(() => navigation.goBack())}
        onCancel={() => details.setDeleteModalVisible(false)}
      />

      <FeedbackModal
        visible={Boolean(details.actionError)}
        type="error"
        title="Não foi possível concluir"
        message={details.actionError ?? ''}
        onConfirm={details.clearActionError}
      />
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    scrollContent: { padding: spacing.md, gap: spacing.md },
  });
