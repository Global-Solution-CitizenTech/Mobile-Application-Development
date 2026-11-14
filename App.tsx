import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { FeedbackProvider } from '@/contexts/FeedbackContext';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { bindReactNativeQueryLifecycle, queryClient } from '@/lib/queryClient';
import { NavigationRouter } from '@/navigation/index';

function ThemedApplication() {
  const { isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <NavigationRouter />
    </>
  );
}

export default function App() {
  useEffect(() => {
    return bindReactNativeQueryLifecycle();
  }, []);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <FeedbackProvider>
            <AuthProvider>
              <ThemedApplication />
            </AuthProvider>
          </FeedbackProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
