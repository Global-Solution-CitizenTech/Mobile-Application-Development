import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { ViewStyle } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { borderRadius, spacing } from '@/theme/spacing';
import { fontSize, fontWeight } from '@/theme/typography';
import type { AppTheme } from '@/types/theme';
import type { ButtonProps, ButtonSize, ButtonVariant } from '@/types/ui';

const SIZE_STYLES: Record<ButtonSize, { container: ViewStyle; fontSize: number }> = {
  sm: {
    container: { minHeight: 36, paddingVertical: spacing.xs + 2, paddingHorizontal: spacing.md },
    fontSize: fontSize.caption,
  },
  md: {
    container: { minHeight: 48, paddingVertical: spacing.sm + 4, paddingHorizontal: spacing.lg },
    fontSize: fontSize.body,
  },
  lg: {
    container: { minHeight: 52, paddingVertical: spacing.md, paddingHorizontal: spacing.xl },
    fontSize: fontSize.bodyLarge,
  },
};

function getVariantPalette(
  variant: ButtonVariant,
  theme: AppTheme,
): { bg: string; text: string; borderColor?: string } {
  switch (variant) {
    case 'primary':
      return { bg: theme.primary, text: theme.inverseText };
    case 'secondary':
      return { bg: theme.secondaryButtonBg, text: theme.inverseText };
    case 'outline':
      return { bg: 'transparent', text: theme.primary, borderColor: theme.primary };
    case 'danger':
      return { bg: theme.danger, text: theme.inverseText };
    case 'ghost':
      return { bg: 'transparent', text: theme.textSecondary };
  }
}

export const Button = ({
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
}: ButtonProps) => {
  const { theme } = useTheme();

  const palette = getVariantPalette(variant, theme);
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

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
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
