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
import { AuthStackParamList } from '../navigation/types';

type RegisterNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterNavigationProp>();
  const { register, isLoading, error, clearError } = useAuth();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [bairro, setBairro] = useState('Bela Vista');

  // Erros por campo
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [modalError, setModalError] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!nome.trim()) {
      newErrors.nome = 'Informe seu nome completo';
    } else if (nome.trim().split(' ').length < 2) {
      newErrors.nome = 'Informe nome e sobrenome';
    }

    if (!email.trim()) {
      newErrors.email = 'Informe seu e-mail';
    } else if (!email.trim().includes('@') || !email.trim().includes('.')) {
      newErrors.email = 'Informe um e-mail válido';
    }

    if (!senha) {
      newErrors.senha = 'Crie uma senha de acesso';
    } else if (senha.length < 6) {
      newErrors.senha = 'A senha deve conter no mínimo 6 caracteres';
    }

    if (senha !== confirmSenha) {
      newErrors.confirmSenha = 'As senhas informadas não coincidem';
    }

    if (!cpf.trim()) {
      newErrors.cpf = 'Informe seu CPF';
    }

    if (!telefone.trim()) {
      newErrors.telefone = 'Informe seu telefone de contato';
    }

    if (!bairro.trim()) {
      newErrors.bairro = 'Informe seu bairro de residência';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    try {
      await register({
        nome: nome.trim(),
        email: email.trim(),
        senha,
        cpf: cpf.trim(),
        telefone: telefone.trim(),
        bairro: bairro.trim(),
      });
      // Contexto de autenticação define token e usuário logado automaticamente!
    } catch (err: any) {
      setModalError(err.message || 'Falha ao realizar cadastro.');
    }
  };

  const preencherExemplo = () => {
    setNome('Ana Clara Souza');
    setEmail('anaclara.cidada@citizentech.com.br');
    setSenha('123456');
    setConfirmSenha('123456');
    setCpf('345.678.901-22');
    setTelefone('(11) 97123-4567');
    setBairro('Pinheiros');
    setErrors({});
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
        {/* Header com Voltar */}
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

        {/* Card do Formulário */}
        <View style={[styles.card, shadows.md]}>
          <Text style={styles.formTitle}>Junte-se à Rede CitizenTech</Text>
          <Text style={styles.formDescription}>
            Tenha voz ativa na gestão urbana do seu bairro e ajude a zelar pelo patrimônio público.
          </Text>

          {error && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={18} color={colors.feedback.danger} />
              <Text style={styles.errorBannerText}>{error}</Text>
            </View>
          )}

          <Input
            label="Nome Completo *"
            placeholder="Ex: Ana Clara Souza"
            value={nome}
            onChangeText={(text) => {
              setNome(text);
              if (errors.nome) setErrors((prev) => ({ ...prev, nome: '' }));
              if (error) clearError();
            }}
            error={errors.nome}
            leftIcon={
              <Ionicons name="person-outline" size={20} color={colors.secondary[400]} />
            }
          />

          <Input
            label="E-mail *"
            placeholder="seuemail@exemplo.com"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
              if (error) clearError();
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.email}
            leftIcon={
              <Ionicons name="mail-outline" size={20} color={colors.secondary[400]} />
            }
          />

          <View style={styles.rowTwoInputs}>
            <View style={{ flex: 1, marginRight: spacing.xs }}>
              <Input
                label="CPF *"
                placeholder="000.000.000-00"
                value={cpf}
                onChangeText={(text) => {
                  setCpf(text);
                  if (errors.cpf) setErrors((prev) => ({ ...prev, cpf: '' }));
                }}
                keyboardType="numeric"
                error={errors.cpf}
              />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.xs }}>
              <Input
                label="Telefone *"
                placeholder="(11) 99999-9999"
                value={telefone}
                onChangeText={(text) => {
                  setTelefone(text);
                  if (errors.telefone) setErrors((prev) => ({ ...prev, telefone: '' }));
                }}
                keyboardType="phone-pad"
                error={errors.telefone}
              />
            </View>
          </View>

          <Input
            label="Bairro de Residência *"
            placeholder="Ex: Bela Vista, Pinheiros, Sé"
            value={bairro}
            onChangeText={(text) => {
              setBairro(text);
              if (errors.bairro) setErrors((prev) => ({ ...prev, bairro: '' }));
            }}
            error={errors.bairro}
            leftIcon={
              <Ionicons name="business-outline" size={20} color={colors.secondary[400]} />
            }
          />

          <Input
            label="Senha de Acesso *"
            placeholder="Mínimo 6 caracteres"
            value={senha}
            onChangeText={(text) => {
              setSenha(text);
              if (errors.senha) setErrors((prev) => ({ ...prev, senha: '' }));
              if (error) clearError();
            }}
            isPassword
            error={errors.senha}
            leftIcon={
              <Ionicons name="lock-closed-outline" size={20} color={colors.secondary[400]} />
            }
          />

          <Input
            label="Confirmação de Senha *"
            placeholder="Repita sua senha"
            value={confirmSenha}
            onChangeText={(text) => {
              setConfirmSenha(text);
              if (errors.confirmSenha) setErrors((prev) => ({ ...prev, confirmSenha: '' }));
            }}
            isPassword
            error={errors.confirmSenha}
            leftIcon={
              <Ionicons name="checkmark-done-outline" size={20} color={colors.secondary[400]} />
            }
          />

          <Button
            title="Concluir Cadastro"
            variant="primary"
            size="lg"
            onPress={handleRegister}
            loading={isLoading}
            style={styles.submitButton}
          />

          <TouchableOpacity
            style={styles.fillExampleBtn}
            onPress={preencherExemplo}
            activeOpacity={0.7}
          >
            <Ionicons name="sparkles-outline" size={16} color={colors.secondary[700]} />
            <Text style={styles.fillExampleText}>Auto-preencher Dados de Teste</Text>
          </TouchableOpacity>
        </View>

        {/* Link para Login */}
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
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
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
  },
  rowTwoInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  submitButton: {
    marginTop: spacing.sm,
  },
  fillExampleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.secondary[100],
    borderRadius: borderRadius.md,
  },
  fillExampleText: {
    fontSize: fontSize.bodySmall,
    fontWeight: fontWeight.semibold,
    color: colors.secondary[700],
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

