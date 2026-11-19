import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useFeedback } from '@/contexts/FeedbackContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useUserChamadosSummary } from '@/hooks/useMeusChamadosData';
import { getApiErrorMessage, normalizeHttpError } from '@/utils/apiError';

export function useProfileData() {
  const { usuario, signOut, refreshProfile } = useAuth();
  const { themeMode, setThemeMode } = useTheme();
  const { showError } = useFeedback();

  const summary = useUserChamadosSummary();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [refreshingProfile, setRefreshingProfile] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleRefreshProfile = useCallback(async () => {
    if (refreshingProfile) return;
    setRefreshingProfile(true);
    setRefreshError(null);

    try {
      const [profileResult, chamadosResult] = await Promise.allSettled([
        refreshProfile(),
        summary.refetch(),
      ]);

      if (!mountedRef.current) return;

      if (profileResult.status === 'rejected') {
        const normalized = normalizeHttpError(profileResult.reason);
        // Não exibe modal de erro sobre um 401 que já dispara o signOut global.
        if (normalized.status !== 401) {
          const message = getApiErrorMessage(
            profileResult.reason,
            'Não foi possível atualizar seu perfil.'
          );
          setRefreshError(message);
          showError('Ops!', message);
        }
        return;
      }

      if (chamadosResult.status === 'rejected') {
        const normalized = normalizeHttpError(chamadosResult.reason);
        if (normalized.status !== 401) {
          setRefreshError(
            getApiErrorMessage(chamadosResult.reason, 'Não foi possível atualizar seus chamados.')
          );
        }
      }
    } finally {
      if (mountedRef.current) {
        setRefreshingProfile(false);
      }
    }
  }, [refreshProfile, refreshingProfile, showError, summary]);

  return {
    usuario,
    userStats: {
      total: summary.stats.total,
      emAndamento: summary.stats.ativos,
      concluidos: summary.stats.concluidosSomente,
      apoiosRecebidos: summary.stats.apoiosRecebidos,
    },
    statsLoading: summary.isLoading,
    error: refreshError ?? summary.error,
    themeMode,
    setThemeMode,
    logoutModalVisible,
    setLogoutModalVisible,
    refreshing: refreshingProfile || summary.isRefetching,
    handleRefreshProfile,
    signOut,
  };
}
