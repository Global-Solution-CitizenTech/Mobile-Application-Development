import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Usuario } from '@/types/auth';
import { StoredUsuarioSchema } from '@/utils/schemas';

const TOKEN_KEY = 'zelafix_jwt_token';
const USER_KEY = '@zelafix:usuario';

export const storageService = {
  getToken: () => SecureStore.getItemAsync(TOKEN_KEY),
  saveToken: (token: string) => SecureStore.setItemAsync(TOKEN_KEY, token),
  removeToken: () => SecureStore.deleteItemAsync(TOKEN_KEY),

  async getUsuario(): Promise<Usuario | null> {
    const raw = await AsyncStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      const result = StoredUsuarioSchema.safeParse(JSON.parse(raw));
      if (result.success) return result.data;
    } catch {
      // JSON corrompido: remove registro inválido abaixo.
    }
    await AsyncStorage.removeItem(USER_KEY);
    return null;
  },

  async saveUsuario(usuario: Usuario): Promise<void> {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(usuario));
  },

  async saveSession(token: string, usuario: Usuario): Promise<void> {
    await Promise.all([storageService.saveToken(token), storageService.saveUsuario(usuario)]);
  },

  async clearSession(): Promise<void> {
    await Promise.all([
      storageService.removeToken(),
      AsyncStorage.removeItem(USER_KEY),
    ]);
  },
};
