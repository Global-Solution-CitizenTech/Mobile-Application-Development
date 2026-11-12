import { useCallback, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useChamadoMutations } from '@/hooks/useChamadoMutations';
import { useChamadoDetail } from '@/hooks/useChamados';
import { canSupportChamado } from '@/theme/semanticConfig';
import { getApiErrorMessage } from '@/utils/apiError';
import { canChangeChamadoStatus, canDeleteChamado, canEditChamado } from '@/utils/permissions';
import type { StatusUpdateFormData } from '@/utils/schemas';

export function useChamadoDetails(id: number) {
  const { usuario } = useAuth();
  const detailQuery = useChamadoDetail(id);
  const { apoiarChamado, alterarStatus, excluirChamado, isSupporting, isChangingStatus, isDeleting } = useChamadoMutations();

  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const chamado = detailQuery.chamado;
  const podeEditar = canEditChamado(usuario, chamado);
  const podeAlterarStatus = canChangeChamadoStatus(usuario);
  const podeExcluir = canDeleteChamado(usuario);
  const podeApoiar = chamado ? canSupportChamado(chamado.status) : false;
  const jaApoiado = chamado?.apoiadoPorMim ?? false;

  const handleApoiar = useCallback(() => {
    if (!chamado || !podeApoiar) return;
    setActionError(null);
    apoiarChamado(chamado.idChamado, {
      onError: (err) => setActionError(getApiErrorMessage(err, 'Falha ao registrar apoio.')),
    });
  }, [apoiarChamado, chamado, podeApoiar]);

  const handleAlterarStatus = useCallback(
    (formData: StatusUpdateFormData) => {
      if (!chamado) return;
      setActionError(null);
      alterarStatus(
        chamado.idChamado,
        { status: formData.status, observacao: formData.observacao.trim() },
        {
          onSuccess: () => setStatusModalVisible(false),
          onError: (err) => setActionError(getApiErrorMessage(err, 'Falha ao atualizar status.')),
        }
      );
    },
    [alterarStatus, chamado]
  );

  const handleConfirmDelete = useCallback(
    (onDeleted: () => void) => {
      if (!chamado) return;
      setActionError(null);
      excluirChamado(chamado.idChamado, {
        onSuccess: () => {
          setDeleteModalVisible(false);
          onDeleted();
        },
        onError: (err) => {
          setDeleteModalVisible(false);
          setActionError(getApiErrorMessage(err, 'Falha ao excluir chamado.'));
        },
      });
    },
    [chamado, excluirChamado]
  );

  return {
    chamado,
    isLoading: detailQuery.isLoading,
    isRefetching: detailQuery.isRefetching,
    fetchError: detailQuery.error,
    actionError,
    clearActionError: () => setActionError(null),
    refetch: detailQuery.refetch,
    podeEditar,
    podeAlterarStatus,
    podeExcluir,
    podeApoiar,
    jaApoiado,
    isSupporting,
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
