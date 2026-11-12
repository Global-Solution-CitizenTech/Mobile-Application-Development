import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { type AppTheme, useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { borderRadius, fontSize, fontWeight, spacing } from '@/theme';
import { getPriorityVisuals } from '@/theme/semanticConfig';
import type { AiInsightItem } from '@/types/ai';

interface ZelaBotInsightsBannerProps {
  bairro?: string;
  insights: AiInsightItem[];
  loading: boolean;
}

export const ZelaBotInsightsBanner: React.FC<ZelaBotInsightsBannerProps> = ({ bairro, insights, loading }) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [expanded, setExpanded] = useState(false);

  if (loading || insights.length === 0) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.headerRow} onPress={() => setExpanded((prev) => !prev)} activeOpacity={0.75}>
        <View style={styles.titleWrap}>
          <View style={styles.iconBox}>
            <Ionicons name="shield-checkmark-outline" size={16} color={theme.primary} />
          </View>
          <Text style={styles.title} numberOfLines={1}>
            {bairro ? `Alertas para ${bairro}` : 'Alertas Preventivos'} ({insights.length})
          </Text>
        </View>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={theme.textSecondary} />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.list}>
          {insights.map((item, idx) => {
            const visuals = getPriorityVisuals(item.urgencia, theme);
            return (
              <View key={`${item.categoria}_${idx}`} style={styles.itemCard}>
                <View style={styles.itemTop}>
                  <Text style={styles.itemTitle}>{item.titulo}</Text>
                  <View style={[styles.badge, { backgroundColor: visuals.bg }]}>
                    <Text style={[styles.badgeText, { color: visuals.color }]}>{visuals.label.toUpperCase()}</Text>
                  </View>
                </View>
                <Text style={styles.itemDesc}>{item.descricao}</Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      marginHorizontal: spacing.md,
      marginTop: spacing.xs,
      marginBottom: spacing.xs,
      backgroundColor: theme.surface,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: theme.border,
      overflow: 'hidden',
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm + 2,
    },
    titleWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    iconBox: {
      width: 28,
      height: 28,
      borderRadius: borderRadius.sm,
      backgroundColor: theme.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: { flex: 1, fontSize: fontSize.bodySmall, fontWeight: fontWeight.bold, color: theme.text },
    list: { paddingHorizontal: spacing.md, paddingBottom: spacing.sm, gap: spacing.sm },
    itemCard: {
      backgroundColor: theme.cardSubtle,
      borderRadius: borderRadius.sm,
      padding: spacing.sm + 2,
      gap: 4,
    },
    itemTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.xs },
    itemTitle: { flex: 1, fontSize: fontSize.bodySmall, fontWeight: fontWeight.bold, color: theme.text },
    badge: { paddingHorizontal: spacing.xs + 2, paddingVertical: 2, borderRadius: borderRadius.xs },
    badgeText: { fontSize: fontSize.tiny, fontWeight: fontWeight.bold },
    itemDesc: { fontSize: fontSize.caption, color: theme.textSecondary, lineHeight: 17 },
  });
