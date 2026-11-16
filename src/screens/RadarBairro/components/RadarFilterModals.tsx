import { useMemo, useState } from 'react';
import { SelectPickerModal } from '@/components/SelectPickerModal';
import { getCategoryLabel, STATUS_OPTIONS } from '@/theme/semanticConfig';
import type {
  LocationFilterLevel,
  RadarActiveModal,
  SelectPickerOption,
  SelectPickerTab,
  StatusFiltro,
} from '@/types/filters';
import type { RadarFilterModalsProps } from '@/types/ui';

const ALL_LOCATIONS_KEY = '__ALL_LOCATIONS__';

const LOCATION_TABS: readonly SelectPickerTab<LocationFilterLevel>[] = [
  { key: 'CIDADE', label: 'Cidade' },
  { key: 'BAIRRO', label: 'Bairro' },
  { key: 'ESTADO', label: 'Estado' },
];

const STATUS_FILTER_OPTIONS: readonly SelectPickerOption<StatusFiltro>[] = [
  { value: 'TODOS', label: 'Todos Status', subtitle: 'Exibir ocorrências em qualquer etapa' },
  ...STATUS_OPTIONS.map((opt) => ({ value: opt.value, label: opt.label })),
];

export const RadarFilterModals = ({
  openModal,
  onClose,
  categorias,
  categoriaFiltro,
  onChangeCategoria,
  statusFiltro,
  onChangeStatus,
  locationFilter,
  onChangeLocation,
  locationOptions,
  userCity,
}: RadarFilterModalsProps) => {
  const [modalLocationTab, setModalLocationTab] = useState<LocationFilterLevel>(locationFilter.nivel);
  const [prevOpenModal, setPrevOpenModal] = useState<RadarActiveModal>(openModal);

  if (openModal !== prevOpenModal) {
    setPrevOpenModal(openModal);
    if (openModal === 'localizacao') {
      setModalLocationTab(locationFilter.nivel);
    }
  }

  const categoriaOptions: SelectPickerOption<string>[] = useMemo(
    () => [
      { value: 'TODAS', label: 'Todas Categorias', subtitle: 'Exibir todos os tipos de ocorrência' },
      ...categorias.map((c) => ({ value: c.nome, label: getCategoryLabel(c.nome) })),
    ],
    [categorias]
  );

  const nivelLabel =
    modalLocationTab === 'CIDADE'
      ? 'Todas as cidades'
      : modalLocationTab === 'BAIRRO'
        ? 'Todos os bairros'
        : 'Todos os estados';

  const activeLocationOptions: SelectPickerOption<string>[] = useMemo(
    () => [
      { value: ALL_LOCATIONS_KEY, label: nivelLabel, subtitle: 'Remover filtro geográfico' },
      ...locationOptions[modalLocationTab].map((nome) => ({
        value: nome,
        label: nome,
        subtitle:
          modalLocationTab === 'CIDADE' && userCity && nome.toLowerCase() === userCity.toLowerCase()
            ? 'Cidade do seu cadastro'
            : undefined,
      })),
    ],
    [locationOptions, modalLocationTab, nivelLabel, userCity]
  );

  return (
    <>
      <SelectPickerModal<string>
        visible={openModal === 'categoria'}
        onClose={onClose}
        title="Filtrar por Categoria"
        subtitle="Escolha o tipo de zeladoria urbana"
        options={categoriaOptions}
        selectedValue={categoriaFiltro}
        onSelect={onChangeCategoria}
        searchable={categoriaOptions.length > 6}
        searchPlaceholder="Buscar categoria..."
      />

      <SelectPickerModal<StatusFiltro>
        visible={openModal === 'status'}
        onClose={onClose}
        title="Filtrar por Status"
        subtitle="Acompanhe a etapa de atendimento"
        options={STATUS_FILTER_OPTIONS}
        selectedValue={statusFiltro}
        onSelect={onChangeStatus}
      />

      <SelectPickerModal<string, LocationFilterLevel>
        visible={openModal === 'localizacao'}
        onClose={onClose}
        title="Filtrar por Localização"
        subtitle="Selecione Cidade (padrão), Bairro ou Estado"
        tabs={LOCATION_TABS}
        activeTab={modalLocationTab}
        onChangeTab={setModalLocationTab}
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
    </>
  );
};
