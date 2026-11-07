import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { APP_VERSION_INFO, GIT_COMMIT_INFO, INTEGRANTES_EQUIPE } from '../../config/version';
import { colors, borderRadius, spacing, fontSize, fontWeight, shadows } from '../../theme';

// Re-exportados para retrocompatibilidade
export const COMMIT_HASH_REFERENCIA = GIT_COMMIT_INFO.commitHash;
export const COMMIT_HASH_CURTO = GIT_COMMIT_INFO.shortCommitHash;
export const APP_VERSAO = APP_VERSION_INFO.version;

export const SobreAppScreen: React.FC = () => {
  const navigation = useNavigation();
  const [copied, setCopied] = useState(false);

  const handleCopyHash = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.secondary[900]} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Sobre o Aplicativo</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Ionicons name="leaf" size={36} color={colors.surface} />
          </View>
          <Text style={styles.brandTitle}>{APP_VERSION_INFO.appName}</Text>
          <Text style={styles.tagline}>{APP_VERSION_INFO.tagline}</Text>
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>
              Versão {APP_VERSION_INFO.version} • Build {APP_VERSION_INFO.buildNumber}
            </Text>
          </View>
        </View>

        {/* EXIGÊNCIA OBRIGATÓRIA DO EDITAL: COMMIT HASH DE REFERÊNCIA DINÂMICO */}
        <View style={[styles.commitCard, shadows.md]}>
          <View style={styles.commitHeaderRow}>
            <View style={styles.commitIconContainer}>
              <Ionicons name="git-commit-outline" size={22} color={colors.primary[600]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.commitTitle}>Commit Hash de Referência</Text>
              <Text style={styles.commitSubtitle}>
                Extraído dinamicamente do Git via app.config.js (FIAP GS 2026/2)
              </Text>
            </View>
          </View>

          <View style={styles.hashBox}>
            <View style={styles.hashRow}>
              <Text style={styles.hashLabel}>HASH COMPLETO:</Text>
              <TouchableOpacity onPress={handleCopyHash} style={styles.copyBtn}>
                <Ionicons
                  name={copied ? 'checkmark-circle' : 'copy-outline'}
                  size={16}
                  color={copied ? colors.feedback.success : colors.primary[700]}
                />
                <Text style={styles.copyBtnText}>{copied ? 'Copiado!' : 'Copiar'}</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.hashValue} selectable>
              {GIT_COMMIT_INFO.commitHash}
            </Text>

            <View style={styles.shortHashRow}>
              <Text style={styles.shortHashLabel}>ID Curto de Tag:</Text>
              <View style={styles.shortHashBadge}>
                <Text style={styles.shortHashValue}>{GIT_COMMIT_INFO.shortCommitHash}</Text>
              </View>
              <Text style={styles.branchText}>Branch: {GIT_COMMIT_INFO.branch}</Text>
            </View>
          </View>
        </View>

        {/* INTEGRANTES DO GRUPO */}
        <View style={[styles.card, shadows.sm]}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="people-outline" size={20} color={colors.secondary[800]} />
            <Text style={styles.sectionTitle}>Integrantes do Grupo (FIAP)</Text>
          </View>
          <Text style={styles.sectionDescription}>
            Equipe de Engenharia e Desenvolvimento ZelaFix:
          </Text>

          {INTEGRANTES_EQUIPE.map((integrante, index) => (
            <View key={integrante.rm || index} style={styles.memberItem}>
              <View style={styles.memberAvatar}>
                <Text style={styles.memberInitials}>
                  {integrante.nome
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')}
                </Text>
              </View>
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{integrante.nome}</Text>
                <Text style={styles.memberRM}>
                  RM: {integrante.rm} • Turma: {integrante.turma || '2TDSPG'}
                </Text>
                <Text style={styles.memberRole}>{integrante.funcao}</Text>

                <View style={styles.socialRow}>
                  {integrante.github && (
                    <TouchableOpacity
                      style={styles.socialButton}
                      onPress={() => Linking.openURL(integrante.github!)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="logo-github" size={14} color={colors.secondary[800]} />
                      <Text style={styles.socialButtonText}>GitHub</Text>
                    </TouchableOpacity>
                  )}
                  {integrante.linkedin && (
                    <TouchableOpacity
                      style={styles.socialButton}
                      onPress={() => Linking.openURL(integrante.linkedin!)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="logo-linkedin" size={14} color="#0A66C2" />
                      <Text style={styles.socialButtonText}>LinkedIn</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* OBJETIVO DE DESENVOLVIMENTO SUSTENTÁVEL (ODS 11) */}
        <View style={[styles.card, shadows.sm]}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="globe-outline" size={20} color={colors.primary[600]} />
            <Text style={styles.sectionTitle}>Alinhamento com a ODS 11 - ONU</Text>
          </View>
          <Text style={styles.odsTitle}>Cidades e Comunidades Sustentáveis</Text>
          <Text style={styles.odsText}>
            O ZelaFix democratiza a zeladoria urbana permitindo que qualquer cidadão identifique,
            priorize colaborativamente e acompanhe problemas em espaços públicos (buracos, bueiros
            entupidos, iluminação precária e descarte irregular), acelerando a resposta do poder público.
          </Text>
        </View>

        {/* ARQUITETURA TÉCNICA E TECNOLOGIAS */}
        <View style={[styles.card, shadows.sm]}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="layers-outline" size={20} color={colors.secondary[800]} />
            <Text style={styles.sectionTitle}>Stack Tecnológico & Arquitetura</Text>
          </View>

          <View style={styles.techPillGrid}>
            {[
              'React Native + Expo SDK 54',
              'TypeScript Strict',
              'TanStack React Query v5',
              'Zod v4 Schema Validation',
              'React Navigation v7',
              'Axios + JWT Interceptors',
              'Pronto para Java Spring Boot',
              'Triagem IA + Priorização',
              'Clean Architecture',
            ].map((tech) => (
              <View key={tech} style={styles.techPill}>
                <Ionicons name="checkmark" size={12} color={colors.primary[700]} />
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 4,
  },
  topBarTitle: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.bold,
    color: colors.secondary[900],
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
    alignItems: 'center',
    marginBottom: spacing.lg,
    marginTop: spacing.xs,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    ...shadows.md,
  },
  brandTitle: {
    fontSize: fontSize.heading,
    fontWeight: fontWeight.extrabold,
    color: colors.secondary[900],
    letterSpacing: -0.3,
  },
  tagline: {
    fontSize: fontSize.caption,
    color: colors.secondary[500],
    textAlign: 'center',
    marginTop: 2,
  },
  versionBadge: {
    marginTop: spacing.xs + 2,
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  versionText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    color: colors.primary[700],
  },
  commitCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.primary[500],
    marginBottom: spacing.md,
  },
  commitHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  commitIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  commitTitle: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.bold,
    color: colors.secondary[900],
  },
  commitSubtitle: {
    fontSize: fontSize.caption,
    color: colors.secondary[500],
  },
  hashBox: {
    backgroundColor: colors.secondary[100],
    padding: spacing.sm + 2,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  hashRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  hashLabel: {
    fontSize: fontSize.tiny,
    fontWeight: fontWeight.bold,
    color: colors.secondary[600],
    letterSpacing: 0.5,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  copyBtnText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    color: colors.primary[700],
  },
  hashValue: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.medium,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: colors.secondary[900],
    marginBottom: spacing.xs,
  },
  shortHashRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 6,
  },
  shortHashLabel: {
    fontSize: fontSize.caption,
    color: colors.secondary[600],
  },
  shortHashBadge: {
    backgroundColor: colors.primary[600],
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
  },
  shortHashValue: {
    color: colors.surface,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  branchText: {
    fontSize: fontSize.tiny,
    color: colors.secondary[500],
    marginLeft: 'auto',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.bold,
    color: colors.secondary[900],
  },
  sectionDescription: {
    fontSize: fontSize.caption,
    color: colors.secondary[500],
    marginBottom: spacing.sm,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  memberAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary[50],
    borderWidth: 1,
    borderColor: colors.primary[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberInitials: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.bold,
    color: colors.primary[700],
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    color: colors.secondary[900],
  },
  memberRM: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    color: colors.primary[700],
  },
  memberRole: {
    fontSize: fontSize.caption,
    color: colors.secondary[500],
    marginTop: 1,
  },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: 6,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.secondary[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.xs,
  },
  socialButtonText: {
    fontSize: fontSize.tiny,
    fontWeight: fontWeight.semibold,
    color: colors.secondary[800],
  },
  odsTitle: {
    fontSize: fontSize.bodySmall,
    fontWeight: fontWeight.bold,
    color: colors.primary[700],
    marginBottom: 4,
  },
  odsText: {
    fontSize: fontSize.caption,
    color: colors.secondary[700],
    lineHeight: 18,
  },
  techPillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  techPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.secondary[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  techPillText: {
    fontSize: fontSize.caption,
    color: colors.secondary[800],
    fontWeight: fontWeight.medium,
  },
  copyrightText: {
    fontSize: fontSize.tiny,
    color: colors.secondary[400],
    textAlign: 'center',
    marginVertical: spacing.md,
  },
});
