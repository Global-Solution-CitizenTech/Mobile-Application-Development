import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { borderRadius, spacing } from '@/theme/spacing';
import { fontSize, fontWeight } from '@/theme/typography';
import type { AppTheme } from '@/types/theme';
import type { ProfileMenuCardProps } from '@/types/ui';

export const ProfileMenuCard = ({
  isDark,
  onToggleTheme,
  onPressEditarPerfil,
  onPressZelaBot,
  onPressSobreApp,
}: ProfileMenuCardProps) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.sectionCard}>
      <TouchableOpacity style={styles.menuRow} onPress={onPressEditarPerfil} activeOpacity={0.75}>
        <View style={styles.menuLeft}>
          <Ionicons name="create-outline" size={20} color={theme.primary} />
          <Text style={styles.menuText}>Editar Meus Dados</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
      </TouchableOpacity>

      <View style={styles.divider} />

      <View style={styles.menuRow}>
        <View style={styles.menuLeft}>
          <Ionicons name={isDark ? 'moon' : 'sunny-outline'} size={20} color={theme.primary} />
          <Text style={styles.menuText}>Modo Escuro</Text>
        </View>
        <Switch value={isDark} onValueChange={onToggleTheme} trackColor={{ true: theme.primary }} />
      </View>

      <View style={styles.divider} />

      <TouchableOpacity style={styles.menuRow} onPress={onPressZelaBot} activeOpacity={0.75}>
        <View style={styles.menuLeft}>
          <Ionicons name="sparkles-outline" size={20} color={theme.primary} />
          <Text style={styles.menuText}>ZelaBot IA</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity style={styles.menuRow} onPress={onPressSobreApp} activeOpacity={0.75}>
        <View style={styles.menuLeft}>
          <Ionicons name="information-circle-outline" size={20} color={theme.primary} />
          <Text style={styles.menuText}>Sobre o Aplicativo</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    sectionCard: {
      backgroundColor: theme.surface,
      borderRadius: borderRadius.cardLg,
      borderWidth: 1,
      borderColor: theme.border,
      overflow: 'hidden',
    },
    menuRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md + 2,
    },
    menuLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm + 4,
    },
    menuText: {
      fontSize: fontSize.body,
      fontWeight: fontWeight.semibold,
      color: theme.text,
    },
    divider: {
      height: 1,
      backgroundColor: theme.border,
    },
  });
