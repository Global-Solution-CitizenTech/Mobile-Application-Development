import { createContext, use, useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { queryClient } from '@/lib/queryClient';
import { queryKeys } from '@/lib/queryKeys';
import { HttpService, registerUnauthorizedHandler } from '@/services/api';
import { authService } from '@/services/authService';
import { storageService } from '@/services/storageService';
import type { AuthContextData, LoginCredentials, Usuario, UsuarioRequest } from '@/types/auth';
import { ApiError } from '@/utils/apiError';
import { canAccessMobileApp } from '@/utils/permissions';

const ADMIN_MOBILE_BLOCKED_MESSAGE =
  'Contas administrativas (ADMIN) não possuem acesso ao aplicativo móvel. Utilize o painel administrativo.';

const AuthContext = createContext<AuthContextData | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const signOut = useCallback(async () => {
    try {
      await storageService.clearSession();
    } catch {
      // O estado local deve ser limpo mesmo se o armazenamento seguro falhar.
    }
    setUsuario(null);
    queryClient.clear();
  }, []);

  useEffect(() => {
    return registerUnauthorizedHandler(() => {
      setUsuario(null);
      queryClient.clear();
    });
  }, []);

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      void HttpService.warmup();
      try {
        const [storedToken, storedUser] = await Promise.all([
          storageService.getToken(),
          storageService.getUsuario(),
        ]);
        if (!active) return;

        if (!storedToken) {
          setIsLoading(false);
          return;
        }

        if (storedUser) {
          setUsuario(storedUser);
        }

        const freshUser = await authService.getMe();
        if (!active) return;
        if (!canAccessMobileApp(freshUser)) {
          await signOut();
          return;
        }
        await storageService.saveUsuario(freshUser);
        setUsuario(freshUser);
      } catch {
        if (!active) return;
        const stillHasToken = await storageService.getToken();
        if (!stillHasToken) {
          setUsuario(null);
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void bootstrap();
    return () => {
      active = false;
    };
  }, [signOut]);

  const signIn = useCallback(async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);
    if (!canAccessMobileApp(response.user)) {
      await storageService.clearSession().catch(() => undefined);
      throw new ApiError('FORBIDDEN', ADMIN_MOBILE_BLOCKED_MESSAGE, 403);
    }
    await storageService.saveSession(response.token, response.user);
    setUsuario(response.user);
    await queryClient.invalidateQueries();
  }, []);

  const signUp = useCallback(async (data: UsuarioRequest) => {
    await authService.register(data);
    const loginResponse = await authService.login({ email: data.email, senha: data.senha });
    if (!canAccessMobileApp(loginResponse.user)) {
      await storageService.clearSession().catch(() => undefined);
      throw new ApiError('FORBIDDEN', ADMIN_MOBILE_BLOCKED_MESSAGE, 403);
    }
    await storageService.saveSession(loginResponse.token, loginResponse.user);
    setUsuario(loginResponse.user);
    await queryClient.invalidateQueries();
  }, []);

  const refreshProfile = useCallback(async () => {
    const freshUser = await authService.getMe();
    if (!canAccessMobileApp(freshUser)) {
      await signOut();
      throw new ApiError('FORBIDDEN', ADMIN_MOBILE_BLOCKED_MESSAGE, 403);
    }
    await storageService.saveUsuario(freshUser);
    setUsuario(freshUser);
  }, [signOut]);

  const updateProfile = useCallback(async (data: UsuarioRequest): Promise<Usuario> => {
    const { usuario: updated, novoToken } = await authService.updateProfile(data);
    if (novoToken) {
      await storageService.saveSession(novoToken, updated);
    } else {
      await storageService.saveUsuario(updated);
    }
    setUsuario(updated);
    await queryClient.invalidateQueries({ queryKey: queryKeys.chamados.all });
    return updated;
  }, []);

  const value = useMemo<AuthContextData>(
    () => ({
      usuario,
      isAuthenticated: Boolean(usuario),
      isLoading,
      signIn,
      signUp,
      signOut,
      refreshProfile,
      updateProfile,
    }),
    [isLoading, refreshProfile, signIn, signOut, signUp, updateProfile, usuario]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextData {
  const context = use(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}
