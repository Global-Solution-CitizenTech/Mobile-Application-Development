import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
  View,
} from 'react-native';
import { colors, borderRadius, spacing, fontSize, fontWeight } from '../../theme';

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
  const getContainerStyle = (): ViewStyle => {
    let paddingVertical = spacing.sm + 4;
    let paddingHorizontal = spacing.lg;

    if (size === 'sm') {
      paddingVertical = spacing.xs + 2;
      paddingHorizontal = spacing.md;
    } else if (size === 'lg') {
      paddingVertical = spacing.md;
      paddingHorizontal = spacing.xl;
    }

    let backgroundColor: string = colors.primary[600];
    let borderWidth: number | undefined;
    let borderColor: string | undefined;

    switch (variant) {
      case 'secondary':
        backgroundColor = colors.secondary[800];
        break;
      case 'outline':
        backgroundColor = 'transparent';
        borderWidth = 1.5;
        borderColor = colors.primary[600];
        break;
      case 'danger':
        backgroundColor = colors.feedback.danger;
        break;
      case 'ghost':
        backgroundColor = 'transparent';
        break;
      case 'primary':
      default:
        backgroundColor = colors.primary[600];
        break;
    }

    return {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: borderRadius.md,
      opacity: disabled || loading ? 0.6 : 1,
      paddingVertical,
      paddingHorizontal,
      backgroundColor,
      borderWidth,
      borderColor,
    };
  };

  const getTextStyle = (): TextStyle => {
    let fontSizeValue = fontSize.body;
    if (size === 'sm') {
      fontSizeValue = fontSize.caption;
    } else if (size === 'lg') {
      fontSizeValue = fontSize.bodyLarge;
    }

    let color: string = colors.surface;
    switch (variant) {
      case 'outline':
        color = colors.primary[600];
        break;
      case 'ghost':
        color = colors.secondary[700];
        break;
      case 'secondary':
      case 'danger':
      case 'primary':
      default:
        color = colors.surface;
        break;
    }

    return {
      fontWeight: fontWeight.bold,
      textAlign: 'center',
      fontSize: fontSizeValue,
      color,
    };
  };

  const spinnerColor =
    variant === 'outline' || variant === 'ghost' ? colors.primary[600] : colors.surface;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[getContainerStyle(), style]}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size="small" color={spinnerColor} />
      ) : (
        <View style={styles.contentRow}>
          {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
          {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIconContainer: {
    marginRight: spacing.sm,
  },
  rightIconContainer: {
    marginLeft: spacing.sm,
  },
});
