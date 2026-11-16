import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { borderRadius, spacing } from '@/theme/spacing';
import { fontSize, fontWeight } from '@/theme/typography';
import type { AppTheme } from '@/types/theme';
import type { PickerTriggerButtonProps } from '@/types/ui';

export const PickerTriggerButton = ({
  icon,
  label,
  valueLabel,
  active = false,
  onPress,
  fullWidth = false,
}: PickerTriggerButtonProps) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <TouchableOpacity
      style={[
        styles.triggerBtn,
        active && styles.triggerBtnActive,
        fullWidth && styles.triggerBtnFull,
      ]}
      onPress={onPress}
      activeOpacity={0.78}
    >
      {icon ? (
        <Ionicons
          name={icon}
          size={15}
          color={active ? theme.primary : theme.textSecondary}
        />
      ) : null}
      <View style={fullWidth ? styles.triggerTextCol : styles.triggerTextInline}>
        {label ? (
          <Text style={styles.triggerLabel} numberOfLines={1}>
            {label}
          </Text>
        ) : null}
        <Text
          style={[styles.triggerValue, active && styles.triggerValueActive]}
          numberOfLines={1}
        >
          {valueLabel}
        </Text>
      </View>
      <Ionicons
        name="chevron-down"
        size={15}
        color={active ? theme.primary : theme.textMuted}
      />
    </TouchableOpacity>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    triggerBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: spacing.sm + 4,
      paddingVertical: spacing.xs + 3,
      borderRadius: borderRadius.md,
      backgroundColor: theme.cardSubtle,
      borderWidth: 1,
      borderColor: theme.border,
    },
    triggerBtnActive: {
      backgroundColor: theme.primaryLight,
      borderColor: theme.primaryBorder,
    },
    triggerBtnFull: {
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm + 2,
      backgroundColor: theme.surface,
    },
    triggerTextInline: {
      flexShrink: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    triggerTextCol: {
      flex: 1,
      gap: 2,
    },
    triggerLabel: {
      fontSize: fontSize.tiny,
      color: theme.textMuted,
      fontWeight: fontWeight.semibold,
    },
    triggerValue: {
      fontSize: fontSize.caption,
      color: theme.text,
      fontWeight: fontWeight.semibold,
      flexShrink: 1,
    },
    triggerValueActive: {
      color: theme.primaryDark,
      fontWeight: fontWeight.bold,
    },
  });
