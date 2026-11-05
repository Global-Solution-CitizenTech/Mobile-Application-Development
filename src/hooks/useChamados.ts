/**
 * Hook Customizado de Gerenciamento de Chamados de Zeladoria
 * Centraliza o estado da lista, filtros, estatísticas, apoios e chamadas ao serviço
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { chamadoService } from '../services/chamadoService';
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

export const useChamados = () => {
  const { usuario } = useAuth();
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [filtros, setFiltros] = useState<FiltroChamados>({
    categoria: 'Todas',
    status: 'Todos',
    busca: '',
    apenasMeus: false,
  });

  const carregarChamados = useCallback(
    async (customFiltros?: FiltroChamados, isPullToRefresh: boolean = false) => {
      try {
        if (isPullToRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
        setError(null);

        const activeFilters = customFiltros || filtros;
        const data = await chamadoService.listar(activeFilters, usuario?.id);
        setChamados(data);
      } catch (err: any) {
        setError(err.message || 'Falha ao carregar ocorrências de zeladoria.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [filtros, usuario?.id]
  );

  // Recarrega sempre que filtros ou usuário mudarem
  useEffect(() => {
    carregarChamados();
  }, [carregarChamados]);

  // Operação CREATE
  const criarChamado = async (dto: CreateChamadoDTO): Promise<Chamado> => {
    if (!usuario) {
      throw new Error('Usuário deve estar autenticado para registrar um chamado.');
    }
    try {
      setLoading(true);
      const novo = await chamadoService.criar(dto, usuario);
      await carregarChamados();
      return novo;
    } catch (err: any) {
      const msg = err.message || 'Não foi possível cadastrar a ocorrência.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Operação UPDATE
  const atualizarChamado = async (id: string, dto: UpdateChamadoDTO): Promise<Chamado> => {
    try {
      setLoading(true);
      const atualizado = await chamadoService.atualizar(id, dto, usuario?.nome);
      await carregarChamados();
      return atualizado;
    } catch (err: any) {
      const msg = err.message || 'Falha ao atualizar chamado.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Operação APOIAR / PRIORIZAR
  const apoiarChamado = async (id: string): Promise<Chamado> => {
    const atualizado = await chamadoService.apoiar(id);
    await carregarChamados();
    return atualizado;
  };

  // Operação UPDATE STATUS
  const atualizarStatus = async (
    id: string,
    novoStatus: StatusChamado,
    feedback?: string
  ): Promise<Chamado> => {
    try {
      setLoading(true);
      const atualizado = await chamadoService.atualizarStatus(
        id,
        novoStatus,
        feedback,
        usuario?.nome || 'Cidadão'
      );
      await carregarChamados();
      return atualizado;
    } catch (err: any) {
      const msg = err.message || 'Falha ao alterar status da ocorrência.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Operação DELETE
  const excluirChamado = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      const sucesso = await chamadoService.excluir(id);
      await carregarChamados();
      return sucesso;
    } catch (err: any) {
      const msg = err.message || 'Falha ao remover chamado.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Obter único chamado
  const obterChamadoPorId = async (id: string): Promise<Chamado> => {
    return await chamadoService.obterPorId(id);
  };

  // Atalhos de filtro
  const setCategoriaFiltro = (categoria: CategoriaChamado | 'Todas') => {
    setFiltros((prev) => ({ ...prev, categoria }));
  };

  const setStatusFiltro = (status: StatusChamado | 'Todos') => {
    setFiltros((prev) => ({ ...prev, status }));
  };

  const setBuscaFiltro = (busca: string) => {
    setFiltros((prev) => ({ ...prev, busca }));
  };

  const setApenasMeusFiltro = (apenasMeus: boolean) => {
    setFiltros((prev) => ({ ...prev, apenasMeus }));
  };

  const limparFiltros = () => {
    setFiltros({
      categoria: 'Todas',
      status: 'Todos',
      busca: '',
      apenasMeus: false,
    });
  };

  // Estatísticas calculadas
  const estatisticas: EstatisticasChamados = useMemo(() => {
    return chamadoService.obterEstatisticas(chamados);
  }, [chamados]);

  // Resetar para dados iniciais da FIAP
  const resetarDados = async () => {
    setLoading(true);
    await chamadoService.resetarMock();
    await carregarChamados();
    setLoading(false);
  };

  return {
    chamados,
    loading,
    refreshing,
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
