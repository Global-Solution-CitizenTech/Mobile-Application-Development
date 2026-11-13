import { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PickerTriggerButton, SelectPickerModal } from '@/components/SelectPickerModal';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { borderRadius, fontSize, fontWeight, shadows, spacing } from '@/theme';
import { STATUS_OPTIONS } from '@/theme/semanticConfig';
import type { AppTheme } from '@/theme/types';
import type { CategoriaResponse } from '@/types/categoria';
import type { LocationFilterLevel, RadarLocationFilter, RadarSortOption, SelectPickerOption, StatusFiltro } from '@/types/filters';

interface RadarHeaderFiltersProps {
  busca: string;
  onChangeBusca: (text: string) => void;
  categorias: CategoriaResponse[];
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

type ActiveModal = 'categoria' | 'status' | 'localizacao' | null;

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
  const [openModal, setOpenModal] = useState<ActiveModal>(null);
  const [modalLocationTab, setModalLocationTab] = useState<LocationFilterLevel>(locationFilter.nivel);

  const categoriaOptions = useMemo<SelectPickerOption<string>[]>(
    () => [
      { value: 'TODAS', label: 'Todas Categorias', subtitle: 'Exibir todos os tipos de ocorrência' },
      ...categorias.map((c) => ({ value: c.nome, label: c.nome })),
    ],
    [categorias]
  );

  const statusLabel = useMemo(() => {
    if (statusFiltro === 'TODOS') return 'Status';
    return STATUS_OPTIONS.find((s) => s.value === statusFiltro)?.label ?? statusFiltro;
  }, [statusFiltro]);

  const locationLabel = useMemo(() => {
    if (!locationFilter.valor) {
      return locationFilter.nivel === 'CIDADE'
        ? 'Todas cidades'
        : locationFilter.nivel === 'BAIRRO'
          ? 'Todos bairros'
          : 'Todos estados';
    }
    return locationFilter.valor;
  }, [locationFilter.nivel, locationFilter.valor]);

  const activeLocationOptions = useMemo<SelectPickerOption<string>[]>(() => {
    const nivelLabel =
      modalLocationTab === 'CIDADE'
        ? 'Todas as cidades'
        : modalLocationTab === 'BAIRRO'
          ? 'Todos os bairros'
          : 'Todos os estados';

    return [
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
  }, [locationOptions, modalLocationTab, userCity]);

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
          <Text style={styles.subtitle}>
            {totalCount} {totalCount === 1 ? 'ocorrência' : 'ocorrências'}
            {locationFilter.valor ? ` • ${locationFilter.valor}` : ''}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.reportButton, shadows.sm]}
          onPress={onPressReportar}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Reportar nova ocorrência"
        >
          <Ionicons name="add-circle-outline" size={18} color={theme.inverseText} />
          <Text style={styles.reportButtonText}>Reportar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchAndSortRow}>
        <View style={styles.searchBar}>
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

      <View style={styles.filterButtonsRow}>
        <View style={styles.filterBtnWrap}>
          <PickerTriggerButton
            icon="location-outline"
            valueLabel={locationLabel}
            active={Boolean(locationFilter.valor)}
            onPress={openLocationModal}
          />
        </View>
        <View style={styles.filterBtnWrap}>
          <PickerTriggerButton
            icon="grid-outline"
            valueLabel={categoriaFiltro === 'TODAS' ? 'Categoria' : categoriaFiltro}
            active={categoriaFiltro !== 'TODAS'}
            onPress={() => setOpenModal('categoria')}
          />
        </View>
        <View style={styles.filterBtnWrap}>
          <PickerTriggerButton
            icon="funnel-outline"
            valueLabel={statusLabel}
            active={statusFiltro !== 'TODOS'}
            onPress={() => setOpenModal('status')}
          />
        </View>
      </View>

      {hasActiveFilters ? (
        <TouchableOpacity style={styles.clearBtn} onPress={onClearFilters} activeOpacity={0.75}>
          <Ionicons name="refresh-outline" size={14} color={theme.primary} />
          <Text style={styles.clearText}>Mostrar todas / Limpar filtros</Text>
        </TouchableOpacity>
      ) : null}

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
    searchAndSortRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    searchBar: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs + 2,
      paddingHorizontal: spacing.sm + 4,
      height: 42,
      borderRadius: borderRadius.md,
      backgroundColor: theme.cardSubtle,
      borderWidth: 1,
      borderColor: theme.border,
    },
    searchInput: {
      flex: 1,
      fontSize: fontSize.bodySmall,
      color: theme.text,
    },
    sortRow: {
      flexDirection: 'row',
      backgroundColor: theme.cardSubtle,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 3,
    },
    sortBtn: {
      paddingHorizontal: spacing.sm,
      paddingVertical: 6,
      borderRadius: borderRadius.sm,
    },
    sortBtnActive: {
      backgroundColor: theme.surface,
    },
    sortText: {
      fontSize: fontSize.caption,
      fontWeight: fontWeight.semibold,
      color: theme.textSecondary,
    },
    sortTextActive: {
      color: theme.primary,
      fontWeight: fontWeight.bold,
    },
    filterButtonsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.xs + 2,
    },
    filterBtnWrap: {
      flexGrow: 1,
    },
    clearBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      alignSelf: 'flex-end',
    },
    clearText: {
      fontSize: fontSize.caption,
      fontWeight: fontWeight.bold,
      color: theme.primary,
    },
  });
