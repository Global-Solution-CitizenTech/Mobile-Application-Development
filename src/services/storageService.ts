/**
 * Serviço de Armazenamento Local Seguro e Sessão
 * Utiliza AsyncStorage com chaves tipadas e isoladas
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Usuario, Chamado } from '../types';

const STORAGE_KEYS = {
  TOKEN: '@citizentech:auth_token',
  USER: '@citizentech:current_user',
  CHAMADOS: '@citizentech:chamados_data',
  API_URL: '@citizentech:custom_api_url',
};

export const storageService = {
  // --- Token JWT ---
  async saveToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
    } catch (error) {
      console.error('Erro ao salvar token no storage:', error);
    }
  },

  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error('Erro ao recuperar token do storage:', error);
      return null;
    }
  },

  async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error('Erro ao remover token do storage:', error);
    }
  },

  // --- Usuário ---
  async saveUser(user: Usuario): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Erro ao salvar usuário no storage:', error);
    }
  },

  async getUser(): Promise<Usuario | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Erro ao recuperar usuário do storage:', error);
      return null;
    }
  },

  async removeUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error('Erro ao remover usuário do storage:', error);
    }
  },

  // --- Chamados Offline / Cache ---
  async saveChamados(chamados: Chamado[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CHAMADOS, JSON.stringify(chamados));
    } catch (error) {
      console.error('Erro ao salvar chamados em cache:', error);
    }
  },

  async getChamados(): Promise<Chamado[] | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CHAMADOS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Erro ao recuperar chamados do cache:', error);
      return null;
    }
  },

  // --- Limpeza de Sessão (Logout) ---
  async clearSession(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error('Erro ao limpar sessão no storage:', error);
    }
  },
};
