import { useState } from 'react';
import { useChamadosList } from '@/hooks/useChamados';
import { useChamadoMutations } from '@/hooks/useChamadoMutations';
import type { MeusChamadosTab } from '@/types/filters';
import { isStatusFinal } from '@/utils/permissions';

export function useMeusChamadosData() {
  const [filterTab, setFilterTab] = useState<MeusChamadosTab>('TODOS');
  const { chamados, totalElements, pageInfo, isLoading, isRefetching, error, refetch } =
    useChamadosList({
      apenasMeus: true,
      page: 0,
      size: 50,
      sort: 'dtAbertura,desc',
    });
  const { apoiarChamado } = useChamadoMutations();

  const totalChamados = pageInfo ? totalElements : chamados.length;
  const contadores = {
    total: totalChamados,
    abertos: chamados.filter((c) => c.status === 'PENDENTE').length,
    emAndamento: chamados.filter((c) => c.status === 'EM_ANALISE' || c.status === 'EM_EXECUCAO').length,
    concluidos: chamados.filter((c) => isStatusFinal(c.status)).length,
  };

  const chamadosFiltrados =
    filterTab === 'ATIVOS'
      ? chamados.filter((c) => !isStatusFinal(c.status))
      : filterTab === 'CONCLUIDOS'
        ? chamados.filter((c) => isStatusFinal(c.status))
        : chamados;

  return {
    chamados: chamadosFiltrados,
    totalChamados,
    contadores,
    filterTab,
    setFilterTab,
    isLoading,
    isRefreshing: isRefetching,
    error,
    refetch,
    apoiarChamado,
  };
}
