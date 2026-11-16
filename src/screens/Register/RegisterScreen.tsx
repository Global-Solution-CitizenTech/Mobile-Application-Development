import { StyleSheet, View } from 'react-native';
import { AuthHeader } from '@/components/AuthHeader';
import { KeyboardScreenLayout } from '@/components/KeyboardScreenLayout';
import { useThemedStyles } from '@/contexts/ThemeContext';
import { useRegisterForm } from '@/hooks/useRegisterForm';
import { RegisterForm } from '@/screens/Register/components/RegisterForm';
import { spacing } from '@/theme/spacing';
import type { AuthStackScreenProps } from '@/types/navigation';
import type { AppTheme } from '@/types/theme';

export const RegisterScreen = ({ navigation }: AuthStackScreenProps<'Register'>) => {
  const styles = useThemedStyles(createStyles);
  const {
    field,
    submitting,
    handleRegister,
    onUsarGps,
    capturandoGps,
    erroGps,
    localizacaoResumo,
  } = useRegisterForm();

  return (
    <KeyboardScreenLayout contentContainerStyle={styles.scrollContent}>
      <View style={styles.contentWrapper}>
        <AuthHeader
          title="Criar Conta"
          subtitle="Preencha seus dados para registrar ocorrências e apoiar melhorias no seu bairro"
          onBack={() => navigation.goBack()}
          showIcon={false}
        />

        <RegisterForm
          field={field}
          onSubmit={handleRegister}
          onGoToLogin={() => navigation.replace('Login')}
          submitting={submitting}
          onUsarGps={() => void onUsarGps()}
          capturandoGps={capturandoGps}
          erroGps={erroGps}
          localizacaoResumo={localizacaoResumo}
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
