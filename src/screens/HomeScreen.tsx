import React, { useState, useCallback } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { useChamados } from '../hooks/useChamados';
import { ChamadoCard } from '../components/ChamadoCard';
import { EmptyState } from '../components/EmptyState';
import { colors, borderRadius, spacing, fontSize, fontWeight, shadows } from '../theme';
import { CategoriaChamado } from '../types';
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

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { usuario } = useAuth();
  const {
    chamados,
    loading,
    refreshing,
    filtros,
    carregarChamados,
    setCategoriaFiltro,
    setBuscaFiltro,
    limparFiltros,
  } = useChamados();

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

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Barra Superior Limpa: Saudação + Bairro + Botão Rápido */}
      <View style={styles.citizenBar}>
        <View style={styles.citizenInfo}>
          <Text style={styles.greetingText}>
            Olá, {usuario?.nome?.split(' ')[0] || 'Cidadão'}
          </Text>
          <View style={styles.neighborhoodBadge}>
            <Ionicons name="location" size={13} color={colors.primary[700]} />
            <Text style={styles.neighborhoodText}>
              {usuario?.bairro || 'Bela Vista / Paulista'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.newReportButton}
          onPress={() => navigation.navigate('NovoChamado')}
          activeOpacity={0.85}
        >
          <Ionicons name="camera-outline" size={18} color={colors.surface} />
          <Text style={styles.newReportButtonText}>Relatar</Text>
        </TouchableOpacity>
      </View>

      {/* Barra de Busca Enxuta */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={19} color={colors.secondary[400]} />
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

      {/* Filtro Rápido por Categorias */}
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

      {/* Título da Lista */}
      <View style={styles.feedHeaderRow}>
        <Text style={styles.feedSectionTitle}>
          Feed da Comunidade ({chamados.length})
        </Text>
        {(filtros.categoria !== 'Todas' || filtros.busca) && (
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
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {loading && !refreshing && chamados.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[600]} />
          <Text style={styles.loadingText}>Carregando feed do bairro...</Text>
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
              description="Não encontramos relatos para a categoria ou endereço pesquisado."
              actionTitle="Abrir Novo Relato"
              onAction={() => navigation.navigate('NovoChamado')}
            />
          }
        />
      )}

      {/* Botão Flutuante (FAB) para Abrir Relato */}
      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => navigation.navigate('NovoChamado')}
        activeOpacity={0.9}
      >
        <Ionicons name="add" size={26} color={colors.surface} />
      </TouchableOpacity>
    </SafeAreaView>
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
    paddingBottom: 96,
  },
  headerContainer: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
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
    fontWeight: fontWeight.semibold,
    color: colors.primary[700],
  },
  newReportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 46,
    marginBottom: spacing.sm + 2,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.bodySmall,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  filterChipsRow: {
    gap: spacing.xs + 2,
    paddingVertical: spacing.xs,
    marginBottom: spacing.xs,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
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
  feedHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  feedSectionTitle: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    color: colors.secondary[800],
  },
  clearFiltersText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    color: colors.primary[600],
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
