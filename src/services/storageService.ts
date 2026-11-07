/**
 * Serviço de Armazenamento Local Seguro e Sessão
 * Utiliza AsyncStorage com chaves tipadas e isoladas
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Usuario, Chamado } from '../types';

const STORAGE_KEYS = {
  TOKEN: '@zelafix:auth_token',
  USER: '@zelafix:current_user',
  CHAMADOS: '@zelafix:chamados_data',
  API_URL: '@zelafix:custom_api_url',
};

const memoryStore: Record<string, string> = {};

export const storageService = {
  // --- Token JWT ---
  async saveToken(token: string): Promise<void> {
    try {
      memoryStore[STORAGE_KEYS.TOKEN] = token;
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
    } catch (error) {
      console.warn('Armazenado em memória (fallback):', error);
    }
  },

  async getToken(): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      return token || memoryStore[STORAGE_KEYS.TOKEN] || null;
    } catch (error) {
      return memoryStore[STORAGE_KEYS.TOKEN] || null;
    }
  },

  async removeToken(): Promise<void> {
    try {
      delete memoryStore[STORAGE_KEYS.TOKEN];
      await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      delete memoryStore[STORAGE_KEYS.TOKEN];
    }
  },

  // --- Usuário ---
  async saveUser(user: Usuario): Promise<void> {
    try {
      const data = JSON.stringify(user);
      memoryStore[STORAGE_KEYS.USER] = data;
      await AsyncStorage.setItem(STORAGE_KEYS.USER, data);
    } catch (error) {
      console.warn('Usuário em memória (fallback):', error);
    }
  },

  async getUser(): Promise<Usuario | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      if (data) return JSON.parse(data);
      const inMemory = memoryStore[STORAGE_KEYS.USER];
      return inMemory ? JSON.parse(inMemory) : null;
    } catch (error) {
      const inMemory = memoryStore[STORAGE_KEYS.USER];
      return inMemory ? JSON.parse(inMemory) : null;
    }
  },

  async removeUser(): Promise<void> {
    try {
      delete memoryStore[STORAGE_KEYS.USER];
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      delete memoryStore[STORAGE_KEYS.USER];
    }
  },

  // --- Chamados Offline / Cache ---
  async saveChamados(chamados: Chamado[]): Promise<void> {
    try {
      const data = JSON.stringify(chamados);
      memoryStore[STORAGE_KEYS.CHAMADOS] = data;
      await AsyncStorage.setItem(STORAGE_KEYS.CHAMADOS, data);
    } catch (error) {
      console.warn('Chamados em memória (fallback):', error);
    }
  },

  async getChamados(): Promise<Chamado[] | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CHAMADOS);
      if (data) return JSON.parse(data);
      const inMemory = memoryStore[STORAGE_KEYS.CHAMADOS];
      return inMemory ? JSON.parse(inMemory) : null;
    } catch (error) {
      const inMemory = memoryStore[STORAGE_KEYS.CHAMADOS];
      return inMemory ? JSON.parse(inMemory) : null;
    }
  },

  // --- Limpeza de Sessão (Logout) ---
  async clearSession(): Promise<void> {
    try {
      delete memoryStore[STORAGE_KEYS.TOKEN];
      delete memoryStore[STORAGE_KEYS.USER];
      await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      delete memoryStore[STORAGE_KEYS.TOKEN];
      delete memoryStore[STORAGE_KEYS.USER];
    }
  },
};
