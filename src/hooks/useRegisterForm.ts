import { useCallback, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useZodForm } from '@/hooks/useZodForm';
import { buildUsuarioRequest } from '@/services/authService';
import { getApiErrorMessage } from '@/utils/apiError';
import { RegisterSchema, type RegisterFormData } from '@/utils/schemas';

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
  const { signUp, clearError } = useAuth();
  const form = useZodForm(RegisterSchema, INITIAL_REGISTER);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const dismissError = useCallback(() => {
    setModalError(null);
    clearError();
  }, [clearError]);

  const handleRegister = useCallback(async () => {
    const parsed = form.validate();
    if (!parsed) return;

    setSubmitting(true);
    dismissError();
    try {
      await signUp(buildUsuarioRequest(parsed));
    } catch (error) {
      setModalError(getApiErrorMessage(error, 'Não foi possível concluir o cadastro.'));
    } finally {
      setSubmitting(false);
    }
  }, [dismissError, form, signUp]);

  return {
    ...form,
    submitting,
    modalError,
    dismissError,
    handleRegister,
  };
}
