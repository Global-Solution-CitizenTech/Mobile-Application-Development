import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '@/components/Avatar';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { borderRadius, spacing } from '@/theme/spacing';
import { fontSize, fontWeight } from '@/theme/typography';
import type { AppTheme } from '@/types/theme';
import type { ProfileUserCardProps } from '@/types/ui';
import { formatCep, formatTelefone, isMeaningfulBairro } from '@/utils/formatters';
import { getCargoLabel } from '@/utils/permissions';
import { shadows } from '@/utils/shadow';

export const ProfileUserCard = ({ usuario }: ProfileUserCardProps) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  const endereco = usuario.endereco;
  const bairro = isMeaningfulBairro(endereco?.bairro) ? endereco?.bairro?.trim() : undefined;
  const cidade = endereco?.cidade?.trim() || undefined;
  const localizacaoTexto = [bairro, cidade].filter(Boolean).join(' • ');

  return (
    <View style={styles.card}>
      <Avatar nome={usuario.nome} tamanho="xl" />

      <View style={styles.identity}>
        <Text style={styles.name}>{usuario.nome}</Text>
        <Text style={styles.email}>{usuario.email}</Text>
      </View>

      <View style={styles.rolePill}>
        <Ionicons name="shield-checkmark" size={13} color={theme.primary} />
        <Text style={styles.roleText}>{getCargoLabel(usuario.cargo)}</Text>
      </View>

      <View style={styles.infoPillsRow}>
        {usuario.ddd && usuario.numeroTelefone ? (
          <View style={styles.infoPill}>
            <Ionicons name="call-outline" size={13} color={theme.textSecondary} />
            <Text style={styles.infoPillText}>{formatTelefone(usuario.ddd, usuario.numeroTelefone)}</Text>
          </View>
        ) : null}

        {localizacaoTexto || endereco?.cep ? (
          <View style={styles.infoPill}>
            <Ionicons name="location-outline" size={13} color={theme.textSecondary} />
            <Text style={styles.infoPillText}>
              {localizacaoTexto || `CEP ${formatCep(endereco?.cep)}`}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.surface,
      borderRadius: borderRadius.cardLg,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: 'center',
      gap: spacing.sm + 2,
      ...shadows.sm,
    },
    identity: {
      alignItems: 'center',
      gap: 3,
    },
    name: {
      fontSize: fontSize.title,
      fontWeight: fontWeight.bold,
      color: theme.text,
      textAlign: 'center',
    },
    email: {
      fontSize: fontSize.bodySmall,
      color: theme.textSecondary,
      textAlign: 'center',
    },
    rolePill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: spacing.sm + 4,
      paddingVertical: 5,
      borderRadius: borderRadius.full,
      backgroundColor: theme.primaryLight,
      borderWidth: 1,
      borderColor: theme.primaryBorder,
    },
    roleText: {
      fontSize: fontSize.caption,
      fontWeight: fontWeight.bold,
      color: theme.primaryDark,
    },
    infoPillsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: spacing.xs + 3,
      marginTop: spacing.xs,
    },
    infoPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: spacing.sm + 3,
      paddingVertical: 6,
      borderRadius: borderRadius.full,
      backgroundColor: theme.cardSubtle,
      borderWidth: 1,
      borderColor: theme.border,
    },
    infoPillText: {
      fontSize: fontSize.caption,
      color: theme.textSecondary,
      fontWeight: fontWeight.medium,
    },
  });
