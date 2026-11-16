import { useCallback, useEffect, useRef } from 'react';
import { useFeedback } from '@/contexts/FeedbackContext';
import { useChamadoMutations } from '@/hooks/useChamadoMutations';
import { useChamadoDetail } from '@/hooks/useChamados';
import { formatLocalizacaoResumo, useLocalizacao } from '@/hooks/useLocalizacao';
import { useZodForm } from '@/hooks/useZodForm';
import { CATEGORIA_CATALOG } from '@/theme/semanticConfig';
import type { Chamado, UseEditarChamadoFormReturn } from '@/types/chamado';
import type { EditarChamadoFormData } from '@/types/form';
import { getApiErrorMessage } from '@/utils/apiError';
import { toChamadoRequest } from '@/utils/chamadoMappers';
import { maskCepInput } from '@/utils/formatters';
import { ChamadoFormSchema } from '@/utils/schemas';

const INITIAL_EDITAR_CHAMADO: EditarChamadoFormData = {
  titulo: '',
  categoriaId: 0,
  descricao: '',
  cep: '',
  rua: '',
  numero: '',
  referencia: '',
};

function mapChamadoToForm(chamado: Chamado): EditarChamadoFormData {
  return {
    titulo: chamado.titulo,
    categoriaId: chamado.categoriaId,
    descricao: chamado.descricao,
    cep: maskCepInput(chamado.endereco.cep),
    rua: chamado.endereco.rua || '',
    numero: chamado.endereco.numero || '',
    referencia: chamado.endereco.referencia || '',
  };
}

export function useEditarChamadoForm(chamadoId: number): UseEditarChamadoFormReturn {
  const { showError } = useFeedback();
  const hasValidId = Number.isInteger(chamadoId) && chamadoId > 0;
  const detailQuery = useChamadoDetail(hasValidId ? chamadoId : undefined);
  const { atualizarChamado, isUpdating } = useChamadoMutations();
  const { capturandoGps, erroGps, ultimaLocalizacao, capturarLocalizacao, limparLocalizacao } =
    useLocalizacao();

  const form = useZodForm(ChamadoFormSchema, INITIAL_EDITAR_CHAMADO);
  const { syncValues, setFieldValue: baseSetFieldValue } = form;

  const mountedRef = useRef(true);
  const submittingRef = useRef(false);
  const isDirtyRef = useRef(false);
  const lastChamadoIdRef = useRef<number>(chamadoId);
  const lastSyncedChamadoRef = useRef<Chamado | null>(null);
  const gpsApplyEpochRef = useRef(0);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (lastChamadoIdRef.current !== chamadoId) {
      lastChamadoIdRef.current = chamadoId;
      lastSyncedChamadoRef.current = null;
      isDirtyRef.current = false;
      gpsApplyEpochRef.current += 1;
      syncValues(INITIAL_EDITAR_CHAMADO);
      limparLocalizacao();
    }
  }, [chamadoId, limparLocalizacao, syncValues]);

  const chamado = detailQuery.chamado;
  useEffect(() => {
    if (!hasValidId || !chamado || chamado.idChamado !== chamadoId) return;
    if (lastSyncedChamadoRef.current === chamado) return;
    if (isDirtyRef.current && lastSyncedChamadoRef.current !== null) return;

    lastSyncedChamadoRef.current = chamado;
    isDirtyRef.current = false;
    syncValues(mapChamadoToForm(chamado));
  }, [chamado, chamadoId, hasValidId, syncValues]);

  const setFieldValue = useCallback(
    <K extends keyof EditarChamadoFormData>(fieldName: K, value: EditarChamadoFormData[K]) => {
      isDirtyRef.current = true;
      baseSetFieldValue(fieldName, value);
    },
    [baseSetFieldValue]
  );

  const handleUsarGps = useCallback(async () => {
    const applyEpoch = gpsApplyEpochRef.current;
    const loc = await capturarLocalizacao();
    if (!loc || !mountedRef.current || applyEpoch !== gpsApplyEpochRef.current) return;

    if (loc.cep) setFieldValue('cep', maskCepInput(loc.cep));
    if (loc.rua) setFieldValue('rua', loc.rua);
    if (loc.numero) setFieldValue('numero', loc.numero);
    if (loc.referencia) setFieldValue('referencia', loc.referencia);
  }, [capturarLocalizacao, setFieldValue]);

  const submit = useCallback(
    (onSuccess: (updated: Chamado) => void) => {
      if (!hasValidId || submittingRef.current || isUpdating) return;

      const parsed = form.validate();
      if (!parsed) return;

      submittingRef.current = true;
      atualizarChamado(chamadoId, toChamadoRequest(parsed), {
        onSuccess: (updated) => {
          submittingRef.current = false;
          isDirtyRef.current = false;
          lastSyncedChamadoRef.current = updated;
          if (!mountedRef.current) return;
          onSuccess(updated);
        },
        onError: (err) => {
          submittingRef.current = false;
          if (!mountedRef.current) return;
          showError('Erro ao salvar', getApiErrorMessage(err, 'Falha ao salvar alterações.'));
        },
      });
    },
    [atualizarChamado, chamadoId, form, hasValidId, isUpdating, showError]
  );

  return {
    values: form.values,
    errors: form.errors,
    setFieldValue,
    field: form.field,
    categorias: CATEGORIA_CATALOG,
    loadingChamado: hasValidId ? detailQuery.isLoading : false,
    loadError: !hasValidId ? 'ID de chamado inválido.' : detailQuery.error,
    submitting: isUpdating,
    capturandoGps,
    erroGps,
    localizacaoPreview: ultimaLocalizacao,
    localizacaoResumo: formatLocalizacaoResumo(ultimaLocalizacao),
    handleUsarGps,
    submit,
  };
}
