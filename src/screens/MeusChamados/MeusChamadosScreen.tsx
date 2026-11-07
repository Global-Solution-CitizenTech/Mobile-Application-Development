import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../hooks/useAuth';
import { useChamados } from '../../hooks/useChamados';
import { ChamadoCard } from '../../components/ChamadoCard';
import { EmptyState } from '../../components/EmptyState';
import { MeusChamadosHeader } from './components/MeusChamadosHeader';
import { colors, spacing } from '../../theme';
import { StatusChamado } from '../../types';
import { RootStackParamList } from '../../navigation/types';

type MeusChamadosNavProp = NativeStackNavigationProp<RootStackParamList>;

export const MeusChamadosScreen: React.FC = () => {
  const navigation = useNavigation<MeusChamadosNavProp>();
  const { usuario } = useAuth();
  const { chamados, refreshing, carregarChamados } = useChamados();

  const [statusFiltro, setStatusFiltro] = useState<StatusChamado | 'Todos'>('Todos');

  useFocusEffect(
    useCallback(() => {
      carregarChamados(
        { categoria: 'Todas', status: 'Todos', busca: '', apenasMeus: false },
        true
      );
    }, [carregarChamados])
  );

  const meusChamados = useMemo(() => {
    const doUsuario = chamados.filter((c) => c.autorId === usuario?.id);
    if (statusFiltro === 'Todos') return doUsuario;
    return doUsuario.filter((c) => c.status === statusFiltro);
  }, [chamados, usuario?.id, statusFiltro]);

  const totalMeus = useMemo(
    () => chamados.filter((c) => c.autorId === usuario?.id).length,
    [chamados, usuario?.id]
  );

  const statusCounts = useMemo(() => {
    const doUsuario = chamados.filter((c) => c.autorId === usuario?.id);
    return {
      Todos: doUsuario.length,
      Aberto: doUsuario.filter((c) => c.status === 'Aberto').length,
      'Em Andamento': doUsuario.filter((c) => c.status === 'Em Andamento').length,
      Resolvido: doUsuario.filter((c) => c.status === 'Resolvido').length,
    };
  }, [chamados, usuario?.id]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <FlatList
        data={meusChamados}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <MeusChamadosHeader
            totalMeus={totalMeus}
            statusFiltro={statusFiltro}
            statusCounts={statusCounts}
            onSelectStatus={setStatusFiltro}
            onNovoRelato={() => navigation.navigate('NovoChamado')}
          />
        }
        renderItem={({ item }) => (
          <ChamadoCard
            chamado={item}
            onPress={() => navigation.navigate('ChamadoDetails', { id: item.id })}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() =>
              carregarChamados(
                { categoria: 'Todas', status: 'Todos', busca: '', apenasMeus: false },
                true
              )
            }
            colors={[colors.primary[600]]}
            tintColor={colors.primary[600]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="document-text-outline"
            title="Nenhum relato neste status"
            description="Você ainda não possui ocorrências registradas com este filtro."
            actionTitle="Registrar Nova Ocorrência"
            onAction={() => navigation.navigate('NovoChamado')}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxxl,
  },
});
