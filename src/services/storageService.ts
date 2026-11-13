import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Usuario } from '@/types/auth';
import type { RadarLocationPreference } from '@/types/filters';
import { RadarLocationPrefSchema, StoredUsuarioSchema } from '@/utils/schemas';

const TOKEN_KEY = 'zelafix_jwt_token';
const USER_KEY = '@zelafix:usuario';
const RADAR_LOCATION_KEY = '@zelafix:radar_location_v1';

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
      const result = StoredUsuarioSchema.safeParse(JSON.parse(raw));
      if (result.success) return result.data;
      await AsyncStorage.removeItem(USER_KEY);
      return null;
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

  async getRadarLocationPreference(): Promise<RadarLocationPreference | null> {
    const raw = await AsyncStorage.getItem(RADAR_LOCATION_KEY);
    if (!raw) return null;
    try {
      const result = RadarLocationPrefSchema.safeParse(JSON.parse(raw));
      if (result.success) return result.data;
      await AsyncStorage.removeItem(RADAR_LOCATION_KEY);
      return null;
    } catch {
      await AsyncStorage.removeItem(RADAR_LOCATION_KEY);
      return null;
    }
  },

  async saveRadarLocationPreference(pref: RadarLocationPreference): Promise<void> {
    await AsyncStorage.setItem(RADAR_LOCATION_KEY, JSON.stringify(pref));
  },

  async clearRadarLocationPreference(): Promise<void> {
    await AsyncStorage.removeItem(RADAR_LOCATION_KEY);
  },

  async saveSession(token: string, usuario: Usuario): Promise<void> {
    await Promise.all([storageService.saveToken(token), storageService.saveUsuario(usuario)]);
  },

  async clearSession(): Promise<void> {
    await Promise.all([
      storageService.removeToken(),
      storageService.removeUsuario(),
      storageService.clearRadarLocationPreference(),
    ]);
  },
};
