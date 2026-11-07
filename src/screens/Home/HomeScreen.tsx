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
import { useAuth } from '../../hooks/useAuth';
import { useChamados } from '../../hooks/useChamados';
import { HomePanoramaCard } from './components/HomePanoramaCard';
import { HomeCategoryList } from './components/HomeCategoryList';
import { HomeAiInfoCard } from './components/HomeAiInfoCard';
import { colors, borderRadius, spacing, fontSize, fontWeight, shadows } from '../../theme';
import { CategoriaChamado } from '../../types';
import { RootStackParamList } from '../../navigation/types';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { usuario } = useAuth();
  const {
    chamados,
    loading,
    refreshing,
    estatisticas,
    carregarChamados,
    setCategoriaFiltro,
  } = useChamados();

  useFocusEffect(
    useCallback(() => {
      carregarChamados(
        { categoria: 'Todas', status: 'Todos', busca: '', apenasMeus: false },
        true
      );
    }, [carregarChamados])
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
          {/* 1. Header do Cidadão (Limpo, sem botões redundantes com a Navbar) */}
          <View style={styles.header}>
            <View style={styles.citizenInfo}>
              <Text style={styles.greetingText}>
                Olá, {usuario?.nome ? usuario.nome.split(' ')[0] : 'Cidadão'}
              </Text>
              <Text style={styles.welcomeSubtitle}>Painel de Zeladoria • São Paulo</Text>
            </View>

            <View style={styles.neighborhoodBadge}>
              <Ionicons name="location" size={13} color={colors.primary[700]} />
              <Text style={styles.neighborhoodText}>
                {usuario?.bairro ? usuario.bairro.split('/')[0].trim() : 'Bela Vista'}
              </Text>
            </View>
          </View>

          {/* 2. Card de Eficiência e Índice de Resolução do Bairro + 4 StatCards */}
          <HomePanoramaCard estatisticas={estatisticas} />

          {/* 3. Ação Principal: Relatar Nova Ocorrência (Sem os 3 botões que duplicavam a Navbar) */}
          <TouchableOpacity
            style={[styles.primaryActionCard, shadows.sm]}
            onPress={() => navigation.navigate('NovoChamado')}
            activeOpacity={0.9}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="camera" size={24} color={colors.surface} />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionCardTitle}>Relatar Nova Ocorrência</Text>
              <Text style={styles.actionCardDesc}>
                Fotografe buracos, bueiros ou postes apagados. A Triagem IA prioriza o chamado!
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.primary[600]} />
          </TouchableOpacity>

          {/* 4. Painel Analítico: Distribuição no Bairro por Categoria */}
          <HomeCategoryList
            distribuicaoCategorias={distribuicaoCategorias}
            totalChamados={estatisticas.total}
            onSelectCategory={handleIrParaDemandasComCategoria}
            onExploreAll={() => {
              setCategoriaFiltro('Todas');
              navigation.navigate('Main', { screen: 'RadarTab' });
            }}
          />

          {/* 5. Card Educativo: Triagem IA & Impacto Coletivo + Status Operacional */}
          <HomeAiInfoCard />
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
    fontSize: fontSize.bodySmall,
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
    marginRight: spacing.sm,
  },
  greetingText: {
    fontSize: fontSize.heading,
    fontWeight: fontWeight.extrabold,
    color: colors.secondary[900],
    letterSpacing: -0.3,
  },
  welcomeSubtitle: {
    fontSize: fontSize.caption,
    color: colors.secondary[500],
    marginTop: 2,
  },
  neighborhoodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primary[100],
  },
  neighborhoodText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    color: colors.primary[700],
  },
  primaryActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.primary[300],
    marginBottom: spacing.md,
  },
  actionIconContainer: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm + 4,
  },
  actionTextContainer: {
    flex: 1,
    marginRight: spacing.xs,
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
    lineHeight: 17,
  },
});
