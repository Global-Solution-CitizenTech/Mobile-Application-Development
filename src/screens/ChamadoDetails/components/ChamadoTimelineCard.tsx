import { StyleSheet, Text, View } from 'react-native';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import type { AppTheme } from '@/theme/types';
import { borderRadius, fontSize, fontWeight, spacing } from '@/theme';
import { getStatusVisuals } from '@/theme/semanticConfig';
import type { HistoricoChamado } from '@/types/chamado';
import { formatDate } from '@/utils/formatters';

interface ChamadoTimelineCardProps {
  historico: HistoricoChamado[];
}

export const ChamadoTimelineCard = ({ historico }: ChamadoTimelineCardProps) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Andamento do Protocolo</Text>

      {historico.length === 0 ? (
        <Text style={styles.emptyText}>Nenhuma movimentação registrada ainda.</Text>
      ) : (
        <View style={styles.timeline}>
          {historico.map((item, idx) => {
            const visuals = getStatusVisuals(item.status, theme);
            const isLast = idx === historico.length - 1;
            return (
              <View key={item.id} style={styles.itemRow}>
                <View style={styles.rail}>
                  <View style={[styles.dot, { backgroundColor: visuals.text }]} />
                  {!isLast && <View style={styles.line} />}
                </View>

                <View style={styles.content}>
                  <View style={styles.itemHeader}>
                    <Text style={[styles.statusLabel, { color: visuals.text }]}>{visuals.label}</Text>
                    <Text style={styles.date}>{formatDate(item.data)}</Text>
                  </View>
                  {item.observacao ? <Text style={styles.obs}>{item.observacao}</Text> : null}
                  {item.autorNome ? <Text style={styles.autor}>Por {item.autorNome}</Text> : null}
                </View>
              </View>
            );
          })}
        </View>
      )}
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
      gap: spacing.md,
    },
    title: { fontSize: fontSize.body, fontWeight: fontWeight.bold, color: theme.text },
    emptyText: { fontSize: fontSize.bodySmall, color: theme.textMuted },
    timeline: { gap: spacing.xs },
    itemRow: { flexDirection: 'row', gap: spacing.sm + 2 },
    rail: { alignItems: 'center', width: 16 },
    dot: { width: 10, height: 10, borderRadius: 5, marginTop: 4 },
    line: { flex: 1, width: 2, backgroundColor: theme.border, marginTop: 4, minHeight: 24 },
    content: { flex: 1, paddingBottom: spacing.md, gap: 3 },
    itemHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
    statusLabel: { fontSize: fontSize.bodySmall, fontWeight: fontWeight.bold },
    date: { fontSize: fontSize.tiny + 1, color: theme.textMuted },
    obs: { fontSize: fontSize.bodySmall, color: theme.textSecondary, lineHeight: 19 },
    autor: { fontSize: fontSize.caption, color: theme.textMuted },
  });
