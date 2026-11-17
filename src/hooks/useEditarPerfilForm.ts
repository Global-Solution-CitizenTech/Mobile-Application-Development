import { useCallback, useEffect, useRef } from 'react';
import { Keyboard } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useFeedback } from '@/contexts/FeedbackContext';
import { formatLocalizacaoResumo, useLocalizacao } from '@/hooks/useLocalizacao';
import { useZodForm } from '@/hooks/useZodForm';
import { buildUsuarioRequest } from '@/services/authService';
import type { UseEditarPerfilFormReturn, Usuario, UsuarioRequest } from '@/types/auth';
import type { EditarPerfilFormData } from '@/types/form';
import { getApiErrorMessage } from '@/utils/apiError';
import { maskCepInput, maskPhoneInput } from '@/utils/formatters';
import { ProfileEditSchema } from '@/utils/schemas';

function toProfileFormValues(usuario: Usuario | null): EditarPerfilFormData {
  return {
    nome: usuario?.nome ?? '',
    email: usuario?.email ?? '',
    telefone: usuario ? maskPhoneInput(`${usuario.ddd}${usuario.numeroTelefone}`) : '',
    cep: usuario?.endereco ? maskCepInput(usuario.endereco.cep) : '',
    rua: usuario?.endereco?.rua ?? '',
    numero: usuario?.endereco?.numero ?? '',
    referencia: usuario?.endereco?.referencia ?? '',
    senha: '',
  };
}

export function useEditarPerfilForm(): UseEditarPerfilFormReturn {
  const { usuario, updateProfile } = useAuth();
  const { showError, showSuccess } = useFeedback();
  const { capturandoGps, erroGps, ultimaLocalizacao, capturarLocalizacao } = useLocalizacao();

  const saveMutation = useMutation({
    mutationFn: (payload: UsuarioRequest) => updateProfile(payload),
  });

  const form = useZodForm(ProfileEditSchema, toProfileFormValues(usuario), {
    disabled: saveMutation.isPending,
  });
  const { syncValues, setFieldValue: baseSetFieldValue } = form;

  const mountedRef = useRef(true);
  const submittingRef = useRef(false);
  const isDirtyRef = useRef(false);
  const lastSyncedUsuarioRef = useRef<Usuario | null>(usuario);
  const gpsApplyEpochRef = useRef(0);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!usuario) {
      lastSyncedUsuarioRef.current = null;
      isDirtyRef.current = false;
      gpsApplyEpochRef.current += 1;
      syncValues(toProfileFormValues(null));
      return;
    }

    if (lastSyncedUsuarioRef.current === usuario) return;
    if (isDirtyRef.current && lastSyncedUsuarioRef.current !== null) return;

    lastSyncedUsuarioRef.current = usuario;
    isDirtyRef.current = false;
    syncValues(toProfileFormValues(usuario));
  }, [syncValues, usuario]);

  const setFieldValue = useCallback(
    <K extends keyof EditarPerfilFormData>(fieldName: K, value: EditarPerfilFormData[K]) => {
      isDirtyRef.current = true;
      baseSetFieldValue(fieldName, value);
    },
    [baseSetFieldValue]
  );

  const onUsarGps = useCallback(async () => {
    if (submittingRef.current || saveMutation.isPending) return;
    const applyEpoch = gpsApplyEpochRef.current;
    const loc = await capturarLocalizacao();
    if (!loc || !mountedRef.current || applyEpoch !== gpsApplyEpochRef.current) return;

    if (loc.cep) setFieldValue('cep', maskCepInput(loc.cep));
    if (loc.rua) setFieldValue('rua', loc.rua);
    if (loc.numero) setFieldValue('numero', loc.numero);
    if (loc.referencia) setFieldValue('referencia', loc.referencia);
  }, [capturarLocalizacao, saveMutation.isPending, setFieldValue]);

  const handleSave = useCallback(
    (onConfirmed?: () => void) => {
      if (!usuario || submittingRef.current || saveMutation.isPending) return;

      const parsed = form.validate();
      if (!parsed) return;

      submittingRef.current = true;
      Keyboard.dismiss();
      saveMutation.mutate(buildUsuarioRequest(parsed), {
        onSuccess: (updatedUsuario) => {
          submittingRef.current = false;
          isDirtyRef.current = false;
          lastSyncedUsuarioRef.current = updatedUsuario;
          if (!mountedRef.current) return;
          syncValues(toProfileFormValues(updatedUsuario));
          showSuccess('Perfil Atualizado', 'Seus dados foram atualizados com sucesso!', onConfirmed);
        },
        onError: (error) => {
          submittingRef.current = false;
          if (!mountedRef.current) return;
          showError('Ops!', getApiErrorMessage(error, 'Falha ao atualizar perfil.'));
        },
      });
    },
    [form, saveMutation, showError, showSuccess, syncValues, usuario]
  );

  return {
    values: form.values,
    errors: form.errors,
    setFieldValue,
    field: form.field,
    hasUsuario: Boolean(usuario),
    submitting: saveMutation.isPending,
    capturandoGps,
    erroGps,
    localizacaoPreview: ultimaLocalizacao,
    localizacaoResumo: formatLocalizacaoResumo(ultimaLocalizacao),
    onUsarGps,
    handleSave,
  };
}
