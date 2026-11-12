import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme, useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { borderRadius, spacing, fontSize, fontWeight } from '@/theme';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string | null;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
  containerStyle?: ViewStyle;
  inputContainerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  isPassword = false,
  containerStyle,
  inputContainerStyle,
  secureTextEntry,
  onFocus,
  onBlur,
  style,
  ...rest
}) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isSecured = isPassword ? !showPassword : secureTextEntry;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputFocused,
          !!error && styles.inputError,
          inputContainerStyle,
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <TextInput
          style={[styles.textInput, style]}
          placeholderTextColor={theme.textMuted}
          secureTextEntry={isSecured}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />

        {isPassword && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={() => setShowPassword((prev) => !prev)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={theme.textMuted}
            />
          </TouchableOpacity>
        )}

        {!isPassword && rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      marginBottom: spacing.md,
    },
    label: {
      fontSize: fontSize.bodySmall,
      fontWeight: fontWeight.semibold,
      color: theme.textSecondary,
      marginBottom: spacing.xs + 2,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.isDark ? theme.inputBg : theme.surface,
      borderWidth: 1.2,
      borderColor: theme.border,
      borderRadius: borderRadius.md,
      paddingHorizontal: 12,
      minHeight: 48,
    },
    inputFocused: {
      borderColor: theme.primary,
    },
    inputError: {
      borderColor: theme.danger,
      backgroundColor: theme.dangerBg,
    },
    leftIcon: {
      marginRight: spacing.xs + 2,
    },
    rightIcon: {
      marginLeft: spacing.xs + 2,
    },
    textInput: {
      flex: 1,
      fontSize: 15,
      color: theme.text,
      paddingVertical: spacing.sm,
      paddingHorizontal: 0,
      includeFontPadding: false,
      textAlignVertical: 'center',
    },
    errorText: {
      fontSize: fontSize.caption,
      color: theme.danger,
      marginTop: spacing.xs,
      fontWeight: fontWeight.medium,
    },
    helperText: {
      fontSize: fontSize.caption,
      color: theme.textMuted,
      marginTop: spacing.xs,
    },
  });
