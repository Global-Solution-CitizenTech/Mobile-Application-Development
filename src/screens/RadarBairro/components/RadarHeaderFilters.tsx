import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { type AppTheme, useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import type { RadarSortOption } from '@/hooks/useRadarData';
import { FilterChipRow, type FilterChipOption } from '@/screens/RadarBairro/components/FilterChipRow';
import { borderRadius, fontSize, fontWeight, spacing } from '@/theme';
import { STATUS_OPTIONS } from '@/theme/semanticConfig';
import type { CategoriaResponse, StatusChamado } from '@/types/categoria';

interface RadarHeaderFiltersProps {
  busca: string;
  onChangeBusca: (text: string) => void;
  categorias: CategoriaResponse[];
  categoriaFiltro: string;
  onChangeCategoria: (categoria: string) => void;
  statusFiltro: StatusChamado | 'TODOS';
  onChangeStatus: (status: StatusChamado | 'TODOS') => void;
  sortBy: RadarSortOption;
  onChangeSort: (sort: RadarSortOption) => void;
  totalCount: number;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

const STATUS_FILTER_OPTIONS: FilterChipOption<StatusChamado | 'TODOS'>[] = [
  { value: 'TODOS', label: 'Todos Status' },
  ...STATUS_OPTIONS,
];

export const RadarHeaderFilters: React.FC<RadarHeaderFiltersProps> = ({
  busca,
  onChangeBusca,
  categorias,
  categoriaFiltro,
  onChangeCategoria,
  statusFiltro,
  onChangeStatus,
  sortBy,
  onChangeSort,
  totalCount,
  hasActiveFilters,
  onClearFilters,
}) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();

  const categoriaOptions: FilterChipOption<string>[] = [
    { value: 'TODAS', label: 'Todas Categorias' },
    ...categorias.map((c) => ({ value: c.nome, label: c.nome })),
  ];

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, spacing.md) }]}>
      <View style={styles.titleRow}>
        <View>
          <Text style={styles.title}>Radar da Cidade</Text>
          <Text style={styles.subtitle}>{totalCount} {totalCount === 1 ? 'ocorrência' : 'ocorrências'}</Text>
        </View>

        <View style={styles.sortRow}>
          <TouchableOpacity
            style={[styles.sortBtn, sortBy === 'RECENTES' && styles.sortBtnActive]}
            onPress={() => onChangeSort('RECENTES')}
          >
            <Text style={[styles.sortText, sortBy === 'RECENTES' && styles.sortTextActive]}>Recentes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortBtn, sortBy === 'MAIS_APOIADOS' && styles.sortBtnActive]}
            onPress={() => onChangeSort('MAIS_APOIADOS')}
          >
            <Text style={[styles.sortText, sortBy === 'MAIS_APOIADOS' && styles.sortTextActive]}>+ Apoios</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color={theme.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por rua, título ou bairro..."
          placeholderTextColor={theme.textMuted}
          value={busca}
          onChangeText={onChangeBusca}
          returnKeyType="search"
        />
        {busca.length > 0 && (
          <TouchableOpacity onPress={() => onChangeBusca('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={theme.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      <FilterChipRow options={categoriaOptions} selectedValue={categoriaFiltro} onSelect={onChangeCategoria} />
      <FilterChipRow options={STATUS_FILTER_OPTIONS} selectedValue={statusFiltro} onSelect={onChangeStatus} />

      {hasActiveFilters && (
        <TouchableOpacity style={styles.clearBtn} onPress={onClearFilters}>
          <Ionicons name="refresh-outline" size={14} color={theme.primary} />
          <Text style={styles.clearText}>Limpar Filtros</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      paddingBottom: spacing.sm + 4,
      gap: spacing.sm,
    },
    titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.md },
    title: { fontSize: fontSize.heading, fontWeight: fontWeight.extrabold, color: theme.text },
    subtitle: { fontSize: fontSize.caption, color: theme.textSecondary },
    sortRow: { flexDirection: 'row', backgroundColor: theme.cardSubtle, borderRadius: borderRadius.full, padding: 3 },
    sortBtn: { paddingHorizontal: spacing.sm + 2, paddingVertical: 5, borderRadius: borderRadius.full },
    sortBtnActive: { backgroundColor: theme.surface },
    sortText: { fontSize: fontSize.caption, fontWeight: fontWeight.semibold, color: theme.textSecondary },
    sortTextActive: { color: theme.primary, fontWeight: fontWeight.bold },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginHorizontal: spacing.md,
      paddingHorizontal: spacing.sm + 4,
      height: 42,
      borderRadius: borderRadius.md,
      backgroundColor: theme.cardSubtle,
      borderWidth: 1,
      borderColor: theme.border,
    },
    searchInput: { flex: 1, fontSize: fontSize.body, color: theme.text },
    clearBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-end', paddingHorizontal: spacing.md },
    clearText: { fontSize: fontSize.caption, fontWeight: fontWeight.bold, color: theme.primary },
  });
