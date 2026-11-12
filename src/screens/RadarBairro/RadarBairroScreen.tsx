import React from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { type CompositeNavigationProp, type RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChamadoCard } from '@/components/ChamadoCard';
import { EmptyState } from '@/components/EmptyState';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { type AppTheme, useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { useRadarData } from '@/hooks/useRadarData';
import type { AppStackParamList, AppTabParamList } from '@/navigation/types';
import { RadarHeaderFilters } from '@/screens/RadarBairro/components/RadarHeaderFilters';
import { spacing } from '@/theme';

type NavProp = CompositeNavigationProp<
  BottomTabNavigationProp<AppTabParamList, 'RadarBairroTab'>,
  NativeStackNavigationProp<AppStackParamList>
>;
type RadarRoute = RouteProp<AppTabParamList, 'RadarBairroTab'>;

export const RadarBairroScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RadarRoute>();
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  const radar = useRadarData(route.params?.categoria);

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
        sortBy={radar.sortBy}
        onChangeSort={radar.setSortBy}
        totalCount={radar.totalElements}
        hasActiveFilters={radar.hasActiveFilters}
        onClearFilters={radar.limparFiltros}
      />

      {radar.isLoading ? (
        <LoadingSpinner message="Buscando ocorrências..." />
      ) : radar.error && radar.chamados.length === 0 ? (
        <EmptyState
          icon="cloud-offline-outline"
          title="Erro ao consultar radar"
          description={radar.error}
          actionTitle="Tentar Novamente"
          onAction={() => { void radar.refetch(); }}
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
          contentContainerStyle={[styles.listContent, radar.chamados.length === 0 && styles.emptyContainer]}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshControl={<RefreshControl refreshing={radar.isRefreshing} onRefresh={() => { void radar.refetch(); }} tintColor={theme.primary} />}
          ListEmptyComponent={
            <EmptyState
              icon="search-outline"
              title="Nenhuma ocorrência encontrada"
              description="Tente ajustar os filtros de busca ou categoria para visualizar mais registros."
              actionTitle={radar.hasActiveFilters ? 'Limpar Filtros' : 'Reportar Agora'}
              onAction={() => (radar.hasActiveFilters ? radar.limparFiltros() : navigation.navigate('NovoChamadoTab'))}
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
    separator: { height: spacing.sm + 4 },
  });
