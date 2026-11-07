import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CategoriaChamado } from '../../types';
import { colors, borderRadius, spacing, fontWeight } from '../../theme';

interface CategoryBadgeProps {
  categoria: CategoriaChamado;
  showIcon?: boolean;
  style?: ViewStyle;
}

export const getCategoryIconName = (
  categoria: CategoriaChamado
): keyof typeof Ionicons.glyphMap => {
  switch (categoria) {
    case 'Buraco na Rua':
      return 'car-outline';
    case 'Bueiro Entupido':
      return 'water-outline';
    case 'Iluminação Pública':
      return 'bulb-outline';
    case 'Entulho e Descarte Irregular':
      return 'trash-outline';
    case 'Poda de Árvore':
      return 'leaf-outline';
    case 'Sinalização e Trânsito':
      return 'warning-outline';
    case 'Vazamento de Água':
      return 'rainy-outline';
    case 'Outros':
    default:
      return 'construct-outline';
  }
};

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  categoria,
  showIcon = true,
  style,
}) => {
  const iconName = getCategoryIconName(categoria);

  return (
    <View style={[styles.badge, style]}>
      {showIcon && (
        <Ionicons
          name={iconName}
          size={13}
          color={colors.secondary[600]}
          style={styles.icon}
        />
      )}
      <Text style={styles.text} numberOfLines={1}>
        {categoria}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary[100],
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontSize: 11.5,
    fontWeight: fontWeight.medium,
    color: colors.secondary[700],
  },
});
