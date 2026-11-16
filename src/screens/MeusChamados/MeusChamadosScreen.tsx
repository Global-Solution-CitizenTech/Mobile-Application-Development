import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChamadoCard } from '@/components/ChamadoCard';
import { EmptyState } from '@/components/EmptyState';
import { ChamadoListSeparator } from '@/components/ListSeparator';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { useMeusChamadosData } from '@/hooks/useMeusChamadosData';
import { MeusChamadosHeader } from '@/screens/MeusChamados/components/MeusChamadosHeader';
import { borderRadius, spacing } from '@/theme/spacing';
import { fontSize, fontWeight } from '@/theme/typography';
import type { MeusChamadosTabNavigationProp } from '@/types/navigation';
import type { AppTheme } from '@/types/theme';

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
    isFetchingNextPage,
    hasNextPage,
    loadMore,
    error,
    refetch,
    apoiarChamado,
    isSupportingId,
  } = useMeusChamadosData();

  const hasCachedData = chamados.length > 0 || totalChamados > 0;

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

      {isLoading && !hasCachedData ? (
        <LoadingSpinner message="Buscando suas ocorrências..." />
      ) : error && !hasCachedData ? (
        <EmptyState
          icon="cloud-offline-outline"
          title="Erro ao carregar"
          description={error}
          actionTitle="Recarregar"
          onAction={() => {
            void refetch();
          }}
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
              isSupporting={isSupportingId(item.idChamado)}
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
          ItemSeparatorComponent={ChamadoListSeparator}
          ListHeaderComponent={
            error ? (
              <TouchableOpacity
                style={styles.refreshNotice}
                onPress={() => {
                  void refetch();
                }}
                activeOpacity={0.8}
              >
                <Ionicons name="alert-circle-outline" size={16} color={theme.warning} />
                <Text style={styles.refreshNoticeText}>
                  Falha ao atualizar ({error}). Toque para tentar novamente.
                </Text>
              </TouchableOpacity>
            ) : undefined
          }
          onEndReached={hasNextPage ? loadMore : undefined}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={theme.primary} />
              </View>
            ) : undefined
          }
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => {
                void refetch();
              }}
              tintColor={theme.primary}
            />
          }
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
              onAction={() =>
                totalChamados === 0 ? navigation.navigate('NovoChamado') : setFilterTab('TODOS')
              }
            />
          }
        />
      )}
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    listContent: { padding: spacing.md, paddingBottom: spacing.xxl },
    emptyContainer: { flexGrow: 1, justifyContent: 'center' },
    footerLoader: { paddingVertical: spacing.md, alignItems: 'center' },
    refreshNotice: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs + 2,
      padding: spacing.sm + 2,
      marginBottom: spacing.md,
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
