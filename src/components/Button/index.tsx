import React, { useMemo } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle, TouchableOpacityProps, View } from 'react-native';
import { AppTheme, useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { borderRadius, spacing, fontSize, fontWeight } from '@/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const SIZE_STYLES: Record<ButtonSize, { container: ViewStyle; fontSize: number }> = {
  sm: {
    container: { paddingVertical: spacing.xs + 2, paddingHorizontal: spacing.md },
    fontSize: fontSize.caption,
  },
  md: {
    container: { paddingVertical: spacing.sm + 4, paddingHorizontal: spacing.lg },
    fontSize: fontSize.body,
  },
  lg: {
    container: { paddingVertical: spacing.md, paddingHorizontal: spacing.xl },
    fontSize: fontSize.bodyLarge,
  },
};

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  disabled,
  ...rest
}) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  const variantColors = useMemo<
    Record<ButtonVariant, { bg: string; text: string; borderColor?: string }>
  >(
    () => ({
      primary: { bg: theme.primary, text: theme.inverseText },
      secondary: { bg: theme.isDark ? '#334155' : '#1E293B', text: theme.inverseText },
      outline: { bg: 'transparent', text: theme.primary, borderColor: theme.primary },
      danger: { bg: theme.danger, text: theme.inverseText },
      ghost: { bg: 'transparent', text: theme.textSecondary },
    }),
    [theme]
  );

  const palette = variantColors[variant];
  const sizeSpec = SIZE_STYLES[size];
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.base,
        sizeSpec.container,
        {
          backgroundColor: palette.bg,
          borderWidth: palette.borderColor ? 1.5 : 0,
          borderColor: palette.borderColor,
          opacity: isDisabled ? 0.6 : 1,
        },
        style,
      ]}
      disabled={isDisabled}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size="small" color={palette.text} />
      ) : (
        <View style={styles.contentRow}>
          {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
          <Text
            style={[
              styles.textBase,
              { fontSize: sizeSpec.fontSize, color: palette.text },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const createStyles = (_theme: AppTheme) =>
  StyleSheet.create({
    base: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: borderRadius.md,
    },
    contentRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    textBase: {
      fontWeight: fontWeight.bold,
      textAlign: 'center',
    },
    leftIconContainer: {
      marginRight: spacing.sm,
    },
    rightIconContainer: {
      marginLeft: spacing.sm,
    },
  });
