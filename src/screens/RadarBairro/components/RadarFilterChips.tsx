import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { getCategoryLabel, STATUS_OPTIONS } from '@/theme/semanticConfig';
import { borderRadius, spacing } from '@/theme/spacing';
import { fontSize, fontWeight } from '@/theme/typography';
import type { AppTheme } from '@/types/theme';
import type { RadarFilterChipsProps } from '@/types/ui';

export const RadarFilterChips = ({
  categoriaFiltro,
  statusFiltro,
  locationFilter,
  sortBy,
  hasActiveFilters,
  onOpenLocationModal,
  onOpenCategoriaModal,
  onOpenStatusModal,
  onToggleSort,
  onClearFilters,
}: RadarFilterChipsProps) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  const statusLabel =
    statusFiltro === 'TODOS'
      ? 'Status'
      : STATUS_OPTIONS.find((s) => s.value === statusFiltro)?.label ?? statusFiltro;

  const locationLabel = locationFilter.valor
    ? locationFilter.valor
    : locationFilter.nivel === 'CIDADE'
      ? 'Todas cidades'
      : locationFilter.nivel === 'BAIRRO'
        ? 'Todos bairros'
        : 'Todos estados';

  const hasLocationValue = Boolean(locationFilter.valor);
  const hasCategoria = categoriaFiltro !== 'TODAS';
  const hasStatus = statusFiltro !== 'TODOS';
  const isSortedByVotes = sortBy === 'MAIS_APOIADOS';

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.chipsScroll}
    >
      <TouchableOpacity
        style={[styles.chip, hasLocationValue && styles.chipActive]}
        onPress={onOpenLocationModal}
        activeOpacity={0.8}
      >
        <Ionicons
          name="location-outline"
          size={13}
          color={hasLocationValue ? theme.primary : theme.textSecondary}
        />
        <Text style={[styles.chipText, hasLocationValue && styles.chipTextActive]} numberOfLines={1}>
          {locationLabel}
        </Text>
        <Ionicons
          name="chevron-down"
          size={12}
          color={hasLocationValue ? theme.primary : theme.textMuted}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.chip, hasCategoria && styles.chipActive]}
        onPress={onOpenCategoriaModal}
        activeOpacity={0.8}
      >
        <Ionicons
          name="grid-outline"
          size={13}
          color={hasCategoria ? theme.primary : theme.textSecondary}
        />
        <Text style={[styles.chipText, hasCategoria && styles.chipTextActive]} numberOfLines={1}>
          {hasCategoria ? getCategoryLabel(categoriaFiltro) : 'Categoria'}
        </Text>
        <Ionicons
          name="chevron-down"
          size={12}
          color={hasCategoria ? theme.primary : theme.textMuted}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.chip, hasStatus && styles.chipActive]}
        onPress={onOpenStatusModal}
        activeOpacity={0.8}
      >
        <Ionicons
          name="funnel-outline"
          size={13}
          color={hasStatus ? theme.primary : theme.textSecondary}
        />
        <Text style={[styles.chipText, hasStatus && styles.chipTextActive]} numberOfLines={1}>
          {statusLabel}
        </Text>
        <Ionicons
          name="chevron-down"
          size={12}
          color={hasStatus ? theme.primary : theme.textMuted}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.chip, styles.chipSort, isSortedByVotes && styles.chipActive]}
        onPress={onToggleSort}
        activeOpacity={0.8}
      >
        <Ionicons
          name="swap-vertical-outline"
          size={13}
          color={isSortedByVotes ? theme.primary : theme.textSecondary}
        />
        <Text style={[styles.chipText, isSortedByVotes && styles.chipTextActive]}>
          {isSortedByVotes ? '+ Apoios' : 'Recentes'}
        </Text>
      </TouchableOpacity>

      {hasActiveFilters ? (
        <TouchableOpacity
          style={[styles.chip, styles.chipClear]}
          onPress={onClearFilters}
          activeOpacity={0.8}
        >
          <Ionicons name="close-circle-outline" size={14} color={theme.danger} />
          <Text style={styles.chipClearText}>Limpar</Text>
        </TouchableOpacity>
      ) : null}
    </ScrollView>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    chipsScroll: {
      flexDirection: 'row',
      gap: spacing.xs + 3,
      paddingVertical: 2,
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: spacing.sm + 4,
      paddingVertical: spacing.xs + 3,
      borderRadius: borderRadius.full,
      backgroundColor: theme.cardSubtle,
      borderWidth: 1,
      borderColor: theme.border,
    },
    chipActive: {
      backgroundColor: theme.primaryLight,
      borderColor: theme.primaryBorder,
    },
    chipText: {
      fontSize: fontSize.caption,
      fontWeight: fontWeight.semibold,
      color: theme.textSecondary,
    },
    chipTextActive: {
      color: theme.primary,
      fontWeight: fontWeight.bold,
    },
    chipSort: {
      backgroundColor: theme.surface,
    },
    chipClear: {
      backgroundColor: theme.dangerBg,
      borderColor: theme.dangerBorder,
    },
    chipClearText: {
      fontSize: fontSize.caption,
      fontWeight: fontWeight.bold,
      color: theme.danger,
    },
  });
