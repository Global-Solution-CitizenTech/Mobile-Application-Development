import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useFeedback } from '@/contexts/FeedbackContext';
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
  const { showError } = useFeedback();
  const form = useZodForm(RegisterSchema, INITIAL_REGISTER);

  const registerMutation = useMutation({
    mutationFn: (payload: UsuarioRequest) => signUp(payload),
    onError: (error) => {
      showError(
        'Não foi possível cadastrar',
        getApiErrorMessage(error, 'Não foi possível concluir o cadastro.')
      );
    },
  });

  const handleRegister = () => {
    const parsed = form.validate();
    if (!parsed) return;
    registerMutation.mutate(buildUsuarioRequest(parsed));
  };

  return {
    ...form,
    submitting: registerMutation.isPending,
    handleRegister,
  };
}
