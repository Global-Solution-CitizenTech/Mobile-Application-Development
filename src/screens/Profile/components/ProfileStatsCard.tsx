import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatCard } from '@/components/StatCard';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { borderRadius, spacing } from '@/theme/spacing';
import { fontSize, fontWeight } from '@/theme/typography';
import type { AppTheme } from '@/types/theme';
import type { ProfileStatsCardProps } from '@/types/ui';
import { shadows } from '@/utils/shadow';

export const ProfileStatsCard = ({
  total,
  emAndamento,
  concluidos,
  apoiosRecebidos,
  loading = false,
  onPressVerChamados,
}: ProfileStatsCardProps) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Minhas Estatísticas</Text>
          <Text style={styles.subtitle}>
            {emAndamento > 0 ? `${emAndamento} em andamento` : 'Participação cívica na cidade'}
          </Text>
        </View>
        <TouchableOpacity onPress={onPressVerChamados} activeOpacity={0.75} hitSlop={6}>
          <Text style={styles.link}>Ver Meus</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <StatCard
          label="Reportados"
          value={loading ? '—' : total}
          icon="megaphone-outline"
          color={theme.primary}
          bgColor={theme.primaryLight}
        />
        <StatCard
          label="Concluídos"
          value={loading ? '—' : concluidos}
          icon="checkmark-circle-outline"
          color={theme.success}
          bgColor={theme.successBg}
        />
        <StatCard
          label="Apoios"
          value={loading ? '—' : apoiosRecebidos}
          icon="thumbs-up-outline"
          color={theme.warning}
          bgColor={theme.warningBg}
        />
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
    statsRow: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
  });
