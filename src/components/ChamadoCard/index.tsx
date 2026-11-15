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
import { formatShortDate, getShortEndereco } from '@/utils/formatters';
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
  const priority = getPriorityVisuals(chamado.prioridadeNome, theme);
  const showThumbnail = Boolean(chamado.fotoUrl && failedFotoUrl !== chamado.fotoUrl);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.topRow}>
        <CategoryBadge categoria={chamado.categoriaNome} compact />
        <StatusBadge status={chamado.status} compact />
      </View>

      <View style={styles.contentRow}>
        <View style={styles.mainInfo}>
          <Text style={styles.title} numberOfLines={2}>
            {chamado.titulo}
          </Text>
          {chamado.descricao ? (
            <Text style={styles.description} numberOfLines={2}>
              {chamado.descricao}
            </Text>
          ) : null}
          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={13} color={theme.textMuted} />
            <Text style={styles.metaText} numberOfLines={1}>
              {getShortEndereco(chamado.endereco)} • #{chamado.idChamado}
            </Text>
          </View>
        </View>

        {showThumbnail ? (
          <Image
            source={{ uri: chamado.fotoUrl }}
            style={styles.thumbnail}
            onError={() => setFailedFotoUrl(chamado.fotoUrl ?? null)}
          />
        ) : null}
      </View>

      <View style={styles.footerRow}>
        <View style={[styles.priorityPill, { backgroundColor: priority.bg }]}>
          <Ionicons name="flag-outline" size={12} color={priority.color} />
          <Text style={[styles.priorityText, { color: priority.color }]}>Prioridade {priority.label}</Text>
        </View>

        <View style={styles.footerRight}>
          <Text style={styles.dateText}>{formatShortDate(chamado.dtAbertura)}</Text>
          {podeApoiar ? (
            <TouchableOpacity
              style={[styles.voteBtn, chamado.apoiadoPorMim && styles.voteBtnActive]}
              onPress={(event) => {
                event.stopPropagation();
                onApoiar?.();
              }}
              activeOpacity={0.75}
              hitSlop={6}
            >
              <Ionicons
                name={chamado.apoiadoPorMim ? 'thumbs-up' : 'thumbs-up-outline'}
                size={13}
                color={chamado.apoiadoPorMim ? theme.primary : theme.textSecondary}
              />
              <Text style={[styles.voteText, chamado.apoiadoPorMim && styles.voteTextActive]}>
                {chamado.totalVotos}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.voteBtn}>
              <Ionicons name="thumbs-up-outline" size={13} color={theme.textMuted} />
              <Text style={styles.voteTextMuted}>{chamado.totalVotos}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.surface,
      borderRadius: borderRadius.card,
      padding: spacing.md + 2,
      borderWidth: 1,
      borderColor: theme.border,
      gap: spacing.sm + 3,
      ...shadows.sm,
    },
    topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.xs },
    contentRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
    mainInfo: { flex: 1, gap: 5 },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
    metaText: { fontSize: fontSize.caption, color: theme.textMuted },
    title: { fontSize: fontSize.bodyLarge, fontWeight: fontWeight.bold, color: theme.text, lineHeight: 22 },
    description: { fontSize: fontSize.bodySmall, color: theme.textSecondary, lineHeight: 18 },
    thumbnail: { width: 76, height: 76, borderRadius: borderRadius.md + 2, backgroundColor: theme.cardSubtle },
    footerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: spacing.xs,
    },
    priorityPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: spacing.sm + 2,
      paddingVertical: 4,
      borderRadius: borderRadius.full,
    },
    priorityText: { fontSize: fontSize.tiny + 1, fontWeight: fontWeight.bold },
    footerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    dateText: { fontSize: fontSize.caption, color: theme.textMuted },
    voteBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: spacing.sm + 4,
      paddingVertical: 5,
      borderRadius: borderRadius.full,
      backgroundColor: theme.cardSubtle,
      borderWidth: 1,
      borderColor: theme.border,
    },
    voteBtnActive: { backgroundColor: theme.primaryLight, borderColor: theme.primary },
    voteText: { fontSize: fontSize.caption, fontWeight: fontWeight.bold, color: theme.textSecondary },
    voteTextActive: { color: theme.primary },
    voteTextMuted: { fontSize: fontSize.caption, fontWeight: fontWeight.bold, color: theme.textMuted },
  });
