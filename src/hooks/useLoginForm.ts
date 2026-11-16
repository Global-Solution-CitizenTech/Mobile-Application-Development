import { useCallback, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useFeedback } from '@/contexts/FeedbackContext';
import { useZodForm } from '@/hooks/useZodForm';
import type { LoginCredentials } from '@/types/auth';
import type { LoginFormData } from '@/types/form';
import { getAuthErrorMessage } from '@/utils/apiError';
import { LoginSchema } from '@/utils/schemas';

const INITIAL_LOGIN: LoginFormData = {
  email: '',
  senha: '',
};

export function useLoginForm() {
  const { signIn } = useAuth();
  const { showError } = useFeedback();
  const form = useZodForm(LoginSchema, INITIAL_LOGIN);
  const submittingRef = useRef(false);

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => signIn(credentials),
    onError: (error) => {
      showError('Não foi possível entrar', getAuthErrorMessage(error));
    },
    onSettled: () => {
      submittingRef.current = false;
    },
  });

  const handleLogin = useCallback(() => {
    if (submittingRef.current || loginMutation.isPending) return;
    const parsed = form.validate();
    if (!parsed) return;
    submittingRef.current = true;
    loginMutation.mutate(parsed);
  }, [form, loginMutation]);

  return {
    ...form,
    submitting: loginMutation.isPending,
    handleLogin,
  };
}
