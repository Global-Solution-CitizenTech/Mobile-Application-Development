import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { queryClient } from '@/lib/queryClient';
import { queryKeys } from '@/lib/queryKeys';
import { HttpService, registerUnauthorizedHandler } from '@/services/api';
import { authService } from '@/services/authService';
import { storageService } from '@/services/storageService';
import type { LoginCredentials, Usuario, UsuarioRequest } from '@/types/auth';
import { getApiErrorMessage, getAuthErrorMessage } from '@/utils/apiError';

interface AuthContextData {
  usuario: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signUp: (data: UsuarioRequest) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: UsuarioRequest) => Promise<Usuario>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const clearError = useCallback(() => setAuthError(null), []);

  const signOut = useCallback(async () => {
    await storageService.clearSession();
    setToken(null);
    setUsuario(null);
    setAuthError(null);
    queryClient.clear();
  }, []);

  useEffect(() => {
    registerUnauthorizedHandler(() => {
      setToken(null);
      setUsuario(null);
      queryClient.clear();
    });
  }, []);

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      void HttpService.warmup();
      try {
        const [storedToken, storedUser] = await Promise.all([storageService.getToken(), storageService.getUsuario()]);
        if (!active) return;

        if (!storedToken) {
          setIsLoading(false);
          return;
        }

        setToken(storedToken);
        if (storedUser) {
          setUsuario(storedUser);
        }

        const freshUser = await authService.getMe();
        if (!active) return;
        await storageService.saveUsuario(freshUser);
        setUsuario(freshUser);
      } catch {
        if (!active) return;
        const stillHasToken = await storageService.getToken();
        if (!stillHasToken) {
          setToken(null);
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
  }, []);

  const signIn = useCallback(async (credentials: LoginCredentials) => {
    setAuthError(null);
    try {
      const response = await authService.login(credentials);
      await storageService.saveSession(response.token, response.user);
      setToken(response.token);
      setUsuario(response.user);
      queryClient.invalidateQueries();
    } catch (error) {
      const message = getAuthErrorMessage(error);
      setAuthError(message);
      throw error;
    }
  }, []);

  const signUp = useCallback(async (data: UsuarioRequest) => {
    setAuthError(null);
    try {
      await authService.register(data);
      const loginResponse = await authService.login({ email: data.email, senha: data.senha });
      await storageService.saveSession(loginResponse.token, loginResponse.user);
      setToken(loginResponse.token);
      setUsuario(loginResponse.user);
      queryClient.invalidateQueries();
    } catch (error) {
      const message = getApiErrorMessage(error, 'Não foi possível concluir o cadastro.');
      setAuthError(message);
      throw error;
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    const freshUser = await authService.getMe();
    await storageService.saveUsuario(freshUser);
    setUsuario(freshUser);
  }, []);

  const updateProfile = useCallback(async (data: UsuarioRequest): Promise<Usuario> => {
    const { usuario: updated, novoToken } = await authService.updateProfile(data);
    if (novoToken) {
      await storageService.saveSession(novoToken, updated);
      setToken(novoToken);
    } else {
      await storageService.saveUsuario(updated);
    }
    setUsuario(updated);
    void queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
    return updated;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        isAuthenticated: Boolean(usuario && token),
        isLoading,
        authError,
        signIn,
        signUp,
        signOut,
        refreshProfile,
        updateProfile,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  if (!context || !context.signIn) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}
