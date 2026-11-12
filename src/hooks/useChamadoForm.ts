import { useCallback, useMemo, useState } from 'react';
import { useCategoriasChamado, useChamadoDetail } from '@/hooks/useChamados';
import { useChamadoMutations } from '@/hooks/useChamadoMutations';
import { useLocalizacao, type LocalizacaoCapturada } from '@/hooks/useLocalizacao';
import type { Chamado } from '@/types/chamado';
import { getApiErrorMessage } from '@/utils/apiError';
import { toChamadoRequest } from '@/utils/chamadoMappers';
import { formatCep } from '@/utils/formatters';
import { ChamadoFormSchema, type ChamadoFormData } from '@/utils/schemas';

const INITIAL_CHAMADO_FORM: ChamadoFormData = {
  titulo: '',
  categoriaId: 0,
  descricao: '',
  cep: '',
  rua: '',
  numero: '',
  referencia: '',
  fotoBase64: undefined,
};

interface UseChamadoFormOptions {
  mode: 'create' | 'edit';
  chamadoId?: number;
}

export function useChamadoForm({ mode, chamadoId }: UseChamadoFormOptions) {
  const isEdit = mode === 'edit';
  const { categorias, isLoading: loadingCategorias } = useCategoriasChamado();
  const detailQuery = useChamadoDetail(isEdit ? chamadoId : undefined);
  const { criarChamado, atualizarChamado, isCreating, isUpdating } = useChamadoMutations();
  const { capturandoGps, erroGps, ultimaLocalizacao, capturarLocalizacao, limparLocalizacao } = useLocalizacao();

  const [draft, setDraft] = useState<Partial<ChamadoFormData>>({});
  const [errors, setErrors] = useState<Partial<Record<keyof ChamadoFormData, string>>>({});
  const [localizacaoPreview, setLocalizacaoPreview] = useState<LocalizacaoCapturada | null>(null);
  const [erroModal, setErroModal] = useState<string | null>(null);

  const values = useMemo<ChamadoFormData>(() => {
    const chamado = detailQuery.chamado;
    const base: ChamadoFormData =
      isEdit && chamado
        ? {
            titulo: chamado.titulo,
            categoriaId: chamado.categoriaId,
            descricao: chamado.descricao,
            cep: formatCep(chamado.endereco.cep),
            rua: chamado.endereco.rua || '',
            numero: chamado.endereco.numero || '',
            referencia: chamado.endereco.referencia || '',
            fotoBase64: undefined,
          }
        : INITIAL_CHAMADO_FORM;

    return { ...base, ...draft };
  }, [detailQuery.chamado, draft, isEdit]);

  const setFieldValue = useCallback(<K extends keyof ChamadoFormData>(field: K, value: ChamadoFormData[K]) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const handleUsarGps = useCallback(async () => {
    const loc = await capturarLocalizacao();
    if (!loc) return;

    setLocalizacaoPreview(loc);
    setDraft((prev) => ({
      ...prev,
      cep: loc.cep ? formatCep(loc.cep) : prev.cep,
      rua: loc.rua || prev.rua,
      numero: loc.numero || prev.numero || 'S/N',
      referencia: loc.referencia || prev.referencia,
    }));
  }, [capturarLocalizacao]);

  const resetForm = useCallback(() => {
    setDraft({});
    setErrors({});
    setLocalizacaoPreview(null);
    limparLocalizacao();
    setErroModal(null);
  }, [limparLocalizacao]);

  const submit = useCallback(
    (onSuccess: (chamado: Chamado) => void) => {
      const result = ChamadoFormSchema.safeParse(values);
      if (!result.success) {
        const nextErrors: Partial<Record<keyof ChamadoFormData, string>> = {};
        for (const issue of result.error.issues) {
          const key = issue.path[0] as keyof ChamadoFormData | undefined;
          if (key && !nextErrors[key]) nextErrors[key] = issue.message;
        }
        setErrors(nextErrors);
        return;
      }

      setErrors({});
      setErroModal(null);
      const payload = toChamadoRequest(result.data);

      if (isEdit && chamadoId) {
        atualizarChamado(chamadoId, payload, {
          onSuccess,
          onError: (err) => setErroModal(getApiErrorMessage(err, 'Falha ao salvar alterações.')),
        });
        return;
      }

      criarChamado(payload, {
        onSuccess: (created) => {
          resetForm();
          onSuccess(created);
        },
        onError: (err) => setErroModal(getApiErrorMessage(err, 'Erro ao registrar chamado.')),
      });
    },
    [atualizarChamado, chamadoId, criarChamado, isEdit, resetForm, values]
  );

  return {
    values,
    errors,
    setFieldValue,
    categorias,
    loadingCategorias,
    chamadoOriginal: detailQuery.chamado,
    loadingChamado: isEdit ? detailQuery.isLoading : false,
    loadError: isEdit ? detailQuery.error : null,
    submitting: isCreating || isUpdating,
    capturandoGps,
    erroGps,
    localizacaoPreview: localizacaoPreview ?? ultimaLocalizacao,
    erroModal,
    clearErroModal: () => setErroModal(null),
    handleUsarGps,
    resetForm,
    submit,
  };
}
