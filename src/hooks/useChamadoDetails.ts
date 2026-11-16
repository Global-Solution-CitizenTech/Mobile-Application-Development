import { useCallback, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useFeedback } from '@/contexts/FeedbackContext';
import { useChamadoMutations } from '@/hooks/useChamadoMutations';
import { useChamadoDetail } from '@/hooks/useChamados';
import { queryKeys } from '@/lib/queryKeys';
import type { StatusUpdateFormData } from '@/types/form';
import { getApiErrorMessage } from '@/utils/apiError';
import {
  canChangeChamadoStatus,
  canDeleteChamado,
  canEditChamado,
  canSupportChamado,
} from '@/utils/permissions';

export function useChamadoDetails(id: number) {
  const { usuario } = useAuth();
  const { showError } = useFeedback();
  const queryClient = useQueryClient();

  const hasValidId = Number.isInteger(id) && id > 0;
  const detailQuery = useChamadoDetail(hasValidId ? id : undefined);
  const {
    apoiarChamado,
    alterarStatus,
    excluirChamado,
    isSupportingId,
    isChangingStatus,
    isDeleting,
  } = useChamadoMutations();

  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const deletedIdRef = useRef<number | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (deletedIdRef.current !== null) {
        queryClient.removeQueries({ queryKey: queryKeys.chamados.detail(deletedIdRef.current) });
      }
    };
  }, [queryClient]);

  const chamado = detailQuery.chamado;
  const podeEditar = canEditChamado(usuario, chamado);
  const podeAlterarStatus = canChangeChamadoStatus(usuario);
  const podeExcluir = canDeleteChamado(usuario, chamado);
  const podeApoiar = chamado ? canSupportChamado(chamado.status) : false;

  const handleApoiar = useCallback(() => {
    if (!chamado || !podeApoiar) return;
    apoiarChamado(chamado.idChamado);
  }, [apoiarChamado, chamado, podeApoiar]);

  const handleAlterarStatus = useCallback(
    (formData: StatusUpdateFormData) => {
      if (!chamado || isChangingStatus) return;
      alterarStatus(
        chamado.idChamado,
        { status: formData.status, observacao: formData.observacao.trim() },
        {
          onSuccess: () => {
            if (mountedRef.current) setStatusModalVisible(false);
          },
          onError: (err) => {
            if (mountedRef.current) {
              showError(
                'Não foi possível concluir',
                getApiErrorMessage(err, 'Falha ao atualizar status.')
              );
            }
          },
        }
      );
    },
    [alterarStatus, chamado, isChangingStatus, showError]
  );

  const handleConfirmDelete = useCallback(
    (onDeleted: () => void) => {
      if (!chamado || isDeleting) return;
      const targetId = chamado.idChamado;
      excluirChamado(targetId, {
        onSuccess: () => {
          deletedIdRef.current = targetId;
          if (mountedRef.current) {
            setDeleteModalVisible(false);
          }
          onDeleted();
        },
        onError: (err) => {
          if (mountedRef.current) {
            setDeleteModalVisible(false);
            showError(
              'Não foi possível concluir',
              getApiErrorMessage(err, 'Falha ao excluir chamado.')
            );
          }
        },
      });
    },
    [chamado, excluirChamado, isDeleting, showError]
  );

  return {
    chamado,
    hasValidId,
    isLoading: hasValidId ? detailQuery.isLoading : false,
    isRefreshing: hasValidId ? detailQuery.isRefetching : false,
    fetchError: !hasValidId ? 'ID de chamado inválido.' : detailQuery.error,
    refetch: detailQuery.refetch,
    podeEditar,
    podeAlterarStatus,
    podeExcluir,
    podeApoiar,
    isSupporting: chamado ? isSupportingId(chamado.idChamado) : false,
    isChangingStatus,
    isDeleting,
    statusModalVisible,
    setStatusModalVisible,
    deleteModalVisible,
    setDeleteModalVisible,
    handleApoiar,
    handleAlterarStatus,
    handleConfirmDelete,
  };
}
