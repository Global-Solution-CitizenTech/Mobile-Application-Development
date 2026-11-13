import { useCallback, useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useChamadosList } from '@/hooks/useChamados';
import { useZodForm } from '@/hooks/useZodForm';
import { buildUsuarioRequest } from '@/services/authService';
import type { UsuarioRequest } from '@/types/auth';
import { getApiErrorMessage } from '@/utils/apiError';
import { maskCepInput, maskPhoneInput } from '@/utils/formatters';
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
  const form = useZodForm(ProfileEditSchema, EMPTY_PROFILE_FORM);
  const { reset, validate } = form;

  const meusChamadosQuery = useChamadosList({
    apenasMeus: true,
    page: 0,
    size: 50,
    sort: 'dtAbertura,desc',
  });

  const userStats = useMemo(() => {
    const lista = meusChamadosQuery.chamados;
    const total = lista.length;
    const emAndamento = lista.filter(
      (c) => c.status !== 'CONCLUIDO' && c.status !== 'REJEITADO'
    ).length;
    const concluidos = lista.filter((c) => c.status === 'CONCLUIDO').length;
    const apoiosRecebidos = lista.reduce((acc, c) => acc + c.totalVotos, 0);
    return { total, emAndamento, concluidos, apoiosRecebidos };
  }, [meusChamadosQuery.chamados]);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [errorModal, setErrorModal] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const refreshMutation = useMutation({
    mutationFn: () => refreshProfile(),
    onError: (error) => {
      setErrorModal(getApiErrorMessage(error, 'Não foi possível atualizar seu perfil.'));
    },
  });

  const saveMutation = useMutation({
    mutationFn: (payload: UsuarioRequest) => updateProfile(payload),
    onSuccess: () => {
      setEditModalVisible(false);
      setSuccessMessage('Seus dados foram atualizados com sucesso!');
    },
    onError: (error) => {
      setErrorModal(getApiErrorMessage(error, 'Falha ao atualizar perfil.'));
    },
  });

  const { mutateAsync: executeRefresh, isPending: refreshingProfile } = refreshMutation;
  const { mutate: executeSave, isPending: saving } = saveMutation;
  const { refetch: refetchMeusChamados } = meusChamadosQuery;

  const openEditModal = useCallback(() => {
    reset({
      nome: usuario?.nome ?? '',
      email: usuario?.email ?? '',
      telefone: usuario ? maskPhoneInput(`${usuario.ddd}${usuario.numeroTelefone}`) : '',
      cep: usuario?.endereco ? maskCepInput(usuario.endereco.cep) : '',
      rua: usuario?.endereco?.rua ?? '',
      numero: usuario?.endereco?.numero ?? '',
      referencia: usuario?.endereco?.referencia ?? '',
      senha: '',
    });
    setErrorModal(null);
    setEditModalVisible(true);
  }, [reset, usuario]);

  const handleRefreshProfile = useCallback(async () => {
    await Promise.all([executeRefresh().catch(() => undefined), refetchMeusChamados()]);
  }, [executeRefresh, refetchMeusChamados]);

  const handleSaveProfile = useCallback(() => {
    const parsed = validate();
    if (!parsed) return;

    setErrorModal(null);
    executeSave(buildUsuarioRequest(parsed));
  }, [executeSave, validate]);

  const clearErrorModal = useCallback(() => setErrorModal(null), []);
  const clearSuccessMessage = useCallback(() => setSuccessMessage(null), []);

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
    saving,
    refreshing: refreshingProfile || meusChamadosQuery.isRefetching,
    errorModal,
    clearErrorModal,
    successMessage,
    clearSuccessMessage,
    openEditModal,
    handleRefreshProfile,
    handleSaveProfile,
    signOut,
  };
}
