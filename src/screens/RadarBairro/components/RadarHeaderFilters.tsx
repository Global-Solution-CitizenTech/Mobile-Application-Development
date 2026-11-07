import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, fontSize, fontWeight, shadows } from '../../../theme';
import { CategoriaChamado, StatusChamado, FiltroChamados } from '../../../types';

export type ModoExibicao = 'urgentes' | 'todas';

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

interface RadarHeaderFiltersProps {
  bairroNome: string;
  totalListados: number;
  urgentesCount: number;
  totalCount: number;
  modo: ModoExibicao;
  buscaLocal: string;
  filtros: FiltroChamados;
  hasActiveFilters: boolean;
  onModoChange: (m: ModoExibicao) => void;
  onSearchChange: (t: string) => void;
  onClearSearch: () => void;
  onClearAllFilters: () => void;
  onSelectCategoria: (cat: CategoriaChamado | 'Todas') => void;
  onSelectStatus: (st: StatusChamado | 'Todos') => void;
}

export const RadarHeaderFilters: React.FC<RadarHeaderFiltersProps> = ({
  bairroNome,
  totalListados,
  urgentesCount,
  totalCount,
  modo,
  buscaLocal,
  filtros,
  hasActiveFilters,
  onModoChange,
  onSearchChange,
  onClearSearch,
  onClearAllFilters,
  onSelectCategoria,
  onSelectStatus,
}) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.topRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.pageTitle}>Demandas</Text>
          <Text style={styles.pageSubtitle} numberOfLines={1}>
            {bairroNome} • {totalListados}{' '}
            {totalListados === 1 ? 'ocorrência listada' : 'ocorrências listadas'}
          </Text>
        </View>

        {hasActiveFilters && (
          <TouchableOpacity
            style={styles.clearPill}
            onPress={onClearAllFilters}
            activeOpacity={0.7}
          >
            <Ionicons name="refresh" size={13} color={colors.primary[700]} />
            <Text style={styles.clearFiltersText}>Limpar</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color={colors.secondary[400]} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por rua, problema ou protocolo..."
          placeholderTextColor={colors.text.tertiary}
          value={buscaLocal}
          onChangeText={onSearchChange}
          returnKeyType="search"
        />
        {buscaLocal.length > 0 && (
          <TouchableOpacity
            onPress={onClearSearch}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close-circle" size={18} color={colors.secondary[400]} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.modeSwitchContainer}>
        <TouchableOpacity
          style={[styles.modeTab, modo === 'urgentes' && styles.modeTabActive]}
          onPress={() => onModoChange('urgentes')}
          activeOpacity={0.8}
        >
          <Ionicons
            name="flame"
            size={14}
            color={modo === 'urgentes' ? '#DC2626' : colors.secondary[400]}
          />
          <Text
            style={[
              styles.modeTabText,
              modo === 'urgentes' && styles.modeTabTextActive,
            ]}
            numberOfLines={1}
          >
            Mais Urgentes ({urgentesCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeTab, modo === 'todas' && styles.modeTabActive]}
          onPress={() => onModoChange('todas')}
          activeOpacity={0.8}
        >
          <Ionicons
            name="layers-outline"
            size={14}
            color={modo === 'todas' ? colors.primary[700] : colors.secondary[400]}
          />
          <Text
            style={[
              styles.modeTabText,
              modo === 'todas' && styles.modeTabTextActive,
            ]}
            numberOfLines={1}
          >
            Todas ({totalCount})
          </Text>
        </TouchableOpacity>
      </View>

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
              onPress={() => onSelectCategoria(cat)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterChipText,
                  isSelected && styles.filterChipTextActive,
                ]}
              >
                {cat === 'Entulho e Descarte Irregular' ? 'Descarte Irregular' : cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

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
                onPress={() => onSelectStatus(st)}
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
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  pageTitle: {
    fontSize: fontSize.heading,
    fontWeight: fontWeight.extrabold,
    color: colors.secondary[900],
    letterSpacing: -0.3,
  },
  pageSubtitle: {
    fontSize: fontSize.caption,
    color: colors.secondary[500],
    marginTop: 2,
  },
  clearPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
  },
  clearFiltersText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    color: colors.primary[700],
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.secondary[100],
    paddingHorizontal: spacing.md,
    height: 44,
    marginBottom: spacing.sm + 2,
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
    marginBottom: spacing.sm,
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: borderRadius.sm,
  },
  modeTabActive: {
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  modeTabText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    color: colors.secondary[600],
  },
  modeTabTextActive: {
    color: colors.secondary[900],
    fontWeight: fontWeight.bold,
  },
  filterChipsRow: {
    gap: spacing.xs + 2,
    paddingVertical: 4,
    paddingRight: spacing.xl,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.secondary[200],
  },
  filterChipActive: {
    backgroundColor: colors.secondary[900],
    borderColor: colors.secondary[900],
  },
  filterChipText: {
    fontSize: fontSize.caption,
    color: colors.secondary[600],
    fontWeight: fontWeight.medium,
  },
  filterChipTextActive: {
    color: colors.surface,
    fontWeight: fontWeight.semibold,
  },
  statusPillsRow: {
    flexDirection: 'row',
    gap: spacing.xs + 2,
    paddingTop: spacing.xs + 2,
    paddingRight: spacing.xl,
  },
  statusPill: {
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    backgroundColor: colors.secondary[100],
  },
  statusPillActive: {
    backgroundColor: colors.primary[600],
  },
  statusPillText: {
    fontSize: fontSize.tiny,
    fontWeight: fontWeight.semibold,
    color: colors.secondary[600],
  },
  statusPillTextActive: {
    color: colors.surface,
    fontWeight: fontWeight.bold,
  },
});
