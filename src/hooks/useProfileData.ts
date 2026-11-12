import { useCallback, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useZodForm } from '@/hooks/useZodForm';
import { buildUsuarioRequest } from '@/services/authService';
import { getApiErrorMessage } from '@/utils/apiError';
import { formatCep, formatTelefone } from '@/utils/formatters';
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

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [errorModal, setErrorModal] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const openEditModal = useCallback(() => {
    form.reset({
      nome: usuario?.nome ?? '',
      email: usuario?.email ?? '',
      telefone: usuario ? formatTelefone(usuario.ddd, usuario.numeroTelefone) : '',
      cep: usuario?.endereco ? formatCep(usuario.endereco.cep) : '',
      rua: usuario?.endereco?.rua ?? '',
      numero: usuario?.endereco?.numero ?? '',
      referencia: usuario?.endereco?.referencia ?? '',
      senha: '',
    });
    setErrorModal(null);
    setEditModalVisible(true);
  }, [form, usuario]);

  const handleRefreshProfile = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshProfile();
    } catch (error) {
      setErrorModal(getApiErrorMessage(error, 'Não foi possível atualizar seu perfil.'));
    } finally {
      setRefreshing(false);
    }
  }, [refreshProfile]);

  const handleSaveProfile = useCallback(async () => {
    const parsed = form.validate();
    if (!parsed) return;

    setSaving(true);
    setErrorModal(null);
    try {
      await updateProfile(buildUsuarioRequest(parsed));
      setEditModalVisible(false);
      setSuccessMessage('Seus dados foram atualizados com sucesso!');
    } catch (error) {
      setErrorModal(getApiErrorMessage(error, 'Falha ao atualizar perfil.'));
    } finally {
      setSaving(false);
    }
  }, [form, updateProfile]);

  return {
    usuario,
    isDark,
    toggleTheme,
    form,
    editModalVisible,
    setEditModalVisible,
    logoutModalVisible,
    setLogoutModalVisible,
    saving,
    refreshing,
    errorModal,
    clearErrorModal: () => setErrorModal(null),
    successMessage,
    clearSuccessMessage: () => setSuccessMessage(null),
    openEditModal,
    handleRefreshProfile,
    handleSaveProfile,
    signOut,
  };
}
