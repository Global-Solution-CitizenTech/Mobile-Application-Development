import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useChamados } from '../hooks/useChamados';
import { useAuth } from '../hooks/useAuth';
import { StatCard } from '../components/StatCard';
import { getPriorityConfig } from '../components/ChamadoCard';
import { CategoryBadge } from '../components/CategoryBadge';
import { colors, borderRadius, spacing, fontSize, fontWeight, shadows } from '../theme';
import { PrioridadeChamado } from '../types';
import { RootStackParamList } from '../navigation/types';

type RadarNavProp = NativeStackNavigationProp<RootStackParamList>;

const PESO_PRIORIDADE: Record<PrioridadeChamado, number> = {
  Crítica: 4,
  Alta: 3,
  Média: 2,
  Baixa: 1,
};

export const RadarBairroScreen: React.FC = () => {
  const navigation = useNavigation<RadarNavProp>();
  const { usuario } = useAuth();
  const { chamados, refreshing, estatisticas, carregarChamados, apoiarChamado } = useChamados();

  useFocusEffect(
    useCallback(() => {
      carregarChamados({ categoria: 'Todas', status: 'Todos', busca: '', apenasMeus: false }, true);
    }, [carregarChamados])
  );

  // Ordena ocorrências não resolvidas por Prioridade IA + número de apoios da comunidade
  const rankingPrioridades = useMemo(() => {
    return [...chamados]
      .filter((c) => c.status !== 'Resolvido')
      .sort((a, b) => {
        const pesoDiff =
          (PESO_PRIORIDADE[b.prioridade] || 1) - (PESO_PRIORIDADE[a.prioridade] || 1);
        if (pesoDiff !== 0) return pesoDiff;
        return (b.apoiosCount || 0) - (a.apoiosCount || 0);
      });
  }, [chamados]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() =>
              carregarChamados(
                { categoria: 'Todas', status: 'Todos', busca: '', apenasMeus: false },
                true
              )
            }
            colors={[colors.primary[600]]}
            tintColor={colors.primary[600]}
          />
        }
      >
        {/* Header da Tela */}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Radar & Prioridades</Text>
          <Text style={styles.pageSubtitle}>
            Termômetro de zeladoria colaborativa • {usuario?.bairro || 'Região Central'}
          </Text>
        </View>

        {/* Card de Eficiência e Resolução do Bairro */}
        <View style={[styles.efficiencyCard, shadows.sm]}>
          <View style={styles.efficiencyTopRow}>
            <View>
              <Text style={styles.efficiencyLabel}>Índice de Resolução do Bairro</Text>
              <Text style={styles.efficiencySub}>
                Acompanhamento transparente das demandas públicas
              </Text>
            </View>
            <View style={styles.percentageBadge}>
              <Text style={styles.percentageText}>{estatisticas.taxaResolucao}%</Text>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.max(8, estatisticas.taxaResolucao)}%` },
              ]}
            />
          </View>

          <View style={styles.statsRow}>
            <StatCard
              label="Total"
              value={estatisticas.total}
              icon="stats-chart-outline"
              color={colors.secondary[700]}
              bgColor={colors.secondary[100]}
            />
            <StatCard
              label="Abertos"
              value={estatisticas.abertos}
              icon="alert-circle-outline"
              color={colors.status.aberto.icon}
              bgColor={colors.status.aberto.bg}
            />
            <StatCard
              label="Em Ação"
              value={estatisticas.emAndamento}
              icon="time-outline"
              color={colors.status.emAndamento.icon}
              bgColor={colors.status.emAndamento.bg}
            />
            <StatCard
              label="Resolvidos"
              value={estatisticas.resolvidos}
              icon="checkmark-done-outline"
              color={colors.status.resolvido.icon}
              bgColor={colors.status.resolvido.bg}
            />
          </View>
        </View>

        {/* Seção de Priorização Colaborativa + IA */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="flame" size={20} color="#DC2626" />
            <Text style={styles.sectionTitle}>Demandas Mais Urgentes</Text>
          </View>
          <Text style={styles.sectionDescription}>
            Priorizadas por Triagem de IA + confirmação dos moradores do bairro. Apoie para acelerar o atendimento:
          </Text>
        </View>

        {rankingPrioridades.map((item, idx) => {
          const prio = getPriorityConfig(item.prioridade);
          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.85}
              style={[styles.priorityCard, shadows.sm]}
              onPress={() => navigation.navigate('ChamadoDetails', { id: item.id })}
            >
              {/* Topo do Card de Ranking */}
              <View style={styles.rankTopRow}>
                <View style={styles.rankPositionBadge}>
                  <Text style={styles.rankPositionText}>#{idx + 1} Prioridade</Text>
                </View>

                <View
                  style={[
                    styles.urgencyPill,
                    { backgroundColor: prio.bg, borderColor: prio.border },
                  ]}
                >
                  <Ionicons name={prio.icon} size={12} color={prio.text} />
                  <Text style={[styles.urgencyPillText, { color: prio.text }]}>
                    Urgência {item.prioridade}
                  </Text>
                </View>
              </View>

              <Text style={styles.itemTitle}>{item.titulo}</Text>

              <View style={styles.metaRow}>
                <CategoryBadge categoria={item.categoria} />
                <Text style={styles.addressText} numberOfLines={1}>
                  {item.localizacao.logradouro}, {item.localizacao.numero}
                </Text>
              </View>

              {/* Resumo da Triagem IA */}
              {item.parecerIa && (
                <View style={styles.aiInsightBox}>
                  <Ionicons name="sparkles" size={14} color={colors.primary[700]} />
                  <Text style={styles.aiInsightText} numberOfLines={2}>
                    {item.parecerIa}
                  </Text>
                </View>
              )}

              {/* Rodapé Interativo: Contador de Apoios + Botão Apoiar */}
              <View style={styles.actionFooter}>
                <View style={styles.supportersInfo}>
                  <Ionicons name="people" size={16} color={colors.secondary[600]} />
                  <Text style={styles.supportersCountText}>
                    <Text style={styles.boldNum}>{item.apoiosCount || 1}</Text> moradores afetados
                  </Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.upvoteButton,
                    item.apoiadoPeloUsuario && styles.upvoteButtonActive,
                  ]}
                  onPress={() => apoiarChamado(item.id)}
                  activeOpacity={0.75}
                >
                  <Ionicons
                    name={item.apoiadoPeloUsuario ? 'checkmark-circle' : 'arrow-up-circle-outline'}
                    size={16}
                    color={item.apoiadoPeloUsuario ? colors.surface : colors.primary[700]}
                  />
                  <Text
                    style={[
                      styles.upvoteButtonText,
                      item.apoiadoPeloUsuario && styles.upvoteButtonTextActive,
                    ]}
                  >
                    {item.apoiadoPeloUsuario ? 'Apoiado' : 'Apoiar (+1)'}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        })}
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
  header: {
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
  efficiencyCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  efficiencyTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  efficiencyLabel: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.bold,
    color: colors.secondary[900],
  },
  efficiencySub: {
    fontSize: fontSize.tiny,
    color: colors.secondary[500],
    marginTop: 2,
  },
  percentageBadge: {
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  percentageText: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.extrabold,
    color: colors.primary[700],
  },
  progressTrack: {
    height: 8,
    backgroundColor: colors.secondary[100],
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary[600],
    borderRadius: borderRadius.full,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.xs + 2,
  },
  sectionHeader: {
    marginBottom: spacing.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
    color: colors.secondary[900],
  },
  sectionDescription: {
    fontSize: fontSize.caption,
    color: colors.secondary[500],
    marginTop: 3,
    lineHeight: 18,
  },
  priorityCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  rankTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs + 2,
  },
  rankPositionBadge: {
    backgroundColor: colors.secondary[900],
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.xs,
  },
  rankPositionText: {
    color: colors.surface,
    fontSize: fontSize.tiny,
    fontWeight: fontWeight.bold,
  },
  urgencyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  urgencyPillText: {
    fontSize: fontSize.tiny,
    fontWeight: fontWeight.bold,
  },
  itemTitle: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.bold,
    color: colors.secondary[900],
    marginBottom: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  addressText: {
    fontSize: fontSize.caption,
    color: colors.secondary[500],
    flex: 1,
  },
  aiInsightBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: colors.primary[50],
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary[600],
    marginBottom: spacing.sm,
  },
  aiInsightText: {
    flex: 1,
    fontSize: fontSize.tiny,
    color: colors.secondary[800],
    lineHeight: 16,
  },
  actionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: spacing.sm,
  },
  supportersInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  supportersCountText: {
    fontSize: fontSize.caption,
    color: colors.secondary[600],
  },
  boldNum: {
    fontWeight: fontWeight.bold,
    color: colors.secondary[900],
  },
  upvoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[50],
    borderWidth: 1,
    borderColor: colors.primary[300],
  },
  upvoteButtonActive: {
    backgroundColor: colors.primary[600],
    borderColor: colors.primary[600],
  },
  upvoteButtonText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    color: colors.primary[700],
  },
  upvoteButtonTextActive: {
    color: colors.surface,
  },
});
