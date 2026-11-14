import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useFeedback } from '@/contexts/FeedbackContext';
import { useChamadoMutations } from '@/hooks/useChamadoMutations';
import { useChamadoDetail } from '@/hooks/useChamados';
import { getApiErrorMessage } from '@/utils/apiError';
import {
  canChangeChamadoStatus,
  canDeleteChamado,
  canEditChamado,
  canSupportChamado,
} from '@/utils/permissions';
import type { StatusUpdateFormData } from '@/utils/schemas';

export function useChamadoDetails(id: number) {
  const { usuario } = useAuth();
  const { showError } = useFeedback();
  const detailQuery = useChamadoDetail(id);
  const { apoiarChamado, alterarStatus, excluirChamado, isSupporting, isChangingStatus, isDeleting } =
    useChamadoMutations();

  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const chamado = detailQuery.chamado;
  const podeEditar = canEditChamado(usuario, chamado);
  const podeAlterarStatus = canChangeChamadoStatus(usuario);
  const podeExcluir = canDeleteChamado(usuario, chamado);
  const podeApoiar = chamado ? canSupportChamado(chamado.status) : false;

  const handleApoiar = () => {
    if (!chamado || !podeApoiar) return;
    apoiarChamado(chamado.idChamado);
  };

  const handleAlterarStatus = (formData: StatusUpdateFormData) => {
    if (!chamado) return;
    alterarStatus(
      chamado.idChamado,
      { status: formData.status, observacao: formData.observacao.trim() },
      {
        onSuccess: () => setStatusModalVisible(false),
        onError: (err) =>
          showError('Não foi possível concluir', getApiErrorMessage(err, 'Falha ao atualizar status.')),
      }
    );
  };

  const handleConfirmDelete = (onDeleted: () => void) => {
    if (!chamado) return;
    excluirChamado(chamado.idChamado, {
      onSuccess: () => {
        setDeleteModalVisible(false);
        onDeleted();
      },
      onError: (err) => {
        setDeleteModalVisible(false);
        showError('Não foi possível concluir', getApiErrorMessage(err, 'Falha ao excluir chamado.'));
      },
    });
  };

  return {
    chamado,
    isLoading: detailQuery.isLoading,
    isRefreshing: detailQuery.isRefetching,
    fetchError: detailQuery.error,
    refetch: detailQuery.refetch,
    podeEditar,
    podeAlterarStatus,
    podeExcluir,
    podeApoiar,
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
