import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatCard } from '@/components/StatCard';
import { useThemedStyles } from '@/contexts/ThemeContext';
import { borderRadius, fontSize, fontWeight, shadows, spacing } from '@/theme';
import type { AppTheme } from '@/theme/types';

interface ProfileStatsCardProps {
  total: number;
  emAndamento: number;
  concluidos: number;
  apoiosRecebidos: number;
  loading?: boolean;
  onPressVerChamados: () => void;
}

export const ProfileStatsCard = ({
  total,
  emAndamento,
  concluidos,
  apoiosRecebidos,
  loading = false,
  onPressVerChamados,
}: ProfileStatsCardProps) => {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Minhas Estatísticas</Text>
          <Text style={styles.subtitle}>Resumo da sua participação na cidade</Text>
        </View>
        <TouchableOpacity onPress={onPressVerChamados} activeOpacity={0.75} hitSlop={6}>
          <Text style={styles.link}>Ver Meus</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        <StatCard
          label="Reportados"
          value={loading ? '—' : total}
          icon="megaphone-outline"
        />
        <StatCard
          label="Em Andamento"
          value={loading ? '—' : emAndamento}
          icon="time-outline"
        />
      </View>

      <View style={styles.grid}>
        <StatCard
          label="Concluídos"
          value={loading ? '—' : concluidos}
          icon="checkmark-circle-outline"
        />
        <StatCard
          label="Apoios Recebidos"
          value={loading ? '—' : apoiosRecebidos}
          icon="thumbs-up-outline"
        />
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
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.sm,
    },
    title: {
      fontSize: fontSize.subtitle,
      fontWeight: fontWeight.bold,
      color: theme.text,
    },
    subtitle: {
      fontSize: fontSize.caption,
      color: theme.textSecondary,
      marginTop: 2,
    },
    link: {
      fontSize: fontSize.bodySmall,
      fontWeight: fontWeight.bold,
      color: theme.primary,
    },
    grid: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
  });
