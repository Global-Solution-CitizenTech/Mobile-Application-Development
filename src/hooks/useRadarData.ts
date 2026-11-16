import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useChamadosList, useInfiniteChamadosList } from '@/hooks/useChamados';
import { useChamadoMutations } from '@/hooks/useChamadoMutations';
import { useDebounce } from '@/hooks/useDebounce';
import { CATEGORIA_CATALOG } from '@/theme/semanticConfig';
import type {
  LocationFilterLevel,
  RadarLocationFilter,
  RadarSortOption,
  StatusFiltro,
} from '@/types/filters';

function uniqueSorted(values: (string | undefined | null)[]): string[] {
  const map = new Map<string, string>();
  for (const raw of values) {
    const trimmed = raw?.trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (!map.has(key)) map.set(key, trimmed);
  }
  return Array.from(map.values()).sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

export function useRadarData(initialCategoria?: string) {
  const { usuario } = useAuth();
  const userCity = usuario?.endereco?.cidade?.trim() ?? '';

  const [categoriaFiltro, setCategoriaFiltro] = useState<string>(initialCategoria || 'TODAS');
  const [statusFiltro, setStatusFiltro] = useState<StatusFiltro>('TODOS');
  const [busca, setBusca] = useState('');
  const [sortBy, setSortBy] = useState<RadarSortOption>('RECENTES');
  const [locationFilter, setLocationFilter] = useState<RadarLocationFilter>({
    nivel: 'CIDADE',
    valor: null,
  });

  const prevInitialCategoriaRef = useRef(initialCategoria);
  useEffect(() => {
    if (initialCategoria !== prevInitialCategoriaRef.current) {
      prevInitialCategoriaRef.current = initialCategoria;
      setCategoriaFiltro(initialCategoria || 'TODAS');
    }
  }, [initialCategoria]);

  const trimmedBusca = busca.trim();
  const debouncedBusca = useDebounce(trimmedBusca, 350);
  const buscaEfetiva = trimmedBusca === '' ? '' : debouncedBusca;
  const locationValue = locationFilter.valor?.trim() || undefined;

  // Nota de API (`ChamadoController.findAll` / `Chamado.java`): o endpoint `/chamados` suporta ordenação
  // apenas por colunas da entidade `Chamado` (ex.: `dtAbertura`), não por `totalVotos` (calculado via
  // `VotoChamadoRepository` no serviço). Por isso mantemos `sort: 'dtAbertura,desc'` na API e aplicamos
  // ordenação estável por votos nos itens carregados quando `MAIS_APOIADOS` está selecionado.
  const listQuery = useInfiniteChamadosList({
    status: statusFiltro === 'TODOS' ? undefined : statusFiltro,
    categoria: categoriaFiltro === 'TODAS' ? undefined : categoriaFiltro,
    busca: buscaEfetiva || undefined,
    cidade: locationFilter.nivel === 'CIDADE' ? locationValue : undefined,
    bairro: locationFilter.nivel === 'BAIRRO' ? locationValue : undefined,
    estado: locationFilter.nivel === 'ESTADO' ? locationValue : undefined,
    size: 10,
    sort: 'dtAbertura,desc',
  });
  // Fonte não filtrada em cache para manter opções de cidade/bairro/estado estáveis após selecionar um filtro.
  const locationSeedQuery = useChamadosList({ page: 0, size: 50, sort: 'dtAbertura,desc' });
  const { apoiarChamado, isSupportingId } = useChamadoMutations();

  const items = listQuery.chamados;
  const locationSourceItems = locationSeedQuery.chamados;

  const locationOptions: Record<LocationFilterLevel, string[]> = useMemo(
    () => ({
      CIDADE: uniqueSorted([
        usuario?.endereco?.cidade,
        ...locationSourceItems.map((c) => c.endereco.cidade),
        ...items.map((c) => c.endereco.cidade),
      ]),
      BAIRRO: uniqueSorted([
        usuario?.endereco?.bairro,
        ...locationSourceItems.map((c) => c.endereco.bairro),
        ...items.map((c) => c.endereco.bairro),
      ]),
      ESTADO: uniqueSorted([
        usuario?.endereco?.estado,
        ...locationSourceItems.map((c) => c.endereco.estado),
        ...items.map((c) => c.endereco.estado),
      ]),
    }),
    [
      items,
      locationSourceItems,
      usuario?.endereco?.bairro,
      usuario?.endereco?.cidade,
      usuario?.endereco?.estado,
    ]
  );

  const chamados = useMemo(
    () =>
      sortBy === 'MAIS_APOIADOS'
        ? [...items].sort((a, b) => b.totalVotos - a.totalVotos || b.idChamado - a.idChamado)
        : items,
    [items, sortBy]
  );

  const loadMore = useCallback(() => {
    if (listQuery.hasNextPage && !listQuery.isFetchingNextPage) {
      void listQuery.fetchNextPage();
    }
  }, [listQuery]);

  const isUsingCustomLocation =
    locationFilter.nivel !== 'CIDADE' || locationFilter.valor !== null;

  const hasActiveFilters =
    statusFiltro !== 'TODOS' ||
    categoriaFiltro !== 'TODAS' ||
    trimmedBusca.length > 0 ||
    isUsingCustomLocation;

  const limparFiltros = useCallback(() => {
    setStatusFiltro('TODOS');
    setCategoriaFiltro('TODAS');
    setBusca('');
    setLocationFilter({ nivel: 'CIDADE', valor: null });
  }, []);

  return {
    chamados,
    totalCount: listQuery.totalElements,
    categorias: CATEGORIA_CATALOG,
    statusFiltro,
    setStatusFiltro,
    categoriaFiltro,
    setCategoriaFiltro,
    locationFilter,
    setLocationFilter,
    locationOptions,
    userCity,
    busca,
    setBusca,
    sortBy,
    setSortBy,
    hasActiveFilters,
    limparFiltros,
    isLoading: listQuery.isLoading,
    isRefreshing: listQuery.isRefetching,
    isFetchingNextPage: listQuery.isFetchingNextPage,
    hasNextPage: listQuery.hasNextPage,
    loadMore,
    error: listQuery.error,
    refetch: listQuery.refetch,
    apoiarChamado,
    isSupportingId,
  };
}
