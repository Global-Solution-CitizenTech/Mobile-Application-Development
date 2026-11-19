import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { borderRadius, spacing } from '@/theme/spacing';
import { fontSize, fontWeight } from '@/theme/typography';
import type { AppTheme, ThemeMode } from '@/types/theme';
import type { ProfileMenuCardProps } from '@/types/ui';

const THEME_OPTIONS: readonly { mode: ThemeMode; label: string }[] = [
  { mode: 'system', label: 'Sistema' },
  { mode: 'light', label: 'Claro' },
  { mode: 'dark', label: 'Escuro' },
];

export const ProfileMenuCard = ({
  themeMode,
  onSelectThemeMode,
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

      <View style={styles.themeRow}>
        <View style={styles.menuLeft}>
          <Ionicons name="contrast-outline" size={20} color={theme.primary} />
          <Text style={styles.menuText}>Aparência</Text>
        </View>
        <View style={styles.themeSegment}>
          {THEME_OPTIONS.map((opt) => {
            const active = themeMode === opt.mode;
            return (
              <TouchableOpacity
                key={opt.mode}
                style={[styles.themeChip, active && styles.themeChipActive]}
                onPress={() => onSelectThemeMode(opt.mode)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <Text style={[styles.themeChipText, active && styles.themeChipTextActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
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
    themeRow: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md + 2,
      gap: spacing.sm,
    },
    themeSegment: {
      flexDirection: 'row',
      backgroundColor: theme.pillBg,
      borderRadius: borderRadius.md,
      padding: 3,
      gap: 4,
    },
    themeChip: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: spacing.xs + 2,
      borderRadius: borderRadius.sm,
    },
    themeChipActive: {
      backgroundColor: theme.primary,
    },
    themeChipText: {
      fontSize: fontSize.caption,
      fontWeight: fontWeight.semibold,
      color: theme.textSecondary,
    },
    themeChipTextActive: {
      color: theme.inverseText,
    },
    divider: {
      height: 1,
      backgroundColor: theme.border,
    },
  });
