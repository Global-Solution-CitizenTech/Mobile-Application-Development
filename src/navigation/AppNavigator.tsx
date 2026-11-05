import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { TabNavigator } from './TabNavigator';
import { ChamadoDetailsScreen } from '../screens/ChamadoDetailsScreen';
import { EditarChamadoScreen } from '../screens/EditarChamadoScreen';
import { NovoChamadoScreen } from '../screens/NovoChamadoScreen';
import { SobreAppScreen } from '../screens/SobreAppScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name="ChamadoDetails" component={ChamadoDetailsScreen} />
      <Stack.Screen name="EditarChamado" component={EditarChamadoScreen} />
      <Stack.Screen
        name="NovoChamado"
        component={NovoChamadoScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen name="SobreApp" component={SobreAppScreen} />
    </Stack.Navigator>
  );
};

