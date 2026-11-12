import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { type AppTheme, useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { borderRadius, fontSize, fontWeight, spacing } from '@/theme';
import { getStatusVisuals } from '@/theme/semanticConfig';
import type { StatusChamado } from '@/types/categoria';

interface StatusBadgeProps {
  status: StatusChamado;
  compact?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, compact = false }) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const visuals = getStatusVisuals(status, theme);

  return (
    <View style={[styles.badge, { backgroundColor: visuals.bg, borderColor: visuals.border }, compact && styles.compact]}>
      <Ionicons name={visuals.iconName} size={compact ? 12 : 14} color={visuals.icon} />
      <Text style={[styles.text, { color: visuals.text }, compact && styles.textCompact]}>{visuals.label}</Text>
    </View>
  );
};

const createStyles = (_theme: AppTheme) =>
  StyleSheet.create({
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: spacing.sm + 2,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.full,
      borderWidth: 1,
      alignSelf: 'flex-start',
    },
    compact: { paddingHorizontal: spacing.sm, paddingVertical: 3 },
    text: { fontSize: fontSize.caption, fontWeight: fontWeight.bold },
    textCompact: { fontSize: fontSize.tiny + 1 },
  });
