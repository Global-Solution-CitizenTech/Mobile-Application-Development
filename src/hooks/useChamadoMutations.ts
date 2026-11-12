import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { chamadoService } from '@/services/chamadoService';
import type { ActionCallbacks, SpringPageResponse } from '@/types/api';
import type { Chamado, ChamadoRequest, ChamadoStatusRequest } from '@/types/chamado';

function toggleApoioOtimista(chamado: Chamado): Chamado {
  const apoiado = !chamado.apoiadoPorMim;
  return {
    ...chamado,
    apoiadoPorMim: apoiado,
    totalVotos: Math.max(0, chamado.totalVotos + (apoiado ? 1 : -1)),
  };
}

export function useChamadoMutations() {
  const queryClient = useQueryClient();

  const invalidateListsAndStats = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.chamados.lists() }),
      queryClient.invalidateQueries({ queryKey: queryKeys.chamados.estatisticas() }),
    ]);
  }, [queryClient]);

  const createMutation = useMutation({
    mutationFn: (payload: ChamadoRequest) => chamadoService.criar(payload),
    onSuccess: async (created) => {
      queryClient.setQueryData(queryKeys.chamados.detail(created.idChamado), created);
      await invalidateListsAndStats();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ChamadoRequest }) => chamadoService.atualizar(id, payload),
    onSuccess: async (updated) => {
      queryClient.setQueryData(queryKeys.chamados.detail(updated.idChamado), updated);
      await invalidateListsAndStats();
    },
  });

  const apoiarMutation = useMutation({
    mutationFn: (id: number) => chamadoService.apoiar(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.chamados.all });
      const previousLists = queryClient.getQueriesData<SpringPageResponse<Chamado>>({ queryKey: queryKeys.chamados.lists() });
      const detailKey = queryKeys.chamados.detail(id);
      const previousDetail = queryClient.getQueryData<Chamado>(detailKey);

      queryClient.setQueriesData<SpringPageResponse<Chamado>>({ queryKey: queryKeys.chamados.lists() }, (old) => {
        if (!old) return old;
        return {
          ...old,
          content: old.content.map((item) => (item.idChamado === id ? toggleApoioOtimista(item) : item)),
        };
      });

      if (previousDetail) {
        queryClient.setQueryData<Chamado>(detailKey, toggleApoioOtimista(previousDetail));
      }

      return { previousLists, previousDetail };
    },
    onError: (_error, id, context) => {
      context?.previousLists.forEach(([key, data]) => queryClient.setQueryData(key, data));
      if (context?.previousDetail) {
        queryClient.setQueryData(queryKeys.chamados.detail(id), context.previousDetail);
      }
    },
    onSettled: async (_data, _error, id) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.chamados.detail(id) }),
        invalidateListsAndStats(),
      ]);
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ChamadoStatusRequest }) => chamadoService.alterarStatus(id, payload),
    onSuccess: async (updated) => {
      queryClient.setQueryData(queryKeys.chamados.detail(updated.idChamado), updated);
      await invalidateListsAndStats();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => chamadoService.deletar(id),
    onSuccess: async (_res, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.chamados.detail(id) });
      await invalidateListsAndStats();
    },
  });

  return {
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isSupporting: apoiarMutation.isPending,
    isChangingStatus: statusMutation.isPending,
    isDeleting: deleteMutation.isPending,
    criarChamado: (payload: ChamadoRequest, callbacks?: ActionCallbacks<Chamado>) => createMutation.mutate(payload, callbacks),
    atualizarChamado: (id: number, payload: ChamadoRequest, callbacks?: ActionCallbacks<Chamado>) =>
      updateMutation.mutate({ id, payload }, callbacks),
    apoiarChamado: (id: number, callbacks?: ActionCallbacks<Chamado>) => apoiarMutation.mutate(id, callbacks),
    alterarStatus: (id: number, payload: ChamadoStatusRequest, callbacks?: ActionCallbacks<Chamado>) =>
      statusMutation.mutate({ id, payload }, callbacks),
    excluirChamado: (id: number, callbacks?: ActionCallbacks<void>) => deleteMutation.mutate(id, callbacks),
  };
}
