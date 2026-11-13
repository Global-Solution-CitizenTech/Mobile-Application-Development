import { View, Text, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/Button';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import type { AppTheme, IoniconName } from '@/theme/types';
import { spacing, fontSize, fontWeight } from '@/theme';

interface EmptyStateProps {
  icon?: IoniconName;
  title: string;
  description: string;
  actionTitle?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const EmptyState = ({
  icon = 'clipboard-outline',
  title,
  description,
  actionTitle,
  onAction,
  style,
}: EmptyStateProps) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={42} color={theme.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {actionTitle && onAction && (
        <Button
          title={actionTitle}
          variant="outline"
          size="sm"
          onPress={onAction}
          style={styles.actionButton}
        />
      )}
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.xxl,
      paddingHorizontal: spacing.lg,
    },
    iconCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
    },
    title: {
      fontSize: fontSize.subtitle,
      fontWeight: fontWeight.bold,
      color: theme.text,
      textAlign: 'center',
      marginBottom: spacing.xs,
    },
    description: {
      fontSize: fontSize.body,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
      marginBottom: spacing.md,
      maxWidth: 280,
    },
    actionButton: {
      marginTop: spacing.xs,
    },
  });
