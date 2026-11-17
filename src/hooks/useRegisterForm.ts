import { useCallback, useEffect, useRef } from 'react';
import { Keyboard } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useFeedback } from '@/contexts/FeedbackContext';
import { formatLocalizacaoResumo, useLocalizacao } from '@/hooks/useLocalizacao';
import { useZodForm } from '@/hooks/useZodForm';
import { buildUsuarioRequest } from '@/services/authService';
import type { UsuarioRequest } from '@/types/auth';
import type { RegisterFormData } from '@/types/form';
import { getApiErrorMessage } from '@/utils/apiError';
import { maskCepInput } from '@/utils/formatters';
import { RegisterSchema } from '@/utils/schemas';

const INITIAL_REGISTER: RegisterFormData = {
  nome: '',
  email: '',
  telefone: '',
  cep: '',
  rua: '',
  numero: '',
  referencia: '',
  senha: '',
  confirmarSenha: '',
};

export function useRegisterForm() {
  const { signUp } = useAuth();
  const { showError } = useFeedback();
  const mountedRef = useRef(true);
  const submittingRef = useRef(false);

  const registerMutation = useMutation({
    mutationFn: (payload: UsuarioRequest) => signUp(payload),
    onError: (error) => {
      showError(
        'Não foi possível cadastrar',
        getApiErrorMessage(error, 'Não foi possível concluir o cadastro.')
      );
    },
    onSettled: () => {
      submittingRef.current = false;
    },
  });

  const form = useZodForm(RegisterSchema, INITIAL_REGISTER, { disabled: registerMutation.isPending });
  const { capturandoGps, erroGps, ultimaLocalizacao, capturarLocalizacao } = useLocalizacao();

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleUsarGps = useCallback(async () => {
    const loc = await capturarLocalizacao();
    if (!loc || !mountedRef.current) return;
    if (loc.cep) form.setFieldValue('cep', maskCepInput(loc.cep));
    if (loc.rua) form.setFieldValue('rua', loc.rua);
    if (loc.numero) form.setFieldValue('numero', loc.numero);
    if (loc.referencia) form.setFieldValue('referencia', loc.referencia);
  }, [capturarLocalizacao, form]);

  const handleRegister = useCallback(() => {
    if (submittingRef.current || registerMutation.isPending) return;
    const parsed = form.validate();
    if (!parsed) return;
    submittingRef.current = true;
    Keyboard.dismiss();
    registerMutation.mutate(buildUsuarioRequest(parsed));
  }, [form, registerMutation]);

  return {
    ...form,
    submitting: registerMutation.isPending,
    capturandoGps,
    erroGps,
    localizacaoPreview: ultimaLocalizacao,
    localizacaoResumo: formatLocalizacaoResumo(ultimaLocalizacao),
    onUsarGps: handleUsarGps,
    handleRegister,
  };
}
