import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useChamados } from '../hooks/useChamados';
import { useAuth } from '../hooks/useAuth';
import { StatusBadge } from '../components/StatusBadge';
import { CategoryBadge } from '../components/CategoryBadge';
import { Button } from '../components/Button';
import { FeedbackModal } from '../components/FeedbackModal';
import { colors, borderRadius, spacing, fontSize, fontWeight, shadows } from '../theme';
import { Chamado, StatusChamado } from '../types';
import { RootStackParamList } from '../navigation/types';

type ChamadoDetailsRouteProp = RouteProp<RootStackParamList, 'ChamadoDetails'>;
type ChamadoDetailsNavProp = NativeStackNavigationProp<RootStackParamList>;

export const ChamadoDetailsScreen: React.FC = () => {
  const route = useRoute<ChamadoDetailsRouteProp>();
  const navigation = useNavigation<ChamadoDetailsNavProp>();
  const { id } = route.params;

  const { usuario } = useAuth();
  const { obterChamadoPorId, atualizarStatus, excluirChamado } = useChamados();

  const [chamado, setChamado] = useState<Chamado | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Modais de ação
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<StatusChamado>('Em Andamento');
  const [statusFeedback, setStatusFeedback] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);

  const carregarDetalhes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await obterChamadoPorId(id);
      setChamado(data);
      setSelectedStatus(data.status);
    } catch (err: any) {
      alert(err.message || 'Chamado não encontrado.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }, [id, obterChamadoPorId, navigation]);

  useEffect(() => {
    carregarDetalhes();
  }, [carregarDetalhes]);

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
        <Text style={styles.loadingText}>Carregando detalhes da ocorrência...</Text>
      </View>
    );
  }

  const isOwner = usuario?.id === chamado.autorId;

  return (
    <View style={styles.container}>
      {/* Top Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.secondary[900]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Protocolo: {chamado.protocolo}
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('EditarChamado', { id: chamado.id })}
          style={styles.editHeaderBtn}
        >
          <Ionicons name="create-outline" size={22} color={colors.primary[700]} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Banner de Imagem da Ocorrência */}
        {chamado.fotoUrl && (
          <View style={styles.imageCard}>
            <Image
              source={{ uri: chamado.fotoUrl }}
              style={styles.mainImage}
              resizeMode="cover"
            />
          </View>
        )}

        {/* Card Principal: Título, Status e Categoria */}
        <View style={[styles.mainCard, shadows.sm]}>
          <View style={styles.badgeRow}>
            <StatusBadge status={chamado.status} />
            <CategoryBadge categoria={chamado.categoria} />
          </View>

          <Text style={styles.title}>{chamado.titulo}</Text>

          <View style={styles.authorRow}>
            <Ionicons name="person-circle" size={20} color={colors.secondary[400]} />
            <Text style={styles.authorName}>
              Registrado por: <Text style={styles.boldText}>{chamado.autorNome}</Text>
            </Text>
          </View>

          <View style={styles.dateRow}>
            <Ionicons name="time-outline" size={16} color={colors.secondary[400]} />
            <Text style={styles.dateText}>Aberto em: {formatDate(chamado.dataAbertura)}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionHeading}>Descrição Detalhada</Text>
          <Text style={styles.descriptionText}>{chamado.descricao}</Text>

          {chamado.feedbackResolucao && (
            <View style={styles.feedbackResolucaoBox}>
              <View style={styles.feedbackTitleRow}>
                <Ionicons name="checkmark-circle" size={18} color={colors.feedback.success} />
                <Text style={styles.feedbackTitle}>Parecer da Zeladoria Urbana</Text>
              </View>
              <Text style={styles.feedbackDescription}>{chamado.feedbackResolucao}</Text>
            </View>
          )}
        </View>

        {/* Card de Localização */}
        <View style={[styles.mainCard, shadows.sm]}>
          <View style={styles.cardHeaderWithIcon}>
            <Ionicons name="location" size={20} color={colors.primary[600]} />
            <Text style={styles.sectionHeading}>Local da Ocorrência</Text>
          </View>

          <Text style={styles.addressStreet}>
            {chamado.localizacao.logradouro}, {chamado.localizacao.numero}
          </Text>
          <Text style={styles.addressSub}>
            Bairro: {chamado.localizacao.bairro} • {chamado.localizacao.cidade} - CEP: {chamado.localizacao.cep}
          </Text>

          {chamado.localizacao.pontoReferencia ? (
            <View style={styles.referenceContainer}>
              <Text style={styles.referenceLabel}>Referência:</Text>
              <Text style={styles.referenceText}>{chamado.localizacao.pontoReferencia}</Text>
            </View>
          ) : null}

          {/* Simulação Visual de Mapa com Coordenadas */}
          <View style={styles.mapSimulationBox}>
            <Ionicons name="map" size={28} color={colors.primary[600]} />
            <View style={styles.mapInfo}>
              <Text style={styles.mapTitle}>Geolocalização Registrada</Text>
              <Text style={styles.mapCoords}>
                Lat: {chamado.localizacao.latitude.toFixed(4)} | Long: {chamado.localizacao.longitude.toFixed(4)}
              </Text>
            </View>
          </View>
        </View>

        {/* Card de Histórico / Linha do Tempo */}
        <View style={[styles.mainCard, shadows.sm]}>
          <View style={styles.cardHeaderWithIcon}>
            <Ionicons name="git-network-outline" size={20} color={colors.secondary[700]} />
            <Text style={styles.sectionHeading}>Histórico de Acompanhamento</Text>
          </View>

          {chamado.historico && chamado.historico.length > 0 ? (
            chamado.historico.map((item, index) => (
              <View key={item.id || index} style={styles.timelineItem}>
                <View style={styles.timelineIndicator}>
                  <View style={styles.timelineDot} />
                  {index < (chamado.historico?.length || 1) - 1 && <View style={styles.timelineLine} />}
                </View>
                <View style={styles.timelineBody}>
                  <View style={styles.timelineStatusRow}>
                    <Text style={styles.timelineStatusTitle}>Novo Status: {item.novoStatus}</Text>
                    <Text style={styles.timelineDate}>{formatDate(item.data)}</Text>
                  </View>
                  <Text style={styles.timelineObs}>{item.observacao}</Text>
                  <Text style={styles.timelineAuthor}>Por: {item.autorNome}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyTimelineText}>Nenhuma movimentação registrada até o momento.</Text>
          )}
        </View>

        {/* Painel de Ações de Negócio do CRUD */}
        <View style={[styles.mainCard, shadows.sm]}>
          <Text style={styles.sectionHeading}>Ações de Negócio</Text>
          <Text style={styles.actionsDescription}>
            Gerencie o ciclo de vida deste chamado de zeladoria urbana:
          </Text>

          <View style={styles.actionsGrid}>
            <Button
              title="Mudar Status"
              variant="primary"
              onPress={() => setStatusModalVisible(true)}
              leftIcon={<Ionicons name="swap-horizontal" size={18} color={colors.surface} />}
              style={styles.actionBtn}
            />

            <Button
              title="Editar Dados"
              variant="outline"
              onPress={() => navigation.navigate('EditarChamado', { id: chamado.id })}
              leftIcon={<Ionicons name="create-outline" size={18} color={colors.primary[600]} />}
              style={styles.actionBtn}
            />
          </View>

          <Button
            title="Excluir Ocorrência"
            variant="danger"
            onPress={() => setDeleteModalVisible(true)}
            leftIcon={<Ionicons name="trash-outline" size={18} color={colors.surface} />}
            style={styles.deleteBtn}
          />
        </View>
      </ScrollView>

      {/* Modal para Alterar Status */}
      <Modal visible={statusModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, shadows.lg]}>
            <Text style={styles.modalTitle}>Alterar Status do Chamado</Text>
            <Text style={styles.modalSub}>
              Simule a resposta da prefeitura ou avanço técnico do reparo:
            </Text>

            <View style={styles.statusOptionsRow}>
              {(['Aberto', 'Em Andamento', 'Resolvido'] as StatusChamado[]).map((st) => {
                const isSelected = selectedStatus === st;
                return (
                  <TouchableOpacity
                    key={st}
                    style={[
                      styles.statusSelectButton,
                      isSelected && styles.statusSelectButtonActive,
                    ]}
                    onPress={() => setSelectedStatus(st)}
                  >
                    <Text
                      style={[
                        styles.statusSelectText,
                        isSelected && styles.statusSelectTextActive,
                      ]}
                    >
                      {st}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TextInput
              style={styles.modalTextInput}
              placeholder="Descreva a observação ou parecer técnico (opcional)..."
              placeholderTextColor={colors.text.tertiary}
              value={statusFeedback}
              onChangeText={setStatusFeedback}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalButtonsRow}>
              <Button
                title="Cancelar"
                variant="ghost"
                onPress={() => setStatusModalVisible(false)}
                style={{ flex: 1 }}
              />
              <Button
                title="Salvar Status"
                variant="primary"
                onPress={handleConfirmStatusChange}
                loading={actionLoading}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <FeedbackModal
        visible={deleteModalVisible}
        type="warning"
        title="Excluir Ocorrência"
        message="Tem certeza que deseja excluir esta ocorrência de zeladoria? Esta ação é irreversível."
        confirmText="Sim, Excluir"
        cancelText="Cancelar"
        confirmLoading={actionLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
      />

      {/* Feedback de Sucesso */}
      <FeedbackModal
        visible={!!feedbackSuccess}
        type="success"
        title="Sucesso"
        message={feedbackSuccess || ''}
        confirmText="OK"
        onConfirm={() => setFeedbackSuccess(null)}
      />
    </View>
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
    fontSize: fontSize.body,
    color: colors.secondary[500],
    marginTop: spacing.md,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.bold,
    color: colors.secondary[900],
    flex: 1,
    marginLeft: spacing.sm,
  },
  editHeaderBtn: {
    padding: 6,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  imageCard: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  mainImage: {
    width: '100%',
    height: 220,
  },
  mainCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
    color: colors.secondary[900],
    lineHeight: 26,
    marginBottom: spacing.sm,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  authorName: {
    fontSize: fontSize.caption,
    color: colors.secondary[600],
  },
  boldText: {
    fontWeight: fontWeight.bold,
    color: colors.secondary[900],
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.sm,
  },
  dateText: {
    fontSize: fontSize.caption,
    color: colors.secondary[500],
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.sm + 2,
  },
  sectionHeading: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.bold,
    color: colors.secondary[900],
    marginBottom: spacing.xs,
  },
  descriptionText: {
    fontSize: fontSize.body,
    color: colors.secondary[700],
    lineHeight: 22,
  },
  feedbackResolucaoBox: {
    marginTop: spacing.md,
    backgroundColor: colors.feedback.successLight,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    borderLeftWidth: 4,
    borderLeftColor: colors.feedback.success,
  },
  feedbackTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  feedbackTitle: {
    fontSize: fontSize.bodySmall,
    fontWeight: fontWeight.bold,
    color: colors.primary[900],
  },
  feedbackDescription: {
    fontSize: fontSize.bodySmall,
    color: colors.secondary[800],
    lineHeight: 18,
  },
  cardHeaderWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.sm,
  },
  addressStreet: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.bold,
    color: colors.secondary[900],
  },
  addressSub: {
    fontSize: fontSize.caption,
    color: colors.secondary[500],
    marginTop: 2,
    marginBottom: spacing.sm,
  },
  referenceContainer: {
    backgroundColor: colors.secondary[50],
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  referenceLabel: {
    fontSize: fontSize.tiny,
    fontWeight: fontWeight.bold,
    color: colors.secondary[600],
  },
  referenceText: {
    fontSize: fontSize.caption,
    color: colors.secondary[800],
    marginTop: 2,
  },
  mapSimulationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[50],
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.primary[200],
    gap: spacing.md,
  },
  mapInfo: {
    flex: 1,
  },
  mapTitle: {
    fontSize: fontSize.bodySmall,
    fontWeight: fontWeight.bold,
    color: colors.primary[900],
  },
  mapCoords: {
    fontSize: fontSize.caption,
    color: colors.secondary[600],
    marginTop: 2,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  timelineIndicator: {
    alignItems: 'center',
    marginRight: spacing.sm,
    width: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary[600],
    marginTop: 4,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
    marginTop: 2,
  },
  timelineBody: {
    flex: 1,
  },
  timelineStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timelineStatusTitle: {
    fontSize: fontSize.bodySmall,
    fontWeight: fontWeight.bold,
    color: colors.secondary[900],
  },
  timelineDate: {
    fontSize: fontSize.tiny,
    color: colors.secondary[400],
  },
  timelineObs: {
    fontSize: fontSize.caption,
    color: colors.secondary[600],
    marginTop: 2,
  },
  timelineAuthor: {
    fontSize: fontSize.tiny,
    color: colors.secondary[400],
    marginTop: 2,
  },
  emptyTimelineText: {
    fontSize: fontSize.caption,
    color: colors.secondary[400],
    fontStyle: 'italic',
  },
  actionsDescription: {
    fontSize: fontSize.caption,
    color: colors.secondary[500],
    marginBottom: spacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  actionBtn: {
    flex: 1,
  },
  deleteBtn: {
    marginTop: spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
  },
  modalTitle: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
    color: colors.secondary[900],
    marginBottom: 4,
  },
  modalSub: {
    fontSize: fontSize.bodySmall,
    color: colors.secondary[500],
    marginBottom: spacing.md,
  },
  statusOptionsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  statusSelectButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  statusSelectButtonActive: {
    backgroundColor: colors.primary[600],
    borderColor: colors.primary[600],
  },
  statusSelectText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    color: colors.secondary[700],
  },
  statusSelectTextActive: {
    color: colors.surface,
    fontWeight: fontWeight.bold,
  },
  modalTextInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    fontSize: fontSize.body,
    color: colors.text.primary,
    minHeight: 70,
    textAlignVertical: 'top',
    marginBottom: spacing.lg,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});

