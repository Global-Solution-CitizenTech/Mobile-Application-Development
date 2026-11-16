import { FeedbackModal } from '@/components/FeedbackModal';
import { getCategoryLabel, getPriorityLabel } from '@/theme/semanticConfig';
import type { NovoChamadoSuccessModalProps } from '@/types/ui';

export const NovoChamadoSuccessModal = ({
  chamado,
  onViewChamado,
  onGoToMeusChamados,
}: NovoChamadoSuccessModalProps) => {
  const message = chamado
    ? `Protocolo #${chamado.idChamado}\n\n• Categoria: ${getCategoryLabel(chamado.categoriaNome)}\n• Gravidade: ${getPriorityLabel(chamado.prioridadeNome)}`
    : '';

  return (
    <FeedbackModal
      visible={Boolean(chamado)}
      type="success"
      title="Chamado Criado com Sucesso!"
      message={message}
      confirmText="Ver Chamado"
      cancelText="Meus Chamados"
      onConfirm={() => {
        if (chamado) {
          onViewChamado(chamado.idChamado);
        }
      }}
      onCancel={onGoToMeusChamados}
    />
  );
};
