import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { FeedbackModal } from '@/components/FeedbackModal';
import { Header } from '@/components/Header';
import { type AppTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { useRegisterForm } from '@/hooks/useRegisterForm';
import type { AuthStackParamList } from '@/navigation/types';
import { RegisterForm } from '@/screens/Register/components/RegisterForm';
import { fontSize, fontWeight, spacing } from '@/theme';
import { maskCepInput, maskPhoneInput } from '@/utils/formatters';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const styles = useThemedStyles(createStyles);
  const { values, errors, setFieldValue, submitting, modalError, dismissError, handleRegister } = useRegisterForm();

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Header title="Criar Conta" subtitle="Cadastro de Cidadão" showBack onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={styles.lead}>Preencha seus dados para registrar ocorrências e acompanhar a zeladoria do seu bairro.</Text>

        <RegisterForm
          values={values}
          errors={errors}
          onChangeField={setFieldValue}
          onChangeTelefone={(text) => setFieldValue('telefone', maskPhoneInput(text))}
          onChangeCep={(text) => setFieldValue('cep', maskCepInput(text))}
          onSubmit={handleRegister}
          submitting={submitting}
        />

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Já possui uma conta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerLink}>Fazer Login</Text>
          </TouchableOpacity>
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
    container: { flex: 1, backgroundColor: theme.background },
    scrollContent: { padding: spacing.md, paddingBottom: spacing.xxxl },
    lead: { fontSize: fontSize.body, color: theme.textSecondary, marginBottom: spacing.md, lineHeight: 20 },
    footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: spacing.xs, marginTop: spacing.lg },
    footerText: { fontSize: fontSize.body, color: theme.textSecondary },
    footerLink: { fontSize: fontSize.body, fontWeight: fontWeight.bold, color: theme.primary },
  });
