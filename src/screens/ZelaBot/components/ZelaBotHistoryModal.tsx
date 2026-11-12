import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BaseModal } from '@/components/BaseModal';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { type AppTheme, useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { borderRadius, fontSize, fontWeight, spacing } from '@/theme';
import type { AiChatSession } from '@/types/ai';
import { formatDate } from '@/utils/formatters';

interface ZelaBotHistoryModalProps {
  visible: boolean;
  onClose: () => void;
  sessoes: AiChatSession[];
  loading: boolean;
  activeSessionId: string;
  loadingSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onNewChat: () => void;
}

export const ZelaBotHistoryModal: React.FC<ZelaBotHistoryModalProps> = ({
  visible,
  onClose,
  sessoes,
  loading,
  activeSessionId,
  loadingSessionId,
  onSelectSession,
  onDeleteSession,
  onNewChat,
}) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <BaseModal visible={visible} title="Histórico de Conversas" subtitle="Consultas salvas no servidor ZelaBot AI" onClose={onClose}>
      {loading ? (
        <LoadingSpinner message="Carregando conversas..." />
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
                  <TouchableOpacity onPress={() => onDeleteSession(item.sessionId)} hitSlop={8} accessibilityLabel="Excluir conversa">
                    <Ionicons name="trash-outline" size={18} color={theme.danger} />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <View style={styles.footer}>
        <Button
          title="Iniciar Nova Conversa"
          variant="outline"
          leftIcon={<Ionicons name="add-circle-outline" size={18} color={theme.primary} />}
          onPress={() => {
            onNewChat();
            onClose();
          }}
        />
      </View>
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
    footer: { marginTop: spacing.md },
  });
