import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { borderRadius, spacing } from '@/theme/spacing';
import { fontSize, fontWeight } from '@/theme/typography';
import type { AppTheme } from '@/types/theme';
import type { HomeAiPromoCardProps } from '@/types/ui';
import { shadows } from '@/utils/shadow';

export const HomeAiPromoCard = ({ onPress }: HomeAiPromoCardProps) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <TouchableOpacity style={styles.aiCard} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.aiIconBox}>
        <Ionicons name="sparkles" size={22} color={theme.primary} />
      </View>
      <View style={styles.aiBody}>
        <Text style={styles.aiTitle}>ZelaBot IA • Assistente Cívico</Text>
        <Text style={styles.aiSubtitle}>Tire dúvidas sobre prazos, órgãos e decretos de zeladoria</Text>
      </View>
      <Ionicons name="arrow-forward" size={18} color={theme.primary} />
    </TouchableOpacity>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    aiCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      backgroundColor: theme.surface,
      borderRadius: borderRadius.cardLg,
      padding: spacing.md + 2,
      borderWidth: 1,
      borderColor: theme.border,
      ...shadows.sm,
    },
    aiIconBox: {
      width: 48,
      height: 48,
      borderRadius: borderRadius.md + 4,
      backgroundColor: theme.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    aiBody: { flex: 1 },
    aiTitle: { fontSize: fontSize.bodyLarge, fontWeight: fontWeight.bold, color: theme.text },
    aiSubtitle: { fontSize: fontSize.caption, color: theme.textSecondary, marginTop: 2 },
  });
