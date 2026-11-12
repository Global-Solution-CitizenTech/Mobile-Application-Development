import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme, useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { borderRadius, spacing, fontSize, fontWeight, shadows } from '@/theme';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
  bgColor?: string;
  style?: ViewStyle;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  color,
  bgColor,
  style,
}) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={[styles.card, shadows.sm, style]}>
      <View style={[styles.iconContainer, { backgroundColor: bgColor || theme.primaryLight }]}>
        <Ionicons name={icon} size={18} color={color || theme.primary} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      flex: 1,
      backgroundColor: theme.surface,
      borderRadius: borderRadius.md,
      paddingVertical: spacing.sm,
      paddingHorizontal: 4,
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: 'center',
      minWidth: 64,
    },
    iconContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 4,
    },
    value: {
      fontSize: fontSize.title,
      fontWeight: fontWeight.bold,
      color: theme.text,
    },
    label: {
      fontSize: fontSize.tiny,
      fontWeight: fontWeight.medium,
      color: theme.textSecondary,
      marginTop: 2,
      textAlign: 'center',
    },
  });
