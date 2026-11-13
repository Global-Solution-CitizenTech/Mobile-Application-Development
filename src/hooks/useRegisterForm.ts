import { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useZodForm } from '@/hooks/useZodForm';
import { buildUsuarioRequest } from '@/services/authService';
import type { UsuarioRequest } from '@/types/auth';
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
  const { signUp } = useAuth();
  const form = useZodForm(RegisterSchema, INITIAL_REGISTER);
  const { validate } = form;
  const [modalError, setModalError] = useState<string | null>(null);

  const registerMutation = useMutation({
    mutationFn: (payload: UsuarioRequest) => signUp(payload),
    onError: (error) => {
      setModalError(getApiErrorMessage(error, 'Não foi possível concluir o cadastro.'));
    },
  });

  const { mutate: executeRegister, isPending } = registerMutation;

  const dismissError = useCallback(() => {
    setModalError(null);
  }, []);

  const handleRegister = useCallback(() => {
    const parsed = validate();
    if (!parsed) return;

    setModalError(null);
    executeRegister(buildUsuarioRequest(parsed));
  }, [executeRegister, validate]);

  return {
    ...form,
    submitting: isPending,
    modalError,
    dismissError,
    handleRegister,
  };
}
