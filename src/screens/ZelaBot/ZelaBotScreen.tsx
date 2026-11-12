import React, { useRef } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { type AppTheme, useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { useZelaBot } from '@/hooks/useZelaBot';
import type { AppStackParamList } from '@/navigation/types';
import { ZelaBotHistoryModal } from '@/screens/ZelaBot/components/ZelaBotHistoryModal';
import { ZelaBotInputBar } from '@/screens/ZelaBot/components/ZelaBotInputBar';
import { ZelaBotInsightsBanner } from '@/screens/ZelaBot/components/ZelaBotInsightsBanner';
import { ZelaBotMessageBubble } from '@/screens/ZelaBot/components/ZelaBotMessageBubble';
import { borderRadius, fontSize, fontWeight, spacing } from '@/theme';
import type { AiMessage } from '@/types/ai';

type Props = NativeStackScreenProps<AppStackParamList, 'ZelaBot'>;

export const ZelaBotScreen: React.FC<Props> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList<AiMessage>>(null);

  const bot = useZelaBot(route.params?.chamadoId);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Header
        title="ZelaBot IA"
        subtitle={bot.selectedChamado ? `Contexto: #${bot.selectedChamado.idChamado}` : 'Assistente de Zeladoria Urbana'}
        showBack
        onBack={() => navigation.goBack()}
        rightAction={
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerBtn} onPress={() => bot.setHistoryModalVisible(true)} activeOpacity={0.75}>
              <Ionicons name="time-outline" size={18} color={theme.text} />
            </TouchableOpacity>
            {bot.messages.length > 0 && (
              <TouchableOpacity style={styles.headerBtn} onPress={bot.novaConversa} activeOpacity={0.75}>
                <Ionicons name="add-outline" size={20} color={theme.primary} />
              </TouchableOpacity>
            )}
          </View>
        }
      />

      <View style={styles.contextStrip}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.contextScroll}>
          <TouchableOpacity
            style={[styles.contextChip, bot.selectedChamadoId === null && styles.contextChipActive]}
            onPress={() => bot.selecionarChamadoContexto(null)}
            activeOpacity={0.75}
          >
            <Ionicons name="earth-outline" size={14} color={bot.selectedChamadoId === null ? theme.inverseText : theme.textSecondary} />
            <Text style={[styles.contextChipText, bot.selectedChamadoId === null && styles.contextChipTextActive]}>
              Consulta Geral
            </Text>
          </TouchableOpacity>

          {bot.chamadosDisponiveis.map((chamado) => {
            const active = bot.selectedChamadoId === chamado.idChamado;
            return (
              <TouchableOpacity
                key={chamado.idChamado}
                style={[styles.contextChip, active && styles.contextChipActive]}
                onPress={() => bot.selecionarChamadoContexto(chamado.idChamado)}
                activeOpacity={0.75}
              >
                <Text style={[styles.contextChipText, active && styles.contextChipTextActive]} numberOfLines={1}>
                  #{chamado.idChamado} · {chamado.titulo}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ZelaBotInsightsBanner bairro={bot.bairroAtivo} insights={bot.insights} loading={bot.loadingInsights} />

      <FlatList
        ref={flatListRef}
        data={bot.messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ZelaBotMessageBubble message={item} />}
        contentContainerStyle={[styles.chatContent, bot.messages.length === 0 && styles.chatContentEmpty]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() => {
          if (bot.messages.length > 0) flatListRef.current?.scrollToEnd({ animated: true });
        }}
        ListEmptyComponent={
          <View style={styles.emptyHero}>
            <View style={styles.heroIcon}>
              <Ionicons name="sparkles" size={28} color={theme.primary} />
            </View>
            <Text style={styles.heroTitle}>Como posso ajudar sua cidade hoje?</Text>
            <Text style={styles.heroDesc}>
              {bot.selectedChamado
                ? `Analisando a ocorrência #${bot.selectedChamado.idChamado} (${bot.selectedChamado.categoriaNome}). Tire dúvidas sobre prazos e órgãos responsáveis.`
                : 'Pergunte sobre prazos municipais, legislação de zeladoria urbana, encaminhamento ou selecione um chamado acima.'}
            </Text>
          </View>
        }
        ListFooterComponent={
          bot.isSending ? (
            <View style={styles.typingRow}>
              <ActivityIndicator size="small" color={theme.primary} />
              <Text style={styles.typingText}>Consultando base normativa ZelaFix...</Text>
            </View>
          ) : undefined
        }
      />

      <ZelaBotInputBar
        value={bot.inputText}
        onChangeText={bot.setInputText}
        onSend={bot.enviarPergunta}
        sugestoes={bot.sugestoesRapidas}
        disabled={bot.isSending}
        bottomInset={insets.bottom}
      />

      <ZelaBotHistoryModal
        visible={bot.historyModalVisible}
        onClose={() => bot.setHistoryModalVisible(false)}
        sessoes={bot.sessoes}
        loading={bot.loadingSessoes}
        activeSessionId={bot.sessionId}
        loadingSessionId={bot.loadingSessionId}
        onSelectSession={bot.abrirSessao}
        onDeleteSession={bot.removerSessao}
        onNewChat={bot.novaConversa}
      />
    </KeyboardAvoidingView>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    headerActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
    headerBtn: {
      width: 34,
      height: 34,
      borderRadius: borderRadius.sm,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    contextStrip: { paddingVertical: spacing.xs + 2, borderBottomWidth: 1, borderBottomColor: theme.border },
    contextScroll: { paddingHorizontal: spacing.md, gap: spacing.xs + 2 },
    contextChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      maxWidth: 210,
      paddingHorizontal: spacing.sm + 4,
      paddingVertical: spacing.xs + 2,
      borderRadius: borderRadius.full,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
    },
    contextChipActive: { backgroundColor: theme.primary, borderColor: theme.primary },
    contextChipText: { fontSize: fontSize.caption, fontWeight: fontWeight.semibold, color: theme.textSecondary },
    contextChipTextActive: { color: theme.inverseText },
    chatContent: { padding: spacing.md, paddingBottom: spacing.sm },
    chatContentEmpty: { flexGrow: 1, justifyContent: 'center' },
    emptyHero: { alignItems: 'center', paddingHorizontal: spacing.lg, gap: spacing.sm },
    heroIcon: {
      width: 56,
      height: 56,
      borderRadius: borderRadius.full,
      backgroundColor: theme.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroTitle: { fontSize: fontSize.subtitle, fontWeight: fontWeight.bold, color: theme.text, textAlign: 'center' },
    heroDesc: { fontSize: fontSize.body, color: theme.textSecondary, textAlign: 'center', lineHeight: 20 },
    typingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm + 2,
      alignSelf: 'flex-start',
    },
    typingText: { fontSize: fontSize.bodySmall, color: theme.textSecondary },
  });
