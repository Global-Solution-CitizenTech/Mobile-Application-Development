import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { LoginSchema, extractZodFieldErrors } from '../utils/schemas';
import { getAuthErrorMessage } from '../utils/apiError';
import { DEMO_USER } from '../mocks/chamadosMock';

export const useLoginForm = () => {
  const { login, isLoading: authLoading, error: authError, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [modalError, setModalError] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: async () => {
      await login({ email: email.trim(), senha });
    },
    onError: (err) => {
      setModalError(getAuthErrorMessage(err));
    },
  });

  const handleEmailChange = useCallback(
    (value: string) => {
      setEmail(value);
      if (fieldErrors.email) {
        setFieldErrors((prev) => ({ ...prev, email: '' }));
      }
      if (authError) clearError();
    },
    [fieldErrors.email, authError, clearError]
  );

  const handleSenhaChange = useCallback(
    (value: string) => {
      setSenha(value);
      if (fieldErrors.senha) {
        setFieldErrors((prev) => ({ ...prev, senha: '' }));
      }
      if (authError) clearError();
    },
    [fieldErrors.senha, authError, clearError]
  );

  const fillDemoCredentials = useCallback(() => {
    setEmail(DEMO_USER.email);
    setSenha('123456');
    setFieldErrors({});
    if (authError) clearError();
  }, [authError, clearError]);

  const handleSubmit = useCallback(async () => {
    const parsed = LoginSchema.safeParse({ email: email.trim(), senha });
    if (!parsed.success) {
      setFieldErrors(extractZodFieldErrors(parsed.error));
      return;
    }

    setFieldErrors({});
    await loginMutation.mutateAsync();
  }, [email, senha, loginMutation]);

  return {
    email,
    senha,
    emailError: fieldErrors.email || null,
    senhaError: fieldErrors.senha || null,
    error: authError,
    modalError,
    setModalError,
    isLoading: authLoading || loginMutation.isPending,
    handleEmailChange,
    handleSenhaChange,
    fillDemoCredentials,
    handleSubmit,
  };
};
