import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { useChamados } from '../hooks/useChamados';
import { ChamadoCard } from '../components/ChamadoCard';
import { StatCard } from '../components/StatCard';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { FeedbackModal } from '../components/FeedbackModal';
import { colors, borderRadius, spacing, fontSize, fontWeight, shadows } from '../theme';
import { RootStackParamList } from '../navigation/types';

type ProfileNavProp = NativeStackNavigationProp<RootStackParamList>;

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileNavProp>();
  const { usuario, logout, updateProfile } = useAuth();
  const { chamados, resetarDados } = useChamados();

  // Estados dos modais de ação
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccessModal, setResetSuccessModal] = useState(false);

  // Estados de edição de dados e senha
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccessModal, setProfileSuccessModal] = useState(false);

  // Formulário de edição
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [bairro, setBairro] = useState('');
  const [alterarSenha, setAlterarSenha] = useState(false);
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});

  // Filtrar os chamados do cidadão logado
  const meusChamados = chamados.filter((c) => c.autorId === usuario?.id);
  const meusAbertos = meusChamados.filter((c) => c.status === 'Aberto').length;
  const meusEmAndamento = meusChamados.filter((c) => c.status === 'Em Andamento').length;
  const meusResolvidos = meusChamados.filter((c) => c.status === 'Resolvido').length;

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
    const errs: Record<string, string> = {};

    if (!nome.trim()) {
      errs.nome = 'Informe seu nome completo';
    }

    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      errs.email = 'Informe um e-mail válido';
    }

    if (!telefone.trim()) {
      errs.telefone = 'Informe seu telefone de contato';
    }

    if (!bairro.trim()) {
      errs.bairro = 'Informe o bairro';
    }

    if (alterarSenha) {
      if (!novaSenha) {
        errs.novaSenha = 'Crie uma nova senha';
      } else if (novaSenha.length < 6) {
        errs.novaSenha = 'A senha deve ter no mínimo 6 caracteres';
      }

      if (novaSenha !== confirmarNovaSenha) {
        errs.confirmarNovaSenha = 'As senhas informadas não conferem';
      }
    }

    setEditErrors(errs);
    return Object.keys(errs).length === 0;
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
        {/* Header do Perfil */}
        <View style={styles.topHeader}>
          <Text style={styles.pageTitle}>Meu Perfil</Text>
          <Text style={styles.pageSubtitle}>Dados do Cidadão e Histórico de Ocorrências</Text>
        </View>

        {/* Card do Usuário */}
        <View style={[styles.userCard, shadows.md]}>
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

          {/* Detalhes Cadastrais */}
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
              <Text style={styles.infoLabel}>Bairro Registrado</Text>
              <Text style={styles.infoValue}>{usuario?.bairro || 'Bela Vista'}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Cidade / UF</Text>
              <Text style={styles.infoValue}>São Paulo / SP</Text>
            </View>
          </View>

          {/* Botão de Edição de Dados e Senha */}
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={handleOpenEditModal}
            activeOpacity={0.7}
          >
            <Ionicons name="create-outline" size={18} color={colors.primary[700]} />
            <Text style={styles.editProfileButtonText}>Editar Meus Dados e Senha</Text>
          </TouchableOpacity>
        </View>

        {/* Estatísticas Pessoais */}
        <Text style={styles.sectionHeading}>Minhas Contribuições de Zeladoria</Text>
        <View style={styles.statsRow}>
          <StatCard
            label="Total Criado"
            value={meusChamados.length}
            icon="folder-open-outline"
            color={colors.secondary[700]}
            bgColor={colors.secondary[100]}
          />
          <StatCard
            label="Abertos"
            value={meusAbertos}
            icon="alert-circle-outline"
            color={colors.status.aberto.icon}
            bgColor={colors.status.aberto.bg}
          />
          <StatCard
            label="Em Ação"
            value={meusEmAndamento}
            icon="time-outline"
            color={colors.status.emAndamento.icon}
            bgColor={colors.status.emAndamento.bg}
          />
          <StatCard
            label="Resolvidos"
            value={meusResolvidos}
            icon="checkmark-done-outline"
            color={colors.status.resolvido.icon}
            bgColor={colors.status.resolvido.bg}
          />
        </View>

        {/* Lista de Chamados do Próprio Usuário */}
        <View style={styles.myReportsHeaderRow}>
          <Text style={styles.sectionHeading}>Minhas Ocorrências Recentes ({meusChamados.length})</Text>
        </View>

        {meusChamados.length === 0 ? (
          <View style={styles.emptyMyReports}>
            <Ionicons name="document-text-outline" size={32} color={colors.secondary[400]} />
            <Text style={styles.emptyText}>Você ainda não registrou chamados com esta conta.</Text>
            <Button
              title="Registrar Agora"
              variant="outline"
              size="sm"
              onPress={() => navigation.navigate('NovoChamado')}
              style={{ marginTop: spacing.sm }}
            />
          </View>
        ) : (
          meusChamados.map((item) => (
            <ChamadoCard
              key={item.id}
              chamado={item}
              onPress={() => navigation.navigate('ChamadoDetails', { id: item.id })}
            />
          ))
        )}

        {/* Utilitário para Avaliadores FIAP */}
        <View style={[styles.utilityCard, shadows.sm]}>
          <View style={styles.utilityHeader}>
            <Ionicons name="construct-outline" size={20} color={colors.secondary[700]} />
            <Text style={styles.utilityTitle}>Ambiente de Avaliação FIAP</Text>
          </View>
          <Text style={styles.utilityText}>
            Precisa restaurar a base original de ocorrências de teste com fotos e endereços reais de São Paulo?
          </Text>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => setResetModalVisible(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="refresh" size={16} color={colors.primary[700]} />
            <Text style={styles.resetButtonText}>Restaurar Chamados Originais de Demonstração</Text>
          </TouchableOpacity>
        </View>

        {/* Botão de Logout */}
        <Button
          title="Sair da Conta (Logout)"
          variant="danger"
          size="lg"
          onPress={() => setLogoutModalVisible(true)}
          leftIcon={<Ionicons name="log-out-outline" size={20} color={colors.surface} />}
          style={styles.logoutButton}
        />

        {/* Modal de Edição de Dados Pessoais & Senha */}
        <Modal
          visible={editModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setEditModalVisible(false)}
        >
          <KeyboardAvoidingView
            style={styles.modalOverlay}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <View style={[styles.modalCard, shadows.lg]}>
              <View style={styles.modalHeaderRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalTitle}>Editar Dados Pessoais</Text>
                  <Text style={styles.modalSubtitle}>Atualize seus dados cadastrais e senha</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setEditModalVisible(false)}
                  style={styles.modalCloseBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="close" size={24} color={colors.secondary[600]} />
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.modalScrollContent}
              >
                <Input
                  label="Nome Completo *"
                  value={nome}
                  onChangeText={(t) => {
                    setNome(t);
                    if (editErrors.nome) setEditErrors((prev) => ({ ...prev, nome: '' }));
                  }}
                  error={editErrors.nome}
                  leftIcon={<Ionicons name="person-outline" size={18} color={colors.secondary[400]} />}
                />

                <Input
                  label="E-mail *"
                  value={email}
                  onChangeText={(t) => {
                    setEmail(t);
                    if (editErrors.email) setEditErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={editErrors.email}
                  leftIcon={<Ionicons name="mail-outline" size={18} color={colors.secondary[400]} />}
                />

                <Input
                  label="Telefone *"
                  value={telefone}
                  onChangeText={(t) => {
                    setTelefone(t);
                    if (editErrors.telefone) setEditErrors((prev) => ({ ...prev, telefone: '' }));
                  }}
                  keyboardType="phone-pad"
                  error={editErrors.telefone}
                  leftIcon={<Ionicons name="call-outline" size={18} color={colors.secondary[400]} />}
                />

                <Input
                  label="Bairro de Residência *"
                  value={bairro}
                  onChangeText={(t) => {
                    setBairro(t);
                    if (editErrors.bairro) setEditErrors((prev) => ({ ...prev, bairro: '' }));
                  }}
                  error={editErrors.bairro}
                  leftIcon={<Ionicons name="business-outline" size={18} color={colors.secondary[400]} />}
                />

                {/* Opção para Alterar Senha */}
                <TouchableOpacity
                  style={styles.passwordToggleRow}
                  onPress={() => setAlterarSenha(!alterarSenha)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={alterarSenha ? 'checkbox' : 'square-outline'}
                    size={22}
                    color={alterarSenha ? colors.primary[600] : colors.secondary[400]}
                  />
                  <Text style={styles.passwordToggleText}>Desejo alterar minha senha de acesso</Text>
                </TouchableOpacity>

                {alterarSenha && (
                  <View style={styles.passwordBox}>
                    <Input
                      label="Nova Senha *"
                      placeholder="Mínimo 6 caracteres"
                      value={novaSenha}
                      onChangeText={(t) => {
                        setNovaSenha(t);
                        if (editErrors.novaSenha) setEditErrors((prev) => ({ ...prev, novaSenha: '' }));
                      }}
                      isPassword
                      error={editErrors.novaSenha}
                      leftIcon={<Ionicons name="lock-closed-outline" size={18} color={colors.secondary[400]} />}
                    />

                    <Input
                      label="Confirmar Nova Senha *"
                      placeholder="Repita a nova senha"
                      value={confirmarNovaSenha}
                      onChangeText={(t) => {
                        setConfirmarNovaSenha(t);
                        if (editErrors.confirmarNovaSenha)
                          setEditErrors((prev) => ({ ...prev, confirmarNovaSenha: '' }));
                      }}
                      isPassword
                      error={editErrors.confirmarNovaSenha}
                      leftIcon={
                        <Ionicons name="checkmark-done-outline" size={18} color={colors.secondary[400]} />
                      }
                    />
                  </View>
                )}

                <View style={styles.modalButtonsRow}>
                  <Button
                    title="Cancelar"
                    variant="ghost"
                    onPress={() => setEditModalVisible(false)}
                    style={{ flex: 1 }}
                    disabled={isSavingProfile}
                  />
                  <Button
                    title="Salvar"
                    variant="primary"
                    onPress={handleSaveProfile}
                    loading={isSavingProfile}
                    style={{ flex: 1 }}
                  />
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {/* Modal de Sucesso da Edição de Perfil */}
        <FeedbackModal
          visible={profileSuccessModal}
          type="success"
          title="Dados Atualizados!"
          message="Seus dados pessoais e credenciais foram atualizados com sucesso no sistema CitizenTech."
          confirmText="OK"
          onConfirm={() => setProfileSuccessModal(false)}
        />

        {/* Modal de Confirmação de Logout */}
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

        {/* Modal de Confirmação de Reset de Demonstração */}
        <FeedbackModal
          visible={resetModalVisible}
          type="info"
          title="Restaurar Banco de Teste"
          message="Isto restaurará o conjunto inicial de 5 ocorrências com todos os dados simulados da FIAP."
          confirmText="Restaurar"
          cancelText="Cancelar"
          confirmLoading={isResetting}
          onConfirm={handleConfirmReset}
          onCancel={() => setResetModalVisible(false)}
        />

        {/* Feedback de Sucesso do Reset */}
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
  statsRow: {
    flexDirection: 'row',
    gap: spacing.xs + 2,
    marginBottom: spacing.lg,
  },
  myReportsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emptyMyReports: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  emptyText: {
    fontSize: fontSize.bodySmall,
    color: colors.secondary[500],
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  utilityCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  utilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  utilityTitle: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    color: colors.secondary[800],
  },
  utilityText: {
    fontSize: fontSize.caption,
    color: colors.secondary[500],
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primary[50],
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  resetButtonText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    color: colors.primary[700],
  },
  logoutButton: {
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
    maxHeight: '90%',
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
    color: colors.secondary[900],
  },
  modalSubtitle: {
    fontSize: fontSize.caption,
    color: colors.secondary[500],
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalScrollContent: {
    paddingBottom: spacing.xl,
  },
  passwordToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: spacing.sm,
    paddingVertical: spacing.xs,
  },
  passwordToggleText: {
    fontSize: fontSize.bodySmall,
    fontWeight: fontWeight.semibold,
    color: colors.secondary[800],
  },
  passwordBox: {
    backgroundColor: colors.secondary[50],
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
});
