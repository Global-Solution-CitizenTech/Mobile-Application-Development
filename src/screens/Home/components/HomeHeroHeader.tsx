import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '@/components/Avatar';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { borderRadius, spacing } from '@/theme/spacing';
import { fontSize, fontWeight } from '@/theme/typography';
import type { AppTheme } from '@/types/theme';
import type { HomeHeroHeaderProps } from '@/types/ui';
import { getFirstName, isMeaningfulBairro } from '@/utils/formatters';

export const HomeHeroHeader = ({ usuario, onPressProfile, onPressRadar }: HomeHeroHeaderProps) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  const bairro = usuario?.endereco?.bairro?.trim();
  const cidade = usuario?.endereco?.cidade?.trim();
  const subtitle =
    isMeaningfulBairro(bairro) && cidade
      ? `${bairro}, ${cidade}`
      : isMeaningfulBairro(bairro)
        ? bairro
        : cidade || 'Zeladoria urbana colaborativa';

  return (
    <View style={styles.heroHeader}>
      <TouchableOpacity style={styles.userProfileRow} onPress={onPressProfile} activeOpacity={0.75}>
        <Avatar nome={usuario?.nome} tamanho="md" />
        <View style={styles.greetingBox}>
          <Text style={styles.greeting}>Olá, {getFirstName(usuario?.nome)}!</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.radarPill} onPress={onPressRadar} activeOpacity={0.85}>
        <Ionicons name="compass-outline" size={16} color={theme.primary} />
        <Text style={styles.radarPillText}>Radar</Text>
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    heroHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.sm,
    },
    userProfileRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm + 4,
      flex: 1,
    },
    greetingBox: { flex: 1 },
    greeting: { fontSize: fontSize.heading, fontWeight: fontWeight.extrabold, color: theme.text },
    subtitle: { fontSize: fontSize.bodySmall, color: theme.textSecondary, marginTop: 2 },
    radarPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: theme.primaryLight,
      borderWidth: 1,
      borderColor: theme.primaryBorder,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.full,
    },
    radarPillText: { fontSize: fontSize.bodySmall, fontWeight: fontWeight.bold, color: theme.primaryDark },
  });
