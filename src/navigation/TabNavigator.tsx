import React from 'react';
import { Platform, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import type { AppTabParamList } from '@/navigation/types';
import { HomeScreen } from '@/screens/Home/HomeScreen';
import { MeusChamadosScreen } from '@/screens/MeusChamados/MeusChamadosScreen';
import { NovoChamadoScreen } from '@/screens/NovoChamado/NovoChamadoScreen';
import { ProfileScreen } from '@/screens/Profile/ProfileScreen';
import { RadarBairroScreen } from '@/screens/RadarBairro/RadarBairroScreen';
import { fontSize, fontWeight } from '@/theme';

const Tab = createBottomTabNavigator<AppTabParamList>();

export const TabNavigator: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const tabBarHeight = 60 + Math.max(insets.bottom, Platform.OS === 'ios' ? 16 : 8);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.tabBarActive,
        tabBarInactiveTintColor: theme.tabBarInactive,
        tabBarLabelStyle: { fontSize: fontSize.tiny, fontWeight: fontWeight.semibold, marginBottom: 4 },
        tabBarStyle: {
          backgroundColor: theme.tabBarBg,
          borderTopColor: theme.tabBarBorder,
          borderTopWidth: 1,
          height: tabBarHeight,
          paddingTop: 6,
          paddingBottom: Math.max(insets.bottom, Platform.OS === 'ios' ? 16 : 8),
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="RadarBairroTab"
        component={RadarBairroScreen}
        options={{
          title: 'Radar',
          tabBarIcon: ({ color, size }) => <Ionicons name="compass-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="NovoChamadoTab"
        component={NovoChamadoScreen}
        options={{
          title: 'Reportar',
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: focused ? theme.primaryDark : theme.primary,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 8,
              }}
            >
              <Ionicons name="add" size={26} color={theme.inverseText} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="MeusChamadosTab"
        component={MeusChamadosScreen}
        options={{
          title: 'Meus',
          tabBarIcon: ({ color, size }) => <Ionicons name="list-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};
