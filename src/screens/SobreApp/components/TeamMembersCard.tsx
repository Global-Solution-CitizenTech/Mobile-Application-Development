import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFeedback } from '@/contexts/FeedbackContext';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { borderRadius, spacing } from '@/theme/spacing';
import { fontSize, fontWeight } from '@/theme/typography';
import type { AppTheme } from '@/types/theme';
import type { TeamMembersCardProps } from '@/types/ui';
import { getInitials } from '@/utils/formatters';
import { shadows } from '@/utils/shadow';

export const TeamMembersCard = ({ integrantes }: TeamMembersCardProps) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { showError } = useFeedback();

  const openLink = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        showError('Link indisponível', 'Não há aplicativo compatível para abrir este endereço.');
        return;
      }
      await Linking.openURL(url);
    } catch {
      showError('Erro ao abrir link', 'Não foi possível abrir o endereço no navegador.');
    }
  };

  return (
    <View style={[styles.card, shadows.sm]}>
      <View style={styles.sectionHeaderRow}>
        <Ionicons name="people-outline" size={20} color={theme.text} />
        <Text style={styles.sectionTitle}>Integrantes do Grupo (FIAP)</Text>
      </View>
      <Text style={styles.sectionDescription}>
        Equipe de Engenharia e Desenvolvimento ZelaFix:
      </Text>

      {integrantes.map((integrante) => (
        <View key={integrante.rm} style={styles.memberItem}>
          <View style={styles.memberAvatar}>
            <Text style={styles.memberInitials}>{getInitials(integrante.nome)}</Text>
          </View>
          <View style={styles.memberInfo}>
            <Text style={styles.memberName}>{integrante.nome}</Text>
            <Text style={styles.memberRM}>
              RM: {integrante.rm} • Turma: {integrante.turma || '2TDSPG'}
            </Text>
            <Text style={styles.memberRole}>{integrante.funcao}</Text>

            <View style={styles.socialRow}>
              {integrante.github ? (
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => {
                    void openLink(integrante.github);
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="logo-github" size={14} color={theme.text} />
                  <Text style={styles.socialButtonText}>GitHub</Text>
                </TouchableOpacity>
              ) : null}
              {integrante.linkedin ? (
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => {
                    void openLink(integrante.linkedin);
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="logo-linkedin" size={14} color={theme.info} />
                  <Text style={styles.socialButtonText}>LinkedIn</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>
      ))}
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
    sectionTitle: { fontSize: fontSize.bodyLarge, fontWeight: fontWeight.bold, color: theme.text },
    sectionDescription: {
      fontSize: fontSize.caption,
      color: theme.textSecondary,
      marginBottom: spacing.md,
    },
    memberItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.md,
      paddingVertical: spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.divider,
    },
    memberAvatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    memberInitials: {
      fontSize: fontSize.bodySmall,
      fontWeight: fontWeight.bold,
      color: theme.primaryDark,
    },
    memberInfo: { flex: 1 },
    memberName: { fontSize: fontSize.body, fontWeight: fontWeight.bold, color: theme.text },
    memberRM: { fontSize: fontSize.tiny, color: theme.textSecondary, marginTop: 1 },
    memberRole: { fontSize: fontSize.caption, color: theme.textSecondary, marginTop: 2 },
    socialRow: { flexDirection: 'row', gap: 8, marginTop: spacing.xs + 2 },
    socialButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      backgroundColor: theme.pillBg,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: borderRadius.full,
    },
    socialButtonText: { fontSize: fontSize.tiny, fontWeight: fontWeight.semibold, color: theme.text },
  });
