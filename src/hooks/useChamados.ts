/**
 * Hook Customizado de Gerenciamento de Chamados de Zeladoria (TanStack Query v5)
 * Centraliza cache, queries, mutations, filtros e estatísticas, pronto para o Backend Java
 */

import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chamadoService } from '../services/chamadoService';
import { queryKeys } from '../lib/queryKeys';
import { getApiErrorMessage } from '../utils/apiError';
import { useAuth } from './useAuth';
import {
  Chamado,
  CreateChamadoDTO,
  UpdateChamadoDTO,
  FiltroChamados,
  StatusChamado,
  CategoriaChamado,
  EstatisticasChamados,
} from '../types';

export const useChamadoDetail = (id: string) => {
  return useQuery({
    queryKey: queryKeys.chamados.detail(id),
    queryFn: () => chamadoService.obterPorId(id),
    enabled: Boolean(id),
  });
};

export const useChamados = (initialFiltros?: Partial<FiltroChamados>) => {
  const { usuario } = useAuth();
  const queryClient = useQueryClient();

  const [filtros, setFiltros] = useState<FiltroChamados>({
    categoria: initialFiltros?.categoria || 'Todas',
    status: initialFiltros?.status || 'Todos',
    busca: initialFiltros?.busca || '',
    apenasMeus: initialFiltros?.apenasMeus || false,
  });

  // Query principal da lista filtrada
  const listQuery = useQuery({
    queryKey: queryKeys.chamados.list(filtros, usuario?.id),
    queryFn: () => chamadoService.listar(filtros, usuario?.id),
  });

  // Query global sem filtros para estatísticas gerais do painel
  const allChamadosQuery = useQuery({
    queryKey: queryKeys.chamados.list(
      { categoria: 'Todas', status: 'Todos', busca: '', apenasMeus: false },
      usuario?.id
    ),
    queryFn: () =>
      chamadoService.listar(
        { categoria: 'Todas', status: 'Todos', busca: '', apenasMeus: false },
        usuario?.id
      ),
  });

  const invalidateAllChamados = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.chamados.all });
  }, [queryClient]);

  // Mutation CREATE
  const createMutation = useMutation({
    mutationFn: async (dto: CreateChamadoDTO) => {
      if (!usuario) {
        throw new Error('Usuário deve estar autenticado para registrar um chamado.');
      }
      return chamadoService.criar(dto, usuario);
    },
    onSuccess: invalidateAllChamados,
  });

  // Mutation UPDATE
  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateChamadoDTO }) =>
      chamadoService.atualizar(id, dto),
    onSuccess: invalidateAllChamados,
  });

  // Mutation APOIAR / PRIORIZAR
  const apoiarMutation = useMutation({
    mutationFn: (id: string) => chamadoService.apoiar(id),
    onSuccess: invalidateAllChamados,
  });

  // Mutation UPDATE STATUS
  const statusMutation = useMutation({
    mutationFn: ({
      id,
      novoStatus,
      feedback,
    }: {
      id: string;
      novoStatus: StatusChamado;
      feedback?: string;
    }) =>
      chamadoService.atualizarStatus(
        id,
        novoStatus,
        feedback,
        usuario?.nome || 'Cidadão'
      ),
    onSuccess: invalidateAllChamados,
  });

  // Mutation DELETE
  const deleteMutation = useMutation({
    mutationFn: (id: string) => chamadoService.excluir(id),
    onSuccess: invalidateAllChamados,
  });

  // Mutation RESET MOCK
  const resetMutation = useMutation({
    mutationFn: () => chamadoService.resetarMock(),
    onSuccess: invalidateAllChamados,
  });

  const carregarChamados = useCallback(
    async (customFiltros?: FiltroChamados, _isPullToRefresh: boolean = false) => {
      if (customFiltros) {
        setFiltros(customFiltros);
      }
      await invalidateAllChamados();
    },
    [invalidateAllChamados]
  );

  const criarChamado = async (dto: CreateChamadoDTO): Promise<Chamado> => {
    return createMutation.mutateAsync(dto);
  };

  const atualizarChamado = async (id: string, dto: UpdateChamadoDTO): Promise<Chamado> => {
    return updateMutation.mutateAsync({ id, dto });
  };

  const apoiarChamado = async (id: string): Promise<Chamado> => {
    return apoiarMutation.mutateAsync(id);
  };

  const atualizarStatus = async (
    id: string,
    novoStatus: StatusChamado,
    feedback?: string
  ): Promise<Chamado> => {
    return statusMutation.mutateAsync({ id, novoStatus, feedback });
  };

  const excluirChamado = async (id: string): Promise<boolean> => {
    return deleteMutation.mutateAsync(id);
  };

  const obterChamadoPorId = useCallback(
    async (id: string): Promise<Chamado> => {
      return queryClient.fetchQuery({
        queryKey: queryKeys.chamados.detail(id),
        queryFn: () => chamadoService.obterPorId(id),
      });
    },
    [queryClient]
  );

  // Atalhos de filtro
  const setCategoriaFiltro = useCallback((categoria: CategoriaChamado | 'Todas') => {
    setFiltros((prev) => ({ ...prev, categoria }));
  }, []);

  const setStatusFiltro = useCallback((status: StatusChamado | 'Todos') => {
    setFiltros((prev) => ({ ...prev, status }));
  }, []);

  const setBuscaFiltro = useCallback((busca: string) => {
    setFiltros((prev) => ({ ...prev, busca }));
  }, []);

  const setApenasMeusFiltro = useCallback((apenasMeus: boolean) => {
    setFiltros((prev) => ({ ...prev, apenasMeus }));
  }, []);

  const limparFiltros = useCallback(() => {
    setFiltros({
      categoria: 'Todas',
      status: 'Todos',
      busca: '',
      apenasMeus: false,
    });
  }, []);

  const resetarDados = async () => {
    await resetMutation.mutateAsync();
  };

  const chamados = listQuery.data ?? [];
  const todosChamados = allChamadosQuery.data ?? chamados;

  // Estatísticas globais calculadas a partir da base
  const estatisticas: EstatisticasChamados = useMemo(() => {
    return chamadoService.obterEstatisticas(todosChamados);
  }, [todosChamados]);

  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    statusMutation.isPending ||
    deleteMutation.isPending ||
    resetMutation.isPending;

  const errorObj =
    listQuery.error ||
    createMutation.error ||
    updateMutation.error ||
    statusMutation.error ||
    deleteMutation.error;

  const error = errorObj ? getApiErrorMessage(errorObj) : null;

  return {
    chamados,
    todosChamados,
    loading: listQuery.isLoading || isMutating,
    refreshing: listQuery.isRefetching && !listQuery.isLoading,
    error,
    filtros,
    estatisticas,
    carregarChamados,
    criarChamado,
    atualizarChamado,
    apoiarChamado,
    atualizarStatus,
    excluirChamado,
    obterChamadoPorId,
    setCategoriaFiltro,
    setStatusFiltro,
    setBuscaFiltro,
    setApenasMeusFiltro,
    limparFiltros,
    resetarDados,
  };
};
