import { useCallback, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useZodForm } from '@/hooks/useZodForm';
import { getAuthErrorMessage } from '@/utils/apiError';
import { LoginSchema, type LoginFormData } from '@/utils/schemas';

const INITIAL_LOGIN: LoginFormData = {
  email: '',
  senha: '',
};

export function useLoginForm() {
  const { signIn, clearError } = useAuth();
  const form = useZodForm(LoginSchema, INITIAL_LOGIN);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const dismissError = useCallback(() => {
    setModalError(null);
    clearError();
  }, [clearError]);

  const handleLogin = useCallback(async () => {
    const parsed = form.validate();
    if (!parsed) return;

    setSubmitting(true);
    dismissError();
    try {
      await signIn(parsed);
    } catch (error) {
      setModalError(getAuthErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }, [dismissError, form, signIn]);

  return {
    ...form,
    submitting,
    modalError,
    dismissError,
    handleLogin,
  };
}
