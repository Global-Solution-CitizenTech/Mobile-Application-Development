import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { type AppTheme, useThemedStyles } from '@/contexts/ThemeContext';
import type { MeusChamadosTab } from '@/hooks/useMeusChamadosData';
import { borderRadius, fontSize, fontWeight, spacing } from '@/theme';

interface MeusChamadosHeaderProps {
  total: number;
  abertos: number;
  emAndamento: number;
  concluidos: number;
  activeTab: MeusChamadosTab;
  onSelectTab: (tab: MeusChamadosTab) => void;
}

const TABS: { key: MeusChamadosTab; label: string }[] = [
  { key: 'TODOS', label: 'Todos' },
  { key: 'ATIVOS', label: 'Em Aberto / Análise' },
  { key: 'CONCLUIDOS', label: 'Finalizados' },
];

export const MeusChamadosHeader: React.FC<MeusChamadosHeaderProps> = ({
  total,
  abertos,
  emAndamento,
  concluidos,
  activeTab,
  onSelectTab,
}) => {
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, spacing.md) }]}>
      <Text style={styles.title}>Meus Chamados</Text>
      <Text style={styles.subtitle}>
        {total} {total === 1 ? 'ocorrência registrada' : 'ocorrências registradas'}
      </Text>

      <View style={styles.countersRow}>
        <View style={styles.counterBox}>
          <Text style={styles.counterNum}>{abertos}</Text>
          <Text style={styles.counterLabel}>Abertos</Text>
        </View>
        <View style={styles.counterBox}>
          <Text style={styles.counterNum}>{emAndamento}</Text>
          <Text style={styles.counterLabel}>Andamento</Text>
        </View>
        <View style={styles.counterBox}>
          <Text style={styles.counterNum}>{concluidos}</Text>
          <Text style={styles.counterLabel}>Concluídos</Text>
        </View>
      </View>

      <View style={styles.tabsRow}>
        {TABS.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabBtn, active && styles.tabBtnActive]}
              onPress={() => onSelectTab(tab.key)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>{tab.label}</Text>
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
      paddingBottom: spacing.sm + 4,
      backgroundColor: theme.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      gap: spacing.xs + 2,
    },
    title: { fontSize: fontSize.heading, fontWeight: fontWeight.extrabold, color: theme.text },
    subtitle: { fontSize: fontSize.bodySmall, color: theme.textSecondary },
    countersRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
    counterBox: {
      flex: 1,
      backgroundColor: theme.cardSubtle,
      borderRadius: borderRadius.md,
      paddingVertical: spacing.sm,
      alignItems: 'center',
    },
    counterNum: { fontSize: fontSize.subtitle, fontWeight: fontWeight.extrabold, color: theme.primary },
    counterLabel: { fontSize: fontSize.tiny + 1, color: theme.textSecondary, fontWeight: fontWeight.medium },
    tabsRow: { flexDirection: 'row', gap: spacing.xs + 2, marginTop: spacing.xs },
    tabBtn: {
      flex: 1,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.full,
      backgroundColor: theme.cardSubtle,
      alignItems: 'center',
    },
    tabBtnActive: { backgroundColor: theme.primary },
    tabText: { fontSize: fontSize.caption, fontWeight: fontWeight.semibold, color: theme.textSecondary },
    tabTextActive: { color: theme.inverseText },
  });
