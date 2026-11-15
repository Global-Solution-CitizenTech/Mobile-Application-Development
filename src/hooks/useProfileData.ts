import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useFeedback } from '@/contexts/FeedbackContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useChamadosList } from '@/hooks/useChamados';
import { getApiErrorMessage } from '@/utils/apiError';
import { isStatusFinal } from '@/utils/permissions';

export function useProfileData() {
  const { usuario, signOut, refreshProfile } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { showError } = useFeedback();

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

  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const refreshMutation = useMutation({
    mutationFn: () => refreshProfile(),
    onError: (error) => {
      showError('Ops!', getApiErrorMessage(error, 'Não foi possível atualizar seu perfil.'));
    },
  });

  const handleRefreshProfile = async () => {
    await Promise.all([
      refreshMutation.mutateAsync().catch(() => undefined),
      meusChamadosQuery.refetch(),
    ]);
  };

  return {
    usuario,
    userStats,
    statsLoading: meusChamadosQuery.isLoading,
    isDark,
    toggleTheme,
    logoutModalVisible,
    setLogoutModalVisible,
    refreshing: refreshMutation.isPending || meusChamadosQuery.isRefetching,
    handleRefreshProfile,
    signOut,
  };
}
