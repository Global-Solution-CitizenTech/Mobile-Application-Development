import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useChamados } from '../../hooks/useChamados';
import { StatusBadge } from '../../components/StatusBadge';
import { CategoryBadge } from '../../components/CategoryBadge';
import { getPriorityConfig } from '../../components/ChamadoCard';
import { Button } from '../../components/Button';
import { FeedbackModal } from '../../components/FeedbackModal';
import { ChamadoTimelineCard } from './components/ChamadoTimelineCard';
import { StatusChangeModal } from './components/StatusChangeModal';
import { colors, borderRadius, spacing, fontSize, fontWeight, shadows } from '../../theme';
import { Chamado, StatusChamado } from '../../types';
import { RootStackParamList } from '../../navigation/types';

type ChamadoDetailsRouteProp = RouteProp<RootStackParamList, 'ChamadoDetails'>;
type ChamadoDetailsNavProp = NativeStackNavigationProp<RootStackParamList>;

export const ChamadoDetailsScreen: React.FC = () => {
  const route = useRoute<ChamadoDetailsRouteProp>();
  const navigation = useNavigation<ChamadoDetailsNavProp>();
  const { id } = route.params;

  const { obterChamadoPorId, atualizarStatus, excluirChamado, apoiarChamado } = useChamados();

  const [chamado, setChamado] = useState<Chamado | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<StatusChamado>('Em Andamento');
  const [statusFeedback, setStatusFeedback] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await obterChamadoPorId(id);
        if (isMounted) {
          setChamado(data);
          setSelectedStatus(data.status);
        }
      } catch (err: any) {
        if (isMounted) {
          alert(err.message || 'Chamado não encontrado.');
          navigation.goBack();
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [id, obterChamadoPorId, navigation]);

  const handleToggleSupport = async () => {
    if (!chamado) return;
    const atualizado = await apoiarChamado(chamado.id);
    setChamado(atualizado);
  };

  const handleConfirmStatusChange = async () => {
    if (!chamado) return;
    try {
      setActionLoading(true);
      const atualizado = await atualizarStatus(
        chamado.id,
        selectedStatus,
        statusFeedback.trim() || undefined
      );
      setChamado(atualizado);
      setStatusModalVisible(false);
      setStatusFeedback('');
      setFeedbackSuccess(`Status alterado para "${selectedStatus}" com sucesso.`);
    } catch (err: any) {
      alert(err.message || 'Falha ao atualizar status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!chamado) return;
    try {
      setActionLoading(true);
      await excluirChamado(chamado.id);
      setDeleteModalVisible(false);
      navigation.goBack();
    } catch (err: any) {
      alert(err.message || 'Falha ao excluir chamado.');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  if (loading || !chamado) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
        <Text style={styles.loadingText}>Carregando ocorrência...</Text>
      </View>
    );
  }

  const prio = getPriorityConfig(chamado.prioridade);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.secondary[900]} />
        </TouchableOpacity>
        <View style={styles.headerTitleBox}>
          <Text style={styles.headerSubtitle}>PROTOCOLO</Text>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {chamado.protocolo}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {chamado.fotoUrl && (
          <View style={[styles.imageCard, shadows.sm]}>
            <Image
              source={{ uri: chamado.fotoUrl }}
              style={styles.mainImage}
              resizeMode="cover"
            />
          </View>
        )}

        <View style={[styles.mainCard, shadows.sm]}>
          <View style={styles.badgeRow}>
            <CategoryBadge categoria={chamado.categoria} />
            <StatusBadge status={chamado.status} />
          </View>

          <Text style={styles.title}>{chamado.titulo}</Text>

          <Text style={styles.authorMeta}>
            Reportado por <Text style={styles.boldText}>{chamado.autorNome}</Text> •{' '}
            {formatDate(chamado.dataAbertura)}
          </Text>

          <Text style={styles.descriptionText}>{chamado.descricao}</Text>

          {chamado.feedbackResolucao && (
            <View style={styles.feedbackResolucaoBox}>
              <View style={styles.feedbackTitleRow}>
                <Ionicons name="checkmark-circle" size={16} color={colors.feedback.success} />
                <Text style={styles.feedbackTitle}>Parecer da Zeladoria</Text>
              </View>
              <Text style={styles.feedbackDescription}>{chamado.feedbackResolucao}</Text>
            </View>
          )}

          <View style={styles.communityBar}>
            <View style={styles.communityInfo}>
              <Ionicons name="people" size={18} color={colors.primary[700]} />
              <Text style={styles.communityText}>
                <Text style={styles.boldText}>{chamado.apoiosCount || 1} moradores</Text>{' '}
                apoiaram esta demanda
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.supportActionBtn,
                chamado.apoiadoPeloUsuario && styles.supportActionBtnActive,
              ]}
              onPress={handleToggleSupport}
              activeOpacity={0.8}
            >
              <Ionicons
                name={chamado.apoiadoPeloUsuario ? 'checkmark-circle' : 'arrow-up'}
                size={15}
                color={chamado.apoiadoPeloUsuario ? colors.surface : colors.primary[700]}
              />
              <Text
                style={[
                  styles.supportActionText,
                  chamado.apoiadoPeloUsuario && styles.supportActionTextActive,
                ]}
              >
                {chamado.apoiadoPeloUsuario ? 'Apoiado' : 'Apoiar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.mainCard, shadows.sm]}>
          <View style={styles.aiHeaderRow}>
            <View style={styles.sectionHeaderInline}>
              <Ionicons name="sparkles" size={16} color={colors.primary[600]} />
              <Text style={styles.sectionHeading}>Análise de Triagem IA</Text>
            </View>

            <View style={[styles.priorityPill, { backgroundColor: prio.bg }]}>
              <View style={[styles.priorityDot, { backgroundColor: prio.dot }]} />
              <Text style={[styles.priorityPillText, { color: prio.text }]}>
                Urgência {chamado.prioridade || 'Média'}
              </Text>
            </View>
          </View>

          {chamado.orgaoResponsavel && (
            <Text style={styles.orgaoLabel}>
              Órgão competente: <Text style={styles.boldText}>{chamado.orgaoResponsavel}</Text>
            </Text>
          )}

          <Text style={styles.aiParecerBody}>
            {chamado.parecerIa ||
              'Triagem automática realizada com base na categoria e descrição do relato urbano.'}
          </Text>

          <View style={styles.sectionDivider} />

          <View style={styles.sectionHeaderInline}>
            <Ionicons name="location" size={17} color={colors.primary[600]} />
            <Text style={styles.sectionHeading}>Localização</Text>
          </View>

          <Text style={styles.addressStreet}>
            {chamado.localizacao.logradouro}, {chamado.localizacao.numero}
          </Text>
          <Text style={styles.addressSub}>
            {chamado.localizacao.bairro} • {chamado.localizacao.cidade} • CEP{' '}
            {chamado.localizacao.cep}
          </Text>

          {chamado.localizacao.pontoReferencia ? (
            <Text style={styles.referenceInline}>
              Referência: {chamado.localizacao.pontoReferencia}
            </Text>
          ) : null}

          <View style={styles.coordsPill}>
            <Ionicons name="navigate-outline" size={13} color={colors.secondary[500]} />
            <Text style={styles.coordsText}>
              GPS: {chamado.localizacao.latitude.toFixed(4)},{' '}
              {chamado.localizacao.longitude.toFixed(4)}
            </Text>
          </View>
        </View>

        <ChamadoTimelineCard
          historico={chamado.historico || []}
          formatDate={formatDate}
        />

        <View style={styles.actionsSection}>
          <View style={styles.actionsGrid}>
            <Button
              title="Atualizar Status"
              variant="primary"
              onPress={() => setStatusModalVisible(true)}
              leftIcon={<Ionicons name="sync-outline" size={18} color={colors.surface} />}
              style={styles.actionBtn}
            />

            <Button
              title="Editar Relato"
              variant="outline"
              onPress={() => navigation.navigate('EditarChamado', { id: chamado.id })}
              leftIcon={<Ionicons name="create-outline" size={18} color={colors.primary[600]} />}
              style={styles.actionBtn}
            />
          </View>

          <TouchableOpacity
            style={styles.deleteLinkBtn}
            onPress={() => setDeleteModalVisible(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={16} color={colors.feedback.danger} />
            <Text style={styles.deleteLinkText}>Excluir este protocolo</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <StatusChangeModal
        visible={statusModalVisible}
        selectedStatus={selectedStatus}
        statusFeedback={statusFeedback}
        loading={actionLoading}
        onSelectStatus={setSelectedStatus}
        onFeedbackChange={setStatusFeedback}
        onConfirm={handleConfirmStatusChange}
        onCancel={() => setStatusModalVisible(false)}
      />

      <FeedbackModal
        visible={deleteModalVisible}
        type="warning"
        title="Excluir Ocorrência"
        message="Tem certeza que deseja excluir esta ocorrência? Esta ação é irreversível."
        confirmText="Sim, Excluir"
        cancelText="Cancelar"
        confirmLoading={actionLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
      />

      <FeedbackModal
        visible={!!feedbackSuccess}
        type="success"
        title="Status Atualizado"
        message={feedbackSuccess || ''}
        confirmText="OK"
        onConfirm={() => setFeedbackSuccess(null)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: fontSize.bodySmall,
    color: colors.secondary[500],
    marginTop: spacing.md,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary[100],
  },
  backButton: {
    padding: 6,
  },
  headerTitleBox: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: fontWeight.bold,
    color: colors.secondary[400],
    letterSpacing: 0.7,
  },
  headerTitle: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    color: colors.secondary[900],
  },
  editHeaderBtn: {
    padding: 6,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  imageCard: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  mainImage: {
    width: '100%',
    height: 200,
  },
  mainCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md + 2,
    borderWidth: 1,
    borderColor: colors.secondary[100],
    marginBottom: spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm + 2,
  },
  title: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.extrabold,
    color: colors.secondary[900],
    lineHeight: 24,
    marginBottom: 6,
  },
  authorMeta: {
    fontSize: fontSize.caption,
    color: colors.secondary[400],
    marginBottom: spacing.md,
  },
  boldText: {
    fontWeight: fontWeight.bold,
    color: colors.secondary[800],
  },
  descriptionText: {
    fontSize: fontSize.bodySmall,
    color: colors.secondary[700],
    lineHeight: 21,
  },
  feedbackResolucaoBox: {
    marginTop: spacing.md,
    backgroundColor: colors.feedback.successLight,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  feedbackTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  feedbackTitle: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    color: colors.primary[900],
  },
  feedbackDescription: {
    fontSize: fontSize.caption,
    color: colors.secondary[800],
    lineHeight: 18,
  },
  communityBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.secondary[50],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
  },
  communityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    marginRight: spacing.sm,
  },
  communityText: {
    fontSize: fontSize.caption,
    color: colors.secondary[600],
    flex: 1,
  },
  supportActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[50],
  },
  supportActionBtnActive: {
    backgroundColor: colors.primary[600],
  },
  supportActionText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    color: colors.primary[700],
  },
  supportActionTextActive: {
    color: colors.surface,
  },
  aiHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs + 2,
  },
  sectionHeaderInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionHeading: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    color: colors.secondary[900],
  },
  priorityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  priorityPillText: {
    fontSize: fontSize.tiny,
    fontWeight: fontWeight.bold,
  },
  orgaoLabel: {
    fontSize: fontSize.caption,
    color: colors.secondary[500],
    marginBottom: 8,
  },
  aiParecerBody: {
    fontSize: fontSize.caption,
    color: colors.secondary[700],
    lineHeight: 19,
    backgroundColor: colors.secondary[50],
    padding: spacing.sm + 2,
    borderRadius: borderRadius.md,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: colors.secondary[100],
    marginVertical: spacing.md,
  },
  addressStreet: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    color: colors.secondary[900],
    marginTop: 6,
  },
  addressSub: {
    fontSize: fontSize.caption,
    color: colors.secondary[500],
    marginTop: 2,
  },
  referenceInline: {
    fontSize: fontSize.caption,
    color: colors.secondary[600],
    marginTop: 4,
  },
  coordsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: colors.secondary[50],
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    marginTop: spacing.sm,
  },
  coordsText: {
    fontSize: fontSize.tiny,
    color: colors.secondary[500],
    fontWeight: fontWeight.medium,
  },
  actionsSection: {
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionBtn: {
    flex: 1,
  },
  deleteLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing.md,
    marginTop: spacing.xs,
  },
  deleteLinkText: {
    fontSize: fontSize.bodySmall,
    fontWeight: fontWeight.semibold,
    color: colors.feedback.danger,
  },
});
