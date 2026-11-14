import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useFeedback } from '@/contexts/FeedbackContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useChamadosList } from '@/hooks/useChamados';
import { useZodForm } from '@/hooks/useZodForm';
import { buildUsuarioRequest } from '@/services/authService';
import type { UsuarioRequest } from '@/types/auth';
import { getApiErrorMessage } from '@/utils/apiError';
import { maskCepInput, maskPhoneInput } from '@/utils/formatters';
import { isStatusFinal } from '@/utils/permissions';
import { ProfileEditSchema, type ProfileEditFormData } from '@/utils/schemas';

const EMPTY_PROFILE_FORM: ProfileEditFormData = {
  nome: '',
  email: '',
  telefone: '',
  cep: '',
  rua: '',
  numero: '',
  referencia: '',
  senha: '',
};

export function useProfileData() {
  const { usuario, signOut, refreshProfile, updateProfile } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { showError, showSuccess } = useFeedback();
  const form = useZodForm(ProfileEditSchema, EMPTY_PROFILE_FORM);

  const meusChamadosQuery = useChamadosList({
    apenasMeus: true,
    page: 0,
    size: 50,
    sort: 'dtAbertura,desc',
  });

  const lista = meusChamadosQuery.chamados;
  const userStats = {
    total: meusChamadosQuery.pageInfo ? meusChamadosQuery.totalElements : lista.length,
    emAndamento: lista.filter((c) => !isStatusFinal(c.status)).length,
    concluidos: lista.filter((c) => c.status === 'CONCLUIDO').length,
    apoiosRecebidos: lista.reduce((acc, c) => acc + c.totalVotos, 0),
  };

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const refreshMutation = useMutation({
    mutationFn: () => refreshProfile(),
    onError: (error) => {
      showError('Ops!', getApiErrorMessage(error, 'Não foi possível atualizar seu perfil.'));
    },
  });

  const saveMutation = useMutation({
    mutationFn: (payload: UsuarioRequest) => updateProfile(payload),
    onSuccess: () => {
      setEditModalVisible(false);
      showSuccess('Perfil Atualizado', 'Seus dados foram atualizados com sucesso!');
    },
    onError: (error) => {
      showError('Ops!', getApiErrorMessage(error, 'Falha ao atualizar perfil.'));
    },
  });

  const openEditModal = () => {
    form.reset({
      nome: usuario?.nome ?? '',
      email: usuario?.email ?? '',
      telefone: usuario ? maskPhoneInput(`${usuario.ddd}${usuario.numeroTelefone}`) : '',
      cep: usuario?.endereco ? maskCepInput(usuario.endereco.cep) : '',
      rua: usuario?.endereco?.rua ?? '',
      numero: usuario?.endereco?.numero ?? '',
      referencia: usuario?.endereco?.referencia ?? '',
      senha: '',
    });
    setEditModalVisible(true);
  };

  const handleRefreshProfile = async () => {
    await Promise.all([
      refreshMutation.mutateAsync().catch(() => undefined),
      meusChamadosQuery.refetch(),
    ]);
  };

  const handleSaveProfile = () => {
    const parsed = form.validate();
    if (!parsed) return;
    saveMutation.mutate(buildUsuarioRequest(parsed));
  };

  return {
    usuario,
    userStats,
    statsLoading: meusChamadosQuery.isLoading,
    isDark,
    toggleTheme,
    form,
    editModalVisible,
    setEditModalVisible,
    logoutModalVisible,
    setLogoutModalVisible,
    saving: saveMutation.isPending,
    refreshing: refreshMutation.isPending || meusChamadosQuery.isRefetching,
    openEditModal,
    handleRefreshProfile,
    handleSaveProfile,
    signOut,
  };
}
