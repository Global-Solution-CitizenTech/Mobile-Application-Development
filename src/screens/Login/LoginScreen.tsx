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
import { useLoginForm } from '../../hooks/useLoginForm';
import { FeedbackModal } from '../../components/FeedbackModal';
import { LoginForm } from './components/LoginForm';
import { colors, spacing, fontSize, fontWeight, shadows } from '../../theme';
import { AuthStackParamList } from '../../navigation/types';

type LoginNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginNavigationProp>();
  const {
    email,
    senha,
    emailError,
    senhaError,
    error,
    modalError,
    setModalError,
    isLoading,
    handleEmailChange,
    handleSenhaChange,
    fillDemoCredentials,
    handleSubmit,
  } = useLoginForm();

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
          {/* Header do App / Marca */}
          <View style={styles.header}>
            <View style={styles.logoBadge}>
              <Ionicons name="leaf" size={40} color={colors.surface} />
            </View>
            <Text style={styles.brandTitle}>ZelaFix</Text>
            <Text style={styles.brandSubtitle}>
              Zeladoria Urbana Colaborativa • FIAP GS 2026/2
            </Text>
          </View>

          <LoginForm
            email={email}
            senha={senha}
            emailError={emailError}
            senhaError={senhaError}
            error={error}
            isLoading={isLoading}
            onEmailChange={handleEmailChange}
            onSenhaChange={handleSenhaChange}
            onSubmit={handleSubmit}
            onFillDemo={fillDemoCredentials}
          />

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
