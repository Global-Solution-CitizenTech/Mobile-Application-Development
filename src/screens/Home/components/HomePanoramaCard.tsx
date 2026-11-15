import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatCard } from '@/components/StatCard';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import type { AppTheme } from '@/theme/types';
import { borderRadius, fontSize, fontWeight, shadows, spacing } from '@/theme';
import type { EstatisticasChamados } from '@/types/chamado';

interface HomePanoramaCardProps {
  estatisticas: EstatisticasChamados;
  taxaResolucao: number;
}

export const HomePanoramaCard = ({ estatisticas, taxaResolucao }: HomePanoramaCardProps) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={styles.iconCircle}>
            <Ionicons name="stats-chart" size={18} color={theme.primary} />
          </View>
          <View style={styles.headerTitles}>
            <Text style={styles.title}>Panorama da Cidade</Text>
            <Text style={styles.subtitle}>Índice de eficiência urbana</Text>
          </View>
        </View>

        <View style={styles.percentageBadge}>
          <Text style={styles.percentageText}>{taxaResolucao}% Resolvido</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.max(4, Math.min(100, taxaResolucao))}%` }]} />
        </View>
      </View>

      <View style={styles.grid}>
        <StatCard label="Total" value={estatisticas.total} icon="layers-outline" color={theme.primary} bgColor={theme.primaryLight} />
        <StatCard label="Em Andamento" value={estatisticas.emAndamento} icon="construct-outline" color={theme.warning} bgColor={theme.warningBg} />
        <StatCard label="Resolvidos" value={estatisticas.resolvidos} icon="checkmark-circle-outline" color={theme.success} bgColor={theme.successBg}  />
      </View>

      <View style={styles.footerRow}>
        <Ionicons name="thumbs-up-outline" size={13} color={theme.textMuted} />
        <Text style={styles.footerText}>
          {estatisticas.totalApoios} {estatisticas.totalApoios === 1 ? 'apoio comunitário' : 'apoios comunitários'} • {estatisticas.abertos} em triagem inicial
        </Text>
      </View>
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.surface,
      borderRadius: borderRadius.cardLg,
      padding: spacing.md + 4,
      borderWidth: 1,
      borderColor: theme.border,
      gap: spacing.md,
      ...shadows.sm,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm + 2,
    },
    iconCircle: {
      width: 38,
      height: 38,
      borderRadius: borderRadius.full,
      backgroundColor: theme.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitles: {
      gap: 2,
    },
    title: {
      fontSize: fontSize.bodyLarge,
      fontWeight: fontWeight.bold,
      color: theme.text,
    },
    subtitle: {
      fontSize: fontSize.caption,
      color: theme.textSecondary,
    },
    percentageBadge: {
      backgroundColor: theme.primaryLight,
      paddingHorizontal: spacing.sm + 2,
      paddingVertical: 5,
      borderRadius: borderRadius.full,
      borderWidth: 1,
      borderColor: theme.primaryBorder,
    },
    percentageText: {
      fontSize: fontSize.caption,
      fontWeight: fontWeight.bold,
      color: theme.primaryDark,
    },
    progressContainer: {
      gap: spacing.xs,
    },
    progressTrack: {
      height: 6,
      backgroundColor: theme.cardSubtle,
      borderRadius: borderRadius.full,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: theme.primary,
      borderRadius: borderRadius.full,
    },
    grid: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    footerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 5,
      paddingTop: spacing.xs,
    },
    footerText: {
      fontSize: fontSize.caption,
      color: theme.textMuted,
      fontWeight: fontWeight.medium,
    },
  });
