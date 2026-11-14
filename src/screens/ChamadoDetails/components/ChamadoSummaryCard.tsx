import { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CategoryBadge } from '@/components/CategoryBadge';
import { StatusBadge } from '@/components/StatusBadge';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import type { AppTheme } from '@/theme/types';
import { borderRadius, fontSize, fontWeight, shadows, spacing } from '@/theme';
import { getOrgaoLabel, getPriorityVisuals } from '@/theme/semanticConfig';
import type { Chamado } from '@/types/chamado';
import { formatDate } from '@/utils/formatters';
import { isStatusFinal } from '@/utils/permissions';

interface ChamadoSummaryCardProps {
  chamado: Chamado;
  onAskAi: () => void;
}

export const ChamadoSummaryCard = ({ chamado, onAskAi }: ChamadoSummaryCardProps) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [failedFotoUrl, setFailedFotoUrl] = useState<string | null>(null);
  const parecer = chamado.historico[0];
  const parecerVisivel =
    parecer?.observacao && isStatusFinal(chamado.status) ? parecer : null;
  const showPhoto = Boolean(chamado.fotoUrl && failedFotoUrl !== chamado.fotoUrl);
  const priority = getPriorityVisuals(chamado.prioridadeNome, theme);

  return (
    <View style={styles.card}>
      <View style={styles.badgesRow}>
        <CategoryBadge categoria={chamado.categoriaNome} />
        <StatusBadge status={chamado.status} />
      </View>

      {showPhoto ? (
        <Image
          source={{ uri: chamado.fotoUrl }}
          style={styles.photo}
          resizeMode="cover"
          onError={() => setFailedFotoUrl(chamado.fotoUrl ?? null)}
        />
      ) : (
        <View style={styles.photoPlaceholder}>
          <Ionicons name="image-outline" size={28} color={theme.textMuted} />
          <Text style={styles.placeholderText}>Sem foto anexada a este protocolo</Text>
        </View>
      )}

      <View style={styles.body}>
        <Text style={styles.meta}>
          Protocolo #{chamado.idChamado} • Aberto em {formatDate(chamado.dtAbertura)}
        </Text>
        <Text style={styles.title}>{chamado.titulo}</Text>
        <Text style={styles.description}>{chamado.descricao}</Text>
        <Text style={styles.author}>Solicitante: {chamado.usuarioNome}</Text>

        <View style={styles.triageMetaRow}>
          <View style={[styles.priorityPill, { backgroundColor: priority.bg }]}>
            <Ionicons name="flag-outline" size={12} color={priority.color} />
            <Text style={[styles.priorityText, { color: priority.color }]}>Prioridade {priority.label}</Text>
          </View>
          <View style={styles.orgaoRow}>
            <Ionicons name="business-outline" size={14} color={theme.primary} />
            <Text style={styles.orgaoText}>{getOrgaoLabel(chamado.orgaoNome)}</Text>
          </View>
        </View>
      </View>

      {parecerVisivel && (
        <View style={[styles.parecerBox, chamado.status === 'REJEITADO' && styles.parecerRejected]}>
          <Text style={styles.parecerTitle}>
            {chamado.status === 'REJEITADO' ? 'Motivo da Rejeição' : 'Parecer de Conclusão'}
          </Text>
          <Text style={styles.parecerText}>{parecerVisivel.observacao}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.aiButton} onPress={onAskAi} activeOpacity={0.8}>
        <Ionicons name="sparkles" size={16} color={theme.primary} />
        <Text style={styles.aiButtonText}>Tirar dúvidas com o ZelaBot IA sobre este chamado</Text>
        <Ionicons name="chevron-forward" size={16} color={theme.primary} />
      </TouchableOpacity>
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
      ...shadows.sm,
    },
    badgesRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: spacing.xs },
    photo: { width: '100%', height: 210, borderRadius: borderRadius.md, backgroundColor: theme.cardSubtle },
    photoPlaceholder: {
      height: 110,
      borderRadius: borderRadius.md,
      backgroundColor: theme.cardSubtle,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
    },
    placeholderText: { fontSize: fontSize.caption, color: theme.textMuted },
    body: { gap: spacing.xs + 2 },
    meta: { fontSize: fontSize.caption, color: theme.textMuted, fontWeight: fontWeight.medium },
    title: { fontSize: fontSize.title, fontWeight: fontWeight.extrabold, color: theme.text },
    description: { fontSize: fontSize.body, color: theme.textSecondary, lineHeight: 21 },
    author: { fontSize: fontSize.caption, color: theme.textMuted, marginTop: spacing.xs },
    triageMetaRow: { gap: spacing.xs + 2, marginTop: spacing.xs },
    priorityPill: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: borderRadius.full,
    },
    priorityText: { fontSize: fontSize.tiny + 1, fontWeight: fontWeight.bold },
    orgaoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    orgaoText: { flex: 1, fontSize: fontSize.caption, fontWeight: fontWeight.semibold, color: theme.text },
    parecerBox: {
      padding: spacing.sm + 4,
      borderRadius: borderRadius.md,
      backgroundColor: theme.primaryLight,
      borderLeftWidth: 3,
      borderLeftColor: theme.primary,
      gap: 4,
    },
    parecerRejected: { backgroundColor: theme.dangerBg, borderLeftColor: theme.danger },
    parecerTitle: { fontSize: fontSize.caption, fontWeight: fontWeight.bold, color: theme.text },
    parecerText: { fontSize: fontSize.bodySmall, color: theme.textSecondary, lineHeight: 19 },
    aiButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      padding: spacing.sm + 4,
      borderRadius: borderRadius.md,
      backgroundColor: theme.primaryLight,
    },
    aiButtonText: { flex: 1, fontSize: fontSize.caption, fontWeight: fontWeight.bold, color: theme.primary },
  });
