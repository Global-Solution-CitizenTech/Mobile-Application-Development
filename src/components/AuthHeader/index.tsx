import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { borderRadius, fontSize, fontWeight, shadows, spacing } from '@/theme';
import type { AppTheme } from '@/theme/types';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
  onBack?: () => void;
  showIcon?: boolean;
}

export const AuthHeader = ({ title, subtitle, onBack, showIcon = true }: AuthHeaderProps) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      {onBack ? (
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
      ) : null}

      <View style={styles.headerContent}>
        {showIcon ? (
          <View style={styles.iconCircle}>
            <Image
              source={require('../../../assets/logo-mark.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
        ) : null}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      width: '100%',
      marginBottom: spacing.lg,
    },
    backButton: {
      alignSelf: 'flex-start',
      width: 42,
      height: 42,
      borderRadius: borderRadius.md,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
      ...shadows.sm,
    },
    headerContent: {
      alignItems: 'center',
    },
    iconCircle: {
      width: 64,
      height: 64,
      borderRadius: borderRadius.full,
      backgroundColor: theme.primaryLight,
      borderWidth: 1,
      borderColor: theme.primaryBorder,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.sm + 4,
    },
    logoImage: {
      width: 30,
      height: 42,
    },
    title: {
      fontSize: fontSize.heading + 2,
      fontWeight: fontWeight.extrabold,
      color: theme.text,
      textAlign: 'center',
      marginBottom: 6,
    },
    subtitle: {
      fontSize: fontSize.bodySmall,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 19,
      paddingHorizontal: spacing.md,
    },
  });
