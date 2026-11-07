import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { RegisterSchema, extractZodFieldErrors } from '../utils/schemas';
import { getAuthErrorMessage } from '../utils/apiError';

export const useRegisterForm = () => {
  const { register, isLoading: authLoading, error: authError, clearError } = useAuth();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [bairro, setBairro] = useState('Bela Vista');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [modalError, setModalError] = useState<string | null>(null);

  const registerMutation = useMutation({
    mutationFn: async () => {
      await register({
        nome: nome.trim(),
        email: email.trim(),
        senha,
        cpf: cpf.trim(),
        telefone: telefone.trim(),
        bairro: bairro.trim(),
      });
    },
    onError: (err) => {
      setModalError(getAuthErrorMessage(err));
    },
  });

  const updateField = useCallback(
    (field: string, value: string, setter: (val: string) => void) => {
      setter(value);
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: '' }));
      }
      if (authError) clearError();
    },
    [errors, authError, clearError]
  );

  const preencherExemplo = useCallback(() => {
    setNome('Ana Clara Souza');
    setEmail('anaclara.cidada@zelafix.com.br');
    setSenha('123456');
    setConfirmSenha('123456');
    setCpf('345.678.901-22');
    setTelefone('(11) 97123-4567');
    setBairro('Pinheiros');
    setErrors({});
    if (authError) clearError();
  }, [authError, clearError]);

  const handleSubmit = useCallback(async () => {
    const parsed = RegisterSchema.safeParse({
      nome: nome.trim(),
      email: email.trim(),
      cpf: cpf.trim(),
      telefone: telefone.trim(),
      bairro: bairro.trim(),
      senha,
      confirmSenha,
    });

    if (!parsed.success) {
      setErrors(extractZodFieldErrors(parsed.error));
      return;
    }

    setErrors({});
    await registerMutation.mutateAsync();
  }, [nome, email, cpf, telefone, bairro, senha, confirmSenha, registerMutation]);

  return {
    nome,
    email,
    senha,
    confirmSenha,
    cpf,
    telefone,
    bairro,
    errors,
    error: authError,
    modalError,
    setModalError,
    isLoading: authLoading || registerMutation.isPending,
    setNome: (v: string) => updateField('nome', v, setNome),
    setEmail: (v: string) => updateField('email', v, setEmail),
    setSenha: (v: string) => updateField('senha', v, setSenha),
    setConfirmSenha: (v: string) => updateField('confirmSenha', v, setConfirmSenha),
    setCpf: (v: string) => updateField('cpf', v, setCpf),
    setTelefone: (v: string) => updateField('telefone', v, setTelefone),
    setBairro: (v: string) => updateField('bairro', v, setBairro),
    preencherExemplo,
    handleSubmit,
  };
};
