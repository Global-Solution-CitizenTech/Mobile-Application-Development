/**
 * Tipagens das Rotas e Parâmetros de Navegação
 * React Navigation + TypeScript
 */

import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  NovoChamadoTab: undefined;
  ProfileTab: undefined;
  SobreAppTab: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  ChamadoDetails: { id: string };
  EditarChamado: { id: string };
  NovoChamado: undefined;
  SobreApp: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

