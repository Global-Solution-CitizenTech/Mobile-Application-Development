import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useFeedback } from '@/contexts/FeedbackContext';
import { useLocalizacao } from '@/hooks/useLocalizacao';
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
  const form = useZodForm(RegisterSchema, INITIAL_REGISTER);
  const { capturandoGps, erroGps, ultimaLocalizacao, capturarLocalizacao } = useLocalizacao();

  const handleUsarGps = async () => {
    const loc = await capturarLocalizacao();
    if (!loc) return;
    if (loc.cep) form.setFieldValue('cep', maskCepInput(loc.cep));
    if (loc.rua) form.setFieldValue('rua', loc.rua);
    if (loc.numero) form.setFieldValue('numero', loc.numero);
    if (loc.referencia) form.setFieldValue('referencia', loc.referencia);
  };

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
    capturandoGps,
    erroGps,
    localizacaoPreview: ultimaLocalizacao,
    onUsarGps: handleUsarGps,
    handleRegister,
  };
}
