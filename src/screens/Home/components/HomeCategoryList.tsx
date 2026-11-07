import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCategoryIconName } from '../../../components/CategoryBadge';
import { colors, borderRadius, spacing, fontSize, fontWeight, shadows } from '../../../theme';
import { CategoriaChamado } from '../../../types';

interface CategoryDistItem {
  categoria: CategoriaChamado;
  total: number;
}

interface HomeCategoryListProps {
  distribuicaoCategorias: CategoryDistItem[];
  totalChamados: number;
  onSelectCategory: (cat: CategoriaChamado) => void;
  onExploreAll: () => void;
}

export const HomeCategoryList: React.FC<HomeCategoryListProps> = ({
  distribuicaoCategorias,
  totalChamados,
  onSelectCategory,
  onExploreAll,
}) => {
  return (
    <View style={[styles.analyticsCard, shadows.sm]}>
      <View style={styles.analyticsHeader}>
        <View style={styles.rowAlign}>
          <Ionicons name="pie-chart-outline" size={18} color={colors.secondary[800]} />
          <Text style={styles.analyticsTitle}>Distribuição no Bairro</Text>
        </View>
        <TouchableOpacity onPress={onExploreAll} activeOpacity={0.7}>
          <Text style={styles.seeAllText}>Ver todas</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.analyticsSubtitle}>
        Toque em uma categoria para filtrar as demandas no radar:
      </Text>

      <View style={styles.categoriesList}>
        {distribuicaoCategorias.slice(0, 5).map((item, idx) => {
          const percent =
            totalChamados > 0 ? Math.round((item.total / totalChamados) * 100) : 0;
          const icon = getCategoryIconName(item.categoria);
          const isLast = idx === Math.min(4, distribuicaoCategorias.length - 1);

          return (
            <TouchableOpacity
              key={item.categoria}
              style={[styles.categoryItemRow, isLast && { borderBottomWidth: 0 }]}
              onPress={() => onSelectCategory(item.categoria)}
              activeOpacity={0.7}
            >
              <View style={styles.categoryLeft}>
                <View style={styles.categoryIconCircle}>
                  <Ionicons name={icon} size={15} color={colors.primary[700]} />
                </View>
                <Text style={styles.categoryName} numberOfLines={1}>
                  {item.categoria}
                </Text>
              </View>

              <View style={styles.categoryRight}>
                <View style={styles.categoryMiniTrack}>
                  <View
                    style={[
                      styles.categoryMiniFill,
                      { width: `${Math.max(10, percent)}%` },
                    ]}
                  />
                </View>
                <Text style={styles.categoryCountBadge}>{item.total}</Text>
                <Ionicons
                  name="chevron-forward"
                  size={14}
                  color={colors.secondary[400]}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  analyticsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.secondary[100],
    marginBottom: spacing.md,
  },
  analyticsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  rowAlign: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  analyticsTitle: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    color: colors.secondary[900],
  },
  seeAllText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    color: colors.primary[600],
  },
  analyticsSubtitle: {
    fontSize: fontSize.caption,
    color: colors.secondary[500],
    marginBottom: spacing.sm,
  },
  categoriesList: {
    gap: spacing.xs,
  },
  categoryItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary[100],
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  categoryIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  categoryName: {
    fontSize: fontSize.bodySmall,
    color: colors.secondary[800],
    fontWeight: fontWeight.medium,
    flex: 1,
  },
  categoryRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryMiniTrack: {
    width: 56,
    height: 6,
    backgroundColor: colors.secondary[100],
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  categoryMiniFill: {
    height: '100%',
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.full,
  },
  categoryCountBadge: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    color: colors.secondary[700],
    minWidth: 18,
    textAlign: 'right',
  },
});
