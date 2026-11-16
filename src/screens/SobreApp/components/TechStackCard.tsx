import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { borderRadius, spacing } from '@/theme/spacing';
import { fontSize, fontWeight } from '@/theme/typography';
import type { AppTheme } from '@/types/theme';
import type { TechStackCardProps } from '@/types/ui';
import { shadows } from '@/utils/shadow';

export const TechStackCard = ({ items }: TechStackCardProps) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={[styles.card, shadows.sm]}>
      <View style={styles.sectionHeaderRow}>
        <Ionicons name="layers-outline" size={20} color={theme.text} />
        <Text style={styles.sectionTitle}>Stack Tecnológico & Arquitetura</Text>
      </View>

      <View style={styles.techPillGrid}>
        {items.map((tech) => (
          <View key={tech} style={styles.techPill}>
            <Ionicons name="checkmark" size={12} color={theme.primaryDark} />
            <Text style={styles.techPillText}>{tech}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.card,
      borderRadius: borderRadius.cardLg,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: theme.cardBorder,
      marginBottom: spacing.md,
    },
    sectionHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: spacing.xs + 2,
    },
    sectionTitle: {
      fontSize: fontSize.bodyLarge,
      fontWeight: fontWeight.bold,
      color: theme.text,
    },
    techPillGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: spacing.xs,
    },
    techPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      backgroundColor: theme.primaryLight,
      borderWidth: 1,
      borderColor: theme.primaryBorder,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: borderRadius.full,
    },
    techPillText: {
      fontSize: fontSize.tiny,
      fontWeight: fontWeight.semibold,
      color: theme.primaryDark,
    },
  });
