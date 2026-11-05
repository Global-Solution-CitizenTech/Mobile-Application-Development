import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { useChamados } from '../hooks/useChamados';
import { ChamadoCard } from '../components/ChamadoCard';
import { StatCard } from '../components/StatCard';
import { EmptyState } from '../components/EmptyState';
import { FeedbackModal } from '../components/FeedbackModal';
import { colors, borderRadius, spacing, fontSize, fontWeight, shadows } from '../theme';
import { CategoriaChamado, StatusChamado } from '../types';
import { RootStackParamList } from '../navigation/types';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

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

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { usuario } = useAuth();
  const {
    chamados,
    loading,
    refreshing,
    error,
    filtros,
    estatisticas,
    carregarChamados,
    setCategoriaFiltro,
    setStatusFiltro,
    setBuscaFiltro,
    setApenasMeusFiltro,
    limparFiltros,
  } = useChamados();

  const [buscaLocal, setBuscaLocal] = useState('');
  const [modalFeedback, setModalFeedback] = useState<string | null>(null);

  const handleSearchSubmit = () => {
    setBuscaFiltro(buscaLocal);
  };

  const handleClearSearch = () => {
    setBuscaLocal('');
    setBuscaFiltro('');
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Barra de Boas-Vindas */}
      <View style={styles.citizenBar}>
        <View style={styles.citizenInfo}>
          <Text style={styles.greetingText}>Olá, {usuario?.nome?.split(' ')[0] || 'Cidadão'}</Text>
          <View style={styles.neighborhoodBadge}>
            <Ionicons name="location" size={12} color={colors.primary[700]} />
            <Text style={styles.neighborhoodText}>
              Bairro: {usuario?.bairro || 'São Paulo / Região Central'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.newReportButton}
          onPress={() => navigation.navigate('NovoChamado')}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={20} color={colors.surface} />
          <Text style={styles.newReportButtonText}>Relatar</Text>
        </TouchableOpacity>
      </View>

      {/* Cartões com Métricas e Resumo da Zeladoria */}
      <View style={styles.statsRow}>
        <StatCard
          label="Total"
          value={estatisticas.total}
          icon="stats-chart-outline"
          color={colors.secondary[700]}
          bgColor={colors.secondary[100]}
        />
        <StatCard
          label="Abertos"
          value={estatisticas.abertos}
          icon="alert-circle-outline"
          color={colors.status.aberto.icon}
          bgColor={colors.status.aberto.bg}
        />
        <StatCard
          label="Em Ação"
          value={estatisticas.emAndamento}
          icon="time-outline"
          color={colors.status.emAndamento.icon}
          bgColor={colors.status.emAndamento.bg}
        />
        <StatCard
          label="Resolvidos"
          value={estatisticas.resolvidos}
          icon="checkmark-done-outline"
          color={colors.status.resolvido.icon}
          bgColor={colors.status.resolvido.bg}
        />
      </View>

      {/* Barra de Busca de Ocorrências */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={colors.secondary[400]} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por rua, problema ou protocolo..."
          placeholderTextColor={colors.text.tertiary}
          value={buscaLocal}
          onChangeText={setBuscaLocal}
          onSubmitEditing={handleSearchSubmit}
          returnKeyType="search"
        />
        {buscaLocal.length > 0 && (
          <TouchableOpacity onPress={handleClearSearch} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close-circle" size={18} color={colors.secondary[400]} />
          </TouchableOpacity>
        )}
      </View>

      {/* Alternador de Visualização: Todos vs Meus Chamados */}
      <View style={styles.scopeSwitchContainer}>
        <TouchableOpacity
          style={[
            styles.scopeTab,
            !filtros.apenasMeus && styles.scopeTabActive,
          ]}
          onPress={() => setApenasMeusFiltro(false)}
        >
          <Ionicons
            name="globe-outline"
            size={16}
            color={!filtros.apenasMeus ? colors.primary[700] : colors.secondary[500]}
          />
          <Text
            style={[
              styles.scopeTabText,
              !filtros.apenasMeus && styles.scopeTabTextActive,
            ]}
          >
            Todos do Bairro
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.scopeTab,
            filtros.apenasMeus && styles.scopeTabActive,
          ]}
          onPress={() => setApenasMeusFiltro(true)}
        >
          <Ionicons
            name="person-outline"
            size={16}
            color={filtros.apenasMeus ? colors.primary[700] : colors.secondary[500]}
          />
          <Text
            style={[
              styles.scopeTabText,
              filtros.apenasMeus && styles.scopeTabTextActive,
            ]}
          >
            Meus Chamados
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filtro por Categorias (Scroll Horizontal) */}
      <View style={styles.filtersSection}>
        <Text style={styles.filterTitle}>Filtrar por Categoria</Text>
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
                style={[
                  styles.filterChip,
                  isSelected && styles.filterChipActive,
                ]}
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
      </View>

      {/* Filtro por Status */}
      <View style={styles.statusPillsRow}>
        {STATUS_LIST.map((st) => {
          const isSelected = filtros.status === st;
          return (
            <TouchableOpacity
              key={st}
              style={[
                styles.statusPill,
                isSelected && styles.statusPillActive,
              ]}
              onPress={() => setStatusFiltro(st)}
            >
              <Text
                style={[
                  styles.statusPillText,
                  isSelected && styles.statusPillTextActive,
                ]}
              >
                {st}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Título da Seção do Feed */}
      <View style={styles.feedHeaderRow}>
        <Text style={styles.feedSectionTitle}>
          Ocorrências Encontradas ({chamados.length})
        </Text>
        {(filtros.categoria !== 'Todas' ||
          filtros.status !== 'Todos' ||
          filtros.busca ||
          filtros.apenasMeus) && (
          <TouchableOpacity onPress={limparFiltros} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.clearFiltersText}>Limpar filtros</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading && !refreshing && chamados.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[600]} />
          <Text style={styles.loadingText}>Carregando dados de zeladoria...</Text>
        </View>
      ) : (
        <FlatList
          data={chamados}
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
              onRefresh={() => carregarChamados(undefined, true)}
              colors={[colors.primary[600]]}
              tintColor={colors.primary[600]}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon="search-outline"
              title="Nenhuma ocorrência encontrada"
              description="Não encontramos chamados para os filtros selecionados ou para o termo pesquisado."
              actionTitle="Registrar Novo Chamado"
              onAction={() => navigation.navigate('NovoChamado')}
            />
          }
        />
      )}

      {/* Modal de Feedback se necessário */}
      <FeedbackModal
        visible={!!modalFeedback}
        type="info"
        title="Aviso"
        message={modalFeedback || ''}
        confirmText="OK"
        onConfirm={() => setModalFeedback(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
    paddingBottom: spacing.xxl,
  },
  headerContainer: {
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  citizenBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  citizenInfo: {
    flex: 1,
  },
  greetingText: {
    fontSize: fontSize.heading,
    fontWeight: fontWeight.extrabold,
    color: colors.secondary[900],
    letterSpacing: -0.3,
  },
  neighborhoodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  neighborhoodText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.medium,
    color: colors.primary[700],
  },
  newReportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary[600],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    ...shadows.sm,
  },
  newReportButtonText: {
    color: colors.surface,
    fontSize: fontSize.bodySmall,
    fontWeight: fontWeight.bold,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.xs + 2,
    marginBottom: spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 48,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.body,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  scopeSwitchContainer: {
    flexDirection: 'row',
    backgroundColor: colors.secondary[200],
    borderRadius: borderRadius.md,
    padding: 3,
    marginBottom: spacing.md,
  },
  scopeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.sm,
  },
  scopeTabActive: {
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  scopeTabText: {
    fontSize: fontSize.bodySmall,
    fontWeight: fontWeight.semibold,
    color: colors.secondary[600],
  },
  scopeTabTextActive: {
    color: colors.primary[700],
    fontWeight: fontWeight.bold,
  },
  filtersSection: {
    marginBottom: spacing.sm,
  },
  filterTitle: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    color: colors.secondary[600],
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterChipsRow: {
    gap: spacing.xs + 2,
    paddingVertical: 2,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
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
    fontWeight: fontWeight.medium,
    color: colors.secondary[700],
  },
  filterChipTextActive: {
    color: colors.surface,
    fontWeight: fontWeight.bold,
  },
  statusPillsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.md,
    marginTop: spacing.xs,
  },
  statusPill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusPillActive: {
    backgroundColor: colors.secondary[800],
    borderColor: colors.secondary[800],
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
  feedHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  feedSectionTitle: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.bold,
    color: colors.secondary[900],
  },
  clearFiltersText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    color: colors.primary[600],
  },
});

