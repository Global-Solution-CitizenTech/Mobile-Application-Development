import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Usuario } from '@/types/auth';

const TOKEN_KEY = 'zelafix_jwt_token';
const USER_KEY = '@zelafix:usuario';

export const storageService = {
  async getToken(): Promise<string | null> {
    if (Platform.OS === 'web') return AsyncStorage.getItem(TOKEN_KEY);
    return SecureStore.getItemAsync(TOKEN_KEY);
  },

  async saveToken(token: string): Promise<void> {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem(TOKEN_KEY, token);
      return;
    }
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },

  async removeToken(): Promise<void> {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem(TOKEN_KEY);
      return;
    }
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  },

  async getUsuario(): Promise<Usuario | null> {
    const raw = await AsyncStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Usuario;
    } catch {
      await AsyncStorage.removeItem(USER_KEY);
      return null;
    }
  },

  async saveUsuario(usuario: Usuario): Promise<void> {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(usuario));
  },

  async removeUsuario(): Promise<void> {
    await AsyncStorage.removeItem(USER_KEY);
  },

  async saveSession(token: string, usuario: Usuario): Promise<void> {
    await Promise.all([this.saveToken(token), this.saveUsuario(usuario)]);
  },

  async clearSession(): Promise<void> {
    await Promise.all([this.removeToken(), this.removeUsuario()]);
  },
};
