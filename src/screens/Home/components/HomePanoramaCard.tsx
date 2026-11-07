import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatCard } from '../../../components/StatCard';
import { colors, borderRadius, spacing, fontSize, fontWeight, shadows } from '../../../theme';
import { EstatisticasChamados } from '../../../types';

interface HomePanoramaCardProps {
  estatisticas: EstatisticasChamados;
}

export const HomePanoramaCard: React.FC<HomePanoramaCardProps> = ({ estatisticas }) => {
  return (
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
  );
};

const styles = StyleSheet.create({
  efficiencyCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.secondary[100],
    marginBottom: spacing.md,
  },
  efficiencyTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs + 2,
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
    borderColor: colors.primary[200],
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
    height: 8,
    backgroundColor: colors.secondary[100],
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
    color: colors.secondary[500],
    marginBottom: spacing.md,
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.xs + 2,
  },
});
