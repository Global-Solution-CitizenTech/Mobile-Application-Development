import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatCard } from '@/components/StatCard';
import { type AppTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { borderRadius, fontSize, fontWeight, shadows, spacing } from '@/theme';
import type { EstatisticasChamados } from '@/types/chamado';

interface HomePanoramaCardProps {
  estatisticas: EstatisticasChamados;
  taxaResolucao: number;
}

export const HomePanoramaCard: React.FC<HomePanoramaCardProps> = ({ estatisticas, taxaResolucao }) => {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Panorama da Cidade</Text>
        <Text style={styles.percentage}>{taxaResolucao}% resolvido</Text>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${Math.max(4, Math.min(100, taxaResolucao))}%` }]} />
      </View>

      <View style={styles.grid}>
        <StatCard label="Total" value={estatisticas.total} icon="layers-outline" />
        <StatCard label="Abertos" value={estatisticas.abertos} icon="alert-circle-outline" />
        <StatCard label="Andamento" value={estatisticas.emAndamento} icon="construct-outline" />
      </View>

      <View style={styles.grid}>
        <StatCard label="Resolvidos" value={estatisticas.resolvidos} icon="checkmark-circle-outline" />
        <StatCard label="Rejeitados" value={estatisticas.rejeitados} icon="close-circle-outline" />
        <StatCard label="Apoios" value={estatisticas.totalApoios} icon="thumbs-up-outline" />
      </View>
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: theme.border,
      gap: spacing.sm + 2,
      ...shadows.sm,
    },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    title: { fontSize: fontSize.subtitle, fontWeight: fontWeight.bold, color: theme.text },
    percentage: { fontSize: fontSize.bodySmall, fontWeight: fontWeight.bold, color: theme.primary },
    progressTrack: { height: 8, backgroundColor: theme.cardSubtle, borderRadius: borderRadius.full, overflow: 'hidden' },
    progressFill: { height: '100%', backgroundColor: theme.primary, borderRadius: borderRadius.full },
    grid: { flexDirection: 'row', gap: spacing.sm },
  });
