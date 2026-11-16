import { useCallback, useEffect, useMemo, useState } from 'react';
import { useInfiniteChamadosList } from '@/hooks/useChamados';
import { useChamadoMutations } from '@/hooks/useChamadoMutations';
import type { MeusChamadosTab } from '@/types/filters';
import { isStatusFinal } from '@/utils/permissions';

const MEUS_CHAMADOS_FILTRO = {
  apenasMeus: true,
  size: 50,
  sort: 'dtAbertura,desc',
} as const;

export function useUserChamadosSummary() {
  const listQuery = useInfiniteChamadosList(MEUS_CHAMADOS_FILTRO);
  const { chamados, totalElements, hasNextPage, isFetchingNextPage, fetchNextPage, error } =
    listQuery;

  // Garante carregamento completo das páginas do usuário para que contadores e apoios
  // correspondam exatamente a `totalElements` sem truncamento silencioso em 50 itens.
  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage && !error) {
      void fetchNextPage();
    }
  }, [error, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const stats = useMemo(() => {
    let abertos = 0;
    let emAndamento = 0;
    let concluidos = 0;
    let concluidosSemRejeitados = 0;
    let apoiosRecebidos = 0;

    for (const chamado of chamados) {
      if (chamado.status === 'PENDENTE') {
        abertos += 1;
      } else if (chamado.status === 'EM_ANALISE' || chamado.status === 'EM_EXECUCAO') {
        emAndamento += 1;
      }
      if (isStatusFinal(chamado.status)) {
        concluidos += 1;
      }
      if (chamado.status === 'CONCLUIDO') {
        concluidosSemRejeitados += 1;
      }
      apoiosRecebidos += chamado.totalVotos;
    }

    const total = hasNextPage ? Math.max(totalElements, chamados.length) : chamados.length;
    return {
      total,
      abertos,
      emAndamento,
      concluidos,
      ativos: abertos + emAndamento,
      concluidosSomente: concluidosSemRejeitados,
      apoiosRecebidos,
    };
  }, [chamados, hasNextPage, totalElements]);

  return {
    ...listQuery,
    stats,
  };
}

export function useMeusChamadosData() {
  const [filterTab, setFilterTab] = useState<MeusChamadosTab>('TODOS');
  const summary = useUserChamadosSummary();
  const { apoiarChamado, isSupportingId } = useChamadoMutations();

  const chamadosFiltrados = useMemo(() => {
    if (filterTab === 'ATIVOS') {
      return summary.chamados.filter((c) => !isStatusFinal(c.status));
    }
    if (filterTab === 'CONCLUIDOS') {
      return summary.chamados.filter((c) => isStatusFinal(c.status));
    }
    return summary.chamados;
  }, [filterTab, summary.chamados]);

  const loadMore = useCallback(() => {
    if (summary.hasNextPage && !summary.isFetchingNextPage) {
      void summary.fetchNextPage();
    }
  }, [summary]);

  return {
    chamados: chamadosFiltrados,
    totalChamados: summary.stats.total,
    contadores: {
      total: summary.stats.total,
      abertos: summary.stats.abertos,
      emAndamento: summary.stats.emAndamento,
      concluidos: summary.stats.concluidos,
    },
    filterTab,
    setFilterTab,
    isLoading: summary.isLoading,
    isRefreshing: summary.isRefetching,
    isFetchingNextPage: summary.isFetchingNextPage,
    hasNextPage: summary.hasNextPage,
    loadMore,
    error: summary.error,
    refetch: summary.refetch,
    apoiarChamado,
    isSupportingId,
  };
}
