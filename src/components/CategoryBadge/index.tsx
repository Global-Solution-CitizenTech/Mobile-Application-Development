import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import type { AppTheme } from '@/theme/types';
import { borderRadius, fontSize, fontWeight, spacing } from '@/theme';
import { getCategoryLabel, getCategoryVisuals } from '@/theme/semanticConfig';

interface CategoryBadgeProps {
  categoria: string;
  compact?: boolean;
}

export const CategoryBadge = ({ categoria, compact = false }: CategoryBadgeProps) => {
  const styles = useThemedStyles(createStyles);
  const { theme } = useTheme();
  const { iconName, color, bg } = getCategoryVisuals(categoria, theme);

  return (
    <View style={[styles.badge, { backgroundColor: bg }, compact && styles.compact]}>
      <Ionicons name={iconName} size={compact ? 12 : 14} color={color} />
      <Text style={[styles.text, { color }, compact && styles.textCompact]} numberOfLines={1}>
        {getCategoryLabel(categoria)}
      </Text>
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: spacing.sm + 2,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.full,
      alignSelf: 'flex-start',
      borderWidth: 1,
      borderColor: theme.border,
    },
    compact: { paddingHorizontal: spacing.sm, paddingVertical: 3 },
    text: { fontSize: fontSize.caption, fontWeight: fontWeight.semibold },
    textCompact: { fontSize: fontSize.tiny + 1 },
  });
