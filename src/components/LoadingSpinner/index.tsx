import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import type { AppTheme } from '@/theme/types';
import { spacing, fontSize, fontWeight } from '@/theme';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
  fullScreen?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const LoadingSpinner = ({
  message,
  size = 'large',
  color,
  fullScreen = false,
  style,
}: LoadingSpinnerProps) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={[styles.container, fullScreen && styles.fullScreen, style]}>
      <ActivityIndicator size={size} color={color ?? theme.primary} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.lg,
    },
    fullScreen: {
      flex: 1,
      backgroundColor: theme.background,
    },
    message: {
      marginTop: spacing.sm,
      fontSize: fontSize.bodySmall,
      fontWeight: fontWeight.medium,
      color: theme.textSecondary,
      textAlign: 'center',
    },
  });
