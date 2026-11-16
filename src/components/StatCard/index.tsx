import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { borderRadius, spacing } from '@/theme/spacing';
import { fontSize, fontWeight } from '@/theme/typography';
import type { AppTheme } from '@/types/theme';
import type { StatCardProps } from '@/types/ui';
import { shadows } from '@/utils/shadow';

export const StatCard = ({
  label,
  value,
  icon,
  color,
  bgColor,
  style,
}: StatCardProps) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={[styles.card, shadows.sm, style]}>
      <View style={[styles.iconContainer, { backgroundColor: bgColor ?? theme.primaryLight }]}>
        <Ionicons name={icon} size={18} color={color ?? theme.primary} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      flex: 1,
      backgroundColor: theme.cardSubtle,
      borderRadius: borderRadius.lg,
      paddingVertical: spacing.md - 2,
      paddingHorizontal: spacing.xs,
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: 'center',
      minWidth: 64,
    },
    iconContainer: {
      width: 36,
      height: 36,
      borderRadius: borderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.xs + 2,
    },
    value: {
      fontSize: fontSize.title,
      fontWeight: fontWeight.extrabold,
      color: theme.text,
    },
    label: {
      fontSize: fontSize.caption,
      fontWeight: fontWeight.medium,
      color: theme.textSecondary,
      marginTop: 2,
      textAlign: 'center',
    },
  });
