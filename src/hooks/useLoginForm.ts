import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useFeedback } from '@/contexts/FeedbackContext';
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
  const { showError } = useFeedback();
  const form = useZodForm(LoginSchema, INITIAL_LOGIN);

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => signIn(credentials),
    onError: (error) => {
      showError('Não foi possível entrar', getAuthErrorMessage(error));
    },
  });

  const handleLogin = () => {
    const parsed = form.validate();
    if (!parsed) return;
    loginMutation.mutate(parsed);
  };

  return {
    ...form,
    submitting: loginMutation.isPending,
    handleLogin,
  };
}
