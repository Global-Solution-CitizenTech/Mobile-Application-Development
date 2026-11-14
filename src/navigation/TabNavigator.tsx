import { Platform, StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import type { AppTabParamList } from '@/navigation/types';
import { HomeScreen } from '@/screens/Home/HomeScreen';
import { MeusChamadosScreen } from '@/screens/MeusChamados/MeusChamadosScreen';
import { ProfileScreen } from '@/screens/Profile/ProfileScreen';
import { RadarBairroScreen } from '@/screens/RadarBairro/RadarBairroScreen';
import { ZelaBotScreen } from '@/screens/ZelaBot/ZelaBotScreen';
import { fontSize, fontWeight } from '@/theme';

const Tab = createBottomTabNavigator<AppTabParamList>();

const styles = StyleSheet.create({
  centerTabIcon: {
    width: 34,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const TabNavigator = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, Platform.OS === 'ios' ? 16 : 8);
  const tabBarHeight = 60 + bottomInset;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.tabBarActive,
        tabBarInactiveTintColor: theme.tabBarInactive,
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {
          fontSize: fontSize.tiny,
          fontWeight: fontWeight.semibold,
          marginBottom: 4,
        },
        tabBarStyle: {
          backgroundColor: theme.tabBarBg,
          borderTopColor: theme.tabBarBorder,
          borderTopWidth: 1,
          height: tabBarHeight,
          paddingTop: 6,
          paddingBottom: bottomInset,
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
        name="ZelaBotTab"
        component={ZelaBotScreen}
        options={{
          title: 'ZelaBot IA',
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.centerTabIcon,
                { backgroundColor: focused ? theme.primaryDark : theme.primary },
              ]}
            >
              <Ionicons name="sparkles" size={16} color={theme.inverseText} />
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
