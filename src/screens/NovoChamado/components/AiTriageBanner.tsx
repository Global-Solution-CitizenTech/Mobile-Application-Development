import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { borderRadius, spacing } from '@/theme/spacing';
import { fontSize, fontWeight } from '@/theme/typography';
import type { AppTheme } from '@/types/theme';
import type { AiTriageBannerProps } from '@/types/ui';

const DEFAULT_TRIAGE_MESSAGE =
  'Anexe a foto e informe o endereço. Nossa IA valida a imagem e define título, descrição, categoria, prioridade e órgão responsável.';

export const AiTriageBanner = ({ message = DEFAULT_TRIAGE_MESSAGE }: AiTriageBannerProps) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      <Ionicons name="sparkles" size={16} color={theme.primary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.sm,
      padding: spacing.md,
      borderRadius: borderRadius.card,
      backgroundColor: theme.primaryLight,
      borderWidth: 1,
      borderColor: theme.primaryBorder,
    },
    text: {
      flex: 1,
      fontSize: fontSize.caption,
      fontWeight: fontWeight.medium,
      color: theme.primaryDark,
      lineHeight: 19,
    },
  });
