import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { type AppTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { borderRadius, fontSize, fontWeight, spacing } from '@/theme';

export interface FilterChipOption<T extends string> {
  value: T;
  label: string;
}

interface FilterChipRowProps<T extends string> {
  label?: string;
  options: readonly FilterChipOption<T>[];
  selectedValue: T;
  onSelect: (value: T) => void;
}

export function FilterChipRow<T extends string>({ label, options, selectedValue, onSelect }: FilterChipRowProps<T>) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {options.map((opt) => {
          const active = opt.value === selectedValue;
          return (
            <TouchableOpacity
              key={opt.value}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => onSelect(opt.value)}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{opt.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    wrapper: { gap: spacing.xs },
    label: { fontSize: fontSize.caption, fontWeight: fontWeight.bold, color: theme.textSecondary, paddingHorizontal: spacing.md },
    row: { paddingHorizontal: spacing.md, gap: spacing.xs + 2 },
    chip: {
      paddingHorizontal: spacing.sm + 4,
      paddingVertical: 6,
      borderRadius: borderRadius.full,
      backgroundColor: theme.cardSubtle,
      borderWidth: 1,
      borderColor: theme.border,
    },
    chipActive: { backgroundColor: theme.primary, borderColor: theme.primary },
    chipText: { fontSize: fontSize.caption, fontWeight: fontWeight.semibold, color: theme.textSecondary },
    chipTextActive: { color: theme.inverseText },
  });
