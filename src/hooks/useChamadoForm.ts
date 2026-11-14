import { useState } from 'react';
import { useFeedback } from '@/contexts/FeedbackContext';
import { useChamadoDetail } from '@/hooks/useChamados';
import { useChamadoMutations } from '@/hooks/useChamadoMutations';
import { useLocalizacao } from '@/hooks/useLocalizacao';
import { bindFieldHelpers } from '@/hooks/useZodForm';
import { CATEGORIA_CATALOG } from '@/theme/semanticConfig';
import type { Chamado, FotoUpload } from '@/types/chamado';
import { getApiErrorMessage } from '@/utils/apiError';
import { toChamadoCreateRequest, toChamadoRequest } from '@/utils/chamadoMappers';
import { maskCepInput } from '@/utils/formatters';
import {
  ChamadoCreateSchema,
  ChamadoFormSchema,
  type ChamadoCreateFormData,
  type ChamadoFormData,
  extractFieldErrors,
  type FormErrors,
} from '@/utils/schemas';

type ChamadoFormState = ChamadoFormData & { foto?: FotoUpload };

const INITIAL_CHAMADO_FORM: ChamadoFormState = {
  titulo: '',
  categoriaId: 0,
  descricao: '',
  cep: '',
  rua: '',
  numero: '',
  referencia: '',
  foto: undefined,
};

type UseChamadoFormOptions =
  | { mode: 'create' }
  | { mode: 'edit'; chamadoId: number };

export function useChamadoForm(options: UseChamadoFormOptions) {
  const { showError } = useFeedback();
  const isEdit = options.mode === 'edit';
  const chamadoId = options.mode === 'edit' ? options.chamadoId : undefined;
  const detailQuery = useChamadoDetail(chamadoId);
  const { criarChamado, atualizarChamado, isCreating, isUpdating } = useChamadoMutations();
  const { capturandoGps, erroGps, ultimaLocalizacao, capturarLocalizacao, limparLocalizacao } =
    useLocalizacao();

  const [draft, setDraft] = useState<Partial<ChamadoFormState>>({});
  const [errors, setErrors] = useState<FormErrors<ChamadoFormState>>({});

  const chamado = detailQuery.chamado;
  const base: ChamadoFormState =
    isEdit && chamado
      ? {
          titulo: chamado.titulo,
          categoriaId: chamado.categoriaId,
          descricao: chamado.descricao,
          cep: maskCepInput(chamado.endereco.cep),
          rua: chamado.endereco.rua || '',
          numero: chamado.endereco.numero || '',
          referencia: chamado.endereco.referencia || '',
          foto: undefined,
        }
      : INITIAL_CHAMADO_FORM;

  const values: ChamadoFormState = { ...base, ...draft };

  const setFieldValue = <K extends keyof ChamadoFormState>(field: K, value: ChamadoFormState[K]) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const field = bindFieldHelpers(values, errors, setFieldValue);

  const handleUsarGps = async () => {
    const loc = await capturarLocalizacao();
    if (!loc) return;

    setDraft((prev) => ({
      ...prev,
      cep: loc.cep ? maskCepInput(loc.cep) : prev.cep,
      rua: loc.rua || prev.rua,
      numero: loc.numero || prev.numero || 'S/N',
      referencia: loc.referencia || prev.referencia,
    }));
  };

  const resetForm = () => {
    setDraft({});
    setErrors({});
    limparLocalizacao();
  };

  const submit = (onSuccess: (chamado: Chamado) => void) => {
    setErrors({});

    if (isEdit && chamadoId) {
      const result = ChamadoFormSchema.safeParse(values);
      if (!result.success) {
        setErrors(extractFieldErrors<ChamadoFormData>(result.error));
        return;
      }
      atualizarChamado(chamadoId, toChamadoRequest(result.data), {
        onSuccess,
        onError: (err) =>
          showError('Erro ao salvar', getApiErrorMessage(err, 'Falha ao salvar alterações.')),
      });
      return;
    }

    const result = ChamadoCreateSchema.safeParse({
      cep: values.cep,
      rua: values.rua,
      numero: values.numero,
      referencia: values.referencia,
      foto: values.foto,
    });
    if (!result.success) {
      setErrors(extractFieldErrors<ChamadoCreateFormData>(result.error));
      return;
    }

    criarChamado(toChamadoCreateRequest(result.data), {
      onSuccess: (created) => {
        resetForm();
        onSuccess(created);
      },
      onError: (err) =>
        showError('Erro ao enviar', getApiErrorMessage(err, 'Erro ao registrar chamado.')),
    });
  };

  return {
    values,
    errors,
    setFieldValue,
    field,
    categorias: CATEGORIA_CATALOG,
    loadingChamado: isEdit ? detailQuery.isLoading : false,
    loadError: isEdit ? detailQuery.error : null,
    submitting: isCreating || isUpdating,
    capturandoGps,
    erroGps,
    localizacaoPreview: ultimaLocalizacao,
    handleUsarGps,
    submit,
  };
}
