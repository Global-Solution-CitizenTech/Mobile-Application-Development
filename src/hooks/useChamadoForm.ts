import { useCallback, useMemo, useState } from 'react';
import { useCategoriasChamado, useChamadoDetail } from '@/hooks/useChamados';
import { useChamadoMutations } from '@/hooks/useChamadoMutations';
import { useLocalizacao } from '@/hooks/useLocalizacao';
import type { Chamado } from '@/types/chamado';
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

type UseChamadoFormOptions =
  | { mode: 'create' }
  | { mode: 'edit'; chamadoId: number };

export function useChamadoForm(options: UseChamadoFormOptions) {
  const isEdit = options.mode === 'edit';
  const chamadoId = options.mode === 'edit' ? options.chamadoId : undefined;
  const { categorias, isLoading: loadingCategorias } = useCategoriasChamado();
  const detailQuery = useChamadoDetail(isEdit ? chamadoId : undefined);
  const { criarChamado, atualizarChamado, isCreating, isUpdating } = useChamadoMutations();
  const { capturandoGps, erroGps, ultimaLocalizacao, capturarLocalizacao, limparLocalizacao } = useLocalizacao();

  const [draft, setDraft] = useState<Partial<ChamadoFormData>>({});
  const [errors, setErrors] = useState<FormErrors<ChamadoFormData>>({});
  const [erroModal, setErroModal] = useState<string | null>(null);

  const values = useMemo<ChamadoFormData>(() => {
    const chamado = detailQuery.chamado;
    const base: ChamadoFormData =
      isEdit && chamado
        ? {
            titulo: chamado.titulo,
            categoriaId: chamado.categoriaId,
            descricao: chamado.descricao,
            cep: maskCepInput(chamado.endereco.cep),
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

    setDraft((prev) => ({
      ...prev,
      cep: loc.cep ? maskCepInput(loc.cep) : prev.cep,
      rua: loc.rua || prev.rua,
      numero: loc.numero || prev.numero || 'S/N',
      referencia: loc.referencia || prev.referencia,
    }));
  }, [capturarLocalizacao]);

  const resetForm = useCallback(() => {
    setDraft({});
    setErrors({});
    limparLocalizacao();
    setErroModal(null);
  }, [limparLocalizacao]);

  const submit = useCallback(
    async (onSuccess: (chamado: Chamado) => void) => {
      setErrors({});
      setErroModal(null);

      if (isEdit && chamadoId) {
        const result = ChamadoFormSchema.safeParse(values);
        if (!result.success) {
          setErrors(extractFieldErrors<ChamadoFormData>(result.error));
          return;
        }
        atualizarChamado(chamadoId, toChamadoRequest(result.data), {
          onSuccess: (updated) => onSuccess(updated),
          onError: (err) => setErroModal(getApiErrorMessage(err, 'Falha ao salvar alterações.')),
        });
        return;
      }

      const createInput: ChamadoCreateFormData = {
        cep: values.cep,
        rua: values.rua,
        numero: values.numero,
        referencia: values.referencia,
        fotoBase64: values.fotoBase64 ?? '',
      };
      const result = ChamadoCreateSchema.safeParse(createInput);
      if (!result.success) {
        setErrors(extractFieldErrors<ChamadoCreateFormData>(result.error));
        return;
      }

      criarChamado(toChamadoCreateRequest(result.data), {
        onSuccess: (created) => {
          resetForm();
          onSuccess(created);
        },
        onError: (err) => setErroModal(getApiErrorMessage(err, 'Erro ao registrar chamado.')),
      });
    },
    [atualizarChamado, chamadoId, criarChamado, isEdit, resetForm, values]
  );

  const clearErroModal = useCallback(() => setErroModal(null), []);

  return {
    values,
    errors,
    setFieldValue,
    categorias,
    loadingCategorias,
    loadingChamado: isEdit ? detailQuery.isLoading : false,
    loadError: isEdit ? detailQuery.error : null,
    submitting: isCreating || isUpdating,
    capturandoGps,
    erroGps,
    localizacaoPreview: ultimaLocalizacao,
    erroModal,
    clearErroModal,
    handleUsarGps,
    submit,
  };
}
