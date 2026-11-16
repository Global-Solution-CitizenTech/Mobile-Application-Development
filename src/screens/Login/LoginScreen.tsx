import { StyleSheet, View } from 'react-native';
import { AuthHeader } from '@/components/AuthHeader';
import { KeyboardScreenLayout } from '@/components/KeyboardScreenLayout';
import { useThemedStyles } from '@/contexts/ThemeContext';
import { useLoginForm } from '@/hooks/useLoginForm';
import { LoginForm } from '@/screens/Login/components/LoginForm';
import { spacing } from '@/theme/spacing';
import type { AuthStackScreenProps } from '@/types/navigation';
import type { AppTheme } from '@/types/theme';

export const LoginScreen = ({ navigation }: AuthStackScreenProps<'Login'>) => {
  const styles = useThemedStyles(createStyles);
  const { field, submitting, handleLogin } = useLoginForm();

  return (
    <KeyboardScreenLayout contentContainerStyle={styles.scrollContent}>
      <View style={styles.contentWrapper}>
        <AuthHeader
          title="ZelaFix"
          subtitle="Acesse sua conta para acompanhar e melhorar a zeladoria do seu bairro"
          onBack={() => navigation.goBack()}
        />

        <LoginForm
          field={field}
          isLoading={submitting}
          onSubmit={handleLogin}
          onGoToRegister={() => navigation.replace('Register')}
        />
      </View>
    </KeyboardScreenLayout>
  );
};

const createStyles = (_theme: AppTheme) =>
  StyleSheet.create({
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
    },
    contentWrapper: {
      width: '100%',
      maxWidth: 420,
    },
  });
