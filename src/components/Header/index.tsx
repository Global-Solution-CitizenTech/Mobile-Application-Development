import type { ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { borderRadius, fontSize, fontWeight, shadows, spacing } from '@/theme';
import type { AppTheme } from '@/theme/types';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: ReactNode;
  centerTitle?: boolean;
}

export const Header = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightAction,
  centerTitle = false,
}: HeaderProps) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();

  const containerInsets = {
    paddingTop: Math.max(insets.top, spacing.md) + spacing.xs,
    paddingLeft: Math.max(insets.left, spacing.md),
    paddingRight: Math.max(insets.right, spacing.md),
  };

  const backBtn = showBack && onBack ? (
    <TouchableOpacity
      style={styles.backButton}
      onPress={onBack}
      activeOpacity={0.75}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel="Voltar"
    >
      <Ionicons name="arrow-back" size={20} color={theme.text} />
    </TouchableOpacity>
  ) : null;

  if (centerTitle) {
    return (
      <View style={[styles.container, containerInsets]}>
        {backBtn ?? <View style={styles.placeholderSide} />}

        <View style={styles.centeredWrap}>
          <Text style={styles.centeredTitle} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.centeredSubtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        {rightAction ? <View style={styles.rightAction}>{rightAction}</View> : <View style={styles.placeholderSide} />}
      </View>
    );
  }

  return (
    <View style={[styles.container, containerInsets]}>
      <View style={styles.leftRow}>
        {backBtn}
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      {rightAction ? <View style={styles.rightAction}>{rightAction}</View> : null}
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: spacing.sm + 4,
      backgroundColor: theme.background,
      gap: spacing.sm,
    },
    leftRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: spacing.sm + 4,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.md,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.sm,
    },
    placeholderSide: {
      width: 40,
    },
    centeredWrap: {
      flex: 1,
      alignItems: 'center',
    },
    titleContainer: {
      flex: 1,
    },
    title: {
      fontSize: fontSize.title,
      fontWeight: fontWeight.extrabold,
      color: theme.text,
    },
    centeredTitle: {
      fontSize: fontSize.bodyLarge,
      fontWeight: fontWeight.extrabold,
      color: theme.text,
      textAlign: 'center',
    },
    centeredSubtitle: {
      fontSize: fontSize.caption,
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: 2,
    },
    subtitle: {
      fontSize: fontSize.caption,
      color: theme.textSecondary,
      marginTop: 2,
    },
    rightAction: {
      minWidth: 40,
      alignItems: 'flex-end',
    },
  });
