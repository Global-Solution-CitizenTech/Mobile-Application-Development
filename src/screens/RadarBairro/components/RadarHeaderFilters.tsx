import { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { RadarFilterChips } from '@/screens/RadarBairro/components/RadarFilterChips';
import { RadarFilterModals } from '@/screens/RadarBairro/components/RadarFilterModals';
import { RadarSearchBar } from '@/screens/RadarBairro/components/RadarSearchBar';
import { borderRadius, spacing } from '@/theme/spacing';
import { fontSize, fontWeight } from '@/theme/typography';
import type { RadarActiveModal } from '@/types/filters';
import type { AppTheme } from '@/types/theme';
import type { RadarHeaderFiltersProps } from '@/types/ui';
import { shadows } from '@/utils/shadow';

export const RadarHeaderFilters = ({
  busca,
  onChangeBusca,
  categorias,
  categoriaFiltro,
  onChangeCategoria,
  statusFiltro,
  onChangeStatus,
  locationFilter,
  onChangeLocation,
  locationOptions,
  userCity,
  sortBy,
  onChangeSort,
  totalCount,
  hasActiveFilters,
  onClearFilters,
  onPressReportar,
}: RadarHeaderFiltersProps) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();
  const [openModal, setOpenModal] = useState<RadarActiveModal>(null);

  const locationSubtitle = useMemo(() => {
    const countText = `${totalCount} ${totalCount === 1 ? 'ocorrência' : 'ocorrências'}`;
    if (!locationFilter.valor) {
      return `${countText} • Todas as cidades`;
    }
    const prefix =
      locationFilter.nivel === 'BAIRRO'
        ? 'Bairro '
        : locationFilter.nivel === 'ESTADO'
          ? 'Estado '
          : '';
    return `${countText} • ${prefix}${locationFilter.valor}`;
  }, [locationFilter.nivel, locationFilter.valor, totalCount]);

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top, spacing.md) + spacing.xs,
          paddingLeft: Math.max(insets.left, spacing.md),
          paddingRight: Math.max(insets.right, spacing.md),
        },
      ]}
    >
      <View style={styles.titleRow}>
        <View style={styles.titleBox}>
          <Text style={styles.title}>Radar da Cidade</Text>
          <Text style={styles.subtitle}>{locationSubtitle}</Text>
        </View>

        <TouchableOpacity
          style={[styles.reportButton, shadows.sm]}
          onPress={onPressReportar}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={18} color={theme.inverseText} />
          <Text style={styles.reportButtonText}>Reportar</Text>
        </TouchableOpacity>
      </View>

      <RadarSearchBar value={busca} onChangeText={onChangeBusca} />

      <RadarFilterChips
        categoriaFiltro={categoriaFiltro}
        statusFiltro={statusFiltro}
        locationFilter={locationFilter}
        sortBy={sortBy}
        hasActiveFilters={hasActiveFilters}
        onOpenLocationModal={() => setOpenModal('localizacao')}
        onOpenCategoriaModal={() => setOpenModal('categoria')}
        onOpenStatusModal={() => setOpenModal('status')}
        onToggleSort={() => onChangeSort(sortBy === 'RECENTES' ? 'MAIS_APOIADOS' : 'RECENTES')}
        onClearFilters={onClearFilters}
      />

      <RadarFilterModals
        openModal={openModal}
        onClose={() => setOpenModal(null)}
        categorias={categorias}
        categoriaFiltro={categoriaFiltro}
        onChangeCategoria={onChangeCategoria}
        statusFiltro={statusFiltro}
        onChangeStatus={onChangeStatus}
        locationFilter={locationFilter}
        onChangeLocation={onChangeLocation}
        locationOptions={locationOptions}
        userCity={userCity}
      />
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
      gap: spacing.sm + 2,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.sm,
    },
    titleBox: {
      flex: 1,
    },
    title: {
      fontSize: fontSize.heading,
      fontWeight: fontWeight.extrabold,
      color: theme.text,
    },
    subtitle: {
      fontSize: fontSize.caption,
      color: theme.textSecondary,
      marginTop: 2,
    },
    reportButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: theme.primary,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm + 1,
      borderRadius: borderRadius.full,
    },
    reportButtonText: {
      fontSize: fontSize.bodySmall,
      fontWeight: fontWeight.bold,
      color: theme.inverseText,
    },
  });
