import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import type { AppTheme } from '@/theme/types';
import { borderRadius, fontSize, fontWeight, shadows, spacing } from '@/theme';
import type { Usuario } from '@/types/auth';
import { formatCep, formatTelefone, getInitials } from '@/utils/formatters';
import { getCargoLabel } from '@/utils/permissions';

interface ProfileUserCardProps {
  usuario: Usuario;
}

export const ProfileUserCard = ({ usuario }: ProfileUserCardProps) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  const endereco = usuario.endereco;
  const linhaEndereco = [endereco?.rua, endereco?.numero].filter(Boolean).join(', ');
  const linhaCidade = [endereco?.bairro, endereco?.cidade, endereco?.estado].filter(Boolean).join(' • ');

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(usuario.nome)}</Text>
        </View>
        <View style={styles.identity}>
          <Text style={styles.name}>{usuario.nome}</Text>
          <Text style={styles.email}>{usuario.email}</Text>
          <View style={styles.rolePill}>
            <Ionicons name="shield-checkmark-outline" size={12} color={theme.primary} />
            <Text style={styles.roleText}>{getCargoLabel(usuario.cargo)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.infoList}>
        <View style={styles.infoRow}>
          <Ionicons name="call-outline" size={16} color={theme.textMuted} />
          <Text style={styles.infoText}>{formatTelefone(usuario.ddd, usuario.numeroTelefone)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={16} color={theme.textMuted} />
          <View style={styles.addressCol}>
            <Text style={styles.infoText}>{linhaEndereco || 'Endereço cadastrado'}</Text>
            {linhaCidade ? <Text style={styles.infoSub}>{linhaCidade}</Text> : null}
            <Text style={styles.infoSub}>
              CEP {formatCep(endereco?.cep)} {endereco?.referencia ? `• Ref: ${endereco.referencia}` : ''}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: theme.border,
      gap: spacing.md,
      ...shadows.sm,
    },
    headerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: borderRadius.full,
      backgroundColor: theme.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: { fontSize: fontSize.title, fontWeight: fontWeight.extrabold, color: theme.primary },
    identity: { flex: 1, gap: 3 },
    name: { fontSize: fontSize.subtitle, fontWeight: fontWeight.bold, color: theme.text },
    email: { fontSize: fontSize.bodySmall, color: theme.textSecondary },
    rolePill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      alignSelf: 'flex-start',
      marginTop: 4,
      paddingHorizontal: spacing.sm,
      paddingVertical: 3,
      borderRadius: borderRadius.full,
      backgroundColor: theme.primaryLight,
    },
    roleText: { fontSize: fontSize.tiny + 1, fontWeight: fontWeight.bold, color: theme.primary },
    divider: { height: 1, backgroundColor: theme.border },
    infoList: { gap: spacing.sm },
    infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
    addressCol: { flex: 1, gap: 2 },
    infoText: { fontSize: fontSize.body, color: theme.text, fontWeight: fontWeight.medium },
    infoSub: { fontSize: fontSize.caption, color: theme.textSecondary },
  });
