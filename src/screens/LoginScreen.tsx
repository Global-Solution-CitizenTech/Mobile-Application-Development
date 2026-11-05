import React, { useState } from 'react';
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
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { FeedbackModal } from '../components/FeedbackModal';
import { colors, borderRadius, spacing, fontSize, fontWeight, shadows } from '../theme';
import { DEMO_USER } from '../services/mockData';
import { AuthStackParamList } from '../navigation/types';

type LoginNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginNavigationProp>();
  const { login, isLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [senhaError, setSenhaError] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  const validate = (): boolean => {
    let isValid = true;
    setEmailError(null);
    setSenhaError(null);

    const emailTrimmed = email.trim();
    if (!emailTrimmed) {
      setEmailError('Informe seu e-mail');
      isValid = false;
    } else if (!emailTrimmed.includes('@') || !emailTrimmed.includes('.')) {
      setEmailError('Informe um e-mail válido');
      isValid = false;
    }

    if (!senha) {
      setSenhaError('Informe sua senha');
      isValid = false;
    } else if (senha.length < 4) {
      setSenhaError('A senha deve ter no mínimo 4 caracteres');
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      await login({ email: email.trim(), senha });
    } catch (err: any) {
      setModalError(err.message || 'Falha ao realizar login');
    }
  };

  const fillDemoCredentials = () => {
    setEmail(DEMO_USER.email);
    setSenha('123456');
    setEmailError(null);
    setSenhaError(null);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header do App / Marca */}
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Ionicons name="leaf" size={40} color={colors.surface} />
          </View>
          <Text style={styles.brandTitle}>CitizenTech</Text>
          <Text style={styles.brandSubtitle}>
            Zeladoria Urbana Colaborativa • FIAP GS 2026/2
          </Text>
        </View>

        {/* Card do Formulário de Login */}
        <View style={[styles.card, shadows.md]}>
          <Text style={styles.formTitle}>Acesse sua conta</Text>
          <Text style={styles.formDescription}>
            Colabore para transformar nossa cidade em um espaço mais limpo, seguro e sustentável.
          </Text>

          {/* Banner de erro de autenticação caso ocorra */}
          {error && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={18} color={colors.feedback.danger} />
              <Text style={styles.errorBannerText}>{error}</Text>
            </View>
          )}

          <Input
            label="E-mail"
            placeholder="exemplo@citizentech.com.br"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (emailError) setEmailError(null);
              if (error) clearError();
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={emailError}
            leftIcon={
              <Ionicons name="mail-outline" size={20} color={colors.secondary[400]} />
            }
          />

          <Input
            label="Senha"
            placeholder="Digite sua senha"
            value={senha}
            onChangeText={(text) => {
              setSenha(text);
              if (senhaError) setSenhaError(null);
              if (error) clearError();
            }}
            isPassword
            error={senhaError}
            leftIcon={
              <Ionicons name="lock-closed-outline" size={20} color={colors.secondary[400]} />
            }
          />

          <Button
            title="Entrar"
            variant="primary"
            size="lg"
            onPress={handleLogin}
            loading={isLoading}
            style={styles.loginButton}
          />

          {/* Botão de Ajuda para Avaliadores FIAP */}
          <TouchableOpacity
            style={styles.demoButton}
            onPress={fillDemoCredentials}
            activeOpacity={0.7}
          >
            <Ionicons name="flash-outline" size={16} color={colors.primary[700]} />
            <Text style={styles.demoButtonText}>Preencher Acesso Demo (Avaliador FIAP)</Text>
          </TouchableOpacity>
        </View>

        {/* Rodapé: Link para Cadastro */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Ainda não possui cadastro?</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            activeOpacity={0.7}
          >
            <Text style={styles.signupLink}>Criar nova conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal de Feedback amigável para erros de conexão */}
      <FeedbackModal
        visible={!!modalError}
        type="error"
        title="Atenção"
        message={modalError || ''}
        confirmText="Entendido"
        onConfirm={() => setModalError(null)}
      />
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    ...shadows.md,
  },
  brandTitle: {
    fontSize: fontSize.display,
    fontWeight: fontWeight.extrabold,
    color: colors.secondary[900],
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: fontSize.caption,
    color: colors.secondary[500],
    marginTop: 4,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  formTitle: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
    color: colors.secondary[900],
    marginBottom: spacing.xs,
  },
  formDescription: {
    fontSize: fontSize.bodySmall,
    color: colors.secondary[500],
    lineHeight: 18,
    marginBottom: spacing.lg,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.feedback.dangerLight,
    padding: spacing.sm + 2,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
  },
  errorBannerText: {
    fontSize: fontSize.bodySmall,
    color: colors.feedback.danger,
    flex: 1,
    fontWeight: fontWeight.medium,
  },
  loginButton: {
    marginTop: spacing.sm,
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  demoButtonText: {
    fontSize: fontSize.bodySmall,
    fontWeight: fontWeight.semibold,
    color: colors.primary[700],
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.xl,
  },
  footerText: {
    fontSize: fontSize.body,
    color: colors.secondary[600],
  },
  signupLink: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    color: colors.primary[600],
  },
});

