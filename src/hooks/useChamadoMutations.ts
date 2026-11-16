import { useCallback, useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFeedback } from '@/contexts/FeedbackContext';
import { patchApoioInCache, toggleApoioOtimista } from '@/lib/chamadoCache';
import { queryKeys } from '@/lib/queryKeys';
import { chamadoService } from '@/services/chamadoService';
import type { ActionCallbacks } from '@/types/api';
import type {
  Chamado,
  ChamadoCreateRequest,
  ChamadoListCache,
  ChamadoRequest,
  ChamadoStatusRequest,
} from '@/types/chamado';
import { getApiErrorMessage } from '@/utils/apiError';

function replaceChamadoInCache(
  old: ChamadoListCache | undefined,
  updated: Chamado
): ChamadoListCache | undefined {
  if (!old) return old;
  const replace = (item: Chamado) => (item.idChamado === updated.idChamado ? updated : item);

  if ('pages' in old) {
    return {
      ...old,
      pages: old.pages.map((page) => ({ ...page, content: page.content.map(replace) })),
    };
  }

  return {
    ...old,
    content: old.content.map(replace),
  };
}

export function useChamadoMutations() {
  const queryClient = useQueryClient();
  const { showError } = useFeedback();
  const [supportingIds, setSupportingIds] = useState<number[]>([]);
  const supportingIdsRef = useRef<Set<number>>(new Set());
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const syncSupportingState = useCallback(() => {
    if (mountedRef.current) {
      setSupportingIds(Array.from(supportingIdsRef.current));
    }
  }, []);

  const unlockSupportId = useCallback(
    (id: number) => {
      if (supportingIdsRef.current.delete(id)) {
        syncSupportingState();
      }
    },
    [syncSupportingState]
  );

  const invalidateListsAndStats = useCallback(
    () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.chamados.lists() }),
        queryClient.invalidateQueries({ queryKey: queryKeys.chamados.estatisticas() }),
      ]),
    [queryClient]
  );

  const createMutation = useMutation({
    mutationFn: (payload: ChamadoCreateRequest) => chamadoService.criar(payload),
    onSuccess: async (created) => {
      queryClient.setQueryData(queryKeys.chamados.detail(created.idChamado), created);
      await invalidateListsAndStats();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ChamadoRequest }) =>
      chamadoService.atualizar(id, payload),
    onSuccess: async (updated) => {
      queryClient.setQueryData(queryKeys.chamados.detail(updated.idChamado), updated);
      await invalidateListsAndStats();
    },
  });

  const apoiarMutation = useMutation({
    mutationFn: (id: number) => chamadoService.apoiar(id),
    onMutate: async (id) => {
      const detailKey = queryKeys.chamados.detail(id);
      await Promise.all([
        queryClient.cancelQueries({ queryKey: detailKey }),
        queryClient.cancelQueries({ queryKey: queryKeys.chamados.lists() }),
      ]);

      queryClient.setQueriesData<ChamadoListCache>(
        { queryKey: queryKeys.chamados.lists() },
        (old) => patchApoioInCache(old, id)
      );

      const previousDetail = queryClient.getQueryData<Chamado>(detailKey);
      if (previousDetail) {
        queryClient.setQueryData<Chamado>(detailKey, toggleApoioOtimista(previousDetail));
      }

      return { id, hasPreviousDetail: Boolean(previousDetail) };
    },
    onSuccess: (updated, id) => {
      queryClient.setQueryData(queryKeys.chamados.detail(id), updated);
      queryClient.setQueriesData<ChamadoListCache>(
        { queryKey: queryKeys.chamados.lists() },
        (old) => replaceChamadoInCache(old, updated)
      );
    },
    onError: (error, id, context) => {
      // Reverte apenas o item que falhou para não desfazer apoios otimistas concorrentes de outros cards.
      queryClient.setQueriesData<ChamadoListCache>(
        { queryKey: queryKeys.chamados.lists() },
        (old) => patchApoioInCache(old, id)
      );
      if (context?.hasPreviousDetail) {
        const detailKey = queryKeys.chamados.detail(id);
        const currentDetail = queryClient.getQueryData<Chamado>(detailKey);
        if (currentDetail) {
          queryClient.setQueryData<Chamado>(detailKey, toggleApoioOtimista(currentDetail));
        }
      }
      showError('Não foi possível apoiar', getApiErrorMessage(error, 'Falha ao registrar apoio.'));
    },
    onSettled: async (_data, _error, id) => {
      unlockSupportId(id);
      const tasks: Promise<unknown>[] = [
        queryClient.invalidateQueries({ queryKey: queryKeys.chamados.detail(id) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.chamados.estatisticas() }),
      ];
      if (supportingIdsRef.current.size === 0) {
        tasks.push(queryClient.invalidateQueries({ queryKey: queryKeys.chamados.lists() }));
      }
      await Promise.all(tasks);
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ChamadoStatusRequest }) =>
      chamadoService.alterarStatus(id, payload),
    onSuccess: async (updated) => {
      queryClient.setQueryData(queryKeys.chamados.detail(updated.idChamado), updated);
      await invalidateListsAndStats();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => chamadoService.deletar(id),
    onSuccess: async (_res, id) => {
      // Remove apenas observadores inativos para evitar flash de "não disponível" durante o goBack().
      queryClient.removeQueries({ queryKey: queryKeys.chamados.detail(id), type: 'inactive' });
      await invalidateListsAndStats();
    },
  });

  const { mutate: mutateApoiar } = apoiarMutation;
  const apoiarChamado = useCallback(
    (id: number, callbacks?: ActionCallbacks<Chamado>) => {
      if (supportingIdsRef.current.has(id)) return;
      supportingIdsRef.current.add(id);
      syncSupportingState();
      mutateApoiar(id, callbacks);
    },
    [mutateApoiar, syncSupportingState]
  );

  const isSupportingId = useCallback(
    (id: number) => supportingIds.includes(id),
    [supportingIds]
  );

  return {
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isSupporting: supportingIds.length > 0,
    supportingIds,
    isSupportingId,
    isChangingStatus: statusMutation.isPending,
    isDeleting: deleteMutation.isPending,
    criarChamado: (payload: ChamadoCreateRequest, callbacks?: ActionCallbacks<Chamado>) =>
      createMutation.mutate(payload, callbacks),
    atualizarChamado: (id: number, payload: ChamadoRequest, callbacks?: ActionCallbacks<Chamado>) =>
      updateMutation.mutate({ id, payload }, callbacks),
    apoiarChamado,
    alterarStatus: (id: number, payload: ChamadoStatusRequest, callbacks?: ActionCallbacks<Chamado>) =>
      statusMutation.mutate({ id, payload }, callbacks),
    excluirChamado: (id: number, callbacks?: ActionCallbacks<void>) =>
      deleteMutation.mutate(id, callbacks),
  };
}
