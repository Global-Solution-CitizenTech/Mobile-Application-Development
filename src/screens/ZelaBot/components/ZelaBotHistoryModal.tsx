import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BaseModal } from '@/components/BaseModal';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { borderRadius, spacing } from '@/theme/spacing';
import { fontSize, fontWeight } from '@/theme/typography';
import type { AppTheme } from '@/types/theme';
import type { ZelaBotHistoryModalProps } from '@/types/ui';
import { formatDate } from '@/utils/formatters';

export const ZelaBotHistoryModal = ({
  visible,
  onClose,
  sessoes,
  loading,
  error,
  activeSessionId,
  loadingSessionId,
  onSelectSession,
  onDeleteSession,
  onNewChat,
}: ZelaBotHistoryModalProps) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  const footer = !loading && !error ? (
    <Button
      title="Nova Conversa Geral"
      variant="outline"
      leftIcon={<Ionicons name="add-circle-outline" size={18} color={theme.primary} />}
      onPress={() => {
        onNewChat();
        onClose();
      }}
    />
  ) : undefined;

  return (
    <BaseModal
      visible={visible}
      title="Histórico de Conversas"
      subtitle="Consultas salvas no servidor ZelaBot AI"
      onClose={onClose}
      footer={footer}
    >
      {loading ? (
        <LoadingSpinner message="Carregando conversas..." />
      ) : error ? (
        <EmptyState
          icon="alert-circle-outline"
          title="Erro ao carregar histórico"
          description={error}
        />
      ) : sessoes.length === 0 ? (
        <EmptyState
          icon="chatbubbles-outline"
          title="Nenhuma conversa anterior"
          description="Suas conversas com o ZelaBot aparecerão aqui automaticamente."
        />
      ) : (
        <View style={styles.list}>
          {sessoes.map((item) => {
            const isActive = item.sessionId === activeSessionId;
            const isLoadingThis = loadingSessionId === item.sessionId;
            return (
              <TouchableOpacity
                key={item.sessionId}
                style={[styles.card, isActive && styles.cardActive]}
                onPress={() => onSelectSession(item.sessionId)}
                disabled={Boolean(loadingSessionId)}
                activeOpacity={0.75}
              >
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {item.titulo || 'Consulta de zeladoria'}
                  </Text>
                  <Text style={styles.cardMeta}>
                    {item.totalMensagens} mensagens {item.lastActivity ? `• ${formatDate(item.lastActivity)}` : ''}
                  </Text>
                </View>

                {isLoadingThis ? (
                  <ActivityIndicator size="small" color={theme.primary} />
                ) : (
                  <TouchableOpacity
                    onPress={(event) => {
                      event.stopPropagation();
                      onDeleteSession(item.sessionId);
                    }}
                    hitSlop={8}
                    accessibilityLabel="Excluir conversa"
                  >
                    <Ionicons name="trash-outline" size={18} color={theme.danger} />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </BaseModal>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    list: { gap: spacing.sm },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      padding: spacing.sm + 4,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.cardSubtle,
    },
    cardActive: { borderColor: theme.primary, backgroundColor: theme.primaryLight },
    cardBody: { flex: 1, gap: 4 },
    cardTitle: { fontSize: fontSize.body, fontWeight: fontWeight.semibold, color: theme.text },
    cardMeta: { fontSize: fontSize.caption, color: theme.textSecondary },
  });
