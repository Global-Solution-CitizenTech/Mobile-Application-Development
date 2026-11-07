/**
 * Contexto Central de Autenticação e Sessão
 * Integrado com TanStack QueryClient e Warmup HTTP (Padrão Challenge_Clyvo_4)
 */

import React, { createContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { Usuario, LoginCredentials, RegisterData } from '../types';
import { authService } from '../services/authService';
import { storageService } from '../services/storageService';
import { registerUnauthorizedHandler, HttpService } from '../services/api';
import { queryClient } from '../lib/queryClient';
import { getAuthErrorMessage } from '../utils/apiError';

export interface AuthContextData {
  usuario: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  updateUser: (user: Usuario) => Promise<void>;
  updateProfile: (dados: Partial<Usuario> & { novaSenha?: string }) => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStoredSession() {
      try {
        const storedToken = await storageService.getToken();
        const storedUser = await storageService.getUser();

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUsuario(storedUser);
        }
      } catch (err) {
        console.error('Erro ao restaurar sessão:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadStoredSession();
    HttpService.warmup();

    registerUnauthorizedHandler(() => {
      setToken(null);
      setUsuario(null);
      queryClient.clear();
    });
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);
      const { token: authToken, usuario: authUser } = await authService.login(credentials);
      setToken(authToken);
      setUsuario(authUser);
      queryClient.invalidateQueries();
    } catch (err: unknown) {
      const msg = getAuthErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    try {
      setIsLoading(true);
      setError(null);
      const { token: authToken, usuario: authUser } = await authService.register(data);
      setToken(authToken);
      setUsuario(authUser);
      queryClient.invalidateQueries();
    } catch (err: unknown) {
      const msg = getAuthErrorMessage(err, 'Falha ao cadastrar cidadão.');
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await authService.logout();
    } catch (err) {
      console.warn('Erro durante logout:', err);
    } finally {
      setToken(null);
      setUsuario(null);
      queryClient.clear();
      setIsLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (updated: Usuario) => {
    setUsuario(updated);
    await storageService.saveUser(updated);
  }, []);

  const updateProfile = useCallback(
    async (dados: Partial<Usuario> & { novaSenha?: string }) => {
      try {
        setIsLoading(true);
        setError(null);
        const updated = await authService.updateProfile(dados);
        setUsuario(updated);
      } catch (err: unknown) {
        const msg = getAuthErrorMessage(err, 'Falha ao atualizar dados do perfil.');
        setError(msg);
        throw new Error(msg);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo(
    () => ({
      usuario,
      token,
      isAuthenticated: !!token,
      isLoading,
      error,
      login,
      register,
      logout,
      clearError,
      updateUser,
      updateProfile,
    }),
    [
      usuario,
      token,
      isLoading,
      error,
      login,
      register,
      logout,
      clearError,
      updateUser,
      updateProfile,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
