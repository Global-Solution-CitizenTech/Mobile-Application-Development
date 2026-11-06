import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { useChamados } from '../hooks/useChamados';
import { ChamadoCard } from '../components/ChamadoCard';
import { EmptyState } from '../components/EmptyState';
import { colors, borderRadius, spacing, fontSize, fontWeight } from '../theme';
import { StatusChamado } from '../types';
import { RootStackParamList } from '../navigation/types';

type MeusChamadosNavProp = NativeStackNavigationProp<RootStackParamList>;

const STATUS_TABS: (StatusChamado | 'Todos')[] = [
  'Todos',
  'Aberto',
  'Em Andamento',
  'Resolvido',
];

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

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.titleRow}>
        <View style={{ flex: 1, paddingRight: spacing.sm }}>
          <Text style={styles.pageTitle}>Meus Relatos</Text>
          <Text style={styles.pageSubtitle} numberOfLines={1}>
            Acompanhe o andamento dos seus {totalMeus} protocolos abertos
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('NovoChamado')}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={18} color={colors.primary[700]} />
          <Text style={styles.addBtnText}>Novo</Text>
        </TouchableOpacity>
      </View>

      {/* Filtro de Status em Chips Horizontais sem quebra feia de linha */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statusPillsRow}
      >
        {STATUS_TABS.map((st) => {
          const isSelected = statusFiltro === st;
          return (
            <TouchableOpacity
              key={st}
              style={[styles.statusPill, isSelected && styles.statusPillActive]}
              onPress={() => setStatusFiltro(st)}
              activeOpacity={0.75}
            >
              <Text
                style={[
                  styles.statusPillText,
                  isSelected && styles.statusPillTextActive,
                ]}
                numberOfLines={1}
              >
                {st} ({statusCounts[st]})
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <FlatList
        data={meusChamados}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <ChamadoCard
            chamado={item}
            onPress={() => navigation.navigate('ChamadoDetails', { id: item.id })}
          />
        )}
        contentContainerStyle={styles.listContent}
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
            description="Você ainda não possui ocorrências registradas com este filtro. Viu algum problema na sua rua?"
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
  headerContainer: {
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  pageTitle: {
    fontSize: fontSize.heading,
    fontWeight: fontWeight.extrabold,
    color: colors.secondary[900],
  },
  pageSubtitle: {
    fontSize: fontSize.caption,
    color: colors.secondary[500],
    marginTop: 2,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  addBtnText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    color: colors.primary[700],
  },
  statusPillsRow: {
    flexDirection: 'row',
    gap: spacing.xs + 2,
    paddingVertical: spacing.xs,
    paddingRight: spacing.xl,
    marginBottom: spacing.xs,
  },
  statusPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusPillActive: {
    backgroundColor: colors.primary[600],
    borderColor: colors.primary[600],
  },
  statusPillText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    color: colors.secondary[600],
  },
  statusPillTextActive: {
    color: colors.surface,
    fontWeight: fontWeight.bold,
  },
});
