import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../hooks/useAuth';
import { useChamados } from '../../hooks/useChamados';
import { useTheme } from '../../contexts/ThemeContext';
import { ProfileEditSchema, extractZodFieldErrors } from '../../utils/schemas';
import { Button } from '../../components/Button';
import { FeedbackModal } from '../../components/FeedbackModal';
import { EditProfileModal } from './components/EditProfileModal';
import { APP_VERSION_INFO } from '../../config/version';
import { colors, borderRadius, spacing, fontSize, fontWeight, shadows } from '../../theme';
import { RootStackParamList } from '../../navigation/types';

type ProfileNavProp = NativeStackNavigationProp<RootStackParamList>;

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileNavProp>();
  const { usuario, logout, updateProfile } = useAuth();
  const { chamados, resetarDados } = useChamados();
  const { isDark, toggleTheme } = useTheme();

  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccessModal, setResetSuccessModal] = useState(false);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccessModal, setProfileSuccessModal] = useState(false);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [bairro, setBairro] = useState('');
  const [alterarSenha, setAlterarSenha] = useState(false);
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});

  const meusCount = chamados.filter((c) => c.autorId === usuario?.id).length;

  const handleOpenEditModal = () => {
    setNome(usuario?.nome || '');
    setEmail(usuario?.email || '');
    setTelefone(usuario?.telefone || '');
    setBairro(usuario?.bairro || '');
    setAlterarSenha(false);
    setNovaSenha('');
    setConfirmarNovaSenha('');
    setEditErrors({});
    setEditModalVisible(true);
  };

  const validateEditProfile = (): boolean => {
    const parsed = ProfileEditSchema.safeParse({
      nome: nome.trim(),
      email: email.trim(),
      telefone: telefone.trim(),
      bairro: bairro.trim(),
      alterarSenha,
      novaSenha: alterarSenha ? novaSenha : undefined,
      confirmarNovaSenha: alterarSenha ? confirmarNovaSenha : undefined,
    });

    if (!parsed.success) {
      setEditErrors(extractZodFieldErrors(parsed.error));
      return false;
    }

    setEditErrors({});
    return true;
  };

  const handleSaveProfile = async () => {
    if (!validateEditProfile()) return;

    try {
      setIsSavingProfile(true);
      await updateProfile({
        nome: nome.trim(),
        email: email.trim(),
        telefone: telefone.trim(),
        bairro: bairro.trim(),
        novaSenha: alterarSenha && novaSenha ? novaSenha : undefined,
      });

      setEditModalVisible(false);
      setProfileSuccessModal(true);
    } catch (err: any) {
      alert(err.message || 'Falha ao atualizar dados.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleConfirmLogout = async () => {
    setLogoutModalVisible(false);
    await logout();
  };

  const handleConfirmReset = async () => {
    try {
      setIsResetting(true);
      await resetarDados();
      setResetModalVisible(false);
      setResetSuccessModal(true);
    } catch {
      alert('Falha ao resetar dados.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.topHeader}>
          <Text style={styles.pageTitle}>Meu Perfil</Text>
          <Text style={styles.pageSubtitle}>Dados cadastrais, configurações e informações</Text>
        </View>

        <View style={[styles.userCard, shadows.sm]}>
          <View style={styles.avatarRow}>
            <Image
              source={{
                uri:
                  usuario?.avatarUrl ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
              }}
              style={styles.avatarImage}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{usuario?.nome || 'Cidadão Conectado'}</Text>
              <Text style={styles.userEmail}>{usuario?.email}</Text>
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={14} color={colors.primary[600]} />
                <Text style={styles.verifiedText}>Cidadão Verificado</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>CPF</Text>
              <Text style={styles.infoValue}>{usuario?.cpf || '123.***.***-00'}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Telefone</Text>
              <Text style={styles.infoValue}>{usuario?.telefone || '(11) 98765-4321'}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Bairro Principal</Text>
              <Text style={styles.infoValue}>{usuario?.bairro || 'Bela Vista'}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Participação</Text>
              <Text style={styles.infoValue}>
                {meusCount} {meusCount === 1 ? 'relato registrado' : 'relatos registrados'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={handleOpenEditModal}
            activeOpacity={0.7}
          >
            <Ionicons name="create-outline" size={18} color={colors.primary[700]} />
            <Text style={styles.editProfileButtonText}>Editar Meus Dados e Senha</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionHeading}>Mais Opções & Informações</Text>
        <View style={[styles.menuCard, shadows.sm]}>
          {/* Item 1: Alternância de Tema (Light / Dark) */}
          <View style={styles.menuRow}>
            <View style={[styles.menuIconBox, { backgroundColor: colors.secondary[100] }]}>
              <Ionicons
                name={isDark ? 'moon' : 'sunny-outline'}
                size={20}
                color={colors.secondary[800]}
              />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuItemTitle}>Modo de Aparência</Text>
              <Text style={styles.menuItemSub}>
                {isDark ? 'Tema Escuro ativado' : 'Tema Claro padrão'}
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.secondary[200], true: colors.primary[500] }}
              thumbColor={colors.surface}
            />
          </View>

          <View style={styles.menuDivider} />

          {/* Item 2: Sobre o App */}
          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => navigation.navigate('SobreApp')}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconBox, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="information-circle-outline" size={22} color="#2563EB" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuItemTitle}>Sobre o Aplicativo & Equipe FIAP</Text>
              <Text style={styles.menuItemSub}>
                Versão {APP_VERSION_INFO.version} • Commit #{APP_VERSION_INFO.shortCommitHash} • ODS 11
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.secondary[400]} />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          {/* Item 3: Utilitário para Avaliadores FIAP */}
          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => setResetModalVisible(true)}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconBox, { backgroundColor: '#FFFBEB' }]}>
              <Ionicons name="refresh-outline" size={20} color="#D97706" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuItemTitle}>Restaurar Base de Demonstração</Text>
              <Text style={styles.menuItemSub}>
                Restaura os 5 chamados iniciais de teste para avaliação
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.secondary[400]} />
          </TouchableOpacity>
        </View>

        <Button
          title="Sair da Conta (Logout)"
          variant="danger"
          size="lg"
          onPress={() => setLogoutModalVisible(true)}
          leftIcon={<Ionicons name="log-out-outline" size={20} color={colors.surface} />}
          style={styles.logoutButton}
        />

        <EditProfileModal
          visible={editModalVisible}
          nome={nome}
          email={email}
          telefone={telefone}
          bairro={bairro}
          alterarSenha={alterarSenha}
          novaSenha={novaSenha}
          confirmarNovaSenha={confirmarNovaSenha}
          editErrors={editErrors}
          isSavingProfile={isSavingProfile}
          onNomeChange={(t) => {
            setNome(t);
            if (editErrors.nome) setEditErrors((prev) => ({ ...prev, nome: '' }));
          }}
          onEmailChange={(t) => {
            setEmail(t);
            if (editErrors.email) setEditErrors((prev) => ({ ...prev, email: '' }));
          }}
          onTelefoneChange={(t) => {
            setTelefone(t);
            if (editErrors.telefone) setEditErrors((prev) => ({ ...prev, telefone: '' }));
          }}
          onBairroChange={(t) => {
            setBairro(t);
            if (editErrors.bairro) setEditErrors((prev) => ({ ...prev, bairro: '' }));
          }}
          onToggleAlterarSenha={() => setAlterarSenha(!alterarSenha)}
          onNovaSenhaChange={(t) => {
            setNovaSenha(t);
            if (editErrors.novaSenha) setEditErrors((prev) => ({ ...prev, novaSenha: '' }));
          }}
          onConfirmarNovaSenhaChange={(t) => {
            setConfirmarNovaSenha(t);
            if (editErrors.confirmarNovaSenha)
              setEditErrors((prev) => ({ ...prev, confirmarNovaSenha: '' }));
          }}
          onSave={handleSaveProfile}
          onClose={() => setEditModalVisible(false)}
        />

        <FeedbackModal
          visible={profileSuccessModal}
          type="success"
          title="Dados Atualizados!"
          message="Seus dados pessoais e credenciais foram atualizados com sucesso no sistema ZelaFix."
          confirmText="OK"
          onConfirm={() => setProfileSuccessModal(false)}
        />

        <FeedbackModal
          visible={logoutModalVisible}
          type="warning"
          title="Encerrar Sessão"
          message="Deseja realmente sair da sua conta? Suas ocorrências continuarão salvas."
          confirmText="Sim, Sair"
          cancelText="Cancelar"
          onConfirm={handleConfirmLogout}
          onCancel={() => setLogoutModalVisible(false)}
        />

        <FeedbackModal
          visible={resetModalVisible}
          type="info"
          title="Restaurar Banco de Teste"
          message="Isto restaurará o conjunto inicial de 5 ocorrências com triagem de IA e dados simulados da FIAP."
          confirmText="Restaurar"
          cancelText="Cancelar"
          confirmLoading={isResetting}
          onConfirm={handleConfirmReset}
          onCancel={() => setResetModalVisible(false)}
        />

        <FeedbackModal
          visible={resetSuccessModal}
          type="success"
          title="Dados Restaurados"
          message="O repositório de zeladoria urbana foi restaurado com sucesso para a avaliação."
          confirmText="OK"
          onConfirm={() => setResetSuccessModal(false)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  topHeader: {
    marginBottom: spacing.md,
  },
  pageTitle: {
    fontSize: fontSize.heading,
    fontWeight: fontWeight.extrabold,
    color: colors.secondary[900],
  },
  pageSubtitle: {
    fontSize: fontSize.caption,
    color: colors.secondary[500],
    marginTop: 2,
  },
  userCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary[50],
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
    color: colors.secondary[900],
  },
  userEmail: {
    fontSize: fontSize.caption,
    color: colors.secondary[500],
    marginTop: 2,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  verifiedText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    color: colors.primary[600],
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.md,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  infoItem: {
    width: '47%',
  },
  infoLabel: {
    fontSize: fontSize.tiny,
    color: colors.secondary[400],
    fontWeight: fontWeight.medium,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: fontSize.bodySmall,
    fontWeight: fontWeight.semibold,
    color: colors.secondary[800],
    marginTop: 2,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary[200],
    marginTop: spacing.xs,
  },
  editProfileButtonText: {
    fontSize: fontSize.bodySmall,
    fontWeight: fontWeight.bold,
    color: colors.primary[700],
  },
  sectionHeading: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.bold,
    color: colors.secondary[900],
    marginBottom: spacing.sm,
  },
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTextContainer: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    color: colors.secondary[900],
  },
  menuItemSub: {
    fontSize: fontSize.tiny,
    color: colors.secondary[500],
    marginTop: 2,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.divider,
    marginHorizontal: spacing.md,
  },
  logoutButton: {
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
});
