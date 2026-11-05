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
import { INTEGRANTES_GRUPO } from '../services/mockData';
import { colors, borderRadius, spacing, fontSize, fontWeight, shadows } from '../theme';

// Commit Hash de Referência conforme edital da FIAP Global Solution 2026/2
export const COMMIT_HASH_REFERENCIA =
  process.env.EXPO_PUBLIC_COMMIT_HASH || '729434d68e5235659de3031780d95b7c6cb7fdbf';
export const COMMIT_HASH_CURTO = COMMIT_HASH_REFERENCIA.slice(0, 7);
export const APP_VERSAO = '1.0.0';

export const SobreAppScreen: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyHash = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header com Identidade Visual do Projeto */}
      <View style={styles.header}>
        <View style={styles.logoBadge}>
          <Ionicons name="leaf" size={36} color={colors.surface} />
        </View>
        <Text style={styles.brandTitle}>CitizenTech</Text>
        <Text style={styles.tagline}>Zeladoria Urbana Colaborativa & Cidades Inteligentes</Text>
        <View style={styles.versionBadge}>
          <Text style={styles.versionText}>Versão {APP_VERSAO} • Produção</Text>
        </View>
      </View>

      {/* EXIGÊNCIA OBRIGATÓRIA DO EDITAL: COMMIT HASH DE REFERÊNCIA */}
      <View style={[styles.commitCard, shadows.md]}>
        <View style={styles.commitHeaderRow}>
          <View style={styles.commitIconContainer}>
            <Ionicons name="git-commit-outline" size={22} color={colors.primary[600]} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.commitTitle}>Commit Hash de Referência</Text>
            <Text style={styles.commitSubtitle}>
              Identificador auditável exigido pelo Edital FIAP GS 2026/2
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
            {COMMIT_HASH_REFERENCIA}
          </Text>

          <View style={styles.shortHashRow}>
            <Text style={styles.shortHashLabel}>ID Curto de Tag:</Text>
            <View style={styles.shortHashBadge}>
              <Text style={styles.shortHashValue}>{COMMIT_HASH_CURTO}</Text>
            </View>
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
          Equipe de Engenharia e Desenvolvimento Mobile:
        </Text>

        {INTEGRANTES_GRUPO.map((integrante, index) => (
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

              {/* Links Sociais (GitHub e LinkedIn) */}
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
          O CitizenTech democratiza a zeladoria urbana permitindo que qualquer cidadão registre
          ocorrências de buracos, bueiros entupidos, iluminação precária e lixo irregular em tempo real,
          acelerando o tempo de resposta do poder público e reduzindo riscos de alagamentos e acidentes.
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
            'React Native',
            'Expo SDK 58',
            'TypeScript',
            'React Navigation v7',
            'Axios + Interceptors',
            'JWT Bearer Token',
            'AsyncStorage Cache',
            'Clean Architecture',
            'Hooks Customizados',
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
