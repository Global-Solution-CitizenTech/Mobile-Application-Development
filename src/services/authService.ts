/**
 * Serviço de Autenticação e Perfil (Java Spring Security JWT / .NET Minimal API)
 * Endpoints REST preparados:
 * - POST /auth/login
 * - POST /auth/register
 * - GET  /auth/me (ou /usuarios/me)
 * - PUT  /auth/me (ou /usuarios/me)
 */

import { api } from './api';
import { storageService } from './storageService';
import { env } from '../config/env';
import { DEMO_USER } from '../mocks/chamadosMock';
import { AuthResponse, LoginCredentials, RegisterData, Usuario } from '../types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      const { token, usuario } = response.data;

      await storageService.saveToken(token);
      await storageService.saveUser(usuario);

      return { token, usuario };
    } catch (error: any) {
      if (env.enableMockFallback && (!error.status || error.status === 0 || error.status >= 500)) {
        const isDemo =
          credentials.email.toLowerCase() === DEMO_USER.email.toLowerCase() ||
          credentials.email.includes('@');

        if (isDemo && credentials.senha.length >= 4) {
          const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.zelafix_${Date.now()}`;
          const cachedUser = await storageService.getUser();
          const usuario: Usuario =
            cachedUser && cachedUser.email.toLowerCase() === credentials.email.toLowerCase()
              ? cachedUser
              : {
                  ...DEMO_USER,
                  email: credentials.email.trim().toLowerCase(),
                };

          await storageService.saveToken(mockToken);
          await storageService.saveUser(usuario);

          return { token: mockToken, usuario };
        }
      }

      throw error;
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', data);
      const { token, usuario } = response.data;

      await storageService.saveToken(token);
      await storageService.saveUser(usuario);

      return { token, usuario };
    } catch (error: any) {
      if (env.enableMockFallback && (!error.status || error.status === 0 || error.status >= 500)) {
        const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.zelafix_${Date.now()}`;
        const novoUsuario: Usuario = {
          id: `usr_${Date.now().toString().slice(-6)}`,
          nome: data.nome,
          email: data.email,
          cpf: data.cpf,
          telefone: data.telefone,
          bairro: data.bairro,
          createdAt: new Date().toISOString(),
          avatarUrl:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        };

        await storageService.saveToken(mockToken);
        await storageService.saveUser(novoUsuario);

        return { token: mockToken, usuario: novoUsuario };
      }

      throw error;
    }
  },

  async getProfile(): Promise<Usuario> {
    try {
      const response = await api.get<Usuario>('/auth/me');
      await storageService.saveUser(response.data);
      return response.data;
    } catch {
      const cached = await storageService.getUser();
      if (cached) return cached;
      return DEMO_USER;
    }
  },

  async updateProfile(dados: Partial<Usuario> & { novaSenha?: string }): Promise<Usuario> {
    try {
      const response = await api.put<Usuario>('/auth/me', dados);
      await storageService.saveUser(response.data);
      return response.data;
    } catch (error: any) {
      if (env.enableMockFallback) {
        const current = (await storageService.getUser()) || DEMO_USER;
        const updated: Usuario = {
          ...current,
          nome: dados.nome || current.nome,
          email: dados.email || current.email,
          telefone: dados.telefone || current.telefone,
          bairro: dados.bairro || current.bairro,
        };
        await storageService.saveUser(updated);
        return updated;
      }
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout').catch(() => {});
    } finally {
      await storageService.clearSession();
    }
  },
};
