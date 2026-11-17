import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { getCategoryLabel, getCategoryVisuals } from '@/theme/semanticConfig';
import { borderRadius, spacing } from '@/theme/spacing';
import { fontSize, fontWeight } from '@/theme/typography';
import type { AppTheme } from '@/types/theme';
import type { CategoryGridSelectorProps } from '@/types/ui';

export const CategoryGridSelector = ({
  categorias,
  selectedCategoriaId,
  onSelectCategoriaId,
  error,
  disabled = false,
}: CategoryGridSelectorProps) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.section}>
      <Text style={styles.label}>Categoria da Ocorrência *</Text>
      <View style={styles.grid}>
        {categorias.map((cat) => {
          const selected = cat.id === selectedCategoriaId;
          const { iconName, color, bg } = getCategoryVisuals(cat.nome, theme);
          return (
            <TouchableOpacity
              key={cat.id}
              style={[styles.tile, selected && styles.tileSelected, disabled && styles.tileDisabled]}
              onPress={() => onSelectCategoriaId(cat.id)}
              disabled={disabled}
              activeOpacity={0.8}
            >
              <View style={[styles.iconBox, { backgroundColor: selected ? theme.primary : bg }]}>
                <Ionicons name={iconName} size={18} color={selected ? theme.inverseText : color} />
              </View>
              <Text style={[styles.tileText, selected && styles.tileTextSelected]} numberOfLines={2}>
                {getCategoryLabel(cat.nome)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    section: { gap: spacing.xs + 2, marginBottom: spacing.sm },
    label: { fontSize: fontSize.bodySmall, fontWeight: fontWeight.semibold, color: theme.text },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
    tile: {
      width: '48%',
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      padding: spacing.sm + 2,
      borderRadius: borderRadius.md,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
    },
    tileSelected: { borderColor: theme.primary, backgroundColor: theme.primaryLight },
    tileDisabled: { opacity: 0.6 },
    iconBox: { width: 32, height: 32, borderRadius: borderRadius.sm, alignItems: 'center', justifyContent: 'center' },
    tileText: { flex: 1, fontSize: fontSize.caption, fontWeight: fontWeight.semibold, color: theme.text },
    tileTextSelected: { color: theme.primary, fontWeight: fontWeight.bold },
    error: { fontSize: fontSize.caption, color: theme.danger },
  });
