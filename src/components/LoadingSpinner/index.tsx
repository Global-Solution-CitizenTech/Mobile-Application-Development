import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { spacing } from '@/theme/spacing';
import { fontSize, fontWeight } from '@/theme/typography';
import type { AppTheme } from '@/types/theme';
import type { LoadingSpinnerProps } from '@/types/ui';

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
