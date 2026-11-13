import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChamadoCard } from '@/components/ChamadoCard';
import { EmptyState } from '@/components/EmptyState';
import { FeedbackModal } from '@/components/FeedbackModal';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { useHomeData } from '@/hooks/useHomeData';
import type { HomeTabNavigationProp } from '@/navigation/types';
import { HomeCategoryList } from '@/screens/Home/components/HomeCategoryList';
import { HomePanoramaCard } from '@/screens/Home/components/HomePanoramaCard';
import { borderRadius, fontSize, fontWeight, shadows, spacing } from '@/theme';
import type { AppTheme } from '@/theme/types';
import { getFirstName } from '@/utils/formatters';

export const HomeScreen = () => {
  const navigation = useNavigation<HomeTabNavigationProp>();
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();

  const {
    usuario,
    estatisticas,
    taxaResolucao,
    chamadosRecentes,
    categorias,
    isLoading,
    isRefreshing,
    error,
    onRefresh,
    apoiarChamado,
    supportError,
    clearSupportError,
  } = useHomeData();

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
          refreshing={isRefreshing}
          onRefresh={() => {
            void onRefresh();
          }}
          tintColor={theme.primary}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.heroHeader}>
        <View style={styles.greetingBox}>
          <Text style={styles.greeting}>Olá, {getFirstName(usuario?.nome)}!</Text>
          <Text style={styles.subtitle}>
            {usuario?.endereco?.bairro
              ? `${usuario.endereco.bairro}, ${usuario.endereco.cidade}`
              : 'Zeladoria urbana colaborativa'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.radarPill}
          onPress={() => navigation.navigate('RadarBairroTab')}
          activeOpacity={0.85}
        >
          <Ionicons name="compass-outline" size={16} color={theme.primary} />
          <Text style={styles.radarPillText}>Radar</Text>
        </TouchableOpacity>
      </View>

      {isLoading && !estatisticas ? (
        <LoadingSpinner message="Carregando ocorrências recentes..." />
      ) : error && !estatisticas ? (
        <EmptyState
          icon="cloud-offline-outline"
          title="Falha ao carregar dados"
          description={error}
          actionTitle="Tentar Novamente"
          onAction={() => {
            void onRefresh();
          }}
        />
      ) : (
        <>
          {estatisticas ? <HomePanoramaCard estatisticas={estatisticas} taxaResolucao={taxaResolucao} /> : null}

          <HomeCategoryList
            categorias={categorias}
            onSelectCategoria={(categoria) => navigation.navigate('RadarBairroTab', { categoria })}
          />

          <TouchableOpacity
            style={styles.aiCard}
            onPress={() => navigation.navigate('ZelaBotTab')}
            activeOpacity={0.85}
          >
            <View style={styles.aiIconBox}>
              <Ionicons name="sparkles" size={22} color={theme.primary} />
            </View>
            <View style={styles.aiBody}>
              <Text style={styles.aiTitle}>ZelaBot IA • Assistente Cívico</Text>
              <Text style={styles.aiSubtitle}>Tire dúvidas sobre prazos, órgãos e decretos de zeladoria</Text>
            </View>
            <Ionicons name="arrow-forward" size={18} color={theme.primary} />
          </TouchableOpacity>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ocorrências Mais Recentes</Text>
            <TouchableOpacity onPress={() => navigation.navigate('RadarBairroTab')}>
              <Text style={styles.seeAll}>Abrir Radar</Text>
            </TouchableOpacity>
          </View>

          {chamadosRecentes.length === 0 ? (
            <EmptyState
              icon="megaphone-outline"
              title="Nenhuma ocorrência registrada"
              description="Acesse o Radar da Cidade para registrar a primeira melhoria urbana do seu bairro."
              actionTitle="Ir para o Radar"
              onAction={() => navigation.navigate('RadarBairroTab')}
            />
          ) : (
            <View style={styles.list}>
              {chamadosRecentes.map((chamado) => (
                <ChamadoCard
                  key={chamado.idChamado}
                  chamado={chamado}
                  onPress={() => navigation.navigate('ChamadoDetails', { id: chamado.idChamado })}
                  onApoiar={() => apoiarChamado(chamado.idChamado)}
                />
              ))}
            </View>
          )}
        </>
      )}

      <FeedbackModal
        visible={Boolean(supportError)}
        type="error"
        title="Não foi possível apoiar"
        message={supportError ?? ''}
        onConfirm={clearSupportError}
      />
    </ScrollView>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    content: { gap: spacing.md },
    heroHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
    greetingBox: { flex: 1 },
    greeting: { fontSize: fontSize.heading, fontWeight: fontWeight.extrabold, color: theme.text },
    subtitle: { fontSize: fontSize.bodySmall, color: theme.textSecondary, marginTop: 2 },
    radarPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: theme.primaryLight,
      borderWidth: 1,
      borderColor: theme.primaryBorder,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.full,
    },
    radarPillText: { fontSize: fontSize.bodySmall, fontWeight: fontWeight.bold, color: theme.primaryDark },
    aiCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm + 4,
      backgroundColor: theme.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: theme.border,
      ...shadows.sm,
    },
    aiIconBox: {
      width: 44,
      height: 44,
      borderRadius: borderRadius.md,
      backgroundColor: theme.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    aiBody: { flex: 1 },
    aiTitle: { fontSize: fontSize.body, fontWeight: fontWeight.bold, color: theme.text },
    aiSubtitle: { fontSize: fontSize.caption, color: theme.textSecondary, marginTop: 2 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.xs },
    sectionTitle: { fontSize: fontSize.subtitle, fontWeight: fontWeight.bold, color: theme.text },
    seeAll: { fontSize: fontSize.bodySmall, fontWeight: fontWeight.bold, color: theme.primary },
    list: { gap: spacing.sm + 4 },
  });
