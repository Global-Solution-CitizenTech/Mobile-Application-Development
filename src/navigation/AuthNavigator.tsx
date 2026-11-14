import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@/navigation/types';
import { LoginScreen } from '@/screens/Login/LoginScreen';
import { RegisterScreen } from '@/screens/Register/RegisterScreen';
import { WelcomeScreen } from '@/screens/Welcome/WelcomeScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} getId={() => 'welcome'} />
    <Stack.Screen name="Login" component={LoginScreen} getId={() => 'login'} />
    <Stack.Screen name="Register" component={RegisterScreen} getId={() => 'register'} />
  </Stack.Navigator>
);
