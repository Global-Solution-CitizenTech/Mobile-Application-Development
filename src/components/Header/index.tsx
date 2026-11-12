import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme, useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { spacing, fontSize, fontWeight } from '@/theme';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  centerTitle?: boolean;
  style?: ViewStyle;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightAction,
  centerTitle = false,
  style,
}) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  if (centerTitle) {
    return (
      <View style={[styles.container, style]}>
        {showBack ? (
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={onBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholderSide} />
        )}

        <Text style={styles.centeredTitle} numberOfLines={1}>
          {title}
        </Text>

        {rightAction ? (
          <View style={styles.rightAction}>{rightAction}</View>
        ) : (
          <View style={styles.placeholderSide} />
        )}
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.leftRow}>
        {showBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
        )}
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {rightAction && <View style={styles.rightAction}>{rightAction}</View>}
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm + 4,
      backgroundColor: theme.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    leftRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    backButton: {
      marginRight: spacing.sm,
      padding: 4,
    },
    iconBtn: {
      padding: 4,
      minWidth: 32,
    },
    placeholderSide: {
      width: 32,
    },
    titleContainer: {
      flex: 1,
    },
    title: {
      fontSize: fontSize.title,
      fontWeight: fontWeight.bold,
      color: theme.text,
    },
    centeredTitle: {
      flex: 1,
      textAlign: 'center',
      fontSize: fontSize.bodyLarge,
      fontWeight: fontWeight.bold,
      color: theme.text,
      marginHorizontal: spacing.xs,
    },
    subtitle: {
      fontSize: fontSize.caption,
      color: theme.textSecondary,
      marginTop: 2,
    },
    rightAction: {
      marginLeft: spacing.sm,
      minWidth: 32,
      alignItems: 'flex-end',
    },
  });
