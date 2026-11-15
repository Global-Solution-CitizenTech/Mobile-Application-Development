import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemedStyles } from '@/contexts/ThemeContext';
import type { AppTheme } from '@/theme/types';
import { borderRadius, fontSize, fontWeight, spacing } from '@/theme';
import type { MeusChamadosTab } from '@/types/filters';

interface MeusChamadosHeaderProps {
  total: number;
  abertos: number;
  emAndamento: number;
  concluidos: number;
  activeTab: MeusChamadosTab;
  onSelectTab: (tab: MeusChamadosTab) => void;
}

export const MeusChamadosHeader = ({
  total,
  abertos,
  emAndamento,
  concluidos,
  activeTab,
  onSelectTab,
}: MeusChamadosHeaderProps) => {
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();

  const tabs: { key: MeusChamadosTab; label: string; count: number }[] = [
    { key: 'TODOS', label: 'Todos', count: total },
    { key: 'ATIVOS', label: 'Em Aberto', count: abertos + emAndamento },
    { key: 'CONCLUIDOS', label: 'Finalizados', count: concluidos },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top, spacing.md) + spacing.xs,
          paddingLeft: Math.max(insets.left, spacing.md),
          paddingRight: Math.max(insets.right, spacing.md),
        },
      ]}
    >
      <View style={styles.titleSection}>
        <Text style={styles.title}>Meus Chamados</Text>
        <Text style={styles.subtitle}>
          {total} {total === 1 ? 'ocorrência registrada por você' : 'ocorrências registradas por você'}
        </Text>
      </View>

      <View style={styles.tabsRow}>
        {tabs.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabBtn, active && styles.tabBtnActive]}
              onPress={() => onSelectTab(tab.key)}
              activeOpacity={0.8}
              hitSlop={6}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>{tab.label}</Text>
              <View style={[styles.badge, active ? styles.badgeActive : styles.badgeInactive]}>
                <Text style={[styles.badgeText, active ? styles.badgeTextActive : styles.badgeTextInactive]}>{tab.count}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.md,
      backgroundColor: theme.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      gap: spacing.md,
    },
    titleSection: {
      gap: 3,
    },
    title: { fontSize: fontSize.heading, fontWeight: fontWeight.extrabold, color: theme.text },
    subtitle: { fontSize: fontSize.bodySmall, color: theme.textSecondary },
    tabsRow: {
      flexDirection: 'row',
      gap: spacing.sm,
      backgroundColor: theme.cardSubtle,
      padding: 4,
      borderRadius: borderRadius.full,
    },
    tabBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: spacing.sm + 2,
      paddingHorizontal: spacing.xs,
      borderRadius: 24,
    },
    tabBtnActive: {
      backgroundColor: theme.surface,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 2,
      elevation: 2,
    },
    tabText: {
      fontSize: fontSize.caption,
      fontWeight: fontWeight.bold,
      color: theme.textSecondary,
    },
    tabTextActive: {
      color: theme.primary,
    },
    badge: {
      minWidth: 22,
      height: 22,
      borderRadius: 11,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 5,
      overflow: 'hidden',
    },
    badgeActive: {
      backgroundColor: theme.primaryLight,
    },
    badgeInactive: {
      backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
    },
    badgeText: {
      fontSize: fontSize.tiny + 1,
      fontWeight: fontWeight.bold,
    },
    badgeTextActive: {
      color: theme.primary,
    },
    badgeTextInactive: {
      color: theme.textMuted,
    },
  });
