import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabNavigator } from '@/navigation/TabNavigator';
import type { AppStackParamList } from '@/navigation/types';
import { ChamadoDetailsScreen } from '@/screens/ChamadoDetails/ChamadoDetailsScreen';
import { EditarChamadoScreen } from '@/screens/EditarChamado/EditarChamadoScreen';
import { NovoChamadoScreen } from '@/screens/NovoChamado/NovoChamadoScreen';
import { SobreAppScreen } from '@/screens/SobreApp/SobreAppScreen';

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name="MainTabs" component={TabNavigator} />
    <Stack.Screen name="NovoChamado" component={NovoChamadoScreen} />
    <Stack.Screen name="ChamadoDetails" component={ChamadoDetailsScreen} />
    <Stack.Screen name="EditarChamado" component={EditarChamadoScreen} />
    <Stack.Screen name="SobreApp" component={SobreAppScreen} />
  </Stack.Navigator>
);
