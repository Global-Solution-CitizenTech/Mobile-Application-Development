import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FeedbackModal } from '@/components/FeedbackModal';
import { Header } from '@/components/Header';
import { type AppTheme, useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { useLoginForm } from '@/hooks/useLoginForm';
import type { AuthStackParamList } from '@/navigation/types';
import { LoginForm } from '@/screens/Login/components/LoginForm';
import { borderRadius, fontSize, fontWeight, spacing } from '@/theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();
  const { values, errors, setFieldValue, submitting, modalError, dismissError, handleLogin } = useLoginForm();

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Header title="Entrar no ZelaFix" showBack onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, spacing.xl) }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brandRow}>
          <View style={styles.logoBox}>
            <Ionicons name="leaf" size={26} color={theme.primary} />
          </View>
          <View>
            <Text style={styles.brandName}>ZelaFix</Text>
            <Text style={styles.brandTag}>Zeladoria Urbana Inteligente</Text>
          </View>
        </View>

        <LoginForm
          email={values.email}
          senha={values.senha}
          emailError={errors.email ?? null}
          senhaError={errors.senha ?? null}
          error={null}
          isLoading={submitting}
          onEmailChange={(text) => setFieldValue('email', text)}
          onSenhaChange={(text) => setFieldValue('senha', text)}
          onSubmit={handleLogin}
        />

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Ainda não tem conta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.footerLink}>Cadastre-se</Text>
          </TouchableOpacity>
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
    container: { flex: 1, backgroundColor: theme.background },
    scrollContent: { padding: spacing.md, gap: spacing.lg },
    brandRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm + 4, paddingVertical: spacing.xs },
    logoBox: {
      width: 48,
      height: 48,
      borderRadius: borderRadius.md,
      backgroundColor: theme.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    brandName: { fontSize: fontSize.title, fontWeight: fontWeight.extrabold, color: theme.text },
    brandTag: { fontSize: fontSize.caption, color: theme.textSecondary },
    footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: spacing.xs },
    footerText: { fontSize: fontSize.body, color: theme.textSecondary },
    footerLink: { fontSize: fontSize.body, fontWeight: fontWeight.bold, color: theme.primary },
  });
