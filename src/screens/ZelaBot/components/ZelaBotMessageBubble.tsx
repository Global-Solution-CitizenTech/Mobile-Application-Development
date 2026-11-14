import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import type { AppTheme } from '@/theme/types';
import { borderRadius, fontSize, fontWeight, spacing } from '@/theme';
import { getPriorityVisuals } from '@/theme/semanticConfig';
import type { AiMessage } from '@/types/ai';
import { formatMessageTime } from '@/utils/formatters';

interface ZelaBotMessageBubbleProps {
  message: AiMessage;
}

export const ZelaBotMessageBubble = ({ message }: ZelaBotMessageBubbleProps) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const isUser = message.sender === 'user';
  const isError = Boolean(message.isError);
  const urgencyVisuals = !isUser && message.urgencia ? getPriorityVisuals(message.urgencia, theme) : null;

  return (
    <View style={[styles.row, isUser ? styles.rowUser : styles.rowAi]}>
      {!isUser && (
        <View style={[styles.avatar, isError && styles.avatarError]}>
          <Ionicons name={isError ? 'alert-circle-outline' : 'sparkles'} size={15} color={isError ? theme.danger : theme.primary} />
        </View>
      )}

      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAi, isError && styles.bubbleError]}>
        {!isUser && urgencyVisuals && !isError && (
          <View style={styles.metaRow}>
            <View style={[styles.metaChip, { backgroundColor: urgencyVisuals.bg }]}>
              <Text style={[styles.metaChipText, { color: urgencyVisuals.color }]}>
                Urgência: {urgencyVisuals.label.toUpperCase()}
              </Text>
            </View>
            {message.ragGrounded && (
              <View style={styles.ragChip}>
                <Ionicons name="library-outline" size={11} color={theme.primary} />
                <Text style={styles.ragChipText}>Base Legal RAG</Text>
              </View>
            )}
          </View>
        )}

        <Text style={[styles.text, isUser ? styles.textUser : styles.textAi, isError && styles.textError]}>
          {message.text}
        </Text>

        {!isUser && message.acoesRecomendadas && message.acoesRecomendadas.length > 0 && (
          <View style={styles.actionsBox}>
            <Text style={styles.actionsTitle}>Próximos passos recomendados:</Text>
            {message.acoesRecomendadas.slice(0, 3).map((acao, idx) => (
              <Text key={`${idx}-${acao}`} style={styles.actionItem}>
                • {acao}
              </Text>
            ))}
          </View>
        )}

        {!isUser && message.sourcesUsed && message.sourcesUsed.length > 0 && (
          <View style={styles.sourcesBox}>
            <Text style={styles.sourcesLabel} numberOfLines={2}>
              Fontes: {message.sourcesUsed.map((s) => s.source).join(' • ')}
            </Text>
          </View>
        )}

        <Text style={[styles.time, isUser ? styles.timeUser : styles.timeAi]}>{formatMessageTime(message.timestamp)}</Text>
      </View>
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.xs + 2, marginBottom: spacing.sm + 2 },
    rowUser: { justifyContent: 'flex-end' },
    rowAi: { justifyContent: 'flex-start' },
    avatar: {
      width: 28,
      height: 28,
      borderRadius: borderRadius.full,
      backgroundColor: theme.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 2,
    },
    avatarError: { backgroundColor: theme.dangerBg },
    bubble: { maxWidth: '84%', borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 2 },
    bubbleUser: { backgroundColor: theme.primary, borderBottomRightRadius: borderRadius.xs },
    bubbleAi: { backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border, borderBottomLeftRadius: borderRadius.xs },
    bubbleError: { backgroundColor: theme.dangerBg, borderColor: theme.danger },
    metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.xs + 2 },
    metaChip: { paddingHorizontal: spacing.xs + 2, paddingVertical: 2, borderRadius: borderRadius.xs },
    metaChipText: { fontSize: fontSize.tiny, fontWeight: fontWeight.bold },
    ragChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
      paddingHorizontal: spacing.xs + 2,
      paddingVertical: 2,
      borderRadius: borderRadius.xs,
      backgroundColor: theme.primaryLight,
    },
    ragChipText: { fontSize: fontSize.tiny, fontWeight: fontWeight.semibold, color: theme.primary },
    text: { fontSize: fontSize.body, lineHeight: 20 },
    textUser: { color: theme.inverseText },
    textAi: { color: theme.text },
    textError: { color: theme.danger },
    actionsBox: {
      marginTop: spacing.sm,
      paddingTop: spacing.xs + 2,
      borderTopWidth: 1,
      borderTopColor: theme.border,
      gap: 3,
    },
    actionsTitle: { fontSize: fontSize.caption, fontWeight: fontWeight.bold, color: theme.text },
    actionItem: { fontSize: fontSize.caption, color: theme.textSecondary, lineHeight: 17 },
    sourcesBox: { marginTop: spacing.xs + 2 },
    sourcesLabel: { fontSize: fontSize.tiny, color: theme.textMuted, fontStyle: 'italic' },
    time: { fontSize: fontSize.tiny, marginTop: spacing.xs, alignSelf: 'flex-end' },
    timeUser: { color: 'rgba(255,255,255,0.75)' },
    timeAi: { color: theme.textMuted },
  });
