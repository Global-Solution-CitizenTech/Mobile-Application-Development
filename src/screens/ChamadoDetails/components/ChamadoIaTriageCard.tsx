import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { type AppTheme, useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { borderRadius, fontSize, fontWeight, spacing } from '@/theme';
import { getPriorityVisuals } from '@/theme/semanticConfig';
import type { TriagemIa } from '@/types/chamado';

interface ChamadoIaTriageCardProps {
  triagem?: TriagemIa;
}

export const ChamadoIaTriageCard: React.FC<ChamadoIaTriageCardProps> = ({ triagem }) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  if (!triagem) {
    return (
      <View style={styles.pendingCard}>
        <Ionicons name="sparkles-outline" size={18} color={theme.textMuted} />
        <Text style={styles.pendingText}>
          A triagem técnica por Inteligência Artificial será exibida aqui assim que processada pelo servidor.
        </Text>
      </View>
    );
  }

  const visuals = getPriorityVisuals(triagem.prioridade, theme);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <Ionicons name="sparkles" size={16} color={theme.primary} />
          <Text style={styles.title}>Triagem Técnica por IA</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: visuals.bg }]}>
          <Text style={[styles.badgeText, { color: visuals.color }]}>Prioridade {visuals.label}</Text>
        </View>
      </View>

      <Text style={styles.orgao}>Órgão sugerido: {triagem.orgao}</Text>
      {triagem.parecer ? <Text style={styles.parecer}>{triagem.parecer}</Text> : null}
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    pendingCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      backgroundColor: theme.surface,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: theme.border,
    },
    pendingText: { flex: 1, fontSize: fontSize.caption, color: theme.textMuted, lineHeight: 18 },
    card: {
      backgroundColor: theme.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: theme.border,
      gap: spacing.xs + 2,
    },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
    titleWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    title: { fontSize: fontSize.body, fontWeight: fontWeight.bold, color: theme.text },
    badge: { paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: borderRadius.full },
    badgeText: { fontSize: fontSize.tiny + 1, fontWeight: fontWeight.bold },
    orgao: { fontSize: fontSize.bodySmall, fontWeight: fontWeight.semibold, color: theme.primary },
    parecer: { fontSize: fontSize.bodySmall, color: theme.textSecondary, lineHeight: 19 },
  });
