import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCategoryIconName } from '../../../components/CategoryBadge';
import { colors, borderRadius, spacing, fontSize, fontWeight, shadows } from '../../../theme';
import { CategoriaChamado } from '../../../types';

export const CATEGORIAS_FORM: CategoriaChamado[] = [
  'Buraco na Rua',
  'Bueiro Entupido',
  'Iluminação Pública',
  'Entulho e Descarte Irregular',
  'Poda de Árvore',
  'Sinalização e Trânsito',
  'Vazamento de Água',
  'Outros',
];

interface CategoryGridSelectorProps {
  categoria: CategoriaChamado;
  onSelectCategoria: (cat: CategoriaChamado) => void;
  title?: string;
}

export const CategoryGridSelector: React.FC<CategoryGridSelectorProps> = ({
  categoria,
  onSelectCategoria,
  title = 'Categoria *',
}) => {
  return (
    <View style={[styles.sectionCard, shadows.sm]}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.categoriesGrid}>
        {CATEGORIAS_FORM.map((cat) => {
          const isSelected = categoria === cat;
          const icon = getCategoryIconName(cat);
          return (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryOption,
                isSelected && styles.categoryOptionSelected,
              ]}
              onPress={() => onSelectCategoria(cat)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={icon}
                size={17}
                color={isSelected ? colors.surface : colors.secondary[500]}
              />
              <Text
                style={[
                  styles.categoryOptionText,
                  isSelected && styles.categoryOptionTextSelected,
                ]}
                numberOfLines={2}
              >
                {cat === 'Entulho e Descarte Irregular' ? 'Descarte Irregular' : cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.secondary[100],
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    color: colors.secondary[900],
    marginBottom: spacing.sm + 2,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.xs + 2,
  },
  categoryOption: {
    width: '48.5%',
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
    backgroundColor: colors.secondary[50],
    borderWidth: 1,
    borderColor: colors.secondary[200],
  },
  categoryOptionSelected: {
    backgroundColor: colors.primary[600],
    borderColor: colors.primary[600],
  },
  categoryOptionText: {
    flex: 1,
    fontSize: 12,
    fontWeight: fontWeight.medium,
    color: colors.secondary[700],
    lineHeight: 15,
  },
  categoryOptionTextSelected: {
    color: colors.surface,
    fontWeight: fontWeight.bold,
  },
});
