import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthHeader } from '@/components/AuthHeader';
import { FeedbackModal } from '@/components/FeedbackModal';
import { useThemedStyles } from '@/contexts/ThemeContext';
import { useRegisterForm } from '@/hooks/useRegisterForm';
import type { AuthStackParamList } from '@/navigation/types';
import { RegisterForm } from '@/screens/Register/components/RegisterForm';
import { spacing } from '@/theme';
import type { AppTheme } from '@/theme/types';
import { maskCepInput, maskPhoneInput } from '@/utils/formatters';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export const RegisterScreen = ({ navigation }: Props) => {
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();
  const { values, errors, setFieldValue, submitting, modalError, dismissError, handleRegister } = useRegisterForm();

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top, spacing.lg) + spacing.sm,
            paddingBottom: Math.max(insets.bottom, spacing.xl) + spacing.md,
            paddingLeft: Math.max(insets.left, spacing.lg),
            paddingRight: Math.max(insets.right, spacing.lg),
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrapper}>
          <AuthHeader
            title="Criar Conta"
            subtitle="Preencha seus dados para registrar ocorrências e apoiar melhorias no seu bairro"
            onBack={() => navigation.goBack()}
            showIcon={false}
          />

          <RegisterForm
            values={values}
            errors={errors}
            onChangeField={setFieldValue}
            onChangeTelefone={(text) => setFieldValue('telefone', maskPhoneInput(text))}
            onChangeCep={(text) => setFieldValue('cep', maskCepInput(text))}
            onSubmit={handleRegister}
            onGoToLogin={() => navigation.replace('Login')}
            submitting={submitting}
          />
        </View>
      </ScrollView>

      <FeedbackModal
        visible={Boolean(modalError)}
        type="error"
        title="Não foi possível cadastrar"
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
