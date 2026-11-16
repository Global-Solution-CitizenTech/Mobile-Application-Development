import { createContext, use, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { queryClient } from '@/lib/queryClient';
import { queryKeys } from '@/lib/queryKeys';
import { HttpService, registerUnauthorizedHandler } from '@/services/api';
import { authService } from '@/services/authService';
import { storageService } from '@/services/storageService';
import type { AuthContextData, LoginCredentials, Usuario, UsuarioRequest } from '@/types/auth';
import { ApiError, normalizeHttpError } from '@/utils/apiError';
import { canAccessMobileApp } from '@/utils/permissions';

const ADMIN_MOBILE_BLOCKED_MESSAGE =
  'Contas administrativas (ADMIN) não possuem acesso ao aplicativo móvel. Utilize o painel administrativo.';

const AuthContext = createContext<AuthContextData | null>(null);

async function ensureMobileAccess(usuario: Usuario, token?: string): Promise<void> {
  if (!canAccessMobileApp(usuario)) {
    await storageService.clearSession().catch(() => undefined);
    throw new ApiError('FORBIDDEN', ADMIN_MOBILE_BLOCKED_MESSAGE, 403);
  }
  if (token) {
    await storageService.saveSession(token, usuario);
  } else {
    await storageService.saveUsuario(usuario);
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const sessionEpochRef = useRef(0);

  const signOut = useCallback(async () => {
    sessionEpochRef.current += 1;
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
      sessionEpochRef.current += 1;
      setUsuario(null);
      queryClient.clear();
    });
  }, []);

  useEffect(() => {
    let active = true;
    const bootstrapEpoch = sessionEpochRef.current;

    const isStale = () => !active || sessionEpochRef.current !== bootstrapEpoch;

    async function validateSessionInBackground() {
      try {
        const freshUser = await authService.getMe();
        if (isStale()) return;
        if (!canAccessMobileApp(freshUser)) {
          await signOut();
          return;
        }
        await storageService.saveUsuario(freshUser);
        if (isStale()) return;
        setUsuario(freshUser);
      } catch (error) {
        if (isStale()) return;
        const normalized = normalizeHttpError(error);
        const stillHasToken = await storageService.getToken().catch(() => null);
        if (isStale()) return;
        if (normalized.status === 401 || normalized.status === 403 || !stillHasToken) {
          await signOut();
        }
      }
    }

    async function bootstrap() {
      void HttpService.warmup();
      try {
        const [storedToken, storedUser] = await Promise.all([
          storageService.getToken(),
          storageService.getUsuario(),
        ]);
        if (isStale()) return;

        if (!storedToken) {
          if (storedUser) {
            await storageService.clearSession().catch(() => undefined);
          }
          if (!isStale()) {
            setUsuario(null);
            setIsLoading(false);
          }
          return;
        }

        if (storedUser) {
          if (!canAccessMobileApp(storedUser)) {
            await signOut();
            if (!isStale()) setIsLoading(false);
            return;
          }
          setUsuario(storedUser);
          setIsLoading(false);
          void validateSessionInBackground();
          return;
        }

        // Token existe no SecureStore, mas o usuário em cache está ausente/inválido:
        // mantém isLoading=true até resolver getMe() para evitar redirecionar para AuthNavigator.
        await validateSessionInBackground();
      } catch {
        if (!isStale()) {
          setUsuario(null);
        }
      } finally {
        if (!isStale()) setIsLoading(false);
      }
    }

    void bootstrap();
    return () => {
      active = false;
    };
  }, [signOut]);

  const signIn = useCallback(async (credentials: LoginCredentials) => {
    sessionEpochRef.current += 1;
    const response = await authService.login(credentials);
    await ensureMobileAccess(response.user, response.token);
    setUsuario(response.user);
    await queryClient.invalidateQueries();
  }, []);

  const signUp = useCallback(async (data: UsuarioRequest) => {
    sessionEpochRef.current += 1;
    await authService.register(data);
    const response = await authService.login({ email: data.email, senha: data.senha });
    await ensureMobileAccess(response.user, response.token);
    setUsuario(response.user);
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
    sessionEpochRef.current += 1;
    const { usuario: updated, novoToken } = await authService.updateProfile(data);
    await ensureMobileAccess(updated, novoToken);
    setUsuario(updated);
    await queryClient.invalidateQueries({ queryKey: queryKeys.chamados.all });
    return updated;
  }, []);

  const isAuthenticated = Boolean(usuario);
  const value = useMemo<AuthContextData>(
    () => ({
      usuario,
      isAuthenticated,
      isLoading,
      signIn,
      signUp,
      signOut,
      refreshProfile,
      updateProfile,
    }),
    [usuario, isAuthenticated, isLoading, signIn, signUp, signOut, refreshProfile, updateProfile]
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
