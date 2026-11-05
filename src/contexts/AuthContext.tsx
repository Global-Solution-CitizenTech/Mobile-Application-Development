/**
 * Contexto Central de Autenticação e Sessão
 * Provedor para controle de login, cadastro, logout e proteção de rotas
 */

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Usuario, LoginCredentials, RegisterData } from '../types';
import { authService } from '../services/authService';
import { storageService } from '../services/storageService';
import { registerUnauthorizedHandler } from '../services/api';

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

  // Inicializa a sessão verificando o storage local ao abrir o aplicativo
  useEffect(() => {
    async function loadStoredSession() {
      try {
        const storedToken = await storageService.getToken();
        const storedUser = await storageService.getUser();

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUsuario(storedUser);

          // Tenta atualizar o perfil em segundo plano
          try {
            const freshUser = await authService.getProfile();
            setUsuario(freshUser);
          } catch {
            // Se offline, mantém o usuário do cache
          }
        }
      } catch (err) {
        console.error('Erro ao restaurar sessão:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadStoredSession();

    // Registra callback para expiração de token (401)
    registerUnauthorizedHandler(() => {
      logout();
    });
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);
      const { token: authToken, usuario: authUser } = await authService.login(credentials);
      setToken(authToken);
      setUsuario(authUser);
    } catch (err: any) {
      const msg = err.message || 'Falha ao autenticar. Verifique suas credenciais.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      setError(null);
      const { token: authToken, usuario: authUser } = await authService.register(data);
      setToken(authToken);
      setUsuario(authUser);
    } catch (err: any) {
      const msg = err.message || 'Falha ao cadastrar cidadão.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
    } catch (err) {
      console.warn('Erro durante logout:', err);
    } finally {
      setToken(null);
      setUsuario(null);
      setIsLoading(false);
    }
  };

  const updateUser = async (updated: Usuario) => {
    setUsuario(updated);
    await storageService.saveUser(updated);
  };

  const updateProfile = async (dados: Partial<Usuario> & { novaSenha?: string }) => {
    try {
      setIsLoading(true);
      setError(null);
      const updated = await authService.updateProfile(dados);
      setUsuario(updated);
    } catch (err: any) {
      const msg = err.message || 'Falha ao atualizar dados do perfil.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

