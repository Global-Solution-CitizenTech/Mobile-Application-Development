import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { borderRadius, spacing } from '@/theme/spacing';
import { fontSize, fontWeight } from '@/theme/typography';
import type { AppTheme } from '@/types/theme';
import type { CommitInfoCardProps } from '@/types/ui';
import { formatDate } from '@/utils/formatters';
import { shadows } from '@/utils/shadow';

export const CommitInfoCard = ({ commitInfo, onShare }: CommitInfoCardProps) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={[styles.commitCard, shadows.md]}>
      <View style={styles.commitHeaderRow}>
        <View style={styles.commitIconContainer}>
          <Ionicons name="git-commit-outline" size={22} color={theme.primary} />
        </View>
        <View style={styles.flexOne}>
          <Text style={styles.commitTitle}>Commit Hash de Referência</Text>
          <Text style={styles.commitSubtitle}>
            Extraído dinamicamente do Git no build (FIAP GS 2026/2)
          </Text>
        </View>
      </View>

      <View style={styles.hashBox}>
        <View style={styles.hashRow}>
          <Text style={styles.hashLabel}>HASH COMPLETO:</Text>
          <TouchableOpacity onPress={onShare} style={styles.shareBtn} activeOpacity={0.7}>
            <Ionicons name="share-social-outline" size={15} color={theme.primaryDark} />
            <Text style={styles.shareBtnText}>Compartilhar</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.hashValue} selectable>
          {commitInfo.commitHash}
        </Text>

        <View style={styles.shortHashRow}>
          <Text style={styles.shortHashLabel}>ID Curto:</Text>
          <View style={styles.shortHashBadge}>
            <Text style={styles.shortHashValue} selectable>
              {commitInfo.shortCommitHash}
            </Text>
          </View>
          <Text style={styles.branchText}>Branch: {commitInfo.branch}</Text>
        </View>

        <View style={styles.commitMetaBlock}>
          <Text style={styles.commitMetaLabel}>DATA DO COMMIT</Text>
          <Text style={styles.commitMetaValue} selectable>
            {formatDate(commitInfo.commitDate)}
          </Text>
          <Text style={styles.commitMetaLabel}>MENSAGEM</Text>
          <Text style={styles.commitMetaValue}>{commitInfo.commitMessage}</Text>
        </View>
      </View>
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    flexOne: { flex: 1 },
    commitCard: {
      backgroundColor: theme.card,
      borderRadius: borderRadius.cardLg,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: theme.primaryBorder,
      marginBottom: spacing.md,
    },
    commitHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm + 2,
      marginBottom: spacing.sm + 2,
    },
    commitIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: theme.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    commitTitle: { fontSize: fontSize.body, fontWeight: fontWeight.bold, color: theme.text },
    commitSubtitle: { fontSize: fontSize.tiny, color: theme.textSecondary, marginTop: 1 },
    hashBox: {
      backgroundColor: theme.cardSubtle,
      borderRadius: borderRadius.card,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: theme.border,
    },
    hashRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    hashLabel: { fontSize: 10, fontWeight: fontWeight.bold, color: theme.textMuted, letterSpacing: 0.6 },
    shareBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    shareBtnText: { fontSize: fontSize.tiny, fontWeight: fontWeight.bold, color: theme.primaryDark },
    hashValue: { fontSize: fontSize.tiny, color: theme.text, fontWeight: fontWeight.medium, marginBottom: spacing.sm },
    shortHashRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
    shortHashLabel: { fontSize: fontSize.tiny, color: theme.textSecondary },
    shortHashBadge: {
      backgroundColor: theme.primaryLight,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: borderRadius.sm,
    },
    shortHashValue: { fontSize: fontSize.tiny, fontWeight: fontWeight.bold, color: theme.primaryDark },
    branchText: { fontSize: fontSize.tiny, color: theme.textMuted },
    commitMetaBlock: {
      marginTop: spacing.sm,
      paddingTop: spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.divider,
      gap: 2,
    },
    commitMetaLabel: { fontSize: 10, fontWeight: fontWeight.bold, color: theme.textMuted, letterSpacing: 0.6 },
    commitMetaValue: { fontSize: fontSize.tiny, color: theme.text, marginBottom: spacing.xs },
  });
