import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { useChamados } from '../hooks/useChamados';
import { ChamadoCard } from '../components/ChamadoCard';
import { StatCard } from '../components/StatCard';
import { Button } from '../components/Button';
import { FeedbackModal } from '../components/FeedbackModal';
import { colors, borderRadius, spacing, fontSize, fontWeight, shadows } from '../theme';
import { RootStackParamList } from '../navigation/types';

type ProfileNavProp = NativeStackNavigationProp<RootStackParamList>;

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileNavProp>();
  const { usuario, logout } = useAuth();
  const { chamados, resetarDados } = useChamados();

  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccessModal, setResetSuccessModal] = useState(false);

  // Filtrar os chamados do cidadão logado
  const meusChamados = chamados.filter((c) => c.autorId === usuario?.id);
  const meusAbertos = meusChamados.filter((c) => c.status === 'Aberto').length;
  const meusEmAndamento = meusChamados.filter((c) => c.status === 'Em Andamento').length;
  const meusResolvidos = meusChamados.filter((c) => c.status === 'Resolvido').length;

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
  );
};

const styles = StyleSheet.create({
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
});
