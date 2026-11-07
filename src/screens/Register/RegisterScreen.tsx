import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useRegisterForm } from '../../hooks/useRegisterForm';
import { FeedbackModal } from '../../components/FeedbackModal';
import { RegisterForm } from './components/RegisterForm';
import { colors, spacing, fontSize, fontWeight } from '../../theme';
import { AuthStackParamList } from '../../navigation/types';

type RegisterNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterNavigationProp>();
  const {
    nome,
    email,
    senha,
    confirmSenha,
    cpf,
    telefone,
    bairro,
    errors,
    error,
    modalError,
    setModalError,
    isLoading,
    setNome,
    setEmail,
    setSenha,
    setConfirmSenha,
    setCpf,
    setTelefone,
    setBairro,
    preencherExemplo,
    handleSubmit,
  } = useRegisterForm();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color={colors.secondary[900]} />
            </TouchableOpacity>
            <Text style={styles.topBarTitle}>Cadastro de Cidadão</Text>
            <View style={{ width: 24 }} />
          </View>

          <RegisterForm
            nome={nome}
            email={email}
            cpf={cpf}
            telefone={telefone}
            bairro={bairro}
            senha={senha}
            confirmSenha={confirmSenha}
            errors={errors}
            error={error}
            isLoading={isLoading}
            onNomeChange={setNome}
            onEmailChange={setEmail}
            onCpfChange={setCpf}
            onTelefoneChange={setTelefone}
            onBairroChange={setBairro}
            onSenhaChange={setSenha}
            onConfirmSenhaChange={setConfirmSenha}
            onSubmit={handleSubmit}
            onFillExample={preencherExemplo}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Já tem uma conta cadastrada?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} activeOpacity={0.7}>
              <Text style={styles.loginLink}>Fazer Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <FeedbackModal
          visible={!!modalError}
          type="error"
          title="Erro no Cadastro"
          message={modalError || ''}
          confirmText="Entendido"
          onConfirm={() => setModalError(null)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  backButton: {
    padding: 6,
  },
  topBarTitle: {
    fontSize: fontSize.subtitle,
    fontWeight: fontWeight.bold,
    color: colors.secondary[900],
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  footerText: {
    fontSize: fontSize.body,
    color: colors.secondary[600],
  },
  loginLink: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    color: colors.primary[600],
  },
});
