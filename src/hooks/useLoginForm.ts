import { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useZodForm } from '@/hooks/useZodForm';
import type { LoginCredentials } from '@/types/auth';
import { getAuthErrorMessage } from '@/utils/apiError';
import { LoginSchema, type LoginFormData } from '@/utils/schemas';

const INITIAL_LOGIN: LoginFormData = {
  email: '',
  senha: '',
};

export function useLoginForm() {
  const { signIn } = useAuth();
  const form = useZodForm(LoginSchema, INITIAL_LOGIN);
  const { validate } = form;
  const [modalError, setModalError] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => signIn(credentials),
    onError: (error) => {
      setModalError(getAuthErrorMessage(error));
    },
  });

  const { mutate: executeLogin, isPending } = loginMutation;

  const dismissError = useCallback(() => {
    setModalError(null);
  }, []);

  const handleLogin = useCallback(() => {
    const parsed = validate();
    if (!parsed) return;

    setModalError(null);
    executeLogin(parsed);
  }, [executeLogin, validate]);

  return {
    ...form,
    submitting: isPending,
    modalError,
    dismissError,
    handleLogin,
  };
}
