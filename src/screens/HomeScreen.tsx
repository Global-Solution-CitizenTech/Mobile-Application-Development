import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { useChamados } from '../hooks/useChamados';
import { StatCard } from '../components/StatCard';
import { getCategoryIconName } from '../components/CategoryBadge';
import { colors, borderRadius, spacing, fontSize, fontWeight, shadows } from '../theme';
import { CategoriaChamado } from '../types';
import { RootStackParamList } from '../navigation/types';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { usuario } = useAuth();
  const { chamados, loading, refreshing, estatisticas, carregarChamados, setCategoriaFiltro } =
    useChamados();

  useFocusEffect(
    useCallback(() => {
      carregarChamados(
        { categoria: 'Todas', status: 'Todos', busca: '', apenasMeus: false },
        true
      );
    }, [carregarChamados])
  );

  // Total de chamados abertos pelo próprio usuário logado
  const totalMeusChamados = useMemo(
    () => chamados.filter((c) => c.autorId === usuario?.id).length,
    [chamados, usuario?.id]
  );

  // Distribuição de ocorrências por categoria para o painel analítico
  const distribuicaoCategorias = useMemo(() => {
    const mapa: Partial<Record<CategoriaChamado, number>> = {};
    chamados.forEach((c) => {
      mapa[c.categoria] = (mapa[c.categoria] || 0) + 1;
    });

    return Object.entries(mapa)
      .map(([cat, total]) => ({
        categoria: cat as CategoriaChamado,
        total: total as number,
      }))
      .sort((a, b) => b.total - a.total);
  }, [chamados]);

  const handleIrParaDemandasComCategoria = (cat: CategoriaChamado) => {
    setCategoriaFiltro(cat);
    navigation.navigate('Main', { screen: 'RadarTab' });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {loading && !refreshing && chamados.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[600]} />
          <Text style={styles.loadingText}>Carregando painel do cidadão...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
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
          {/* 1. Header do Cidadão */}
          <View style={styles.header}>
            <View style={styles.citizenInfo}>
              <Text style={styles.greetingText}>
                Olá, {usuario?.nome ? usuario.nome.split(' ')[0] : 'Cidadão'}
              </Text>
              <Text style={styles.welcomeSubtitle}>Painel de Zeladoria • São Paulo</Text>
              <View style={styles.neighborhoodBadge}>
                <Ionicons name="location" size={13} color={colors.primary[700]} />
                <Text style={styles.neighborhoodText}>
                  {usuario?.bairro || 'Bela Vista / Região Central'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.profileAvatarBtn}
              onPress={() => navigation.navigate('Main', { screen: 'ProfileTab' })}
              activeOpacity={0.8}
            >
              <Ionicons name="person-circle-outline" size={38} color={colors.primary[600]} />
            </TouchableOpacity>
          </View>

          {/* 2. Card de Eficiência e Índice de Resolução do Bairro */}
          <View style={[styles.efficiencyCard, shadows.sm]}>
            <View style={styles.efficiencyTopRow}>
              <View style={{ flex: 1, paddingRight: spacing.sm }}>
                <Text style={styles.efficiencyLabel}>Índice de Resolução do Bairro</Text>
                <Text style={styles.efficiencySub}>
                  Zeladoria urbana transparente e colaborativa
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
                  { width: `${Math.max(6, Math.min(100, estatisticas.taxaResolucao))}%` },
                ]}
              />
            </View>

            <Text style={styles.efficiencyLegend}>
              {estatisticas.resolvidos} de {estatisticas.total} ocorrências reportadas foram atendidas
              pelas subprefeituras e órgãos públicos.
            </Text>

            {/* Grid com os 4 StatCards */}
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

          {/* 3. Ações Rápidas: Destaque Principal + Atalhos */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Ações Rápidas</Text>

            {/* Card Principal: Relatar Problema Urbano */}
            <TouchableOpacity
              style={[styles.primaryActionCard, shadows.sm]}
              onPress={() => navigation.navigate('NovoChamado')}
              activeOpacity={0.9}
            >
              <View style={styles.actionIconContainer}>
                <Ionicons name="camera" size={26} color={colors.surface} />
              </View>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionCardTitle}>Relatar Nova Ocorrência</Text>
                <Text style={styles.actionCardDesc}>
                  Fotografe buracos, bueiros ou postes apagados. A Triagem IA prioriza o chamado!
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color={colors.primary[600]} />
            </TouchableOpacity>

            {/* Grid com 3 Atalhos Rápidos */}
            <View style={styles.quickGrid}>
              <TouchableOpacity
                style={[styles.quickCard, shadows.sm]}
                onPress={() => navigation.navigate('Main', { screen: 'RadarTab' })}
                activeOpacity={0.8}
              >
                <View style={[styles.quickIconCircle, { backgroundColor: '#FEF2F2' }]}>
                  <Ionicons name="flame" size={20} color="#DC2626" />
                </View>
                <Text style={styles.quickCardTitle}>Prioridades & Demandas</Text>
                <Text style={styles.quickCardSub}>
                  {estatisticas.abertos + estatisticas.emAndamento} ativas no bairro
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.quickCard, shadows.sm]}
                onPress={() => navigation.navigate('Main', { screen: 'MeusChamadosTab' })}
                activeOpacity={0.8}
              >
                <View style={[styles.quickIconCircle, { backgroundColor: colors.primary[50] }]}>
                  <Ionicons name="document-text" size={20} color={colors.primary[700]} />
                </View>
                <Text style={styles.quickCardTitle}>Meus Relatos</Text>
                <Text style={styles.quickCardSub}>{totalMeusChamados} protocolos seus</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.quickCard, shadows.sm]}
                onPress={() => navigation.navigate('SobreApp')}
                activeOpacity={0.8}
              >
                <View style={[styles.quickIconCircle, { backgroundColor: colors.secondary[100] }]}>
                  <Ionicons name="information-circle" size={20} color={colors.secondary[700]} />
                </View>
                <Text style={styles.quickCardTitle}>Sobre o App</Text>
                <Text style={styles.quickCardSub}>Commit & Equipe</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 4. Painel Analítico: Demandas Mais Frequentes por Categoria */}
          <View style={[styles.analyticsCard, shadows.sm]}>
            <View style={styles.analyticsHeader}>
              <View style={styles.rowAlign}>
                <Ionicons name="pie-chart-outline" size={18} color={colors.secondary[800]} />
                <Text style={styles.analyticsTitle}>Distribuição no Bairro</Text>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('Main', { screen: 'RadarTab' })}
                activeOpacity={0.7}
              >
                <Text style={styles.seeAllText}>Ver todas</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.analyticsSubtitle}>
              Toque em uma categoria para filtrar as demandas no mapa/radar:
            </Text>

            <View style={styles.categoriesList}>
              {distribuicaoCategorias.slice(0, 5).map((item) => {
                const percent =
                  estatisticas.total > 0
                    ? Math.round((item.total / estatisticas.total) * 100)
                    : 0;
                const icon = getCategoryIconName(item.categoria);

                return (
                  <TouchableOpacity
                    key={item.categoria}
                    style={styles.categoryItemRow}
                    onPress={() => handleIrParaDemandasComCategoria(item.categoria)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.categoryLeft}>
                      <View style={styles.categoryIconCircle}>
                        <Ionicons name={icon} size={15} color={colors.primary[700]} />
                      </View>
                      <Text style={styles.categoryName} numberOfLines={1}>
                        {item.categoria}
                      </Text>
                    </View>

                    <View style={styles.categoryRight}>
                      <View style={styles.categoryMiniTrack}>
                        <View style={[styles.categoryMiniFill, { width: `${Math.max(10, percent)}%` }]} />
                      </View>
                      <Text style={styles.categoryCountBadge}>{item.total}</Text>
                      <Ionicons name="chevron-forward" size={14} color={colors.secondary[400]} />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* 5. Card Educativo: Como Funciona a Triagem IA do CitizenTech */}
          <View style={[styles.infoCard, shadows.sm]}>
            <View style={styles.infoCardHeader}>
              <Ionicons name="sparkles" size={20} color={colors.primary[600]} />
              <Text style={styles.infoCardTitle}>Triagem Inteligente & Impacto Coletivo</Text>
            </View>
            <Text style={styles.infoCardText}>
              O CitizenTech utiliza inteligência computacional para analisar o risco das fotos e descrições,
              calculando a urgência e despachando diretamente aos órgãos responsáveis (CET, Subprefeitura, Ilumina SP e Sabesp).
            </Text>

            <View style={styles.infoPillRow}>
              <View style={styles.infoPill}>
                <Ionicons name="shield-checkmark-outline" size={14} color={colors.primary[700]} />
                <Text style={styles.infoPillText}>Triagem IA em Tempo Real</Text>
              </View>
              <View style={styles.infoPill}>
                <Ionicons name="people-outline" size={14} color={colors.primary[700]} />
                <Text style={styles.infoPillText}>Priorização Coletiva (+1 Morador)</Text>
              </View>
            </View>
          </View>

          {/* 6. Status Operacional Municipal */}
          <View style={styles.operationalStatusRow}>
            <View style={styles.operationalDot} />
            <Text style={styles.operationalText}>
              Equipes de Zeladoria e Manutenção Viária Ativas Hoje na Região
            </Text>
          </View>
        </ScrollView>
      )}
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
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: fontSize.body,
    color: colors.secondary[500],
    marginTop: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  citizenInfo: {
    flex: 1,
  },
  greetingText: {
    fontSize: fontSize.heading,
    fontWeight: fontWeight.extrabold,
    color: colors.secondary[900],
  },
  welcomeSubtitle: {
    fontSize: fontSize.caption,
    color: colors.secondary[500],
    marginTop: 1,
  },
  neighborhoodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary[50],
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    marginTop: 6,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  neighborhoodText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    color: colors.primary[700],
  },
  profileAvatarBtn: {
    padding: 4,
  },
  efficiencyCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  efficiencyTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  efficiencyLabel: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    color: colors.secondary[900],
  },
  efficiencySub: {
    fontSize: fontSize.caption,
    color: colors.secondary[500],
    marginTop: 2,
  },
  percentageBadge: {
    backgroundColor: colors.primary[50],
    borderWidth: 1,
    borderColor: colors.primary[300],
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: borderRadius.md,
  },
  percentageText: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.extrabold,
    color: colors.primary[700],
  },
  progressTrack: {
    height: 10,
    backgroundColor: colors.secondary[200],
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginVertical: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary[600],
    borderRadius: borderRadius.full,
  },
  efficiencyLegend: {
    fontSize: fontSize.caption,
    color: colors.secondary[600],
    marginBottom: spacing.md,
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.xs + 2,
  },
  sectionContainer: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.bold,
    color: colors.secondary[900],
    marginBottom: spacing.sm,
  },
  primaryActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.primary[300],
    marginBottom: spacing.sm,
  },
  actionIconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm + 4,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionCardTitle: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    color: colors.secondary[900],
  },
  actionCardDesc: {
    fontSize: fontSize.caption,
    color: colors.secondary[600],
    marginTop: 2,
    lineHeight: 16,
  },
  quickGrid: {
    flexDirection: 'row',
    gap: spacing.xs + 2,
  },
  quickCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.sm + 2,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  quickIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  quickCardTitle: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    color: colors.secondary[800],
    textAlign: 'center',
  },
  quickCardSub: {
    fontSize: fontSize.tiny,
    color: colors.secondary[500],
    textAlign: 'center',
    marginTop: 2,
  },
  analyticsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  analyticsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  rowAlign: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  analyticsTitle: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    color: colors.secondary[900],
  },
  seeAllText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    color: colors.primary[600],
  },
  analyticsSubtitle: {
    fontSize: fontSize.caption,
    color: colors.secondary[500],
    marginBottom: spacing.sm,
  },
  categoriesList: {
    gap: spacing.xs + 2,
  },
  categoryItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary[100],
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  categoryIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  categoryName: {
    fontSize: fontSize.bodySmall,
    color: colors.secondary[800],
    fontWeight: fontWeight.medium,
    flex: 1,
  },
  categoryRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryMiniTrack: {
    width: 60,
    height: 6,
    backgroundColor: colors.secondary[200],
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  categoryMiniFill: {
    height: '100%',
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.full,
  },
  categoryCountBadge: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    color: colors.secondary[700],
    minWidth: 18,
    textAlign: 'right',
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.xs,
  },
  infoCardTitle: {
    fontSize: fontSize.bodySmall,
    fontWeight: fontWeight.bold,
    color: colors.secondary[900],
  },
  infoCardText: {
    fontSize: fontSize.caption,
    color: colors.secondary[600],
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  infoPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  infoPillText: {
    fontSize: fontSize.tiny,
    color: colors.primary[700],
    fontWeight: fontWeight.semibold,
  },
  operationalStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: spacing.sm,
    justifyContent: 'center',
  },
  operationalDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16A34A',
  },
  operationalText: {
    fontSize: fontSize.tiny,
    color: colors.secondary[600],
    fontWeight: fontWeight.medium,
  },
});
