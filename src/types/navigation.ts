import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp, NavigatorScreenParams, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
};

export type AppTabParamList = {
  HomeTab: undefined;
  RadarBairroTab: { categoria?: string } | undefined;
  ZelaBotTab: { chamadoId?: number } | undefined;
  MeusChamadosTab: undefined;
  ProfileTab: undefined;
};

export type AppStackParamList = {
  MainTabs: NavigatorScreenParams<AppTabParamList>;
  NovoChamado: undefined;
  ChamadoDetails: { id: number };
  EditarChamado: { id: number };
  EditarPerfil: undefined;
  SobreApp: undefined;
};

export type AuthStackScreenProps<RouteName extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, RouteName>;

export type AppStackScreenProps<RouteName extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, RouteName>;

export type AuthStackNavigationProp<RouteName extends keyof AuthStackParamList> =
  NativeStackNavigationProp<AuthStackParamList, RouteName>;

export type AppStackNavigationProp<RouteName extends keyof AppStackParamList> =
  NativeStackNavigationProp<AppStackParamList, RouteName>;

/** Navegação de uma aba que também pode abrir telas do stack principal. */
export type AppTabNavigationProp<TabName extends keyof AppTabParamList> = CompositeNavigationProp<
  BottomTabNavigationProp<AppTabParamList, TabName>,
  NativeStackNavigationProp<AppStackParamList>
>;

export type AppTabRouteProp<TabName extends keyof AppTabParamList> = RouteProp<AppTabParamList, TabName>;

export type HomeTabNavigationProp = AppTabNavigationProp<'HomeTab'>;
export type RadarBairroTabNavigationProp = AppTabNavigationProp<'RadarBairroTab'>;
export type MeusChamadosTabNavigationProp = AppTabNavigationProp<'MeusChamadosTab'>;
export type ProfileTabNavigationProp = AppTabNavigationProp<'ProfileTab'>;
