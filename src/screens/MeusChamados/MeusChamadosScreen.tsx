import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChamadoCard } from '@/components/ChamadoCard';
import { EmptyState } from '@/components/EmptyState';
import { FeedbackModal } from '@/components/FeedbackModal';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import type { AppTheme } from '@/theme/types';
import { useMeusChamadosData } from '@/hooks/useMeusChamadosData';
import type { MeusChamadosTabNavigationProp } from '@/navigation/types';
import { MeusChamadosHeader } from '@/screens/MeusChamados/components/MeusChamadosHeader';
import { spacing } from '@/theme';

export const MeusChamadosScreen = () => {
  const navigation = useNavigation<MeusChamadosTabNavigationProp>();
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();

  const {
    chamados,
    totalChamados,
    contadores,
    filterTab,
    setFilterTab,
    isLoading,
    isRefreshing,
    error,
    refetch,
    apoiarChamado,
    supportError,
    clearSupportError,
  } = useMeusChamadosData();

  return (
    <View style={styles.container}>
      <MeusChamadosHeader
        total={totalChamados}
        abertos={contadores.abertos}
        emAndamento={contadores.emAndamento}
        concluidos={contadores.concluidos}
        activeTab={filterTab}
        onSelectTab={setFilterTab}
      />

      {isLoading ? (
        <LoadingSpinner message="Buscando suas ocorrências..." />
      ) : error && chamados.length === 0 ? (
        <EmptyState
          icon="cloud-offline-outline"
          title="Erro ao carregar"
          description={error}
          actionTitle="Recarregar"
          onAction={() => { void refetch(); }}
        />
      ) : (
        <FlatList
          data={chamados}
          keyExtractor={(item) => String(item.idChamado)}
          renderItem={({ item }) => (
            <ChamadoCard
              chamado={item}
              onPress={() => navigation.navigate('ChamadoDetails', { id: item.idChamado })}
              onApoiar={() => apoiarChamado(item.idChamado)}
            />
          )}
          contentContainerStyle={[
            styles.listContent,
            {
              paddingLeft: Math.max(insets.left, spacing.md),
              paddingRight: Math.max(insets.right, spacing.md),
            },
            chamados.length === 0 && styles.emptyContainer,
          ]}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => { void refetch(); }} tintColor={theme.primary} />}
          ListEmptyComponent={
            <EmptyState
              icon="document-text-outline"
              title="Nenhuma ocorrência encontrada"
              description={
                totalChamados === 0
                  ? 'Você ainda não registrou nenhuma ocorrência urbana.'
                  : 'Nenhum chamado seu corresponde ao filtro selecionado.'
              }
              actionTitle={totalChamados === 0 ? 'Reportar Problema' : 'Ver Todos'}
              onAction={() => (totalChamados === 0 ? navigation.navigate('NovoChamado') : setFilterTab('TODOS'))}
            />
          }
        />
      )}

      <FeedbackModal
        visible={Boolean(supportError)}
        type="error"
        title="Não foi possível apoiar"
        message={supportError ?? ''}
        onConfirm={clearSupportError}
      />
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    listContent: { padding: spacing.md, paddingBottom: spacing.xxl },
    emptyContainer: { flexGrow: 1, justifyContent: 'center' },
    separator: { height: spacing.sm + 4 },
  });
