import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useChamados } from '../hooks/useChamados';
import { useAuth } from '../hooks/useAuth';
import { ChamadoCard, getPriorityConfig } from '../components/ChamadoCard';
import { CategoryBadge } from '../components/CategoryBadge';
import { EmptyState } from '../components/EmptyState';
import { colors, borderRadius, spacing, fontSize, fontWeight, shadows } from '../theme';
import { CategoriaChamado, StatusChamado, PrioridadeChamado } from '../types';
import { RootStackParamList } from '../navigation/types';

type RadarNavProp = NativeStackNavigationProp<RootStackParamList>;

const CATEGORIAS_LIST: (CategoriaChamado | 'Todas')[] = [
  'Todas',
  'Buraco na Rua',
  'Bueiro Entupido',
  'Iluminação Pública',
  'Entulho e Descarte Irregular',
  'Poda de Árvore',
  'Sinalização e Trânsito',
  'Vazamento de Água',
  'Outros',
];

const STATUS_LIST: (StatusChamado | 'Todos')[] = [
  'Todos',
  'Aberto',
  'Em Andamento',
  'Resolvido',
];

const PESO_PRIORIDADE: Record<PrioridadeChamado, number> = {
  Crítica: 4,
  Alta: 3,
  Média: 2,
  Baixa: 1,
};

type ModoExibicao = 'urgentes' | 'todas';

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

  // Ranking de ocorrências mais urgentes (Triagem IA + Apoios Comunitários)
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

  // Lista para o modo "Todas as Ocorrências"
  const listaTodas = useMemo(() => {
    return [...chamados];
  }, [chamados]);

  const listaAtual = modo === 'urgentes' ? rankingUrgentes : listaTodas;

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Top Bar: Título, Bairro e Botão Relatar */}
      <View style={styles.topRow}>
        <View style={{ flex: 1, paddingRight: spacing.sm }}>
          <Text style={styles.pageTitle}>Demandas & Prioridades</Text>
          <Text style={styles.pageSubtitle} numberOfLines={1}>
            Radar comunitário • {usuario?.bairro ? usuario.bairro.split('/')[0].trim() : 'Bela Vista'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.newReportButton}
          onPress={() => navigation.navigate('NovoChamado')}
          activeOpacity={0.85}
        >
          <Ionicons name="camera-outline" size={17} color={colors.surface} />
          <Text style={styles.newReportButtonText}>Relatar</Text>
        </TouchableOpacity>
      </View>

      {/* Barra de Busca de Demandas */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color={colors.secondary[400]} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por rua, problema ou protocolo..."
          placeholderTextColor={colors.text.tertiary}
          value={buscaLocal}
          onChangeText={handleSearchChange}
          returnKeyType="search"
        />
        {buscaLocal.length > 0 && (
          <TouchableOpacity
            onPress={handleClearSearch}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close-circle" size={18} color={colors.secondary[400]} />
          </TouchableOpacity>
        )}
      </View>

      {/* Seletor de Modo: Mais Urgentes vs Todas as Demandas */}
      <View style={styles.modeSwitchContainer}>
        <TouchableOpacity
          style={[styles.modeTab, modo === 'urgentes' && styles.modeTabActive]}
          onPress={() => setModo('urgentes')}
          activeOpacity={0.8}
        >
          <Ionicons
            name="flame"
            size={15}
            color={modo === 'urgentes' ? '#DC2626' : colors.secondary[400]}
          />
          <Text
            style={[
              styles.modeTabText,
              modo === 'urgentes' && styles.modeTabTextActive,
            ]}
            numberOfLines={1}
          >
            Mais Urgentes (IA)
          </Text>
          <View
            style={[
              styles.countBadgeMini,
              modo === 'urgentes' && styles.countBadgeMiniActive,
            ]}
          >
            <Text
              style={[
                styles.countBadgeMiniText,
                modo === 'urgentes' && styles.countBadgeMiniTextActive,
              ]}
            >
              {rankingUrgentes.length}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeTab, modo === 'todas' && styles.modeTabActive]}
          onPress={() => setModo('todas')}
          activeOpacity={0.8}
        >
          <Ionicons
            name="list-outline"
            size={15}
            color={modo === 'todas' ? colors.primary[700] : colors.secondary[400]}
          />
          <Text
            style={[
              styles.modeTabText,
              modo === 'todas' && styles.modeTabTextActive,
            ]}
            numberOfLines={1}
          >
            Todas as Demandas
          </Text>
          <View
            style={[
              styles.countBadgeMini,
              modo === 'todas' && styles.countBadgeMiniActive,
            ]}
          >
            <Text
              style={[
                styles.countBadgeMiniText,
                modo === 'todas' && styles.countBadgeMiniTextActive,
              ]}
            >
              {chamados.length}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Carrossel de Categorias */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterChipsRow}
      >
        {CATEGORIAS_LIST.map((cat) => {
          const isSelected = filtros.categoria === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.filterChip, isSelected && styles.filterChipActive]}
              onPress={() => setCategoriaFiltro(cat)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterChipText,
                  isSelected && styles.filterChipTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Pílulas de Filtro de Status (visível quando em "Todas as Demandas") */}
      {modo === 'todas' && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statusPillsRow}
        >
          {STATUS_LIST.map((st) => {
            const isSelected = filtros.status === st;
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
                  {st}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* Descrição / Legenda da Visualização */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionHeaderTitle}>
          {modo === 'urgentes'
            ? 'Ranking por Gravidade & Apoio Coletivo'
            : `Demandas Registradas (${listaAtual.length})`}
        </Text>

        {(filtros.categoria !== 'Todas' || filtros.status !== 'Todos' || filtros.busca) && (
          <TouchableOpacity
            onPress={() => {
              setBuscaLocal('');
              limparFiltros();
            }}
          >
            <Text style={styles.clearFiltersText}>Limpar filtros</Text>
          </TouchableOpacity>
        )}
      </View>

      {modo === 'urgentes' && (
        <Text style={styles.urgentesHint}>
          Triagem de IA + apoios da comunidade. Clique em "Apoiar" para aumentar a relevância da demanda perante a subprefeitura:
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {loading && !refreshing && chamados.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[600]} />
          <Text style={styles.loadingText}>Carregando radar de demandas...</Text>
        </View>
      ) : (
        <FlatList
          data={listaAtual}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
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
          renderItem={({ item, index }) => {
            // No modo "Mais Urgentes", renderiza card de ranking prioritário com IA
            if (modo === 'urgentes') {
              const prio = getPriorityConfig(item.prioridade);
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.85}
                  style={[styles.priorityCard, shadows.sm]}
                  onPress={() => navigation.navigate('ChamadoDetails', { id: item.id })}
                >
                  {/* Topo do Card de Urgência */}
                  <View style={styles.rankTopRow}>
                    <View style={styles.rankPositionBadge}>
                      <Text style={styles.rankPositionText}>#{index + 1} Prioridade</Text>
                    </View>

                    <View
                      style={[
                        styles.urgencyPill,
                        { backgroundColor: prio.bg, borderColor: prio.border },
                      ]}
                    >
                      <Ionicons name={prio.icon} size={12} color={prio.text} />
                      <Text style={[styles.urgencyPillText, { color: prio.text }]}>
                        Urgência {item.prioridade}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.itemTitle}>{item.titulo}</Text>

                  <View style={styles.metaRow}>
                    <CategoryBadge categoria={item.categoria} />
                    <Text style={styles.addressText} numberOfLines={1}>
                      {item.localizacao.logradouro}, {item.localizacao.numero}
                    </Text>
                  </View>

                  {/* Resumo da Triagem IA */}
                  {item.parecerIa && (
                    <View style={styles.aiInsightBox}>
                      <Ionicons name="sparkles" size={14} color={colors.primary[700]} />
                      <Text style={styles.aiInsightText} numberOfLines={3}>
                        {item.parecerIa}
                      </Text>
                    </View>
                  )}

                  {/* Rodapé Interativo: Apoios + Botão Apoiar */}
                  <View style={styles.actionFooter}>
                    <View style={styles.supportersInfo}>
                      <Ionicons name="people" size={16} color={colors.secondary[600]} />
                      <Text style={styles.supportersCountText}>
                        <Text style={styles.boldNum}>{item.apoiosCount || 1}</Text> moradores afetados
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.upvoteButton,
                        item.apoiadoPeloUsuario && styles.upvoteButtonActive,
                      ]}
                      onPress={() => apoiarChamado(item.id)}
                      activeOpacity={0.75}
                    >
                      <Ionicons
                        name={item.apoiadoPeloUsuario ? 'checkmark-circle' : 'arrow-up-circle-outline'}
                        size={16}
                        color={item.apoiadoPeloUsuario ? colors.surface : colors.primary[700]}
                      />
                      <Text
                        style={[
                          styles.upvoteButtonText,
                          item.apoiadoPeloUsuario && styles.upvoteButtonTextActive,
                        ]}
                      >
                        {item.apoiadoPeloUsuario ? 'Apoiado' : 'Apoiar (+1)'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            }

            // No modo "Todas as Demandas", usa o ChamadoCard completo
            return (
              <ChamadoCard
                chamado={item}
                onPress={() => navigation.navigate('ChamadoDetails', { id: item.id })}
              />
            );
          }}
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

      {/* Botão Flutuante (FAB) para Novo Relato */}
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
    fontSize: fontSize.body,
    color: colors.secondary[500],
    marginTop: spacing.md,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: 110,
  },
  headerContainer: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  pageTitle: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.extrabold,
    color: colors.secondary[900],
  },
  pageSubtitle: {
    fontSize: fontSize.caption,
    color: colors.secondary[500],
    marginTop: 2,
  },
  newReportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary[600],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    flexShrink: 0,
    ...shadows.sm,
  },
  newReportButtonText: {
    color: colors.surface,
    fontSize: fontSize.bodySmall,
    fontWeight: fontWeight.bold,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 44,
    marginBottom: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.bodySmall,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  modeSwitchContainer: {
    flexDirection: 'row',
    backgroundColor: colors.secondary[200],
    borderRadius: borderRadius.md,
    padding: 3,
    marginBottom: spacing.xs,
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 7,
    paddingHorizontal: 2,
    borderRadius: borderRadius.sm,
  },
  modeTabActive: {
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  modeTabText: {
    fontSize: 11.5,
    fontWeight: fontWeight.semibold,
    color: colors.secondary[600],
  },
  modeTabTextActive: {
    color: colors.primary[700],
    fontWeight: fontWeight.bold,
  },
  countBadgeMini: {
    backgroundColor: colors.secondary[200],
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: borderRadius.full,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadgeMiniActive: {
    backgroundColor: colors.primary[100],
  },
  countBadgeMiniText: {
    fontSize: 10,
    fontWeight: fontWeight.bold,
    color: colors.secondary[700],
  },
  countBadgeMiniTextActive: {
    color: colors.primary[800],
  },
  filterChipsRow: {
    gap: spacing.xs + 2,
    paddingVertical: spacing.xs,
    paddingRight: spacing.xl,
    marginBottom: spacing.xs,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary[600],
    borderColor: colors.primary[600],
  },
  filterChipText: {
    fontSize: fontSize.caption,
    color: colors.secondary[700],
    fontWeight: fontWeight.medium,
  },
  filterChipTextActive: {
    color: colors.surface,
    fontWeight: fontWeight.bold,
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
    paddingVertical: 6,
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
    fontWeight: fontWeight.medium,
    color: colors.secondary[600],
  },
  statusPillTextActive: {
    color: colors.surface,
    fontWeight: fontWeight.bold,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
    marginBottom: 4,
  },
  sectionHeaderTitle: {
    fontSize: fontSize.bodySmall,
    fontWeight: fontWeight.bold,
    color: colors.secondary[800],
  },
  clearFiltersText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    color: colors.primary[600],
  },
  urgentesHint: {
    fontSize: fontSize.tiny,
    color: colors.secondary[500],
    lineHeight: 16,
    marginBottom: spacing.xs,
  },
  priorityCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  rankTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs + 2,
  },
  rankPositionBadge: {
    backgroundColor: colors.secondary[900],
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  rankPositionText: {
    color: colors.surface,
    fontSize: fontSize.tiny,
    fontWeight: fontWeight.extrabold,
    letterSpacing: 0.5,
  },
  urgencyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  urgencyPillText: {
    fontSize: fontSize.tiny,
    fontWeight: fontWeight.bold,
  },
  itemTitle: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    color: colors.secondary[900],
    marginBottom: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs + 2,
  },
  addressText: {
    flex: 1,
    fontSize: fontSize.caption,
    color: colors.secondary[600],
  },
  aiInsightBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: colors.primary[50],
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary[100],
    marginBottom: spacing.sm,
  },
  aiInsightText: {
    flex: 1,
    fontSize: fontSize.caption,
    color: colors.primary[900],
    lineHeight: 16,
  },
  actionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.xs + 2,
    borderTopWidth: 1,
    borderTopColor: colors.secondary[100],
  },
  supportersInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  supportersCountText: {
    fontSize: fontSize.caption,
    color: colors.secondary[700],
  },
  boldNum: {
    fontWeight: fontWeight.bold,
    color: colors.secondary[900],
  },
  upvoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.primary[50],
    borderWidth: 1,
    borderColor: colors.primary[300],
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
  },
  upvoteButtonActive: {
    backgroundColor: colors.primary[600],
    borderColor: colors.primary[600],
  },
  upvoteButtonText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    color: colors.primary[700],
  },
  upvoteButtonTextActive: {
    color: colors.surface,
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
