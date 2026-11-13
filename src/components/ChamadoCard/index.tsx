import { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CategoryBadge } from '@/components/CategoryBadge';
import { StatusBadge } from '@/components/StatusBadge';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import type { AppTheme } from '@/theme/types';
import { borderRadius, fontSize, fontWeight, shadows, spacing } from '@/theme';
import { getPriorityVisuals } from '@/theme/semanticConfig';
import type { Chamado } from '@/types/chamado';
import { formatShortDate, getFirstName, getShortEndereco } from '@/utils/formatters';
import { canSupportChamado } from '@/utils/permissions';

interface ChamadoCardProps {
  chamado: Chamado;
  onPress: () => void;
  onApoiar?: () => void;
}

export const ChamadoCard = ({ chamado, onPress, onApoiar }: ChamadoCardProps) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [failedFotoUrl, setFailedFotoUrl] = useState<string | null>(null);
  const podeApoiar = Boolean(onApoiar) && canSupportChamado(chamado.status);
  const priority = chamado.prioridadeNome !== 'PENDENTE' ? getPriorityVisuals(chamado.prioridadeNome, theme) : null;
  const showThumbnail = Boolean(chamado.fotoUrl && failedFotoUrl !== chamado.fotoUrl);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.topRow}>
        <CategoryBadge categoria={chamado.categoriaNome} compact />
        <StatusBadge status={chamado.status} compact />
      </View>

      <View style={styles.contentRow}>
        <View style={styles.mainInfo}>
          <Text style={styles.metaText}>
            Protocolo #{chamado.idChamado} • {formatShortDate(chamado.dtAbertura)}
          </Text>
          <Text style={styles.title} numberOfLines={2}>
            {chamado.titulo}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {chamado.descricao}
          </Text>
        </View>

        {showThumbnail ? (
          <Image
            source={{ uri: chamado.fotoUrl }}
            style={styles.thumbnail}
            onError={() => setFailedFotoUrl(chamado.fotoUrl ?? null)}
          />
        ) : null}
      </View>

      <View style={styles.locationRow}>
        <Ionicons name="location-outline" size={14} color={theme.textMuted} />
        <Text style={styles.locationText} numberOfLines={1}>
          {getShortEndereco(chamado.endereco)}
        </Text>
      </View>

      <View style={styles.footerRow}>
        {priority ? (
          <View style={[styles.priorityPill, { backgroundColor: priority.bg }]}>
            <Ionicons name="flag-outline" size={11} color={priority.color} />
            <Text style={[styles.priorityText, { color: priority.color }]}>Prioridade {priority.label}</Text>
          </View>
        ) : (
          <View style={styles.authorPill}>
            <Ionicons name="person-outline" size={12} color={theme.textMuted} />
            <Text style={styles.authorText}>{getFirstName(chamado.usuarioNome)}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.voteBtn, chamado.apoiadoPorMim && styles.voteBtnActive, !podeApoiar && styles.voteBtnDisabled]}
          onPress={(event) => {
            event.stopPropagation();
            onApoiar?.();
          }}
          disabled={!podeApoiar}
          activeOpacity={0.75}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel={chamado.apoiadoPorMim ? 'Remover apoio da ocorrência' : 'Apoiar ocorrência'}
        >
          <Ionicons
            name={chamado.apoiadoPorMim ? 'thumbs-up' : 'thumbs-up-outline'}
            size={14}
            color={chamado.apoiadoPorMim ? theme.primary : theme.textSecondary}
          />
          <Text style={[styles.voteText, chamado.apoiadoPorMim && styles.voteTextActive]}>
            {chamado.totalVotos} {chamado.totalVotos === 1 ? 'apoio' : 'apoios'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
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
      gap: spacing.sm,
      ...shadows.sm,
    },
    topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.xs },
    contentRow: { flexDirection: 'row', gap: spacing.sm + 4 },
    mainInfo: { flex: 1, gap: 4 },
    metaText: { fontSize: fontSize.tiny + 1, color: theme.textMuted, fontWeight: fontWeight.medium },
    title: { fontSize: fontSize.bodyLarge, fontWeight: fontWeight.bold, color: theme.text, lineHeight: 21 },
    description: { fontSize: fontSize.bodySmall, color: theme.textSecondary, lineHeight: 18 },
    thumbnail: { width: 72, height: 72, borderRadius: borderRadius.md, backgroundColor: theme.cardSubtle },
    locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    locationText: { flex: 1, fontSize: fontSize.caption, color: theme.textSecondary },
    footerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: spacing.xs + 2,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    priorityPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: borderRadius.full,
    },
    priorityText: { fontSize: fontSize.tiny + 1, fontWeight: fontWeight.bold },
    authorPill: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    authorText: { fontSize: fontSize.caption, color: theme.textMuted, fontWeight: fontWeight.medium },
    voteBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: spacing.sm + 2,
      paddingVertical: 5,
      borderRadius: borderRadius.full,
      backgroundColor: theme.cardSubtle,
      borderWidth: 1,
      borderColor: theme.border,
    },
    voteBtnActive: { backgroundColor: theme.primaryLight, borderColor: theme.primary },
    voteBtnDisabled: { opacity: 0.65 },
    voteText: { fontSize: fontSize.caption, fontWeight: fontWeight.semibold, color: theme.textSecondary },
    voteTextActive: { color: theme.primary },
  });
