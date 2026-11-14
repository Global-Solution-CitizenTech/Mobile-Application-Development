import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChamadoCard } from '@/components/ChamadoCard';
import { EmptyState } from '@/components/EmptyState';
import { ChamadoListSeparator } from '@/components/ListSeparator';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { useRadarData } from '@/hooks/useRadarData';
import type { AppTabRouteProp, RadarBairroTabNavigationProp } from '@/navigation/types';
import { RadarHeaderFilters } from '@/screens/RadarBairro/components/RadarHeaderFilters';
import { spacing } from '@/theme';
import type { AppTheme } from '@/theme/types';

export const RadarBairroScreen = () => {
  const navigation = useNavigation<RadarBairroTabNavigationProp>();
  const route = useRoute<AppTabRouteProp<'RadarBairroTab'>>();
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();

  const radar = useRadarData(route.params?.categoria, (categoria) =>
    navigation.setParams({ categoria })
  );

  return (
    <View style={styles.container}>
      <RadarHeaderFilters
        busca={radar.busca}
        onChangeBusca={radar.setBusca}
        categorias={radar.categorias}
        categoriaFiltro={radar.categoriaFiltro}
        onChangeCategoria={radar.setCategoriaFiltro}
        statusFiltro={radar.statusFiltro}
        onChangeStatus={radar.setStatusFiltro}
        locationFilter={radar.locationFilter}
        onChangeLocation={radar.setLocationFilter}
        locationOptions={radar.locationOptions}
        userCity={radar.userCity}
        sortBy={radar.sortBy}
        onChangeSort={radar.setSortBy}
        totalCount={radar.totalCount}
        hasActiveFilters={radar.hasActiveFilters}
        onClearFilters={radar.limparFiltros}
        onPressReportar={() => navigation.navigate('NovoChamado')}
      />

      {radar.isLoading ? (
        <LoadingSpinner message="Buscando ocorrências..." />
      ) : radar.error && radar.chamados.length === 0 ? (
        <EmptyState
          icon="cloud-offline-outline"
          title="Erro ao consultar radar"
          description={radar.error}
          actionTitle="Tentar Novamente"
          onAction={() => {
            void radar.refetch();
          }}
        />
      ) : (
        <FlatList
          data={radar.chamados}
          keyExtractor={(item) => String(item.idChamado)}
          renderItem={({ item }) => (
            <ChamadoCard
              chamado={item}
              onPress={() => navigation.navigate('ChamadoDetails', { id: item.idChamado })}
              onApoiar={() => radar.apoiarChamado(item.idChamado)}
            />
          )}
          contentContainerStyle={[
            styles.listContent,
            {
              paddingLeft: Math.max(insets.left, spacing.md),
              paddingRight: Math.max(insets.right, spacing.md),
            },
            radar.chamados.length === 0 && styles.emptyContainer,
          ]}
          ItemSeparatorComponent={ChamadoListSeparator}
          onEndReached={radar.loadMore}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            radar.isFetchingNextPage ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={theme.primary} />
              </View>
            ) : undefined
          }
          refreshControl={
            <RefreshControl
              refreshing={radar.isRefreshing}
              onRefresh={() => {
                void radar.refetch();
              }}
              tintColor={theme.primary}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon="search-outline"
              title="Nenhuma ocorrência encontrada"
              description={
                radar.locationFilter.valor
                  ? `Nenhum registro encontrado para ${radar.locationFilter.valor}. Você pode ampliar os filtros ou reportar um problema agora.`
                  : 'Tente ajustar os filtros de busca ou categoria para visualizar mais registros.'
              }
              actionTitle={radar.hasActiveFilters || radar.locationFilter.valor ? 'Mostrar Todas / Limpar' : 'Reportar Agora'}
              onAction={() =>
                radar.hasActiveFilters || radar.locationFilter.valor
                  ? radar.limparFiltros()
                  : navigation.navigate('NovoChamado')
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
    listContent: { paddingTop: spacing.md, paddingBottom: spacing.xxl },
    emptyContainer: { flexGrow: 1, justifyContent: 'center' },
    footerLoader: { paddingVertical: spacing.md, alignItems: 'center' },
  });
