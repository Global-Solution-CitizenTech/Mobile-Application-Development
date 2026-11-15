import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SelectPickerModal } from '@/components/SelectPickerModal';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { borderRadius, fontSize, fontWeight, shadows, spacing } from '@/theme';
import { getCategoryLabel, STATUS_OPTIONS } from '@/theme/semanticConfig';
import type { AppTheme } from '@/theme/types';
import type { CategoriaResponse } from '@/types/categoria';
import type { LocationFilterLevel, RadarActiveModal, RadarLocationFilter, RadarSortOption, SelectPickerOption, StatusFiltro } from '@/types/filters';

interface RadarHeaderFiltersProps {
  busca: string;
  onChangeBusca: (text: string) => void;
  categorias: readonly CategoriaResponse[];
  categoriaFiltro: string;
  onChangeCategoria: (categoria: string) => void;
  statusFiltro: StatusFiltro;
  onChangeStatus: (status: StatusFiltro) => void;
  locationFilter: RadarLocationFilter;
  onChangeLocation: (location: RadarLocationFilter) => void;
  locationOptions: Record<LocationFilterLevel, string[]>;
  userCity: string;
  sortBy: RadarSortOption;
  onChangeSort: (sort: RadarSortOption) => void;
  totalCount: number;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onPressReportar: () => void;
}

const ALL_LOCATIONS_KEY = '__ALL_LOCATIONS__';

const LOCATION_TABS: { key: LocationFilterLevel; label: string }[] = [
  { key: 'CIDADE', label: 'Cidade' },
  { key: 'BAIRRO', label: 'Bairro' },
  { key: 'ESTADO', label: 'Estado' },
];

const STATUS_FILTER_OPTIONS: SelectPickerOption<StatusFiltro>[] = [
  { value: 'TODOS', label: 'Todos Status', subtitle: 'Exibir ocorrências em qualquer etapa' },
  ...STATUS_OPTIONS.map((opt) => ({ value: opt.value, label: opt.label })),
];

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
  const [modalLocationTab, setModalLocationTab] = useState<LocationFilterLevel>(locationFilter.nivel);

  const categoriaOptions: SelectPickerOption<string>[] = [
    { value: 'TODAS', label: 'Todas Categorias', subtitle: 'Exibir todos os tipos de ocorrência' },
    ...categorias.map((c) => ({ value: c.nome, label: getCategoryLabel(c.nome) })),
  ];

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

  const nivelLabel =
    modalLocationTab === 'CIDADE'
      ? 'Todas as cidades'
      : modalLocationTab === 'BAIRRO'
        ? 'Todos os bairros'
        : 'Todos os estados';

  const activeLocationOptions: SelectPickerOption<string>[] = [
    { value: ALL_LOCATIONS_KEY, label: nivelLabel, subtitle: 'Remover filtro geográfico' },
    ...locationOptions[modalLocationTab].map((nome) => ({
      value: nome,
      label: nome,
      subtitle:
        modalLocationTab === 'CIDADE' && userCity && nome.toLowerCase() === userCity.toLowerCase()
          ? 'Cidade do seu cadastro'
          : undefined,
    })),
  ];

  const openLocationModal = () => {
    setModalLocationTab(locationFilter.nivel);
    setOpenModal('localizacao');
  };

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

      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={18} color={theme.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar rua, título ou bairro..."
          placeholderTextColor={theme.textMuted}
          value={busca}
          onChangeText={onChangeBusca}
          returnKeyType="search"
        />
        {busca.length > 0 ? (
          <TouchableOpacity onPress={() => onChangeBusca('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={theme.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
        <TouchableOpacity
          style={[styles.chip, Boolean(locationFilter.valor) && styles.chipActive]}
          onPress={openLocationModal}
          activeOpacity={0.8}
        >
          <Ionicons
            name="location-outline"
            size={13}
            color={locationFilter.valor ? theme.primary : theme.textSecondary}
          />
          <Text style={[styles.chipText, Boolean(locationFilter.valor) && styles.chipTextActive]} numberOfLines={1}>
            {locationLabel}
          </Text>
          <Ionicons
            name="chevron-down"
            size={12}
            color={locationFilter.valor ? theme.primary : theme.textMuted}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.chip, categoriaFiltro !== 'TODAS' && styles.chipActive]}
          onPress={() => setOpenModal('categoria')}
          activeOpacity={0.8}
        >
          <Ionicons
            name="grid-outline"
            size={13}
            color={categoriaFiltro !== 'TODAS' ? theme.primary : theme.textSecondary}
          />
          <Text style={[styles.chipText, categoriaFiltro !== 'TODAS' && styles.chipTextActive]} numberOfLines={1}>
            {categoriaFiltro === 'TODAS' ? 'Categoria' : getCategoryLabel(categoriaFiltro)}
          </Text>
          <Ionicons
            name="chevron-down"
            size={12}
            color={categoriaFiltro !== 'TODAS' ? theme.primary : theme.textMuted}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.chip, statusFiltro !== 'TODOS' && styles.chipActive]}
          onPress={() => setOpenModal('status')}
          activeOpacity={0.8}
        >
          <Ionicons
            name="funnel-outline"
            size={13}
            color={statusFiltro !== 'TODOS' ? theme.primary : theme.textSecondary}
          />
          <Text style={[styles.chipText, statusFiltro !== 'TODOS' && styles.chipTextActive]} numberOfLines={1}>
            {statusLabel}
          </Text>
          <Ionicons
            name="chevron-down"
            size={12}
            color={statusFiltro !== 'TODOS' ? theme.primary : theme.textMuted}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.chip, styles.chipSort, sortBy === 'MAIS_APOIADOS' && styles.chipActive]}
          onPress={() => onChangeSort(sortBy === 'RECENTES' ? 'MAIS_APOIADOS' : 'RECENTES')}
          activeOpacity={0.8}
        >
          <Ionicons
            name="swap-vertical-outline"
            size={13}
            color={sortBy === 'MAIS_APOIADOS' ? theme.primary : theme.textSecondary}
          />
          <Text style={[styles.chipText, sortBy === 'MAIS_APOIADOS' && styles.chipTextActive]}>
            {sortBy === 'RECENTES' ? 'Recentes' : '+ Apoios'}
          </Text>
        </TouchableOpacity>

        {hasActiveFilters ? (
          <TouchableOpacity style={[styles.chip, styles.chipClear]} onPress={onClearFilters} activeOpacity={0.8}>
            <Ionicons name="close-circle-outline" size={14} color={theme.danger} />
            <Text style={styles.chipClearText}>Limpar</Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>

      <SelectPickerModal
        visible={openModal === 'categoria'}
        onClose={() => setOpenModal(null)}
        title="Filtrar por Categoria"
        subtitle="Escolha o tipo de zeladoria urbana"
        options={categoriaOptions}
        selectedValue={categoriaFiltro}
        onSelect={onChangeCategoria}
        searchable={categoriaOptions.length > 6}
        searchPlaceholder="Buscar categoria..."
      />

      <SelectPickerModal
        visible={openModal === 'status'}
        onClose={() => setOpenModal(null)}
        title="Filtrar por Status"
        subtitle="Acompanhe a etapa de atendimento"
        options={STATUS_FILTER_OPTIONS}
        selectedValue={statusFiltro}
        onSelect={onChangeStatus}
      />

      <SelectPickerModal
        visible={openModal === 'localizacao'}
        onClose={() => setOpenModal(null)}
        title="Filtrar por Localização"
        subtitle="Selecione Cidade (padrão), Bairro ou Estado"
        tabs={LOCATION_TABS}
        activeTab={modalLocationTab}
        onChangeTab={(key) => setModalLocationTab(key as LocationFilterLevel)}
        options={activeLocationOptions}
        selectedValue={
          locationFilter.nivel === modalLocationTab && locationFilter.valor
            ? locationFilter.valor
            : ALL_LOCATIONS_KEY
        }
        onSelect={(val) =>
          onChangeLocation({
            nivel: modalLocationTab,
            valor: val === ALL_LOCATIONS_KEY ? null : val,
          })
        }
        searchable
        searchPlaceholder={`Buscar ${modalLocationTab.toLowerCase()}...`}
        quickAction={
          userCity &&
          (locationFilter.nivel !== 'CIDADE' ||
            locationFilter.valor?.toLowerCase() !== userCity.toLowerCase())
            ? {
                label: `Usar minha cidade (${userCity})`,
                onPress: () => onChangeLocation({ nivel: 'CIDADE', valor: userCity }),
              }
            : undefined
        }
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
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      paddingHorizontal: spacing.sm + 4,
      height: 44,
      borderRadius: borderRadius.card,
      backgroundColor: theme.cardSubtle,
      borderWidth: 1,
      borderColor: theme.border,
    },
    searchInput: {
      flex: 1,
      fontSize: fontSize.bodySmall,
      color: theme.text,
    },
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
