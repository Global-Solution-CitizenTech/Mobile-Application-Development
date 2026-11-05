import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { MainTabParamList } from './types';
import { HomeScreen } from '../screens/HomeScreen';
import { RadarBairroScreen } from '../screens/RadarBairroScreen';
import { MeusChamadosScreen } from '../screens/MeusChamadosScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { colors, fontSize, fontWeight } from '../theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary[600],
        tabBarInactiveTintColor: colors.secondary[400],
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'HomeTab':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'RadarTab':
              iconName = focused ? 'flame' : 'flame-outline';
              break;
            case 'MeusChamadosTab':
              iconName = focused ? 'document-text' : 'document-text-outline';
              break;
            case 'ProfileTab':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'cube-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Feed',
        }}
      />
      <Tab.Screen
        name="RadarTab"
        component={RadarBairroScreen}
        options={{
          tabBarLabel: 'Prioridades',
        }}
      />
      <Tab.Screen
        name="MeusChamadosTab"
        component={MeusChamadosScreen}
        options={{
          tabBarLabel: 'Meus Relatos',
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Perfil',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: Platform.OS === 'ios' ? 88 : 64,
    paddingBottom: Platform.OS === 'ios' ? 28 : 8,
    paddingTop: 8,
    elevation: 8,
  },
  tabBarLabel: {
    fontSize: fontSize.tiny,
    fontWeight: fontWeight.semibold,
  },
});
