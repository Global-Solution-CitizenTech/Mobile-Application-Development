import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChamadoCard } from '@/components/ChamadoCard';
import { EmptyState } from '@/components/EmptyState';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { useHomeData } from '@/hooks/useHomeData';
import { HomeAiPromoCard } from '@/screens/Home/components/HomeAiPromoCard';
import { HomeCategoryList } from '@/screens/Home/components/HomeCategoryList';
import { HomeHeroHeader } from '@/screens/Home/components/HomeHeroHeader';
import { HomePanoramaCard } from '@/screens/Home/components/HomePanoramaCard';
import { borderRadius, spacing } from '@/theme/spacing';
import { fontSize, fontWeight } from '@/theme/typography';
import type { HomeTabNavigationProp } from '@/types/navigation';
import type { AppTheme } from '@/types/theme';

export const HomeScreen = () => {
  const navigation = useNavigation<HomeTabNavigationProp>();
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();

  const home = useHomeData();
  const hasAnyContent = Boolean(home.estatisticas) || home.chamadosRecentes.length > 0;
  const allInitialFailed =
    !home.isLoading && !hasAnyContent && Boolean(home.statsError) && Boolean(home.recentError);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: Math.max(insets.top, spacing.md) + spacing.xs,
          paddingLeft: Math.max(insets.left, spacing.md),
          paddingRight: Math.max(insets.right, spacing.md),
          paddingBottom: spacing.xxl,
        },
      ]}
      refreshControl={
        <RefreshControl
          refreshing={home.isRefreshing}
          onRefresh={() => {
            void home.onRefresh();
          }}
          tintColor={theme.primary}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      <HomeHeroHeader
        usuario={home.usuario}
        onPressProfile={() => navigation.navigate('ProfileTab')}
        onPressRadar={() => navigation.navigate('RadarBairroTab')}
      />

      {home.isLoading && !hasAnyContent ? (
        <LoadingSpinner message="Carregando ocorrências recentes..." />
      ) : allInitialFailed ? (
        <EmptyState
          icon="cloud-offline-outline"
          title="Falha ao carregar dados"
          description={home.statsError ?? home.recentError ?? 'Não foi possível carregar os dados.'}
          actionTitle="Tentar Novamente"
          onAction={() => {
            void home.onRefresh();
          }}
        />
      ) : (
        <>
          {home.estatisticas ? (
            <HomePanoramaCard
              estatisticas={home.estatisticas}
              taxaResolucao={home.taxaResolucao}
            />
          ) : home.statsError ? (
            <EmptyState
              icon="cloud-offline-outline"
              title="Panorama indisponível"
              description={home.statsError}
              actionTitle="Tentar Novamente"
              onAction={() => {
                void home.onRefresh();
              }}
            />
          ) : null}

          <HomeCategoryList
            categorias={home.categorias}
            onSelectCategoria={(categoria) => navigation.navigate('RadarBairroTab', { categoria })}
          />

          <HomeAiPromoCard onPress={() => navigation.navigate('ZelaBotTab')} />

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ocorrências Mais Recentes</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('RadarBairroTab')}
              activeOpacity={0.75}
              hitSlop={8}
            >
              <Text style={styles.seeAll}>Abrir Radar</Text>
            </TouchableOpacity>
          </View>

          {home.isLoadingRecent && home.chamadosRecentes.length === 0 ? (
            <LoadingSpinner message="Carregando ocorrências recentes..." />
          ) : home.recentError && home.chamadosRecentes.length === 0 ? (
            <EmptyState
              icon="cloud-offline-outline"
              title="Falha ao carregar ocorrências"
              description={home.recentError}
              actionTitle="Tentar Novamente"
              onAction={() => {
                void home.onRefresh();
              }}
            />
          ) : home.chamadosRecentes.length === 0 ? (
            <EmptyState
              icon="megaphone-outline"
              title="Nenhuma ocorrência registrada"
              description="Acesse o Radar da Cidade para registrar a primeira melhoria urbana do seu bairro."
              actionTitle="Ir para o Radar"
              onAction={() => navigation.navigate('RadarBairroTab')}
            />
          ) : (
            <View style={styles.list}>
              {home.recentError ? (
                <TouchableOpacity
                  style={styles.refreshNotice}
                  onPress={() => {
                    void home.onRefresh();
                  }}
                  activeOpacity={0.8}
                >
                  <Ionicons name="alert-circle-outline" size={16} color={theme.warning} />
                  <Text style={styles.refreshNoticeText}>
                    Não foi possível atualizar a lista ({home.recentError}). Toque para tentar novamente.
                  </Text>
                </TouchableOpacity>
              ) : null}

              {home.chamadosRecentes.map((chamado) => (
                <ChamadoCard
                  key={chamado.idChamado}
                  chamado={chamado}
                  onPress={() => navigation.navigate('ChamadoDetails', { id: chamado.idChamado })}
                  onApoiar={() => home.apoiarChamado(chamado.idChamado)}
                  isSupporting={home.isSupportingId(chamado.idChamado)}
                />
              ))}
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    content: { gap: spacing.lg - 4 },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: spacing.xs,
    },
    sectionTitle: { fontSize: fontSize.subtitle, fontWeight: fontWeight.bold, color: theme.text },
    seeAll: { fontSize: fontSize.bodySmall, fontWeight: fontWeight.bold, color: theme.primary },
    list: { gap: spacing.md },
    refreshNotice: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs + 2,
      padding: spacing.sm + 2,
      borderRadius: borderRadius.md,
      backgroundColor: theme.warningBg,
      borderWidth: 1,
      borderColor: theme.warningBorder,
    },
    refreshNoticeText: {
      flex: 1,
      fontSize: fontSize.caption,
      color: theme.text,
      fontWeight: fontWeight.medium,
    },
  });
