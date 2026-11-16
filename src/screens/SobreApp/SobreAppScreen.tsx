import { Image, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { TECH_STACK } from '@/config/sobreAppData';
import { APP_VERSION_INFO, GIT_COMMIT_INFO, INTEGRANTES_EQUIPE } from '@/config/version';
import { useFeedback } from '@/contexts/FeedbackContext';
import { useThemedStyles } from '@/contexts/ThemeContext';
import { CommitInfoCard } from '@/screens/SobreApp/components/CommitInfoCard';
import { OdsInfoCard } from '@/screens/SobreApp/components/OdsInfoCard';
import { TeamMembersCard } from '@/screens/SobreApp/components/TeamMembersCard';
import { TechStackCard } from '@/screens/SobreApp/components/TechStackCard';
import { borderRadius, spacing } from '@/theme/spacing';
import { fontSize, fontWeight } from '@/theme/typography';
import type { AppStackNavigationProp } from '@/types/navigation';
import type { AppTheme } from '@/types/theme';
import { shadows } from '@/utils/shadow';

export const SobreAppScreen = () => {
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();
  const { showError } = useFeedback();
  const navigation = useNavigation<AppStackNavigationProp<'SobreApp'>>();

  const handleShareBuild = async () => {
    try {
      await Share.share({
        message: `${APP_VERSION_INFO.appName} v${APP_VERSION_INFO.version} (${APP_VERSION_INFO.buildNumber})\nCommit: ${GIT_COMMIT_INFO.commitHash}\nBranch: ${GIT_COMMIT_INFO.branch}`,
      });
    } catch {
      showError(
        'Erro ao compartilhar',
        'Não foi possível abrir o compartilhamento das informações do build.'
      );
    }
  };

  return (
    <View style={styles.safeArea}>
      <Header
        title="Sobre o Aplicativo"
        showBack
        centerTitle
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: Math.max(insets.bottom, spacing.xl) + spacing.lg,
            paddingLeft: Math.max(insets.left, spacing.md),
            paddingRight: Math.max(insets.right, spacing.md),
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Image
              source={require('../../../assets/logo-mark.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.brandTitle}>{APP_VERSION_INFO.appName}</Text>
          <Text style={styles.tagline}>{APP_VERSION_INFO.tagline}</Text>
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>
              Versão {APP_VERSION_INFO.version} • Build {APP_VERSION_INFO.buildNumber}
            </Text>
          </View>
        </View>

        <CommitInfoCard
          commitInfo={GIT_COMMIT_INFO}
          onShare={() => {
            void handleShareBuild();
          }}
        />

        <TeamMembersCard integrantes={INTEGRANTES_EQUIPE} />

        <OdsInfoCard />

        <TechStackCard items={TECH_STACK} />

        <Text style={styles.copyrightText}>
          FIAP Global Solution 2026/2 • Análise e Desenvolvimento de Sistemas
        </Text>
      </ScrollView>
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.background },
    container: { flex: 1, backgroundColor: theme.background },
    scrollContent: { padding: spacing.md, paddingBottom: spacing.xxxl },
    header: { alignItems: 'center', paddingVertical: spacing.md },
    logoBadge: {
      width: 68,
      height: 68,
      borderRadius: 22,
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.sm + 2,
      ...shadows.md,
    },
    logoImage: { width: 34, height: 52 },
    brandTitle: {
      fontSize: fontSize.heading,
      fontWeight: fontWeight.extrabold,
      color: theme.text,
      letterSpacing: -0.4,
    },
    tagline: {
      fontSize: fontSize.caption,
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: 2,
    },
    versionBadge: {
      marginTop: spacing.sm,
      backgroundColor: theme.primaryLight,
      borderWidth: 1,
      borderColor: theme.primaryBorder,
      paddingHorizontal: spacing.md,
      paddingVertical: 5,
      borderRadius: borderRadius.full,
    },
    versionText: {
      fontSize: fontSize.tiny,
      fontWeight: fontWeight.bold,
      color: theme.primaryDark,
    },
    copyrightText: {
      textAlign: 'center',
      fontSize: fontSize.tiny,
      color: theme.textMuted,
      marginTop: spacing.xs,
    },
  });
