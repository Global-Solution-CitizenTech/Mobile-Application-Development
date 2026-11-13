import { useMemo, useState } from 'react';
import { useChamadosList } from '@/hooks/useChamados';
import { useChamadoMutations } from '@/hooks/useChamadoMutations';
import type { MeusChamadosTab } from '@/types/filters';

export function useMeusChamadosData() {
  const [filterTab, setFilterTab] = useState<MeusChamadosTab>('TODOS');
  const { chamados, isLoading, isRefetching, error, refetch } = useChamadosList({
    apenasMeus: true,
    page: 0,
    size: 50,
    sort: 'dtAbertura,desc',
  });
  const { apoiarChamado, supportError, clearSupportError } = useChamadoMutations();

  const contadores = useMemo(() => {
    const abertos = chamados.filter((c) => c.status === 'PENDENTE' || c.status === 'ABERTO').length;
    const emAndamento = chamados.filter((c) => c.status === 'EM_ANALISE' || c.status === 'EM_EXECUCAO').length;
    const concluidos = chamados.filter((c) => c.status === 'CONCLUIDO' || c.status === 'REJEITADO').length;
    return { total: chamados.length, abertos, emAndamento, concluidos };
  }, [chamados]);

  const chamadosFiltrados = useMemo(() => {
    if (filterTab === 'ATIVOS') {
      return chamados.filter((c) => c.status !== 'CONCLUIDO' && c.status !== 'REJEITADO');
    }
    if (filterTab === 'CONCLUIDOS') {
      return chamados.filter((c) => c.status === 'CONCLUIDO' || c.status === 'REJEITADO');
    }
    return chamados;
  }, [chamados, filterTab]);

  return {
    chamados: chamadosFiltrados,
    totalChamados: chamados.length,
    contadores,
    filterTab,
    setFilterTab,
    isLoading,
    isRefreshing: isRefetching,
    error,
    refetch,
    apoiarChamado,
    supportError,
    clearSupportError,
  };
}
