import { useCallback, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { chamadoService } from '@/services/chamadoService';
import type { ActionCallbacks, SpringPageResponse } from '@/types/api';
import type { Chamado, ChamadoCreateRequest, ChamadoRequest, ChamadoStatusRequest } from '@/types/chamado';
import { getApiErrorMessage } from '@/utils/apiError';

const SUPPORT_ERROR_MESSAGE = 'Falha ao registrar apoio.';

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
  const [supportError, setSupportError] = useState<string | null>(null);

  const invalidateListsAndStats = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.chamados.lists() }),
      queryClient.invalidateQueries({ queryKey: queryKeys.chamados.estatisticas() }),
    ]);
  }, [queryClient]);

  const createMutation = useMutation({
    mutationFn: (payload: ChamadoCreateRequest) => chamadoService.criar(payload),
    onSuccess: async () => {
      await invalidateListsAndStats();
      const refreshTriagem = () => {
        void invalidateListsAndStats();
        void queryClient.invalidateQueries({ queryKey: ['chamados', 'recusa'] });
      };
      setTimeout(refreshTriagem, 5000);
      setTimeout(refreshTriagem, 10000);
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

  const { mutate: mutateCreate } = createMutation;
  const { mutate: mutateUpdate } = updateMutation;
  const { mutate: mutateSupport } = apoiarMutation;
  const { mutate: mutateStatus } = statusMutation;
  const { mutate: mutateDelete } = deleteMutation;

  const criarChamado = useCallback(
    (payload: ChamadoCreateRequest, callbacks?: ActionCallbacks<void>) => {
      mutateCreate(payload, callbacks);
    },
    [mutateCreate]
  );

  const atualizarChamado = useCallback(
    (id: number, payload: ChamadoRequest, callbacks?: ActionCallbacks<Chamado>) => {
      mutateUpdate({ id, payload }, callbacks);
    },
    [mutateUpdate]
  );

  const apoiarChamado = useCallback(
    (id: number, callbacks?: ActionCallbacks<Chamado>) => {
      setSupportError(null);
      mutateSupport(id, {
        onSuccess: callbacks?.onSuccess,
        onError: (error) => {
          setSupportError(getApiErrorMessage(error, SUPPORT_ERROR_MESSAGE));
          callbacks?.onError?.(error);
        },
      });
    },
    [mutateSupport]
  );

  const alterarStatus = useCallback(
    (id: number, payload: ChamadoStatusRequest, callbacks?: ActionCallbacks<Chamado>) => {
      mutateStatus({ id, payload }, callbacks);
    },
    [mutateStatus]
  );

  const excluirChamado = useCallback(
    (id: number, callbacks?: ActionCallbacks<void>) => {
      mutateDelete(id, callbacks);
    },
    [mutateDelete]
  );

  const clearSupportError = useCallback(() => setSupportError(null), []);

  return {
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isSupporting: apoiarMutation.isPending,
    isChangingStatus: statusMutation.isPending,
    isDeleting: deleteMutation.isPending,
    supportError,
    clearSupportError,
    criarChamado,
    atualizarChamado,
    apoiarChamado,
    alterarStatus,
    excluirChamado,
  };
}
