import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthHeader } from '@/components/AuthHeader';
import { FeedbackModal } from '@/components/FeedbackModal';
import { useThemedStyles } from '@/contexts/ThemeContext';
import { useLoginForm } from '@/hooks/useLoginForm';
import type { AuthStackParamList } from '@/navigation/types';
import { LoginForm } from '@/screens/Login/components/LoginForm';
import { spacing } from '@/theme';
import type { AppTheme } from '@/theme/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen = ({ navigation }: Props) => {
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();
  const { values, errors, setFieldValue, submitting, modalError, dismissError, handleLogin } = useLoginForm();

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top, spacing.lg) + spacing.sm,
            paddingBottom: Math.max(insets.bottom, spacing.xl),
            paddingLeft: Math.max(insets.left, spacing.lg),
            paddingRight: Math.max(insets.right, spacing.lg),
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrapper}>
          <AuthHeader
            title="ZelaFix"
            subtitle="Acesse sua conta para acompanhar e melhorar a zeladoria do seu bairro"
            onBack={() => navigation.goBack()}
          />

          <LoginForm
            email={values.email}
            senha={values.senha}
            emailError={errors.email ?? null}
            senhaError={errors.senha ?? null}
            isLoading={submitting}
            onEmailChange={(text) => setFieldValue('email', text)}
            onSenhaChange={(text) => setFieldValue('senha', text)}
            onSubmit={handleLogin}
            onGoToRegister={() => navigation.navigate('Register')}
          />
        </View>
      </ScrollView>

      <FeedbackModal
        visible={Boolean(modalError)}
        type="error"
        title="Não foi possível entrar"
        message={modalError ?? ''}
        onConfirm={dismissError}
      />
    </KeyboardAvoidingView>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    contentWrapper: {
      width: '100%',
      maxWidth: 420,
    },
  });
