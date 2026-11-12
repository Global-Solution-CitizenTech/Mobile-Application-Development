import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
};

export type AppTabParamList = {
  HomeTab: undefined;
  RadarBairroTab: { categoria?: string } | undefined;
  NovoChamadoTab: undefined;
  MeusChamadosTab: undefined;
  ProfileTab: undefined;
};

export type AppStackParamList = {
  MainTabs: NavigatorScreenParams<AppTabParamList>;
  ChamadoDetails: { id: number };
  EditarChamado: { id: number };
  ZelaBot: { chamadoId?: number } | undefined;
  SobreApp: undefined;
};
