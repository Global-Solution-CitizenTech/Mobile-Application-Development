import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { getCategoryLabel, getCategoryVisuals } from '@/theme/semanticConfig';
import { borderRadius, spacing } from '@/theme/spacing';
import { fontSize, fontWeight } from '@/theme/typography';
import type { AppTheme } from '@/types/theme';
import type { HomeCategoryListProps } from '@/types/ui';
import { shadows } from '@/utils/shadow';

export const HomeCategoryList = ({ categorias, onSelectCategoria }: HomeCategoryListProps) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  if (categorias.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Categorias de Zeladoria</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {categorias.map((cat) => {
          const { iconName, color, bg } = getCategoryVisuals(cat.nome, theme);
          return (
            <TouchableOpacity
              key={cat.id}
              style={styles.card}
              onPress={() => onSelectCategoria(cat.nome)}
              activeOpacity={0.8}
              hitSlop={6}
            >
              <View style={[styles.iconBox, { backgroundColor: bg }]}>
                <Ionicons name={iconName} size={22} color={color} />
              </View>
              <Text style={styles.name} numberOfLines={2}>
                {getCategoryLabel(cat.nome)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    section: { gap: spacing.sm + 2 },
    sectionTitle: { fontSize: fontSize.subtitle, fontWeight: fontWeight.bold, color: theme.text },
    scrollContent: { gap: spacing.sm + 2, paddingRight: spacing.md },
    card: {
      width: 120,
      backgroundColor: theme.surface,
      borderRadius: borderRadius.card,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: theme.border,
      gap: spacing.sm + 2,
      alignItems: 'flex-start',
      ...shadows.sm,
    },
    iconBox: {
      width: 44,
      height: 44,
      borderRadius: borderRadius.md + 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    name: {
      fontSize: fontSize.bodySmall,
      fontWeight: fontWeight.bold,
      color: theme.text,
      lineHeight: 18,
    },
  });
