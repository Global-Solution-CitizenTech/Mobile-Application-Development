import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import type { AppTheme } from '@/theme/types';
import { borderRadius, fontSize, fontWeight, spacing } from '@/theme';
import { getCategoryLabel, getCategoryVisuals } from '@/theme/semanticConfig';
import type { CategoriaResponse } from '@/types/categoria';

interface HomeCategoryListProps {
  categorias: readonly CategoriaResponse[];
  onSelectCategoria: (categoriaNome: string) => void;
}

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
            <TouchableOpacity key={cat.id} style={styles.card} onPress={() => onSelectCategoria(cat.nome)} activeOpacity={0.8}>
              <View style={[styles.iconBox, { backgroundColor: bg }]}>
                <Ionicons name={iconName} size={20} color={color} />
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
    section: { gap: spacing.sm },
    sectionTitle: { fontSize: fontSize.subtitle, fontWeight: fontWeight.bold, color: theme.text },
    scrollContent: { gap: spacing.sm, paddingRight: spacing.md },
    card: {
      width: 112,
      backgroundColor: theme.surface,
      borderRadius: borderRadius.md,
      padding: spacing.sm + 4,
      borderWidth: 1,
      borderColor: theme.border,
      gap: spacing.sm,
      alignItems: 'flex-start',
    },
    iconBox: { width: 38, height: 38, borderRadius: borderRadius.sm, alignItems: 'center', justifyContent: 'center' },
    name: { fontSize: fontSize.caption, fontWeight: fontWeight.semibold, color: theme.text, lineHeight: 16 },
  });
