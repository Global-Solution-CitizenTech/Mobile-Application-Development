import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useChamados } from '../../hooks/useChamados';
import { useAuth } from '../../hooks/useAuth';
import { ChamadoCard } from '../../components/ChamadoCard';
import { EmptyState } from '../../components/EmptyState';
import { RadarHeaderFilters, ModoExibicao } from './components/RadarHeaderFilters';
import { colors, spacing, fontSize, shadows } from '../../theme';
import { PrioridadeChamado } from '../../types';
import { RootStackParamList } from '../../navigation/types';

type RadarNavProp = NativeStackNavigationProp<RootStackParamList>;

const PESO_PRIORIDADE: Record<PrioridadeChamado, number> = {
  Crítica: 4,
  Alta: 3,
  Média: 2,
  Baixa: 1,
};

export const RadarBairroScreen: React.FC = () => {
  const navigation = useNavigation<RadarNavProp>();
  const { usuario } = useAuth();
  const {
    chamados,
    loading,
    refreshing,
    filtros,
    carregarChamados,
    setCategoriaFiltro,
    setStatusFiltro,
    setBuscaFiltro,
    limparFiltros,
    apoiarChamado,
  } = useChamados();

  const [modo, setModo] = useState<ModoExibicao>('urgentes');
  const [buscaLocal, setBuscaLocal] = useState('');

  useFocusEffect(
    useCallback(() => {
      carregarChamados(undefined, true);
    }, [carregarChamados])
  );

  const handleSearchChange = (text: string) => {
    setBuscaLocal(text);
    setBuscaFiltro(text);
  };

  const handleClearSearch = () => {
    setBuscaLocal('');
    setBuscaFiltro('');
  };

  const rankingUrgentes = useMemo(() => {
    return [...chamados]
      .filter((c) => c.status !== 'Resolvido')
      .sort((a, b) => {
        const pesoDiff =
          (PESO_PRIORIDADE[b.prioridade] || 1) - (PESO_PRIORIDADE[a.prioridade] || 1);
        if (pesoDiff !== 0) return pesoDiff;
        return (b.apoiosCount || 0) - (a.apoiosCount || 0);
      });
  }, [chamados]);

  const listaTodas = useMemo(() => [...chamados], [chamados]);
  const listaAtual = modo === 'urgentes' ? rankingUrgentes : listaTodas;

  const hasActiveFilters =
    filtros.categoria !== 'Todas' || filtros.status !== 'Todos' || !!filtros.busca;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {loading && !refreshing && chamados.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[600]} />
          <Text style={styles.loadingText}>Carregando demandas...</Text>
        </View>
      ) : (
        <FlatList
          data={listaAtual}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <RadarHeaderFilters
              bairroNome={usuario?.bairro ? usuario.bairro.split('/')[0].trim() : 'Bela Vista'}
              totalListados={listaAtual.length}
              urgentesCount={rankingUrgentes.length}
              totalCount={chamados.length}
              modo={modo}
              buscaLocal={buscaLocal}
              filtros={filtros}
              hasActiveFilters={hasActiveFilters}
              onModoChange={setModo}
              onSearchChange={handleSearchChange}
              onClearSearch={handleClearSearch}
              onClearAllFilters={() => {
                setBuscaLocal('');
                limparFiltros();
              }}
              onSelectCategoria={setCategoriaFiltro}
              onSelectStatus={setStatusFiltro}
            />
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => carregarChamados(undefined, true)}
              colors={[colors.primary[600]]}
              tintColor={colors.primary[600]}
            />
          }
          renderItem={({ item, index }) => (
            <ChamadoCard
              chamado={item}
              rankNumber={modo === 'urgentes' ? index + 1 : undefined}
              onSupportPress={() => apoiarChamado(item.id)}
              onPress={() => navigation.navigate('ChamadoDetails', { id: item.id })}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="search-outline"
              title="Nenhuma ocorrência encontrada"
              description="Não localizamos demandas para os filtros ou busca informada."
              actionTitle="Abrir Novo Relato"
              onAction={() => navigation.navigate('NovoChamado')}
            />
          }
        />
      )}

      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => navigation.navigate('NovoChamado')}
        activeOpacity={0.9}
      >
        <Ionicons name="add" size={28} color={colors.surface} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: fontSize.bodySmall,
    color: colors.secondary[500],
    marginTop: spacing.md,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: 110,
  },
  fabButton: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
});
