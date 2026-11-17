import { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard } from 'react-native';
import { useFeedback } from '@/contexts/FeedbackContext';
import { formatLocalizacaoResumo, useLocalizacao } from '@/hooks/useLocalizacao';
import { bindFieldHelpers } from '@/hooks/useZodForm';
import type {
  Chamado,
  NovoChamadoFormState,
  UseNovoChamadoFormReturn,
} from '@/types/chamado';
import type { ChamadoCreateFormData, FormErrors, StringFieldKeys } from '@/types/form';
import { getApiErrorMessage } from '@/utils/apiError';
import { toChamadoCreateRequest } from '@/utils/chamadoMappers';
import { maskCepInput } from '@/utils/formatters';
import { ChamadoCreateSchema, extractFieldErrors } from '@/utils/schemas';
import { useChamadoMutations } from '@/hooks/useChamadoMutations';

const INITIAL_NOVO_CHAMADO: NovoChamadoFormState = {
  cep: '',
  rua: '',
  numero: '',
  referencia: '',
  foto: undefined,
};

export function useNovoChamadoForm(): UseNovoChamadoFormReturn {
  const { showError } = useFeedback();
  const { criarChamado, isCreating } = useChamadoMutations();
  const { capturandoGps, erroGps, ultimaLocalizacao, capturarLocalizacao, limparLocalizacao } =
    useLocalizacao();

  const [values, setValues] = useState<NovoChamadoFormState>(INITIAL_NOVO_CHAMADO);
  const [errors, setErrors] = useState<FormErrors<ChamadoCreateFormData>>({});
  const mountedRef = useRef(true);
  const submittingRef = useRef(false);
  const gpsApplyEpochRef = useRef(0);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const clearFieldError = useCallback((field: keyof NovoChamadoFormState) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const setFieldValue = useCallback(
    <K extends keyof NovoChamadoFormState>(field: K, value: NovoChamadoFormState[K]) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      clearFieldError(field);
    },
    [clearFieldError]
  );

  const setStringField = useCallback(
    <K extends StringFieldKeys<NovoChamadoFormState>>(fieldName: K, value: string) => {
      setValues((prev) => Object.assign({}, prev, { [fieldName]: value }));
      clearFieldError(fieldName);
    },
    [clearFieldError]
  );

  const field = bindFieldHelpers(values, errors, setStringField, isCreating);

  const resetForm = useCallback(() => {
    gpsApplyEpochRef.current += 1;
    setValues(INITIAL_NOVO_CHAMADO);
    setErrors({});
    limparLocalizacao();
  }, [limparLocalizacao]);

  const handleUsarGps = useCallback(async () => {
    if (submittingRef.current || isCreating) return;
    const applyEpoch = gpsApplyEpochRef.current;
    const loc = await capturarLocalizacao();
    if (!loc || !mountedRef.current || applyEpoch !== gpsApplyEpochRef.current) return;

    if (loc.cep) setFieldValue('cep', maskCepInput(loc.cep));
    if (loc.rua) setFieldValue('rua', loc.rua);
    if (loc.numero) setFieldValue('numero', loc.numero);
    if (loc.referencia) setFieldValue('referencia', loc.referencia);
  }, [capturarLocalizacao, isCreating, setFieldValue]);

  const submit = useCallback(
    (onSuccess: (chamado: Chamado) => void) => {
      if (submittingRef.current || isCreating) return;

      const result = ChamadoCreateSchema.safeParse(values);
      if (!result.success) {
        setErrors(extractFieldErrors<ChamadoCreateFormData>(result.error));
        return;
      }

      setErrors({});
      submittingRef.current = true;
      Keyboard.dismiss();
      criarChamado(toChamadoCreateRequest(result.data), {
        onSuccess: (created) => {
          submittingRef.current = false;
          if (!mountedRef.current) return;
          resetForm();
          onSuccess(created);
        },
        onError: (err) => {
          submittingRef.current = false;
          if (!mountedRef.current) return;
          showError('Erro ao enviar', getApiErrorMessage(err, 'Erro ao registrar chamado.'));
        },
      });
    },
    [criarChamado, isCreating, resetForm, showError, values]
  );

  return {
    values,
    errors,
    setFieldValue,
    field,
    submitting: isCreating,
    capturandoGps,
    erroGps,
    localizacaoPreview: ultimaLocalizacao,
    localizacaoResumo: formatLocalizacaoResumo(ultimaLocalizacao),
    handleUsarGps,
    resetForm,
    submit,
  };
}
