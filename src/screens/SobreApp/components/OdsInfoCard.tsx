import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { borderRadius, spacing } from '@/theme/spacing';
import { fontSize, fontWeight } from '@/theme/typography';
import type { AppTheme } from '@/types/theme';
import { shadows } from '@/utils/shadow';

export const OdsInfoCard = () => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={[styles.card, shadows.sm]}>
      <View style={styles.sectionHeaderRow}>
        <Ionicons name="globe-outline" size={20} color={theme.primary} />
        <Text style={styles.sectionTitle}>Alinhamento com a ODS 11 - ONU</Text>
      </View>
      <Text style={styles.odsTitle}>Cidades e Comunidades Sustentáveis</Text>
      <Text style={styles.odsText}>
        O ZelaFix democratiza a zeladoria urbana permitindo que qualquer cidadão identifique,
        priorize colaborativamente e acompanhe problemas em espaços públicos, acelerando a resposta
        do poder público.
      </Text>
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.card,
      borderRadius: borderRadius.cardLg,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: theme.cardBorder,
      marginBottom: spacing.md,
    },
    sectionHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: spacing.xs + 2,
    },
    sectionTitle: {
      fontSize: fontSize.bodyLarge,
      fontWeight: fontWeight.bold,
      color: theme.text,
    },
    odsTitle: {
      fontSize: fontSize.body,
      fontWeight: fontWeight.bold,
      color: theme.primaryDark,
      marginBottom: 4,
    },
    odsText: {
      fontSize: fontSize.caption,
      color: theme.textSecondary,
      lineHeight: 19,
    },
  });
