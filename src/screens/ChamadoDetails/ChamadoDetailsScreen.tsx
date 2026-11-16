import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EmptyState } from '@/components/EmptyState';
import { FeedbackModal } from '@/components/FeedbackModal';
import { Header } from '@/components/Header';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { useChamadoDetails } from '@/hooks/useChamadoDetails';
import { ChamadoActionBar } from '@/screens/ChamadoDetails/components/ChamadoActionBar';
import { ChamadoLocationCard } from '@/screens/ChamadoDetails/components/ChamadoLocationCard';
import { ChamadoSummaryCard } from '@/screens/ChamadoDetails/components/ChamadoSummaryCard';
import { ChamadoTimelineCard } from '@/screens/ChamadoDetails/components/ChamadoTimelineCard';
import { StatusChangeModal } from '@/screens/ChamadoDetails/components/StatusChangeModal';
import { getCategoryLabel } from '@/theme/semanticConfig';
import { borderRadius, spacing } from '@/theme/spacing';
import { fontSize, fontWeight } from '@/theme/typography';
import type { AppStackScreenProps } from '@/types/navigation';
import type { AppTheme } from '@/types/theme';

export const ChamadoDetailsScreen = ({ navigation, route }: AppStackScreenProps<'ChamadoDetails'>) => {
  const id = route.params?.id ?? Number.NaN;
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();
  const details = useChamadoDetails(id);
  const chamado = details.chamado;

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainTabs', { screen: 'HomeTab' });
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title={chamado ? `Protocolo #${chamado.idChamado}` : 'Detalhes do Chamado'}
        subtitle={chamado ? getCategoryLabel(chamado.categoriaNome) : 'Acompanhamento oficial'}
        showBack
        onBack={handleGoBack}
      />

      {details.isLoading && !chamado ? (
        <LoadingSpinner message="Carregando ocorrência..." />
      ) : !details.hasValidId || !chamado ? (
        <EmptyState
          icon="alert-circle-outline"
          title="Chamado não disponível"
          description={details.fetchError ?? 'Não foi possível localizar esta ocorrência.'}
          actionTitle={details.hasValidId ? 'Tentar Novamente' : 'Voltar'}
          onAction={() => {
            if (details.hasValidId) {
              void details.refetch();
            } else {
              handleGoBack();
            }
          }}
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
          refreshControl={
            <RefreshControl
              refreshing={details.isRefreshing}
              onRefresh={() => {
                void details.refetch();
              }}
              tintColor={theme.primary}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {details.fetchError ? (
            <TouchableOpacity
              style={styles.refreshNotice}
              onPress={() => {
                void details.refetch();
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="alert-circle-outline" size={16} color={theme.warning} />
              <Text style={styles.refreshNoticeText}>
                Não foi possível atualizar ({details.fetchError}). Toque para tentar novamente.
              </Text>
            </TouchableOpacity>
          ) : null}

          <ChamadoSummaryCard
            chamado={chamado}
            onAskAi={() =>
              navigation.navigate('MainTabs', {
                screen: 'ZelaBotTab',
                params: { chamadoId: chamado.idChamado },
              })
            }
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
        onConfirm={() => details.handleConfirmDelete(handleGoBack)}
        onCancel={() => details.setDeleteModalVisible(false)}
      />
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    scrollContent: { padding: spacing.md, gap: spacing.md },
    refreshNotice: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs + 2,
      padding: spacing.sm + 2,
      borderRadius: borderRadius.md,
      backgroundColor: theme.warningBg,
      borderWidth: 1,
      borderColor: theme.warningBorder,
    },
    refreshNoticeText: {
      flex: 1,
      fontSize: fontSize.caption,
      color: theme.text,
      fontWeight: fontWeight.medium,
    },
  });
