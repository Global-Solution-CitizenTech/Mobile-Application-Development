import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AppTheme, useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { Header } from '@/components/Header';
import { TeamMembersCard } from './components/TeamMembersCard';
import { APP_VERSION_INFO, GIT_COMMIT_INFO, INTEGRANTES_EQUIPE } from '@/config/version';
import { borderRadius, spacing, fontSize, fontWeight, shadows } from '@/theme';

const TECH_STACK = [
  'React Native + Expo SDK 58',
  'TypeScript Strict',
  'TanStack React Query v5',
  'Zod v4 Schema Validation',
  'React Navigation v7',
  'Axios + JWT Interceptors',
  'Expo SecureStore + Network',
  'API Java Spring Boot (Azure)',
  'Triagem IA + Priorização',
];

export const SobreAppScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const navigation = useNavigation();

  const handleShareBuild = () => {
    void Share.share({
      message: `${APP_VERSION_INFO.appName} v${APP_VERSION_INFO.version} (${APP_VERSION_INFO.buildNumber})\nCommit: ${GIT_COMMIT_INFO.commitHash}\nBranch: ${GIT_COMMIT_INFO.branch}`,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header
        title="Sobre o Aplicativo"
        showBack
        centerTitle
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Ionicons name="leaf" size={36} color={theme.inverseText} />
          </View>
          <Text style={styles.brandTitle}>{APP_VERSION_INFO.appName}</Text>
          <Text style={styles.tagline}>{APP_VERSION_INFO.tagline}</Text>
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>
              Versão {APP_VERSION_INFO.version} • Build {APP_VERSION_INFO.buildNumber}
            </Text>
          </View>
        </View>

        <View style={[styles.commitCard, shadows.md]}>
          <View style={styles.commitHeaderRow}>
            <View style={styles.commitIconContainer}>
              <Ionicons name="git-commit-outline" size={22} color={theme.primary} />
            </View>
            <View style={styles.flexOne}>
              <Text style={styles.commitTitle}>Commit Hash de Referência</Text>
              <Text style={styles.commitSubtitle}>
                Extraído dinamicamente do Git no build (FIAP GS 2026/2)
              </Text>
            </View>
          </View>

          <View style={styles.hashBox}>
            <View style={styles.hashRow}>
              <Text style={styles.hashLabel}>HASH COMPLETO:</Text>
              <TouchableOpacity onPress={handleShareBuild} style={styles.shareBtn} activeOpacity={0.7}>
                <Ionicons name="share-social-outline" size={15} color={theme.primaryDark} />
                <Text style={styles.shareBtnText}>Compartilhar</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.hashValue} selectable>
              {GIT_COMMIT_INFO.commitHash}
            </Text>

            <View style={styles.shortHashRow}>
              <Text style={styles.shortHashLabel}>ID Curto:</Text>
              <View style={styles.shortHashBadge}>
                <Text style={styles.shortHashValue} selectable>
                  {GIT_COMMIT_INFO.shortCommitHash}
                </Text>
              </View>
              <Text style={styles.branchText}>Branch: {GIT_COMMIT_INFO.branch}</Text>
            </View>
          </View>
        </View>

        <TeamMembersCard integrantes={INTEGRANTES_EQUIPE} />

        <View style={[styles.card, shadows.sm]}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="globe-outline" size={20} color={theme.primary} />
            <Text style={styles.sectionTitle}>Alinhamento com a ODS 11 - ONU</Text>
          </View>
          <Text style={styles.odsTitle}>Cidades e Comunidades Sustentáveis</Text>
          <Text style={styles.odsText}>
            O ZelaFix democratiza a zeladoria urbana permitindo que qualquer cidadão identifique,
            priorize colaborativamente e acompanhe problemas em espaços públicos, acelerando a
            resposta do poder público.
          </Text>
        </View>

        <View style={[styles.card, shadows.sm]}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="layers-outline" size={20} color={theme.text} />
            <Text style={styles.sectionTitle}>Stack Tecnológico & Arquitetura</Text>
          </View>

          <View style={styles.techPillGrid}>
            {TECH_STACK.map((tech) => (
              <View key={tech} style={styles.techPill}>
                <Ionicons name="checkmark" size={12} color={theme.primaryDark} />
                <Text style={styles.techPillText}>{tech}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.copyrightText}>
          FIAP Global Solution 2026/2 • Análise e Desenvolvimento de Sistemas
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.background },
    container: { flex: 1, backgroundColor: theme.background },
    scrollContent: { padding: spacing.md, paddingBottom: spacing.xxxl },
    flexOne: { flex: 1 },
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
    brandTitle: {
      fontSize: fontSize.heading,
      fontWeight: fontWeight.extrabold,
      color: theme.text,
      letterSpacing: -0.4,
    },
    tagline: { fontSize: fontSize.caption, color: theme.textSecondary, textAlign: 'center', marginTop: 2 },
    versionBadge: {
      marginTop: spacing.sm,
      backgroundColor: theme.primaryLight,
      borderWidth: 1,
      borderColor: theme.primaryBorder,
      paddingHorizontal: spacing.md,
      paddingVertical: 5,
      borderRadius: borderRadius.full,
    },
    versionText: { fontSize: fontSize.tiny, fontWeight: fontWeight.bold, color: theme.primaryDark },
    commitCard: {
      backgroundColor: theme.card,
      borderRadius: borderRadius.lg,
      padding: spacing.md + 2,
      borderWidth: 1,
      borderColor: theme.primaryBorder,
      marginBottom: spacing.md,
    },
    commitHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm + 2,
      marginBottom: spacing.sm + 2,
    },
    commitIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: theme.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    commitTitle: { fontSize: fontSize.body, fontWeight: fontWeight.bold, color: theme.text },
    commitSubtitle: { fontSize: fontSize.tiny, color: theme.textSecondary, marginTop: 1 },
    hashBox: {
      backgroundColor: theme.cardSubtle,
      borderRadius: borderRadius.md,
      padding: spacing.sm + 4,
      borderWidth: 1,
      borderColor: theme.border,
    },
    hashRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    hashLabel: { fontSize: 10, fontWeight: fontWeight.bold, color: theme.textMuted, letterSpacing: 0.6 },
    shareBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    shareBtnText: { fontSize: fontSize.tiny, fontWeight: fontWeight.bold, color: theme.primaryDark },
    hashValue: { fontSize: fontSize.tiny, color: theme.text, fontWeight: fontWeight.medium, marginBottom: spacing.sm },
    shortHashRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
    shortHashLabel: { fontSize: fontSize.tiny, color: theme.textSecondary },
    shortHashBadge: {
      backgroundColor: theme.primaryLight,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: borderRadius.sm,
    },
    shortHashValue: { fontSize: fontSize.tiny, fontWeight: fontWeight.bold, color: theme.primaryDark },
    branchText: { fontSize: fontSize.tiny, color: theme.textMuted },
    card: {
      backgroundColor: theme.card,
      borderRadius: borderRadius.lg,
      padding: spacing.md + 2,
      borderWidth: 1,
      borderColor: theme.cardBorder,
      marginBottom: spacing.md,
    },
    sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: spacing.xs + 2 },
    sectionTitle: { fontSize: fontSize.bodyLarge, fontWeight: fontWeight.bold, color: theme.text },
    odsTitle: { fontSize: fontSize.body, fontWeight: fontWeight.bold, color: theme.primaryDark, marginBottom: 4 },
    odsText: { fontSize: fontSize.caption, color: theme.textSecondary, lineHeight: 19 },
    techPillGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: spacing.xs },
    techPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      backgroundColor: theme.primaryLight,
      borderWidth: 1,
      borderColor: theme.primaryBorder,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: borderRadius.full,
    },
    techPillText: { fontSize: fontSize.tiny, fontWeight: fontWeight.semibold, color: theme.primaryDark },
    copyrightText: { textAlign: 'center', fontSize: fontSize.tiny, color: theme.textMuted, marginTop: spacing.xs },
  });
