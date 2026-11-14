import { useRef, useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { MessageListSeparator } from '@/components/ListSeparator';
import { PickerTriggerButton, SelectPickerModal } from '@/components/SelectPickerModal';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { useZelaBot } from '@/hooks/useZelaBot';
import type { AppTabRouteProp } from '@/navigation/types';
import { ZelaBotHistoryModal } from '@/screens/ZelaBot/components/ZelaBotHistoryModal';
import { ZelaBotInputBar } from '@/screens/ZelaBot/components/ZelaBotInputBar';
import { ZelaBotInsightsBanner } from '@/screens/ZelaBot/components/ZelaBotInsightsBanner';
import { ZelaBotMessageBubble } from '@/screens/ZelaBot/components/ZelaBotMessageBubble';
import { borderRadius, fontSize, fontWeight, spacing } from '@/theme';
import type { AppTheme } from '@/theme/types';
import type { AiMessage } from '@/types/ai';
import type { SelectPickerOption } from '@/types/filters';

const GERAL_CONTEXT_KEY = '__GERAL__';

export const ZelaBotScreen = () => {
  const route = useRoute<AppTabRouteProp<'ZelaBotTab'>>();
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList<AiMessage>>(null);
  const [contextModalVisible, setContextModalVisible] = useState(false);

  const bot = useZelaBot(route.params?.chamadoId);

  const contextOptions: SelectPickerOption<string>[] = [
    {
      value: GERAL_CONTEXT_KEY,
      label: 'Consulta Geral',
      subtitle: 'Dúvidas sobre prazos, decretos e direitos municipais',
    },
    ...bot.chamadosDisponiveis.map((chamado) => ({
      value: String(chamado.idChamado),
      label: `#${chamado.idChamado} · ${chamado.titulo}`,
      subtitle: [chamado.categoriaNome, chamado.endereco.bairro, chamado.endereco.cidade]
        .filter(Boolean)
        .join(' • '),
    })),
  ];

  const currentContextLabel = bot.selectedChamado
    ? `#${bot.selectedChamado.idChamado} · ${bot.selectedChamado.titulo}`
    : 'Consulta Geral';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header
        title="ZelaBot IA"
        subtitle={
          bot.selectedChamado
            ? `Analisando chamado #${bot.selectedChamado.idChamado}`
            : 'Assistente cívico de zeladoria urbana'
        }
        rightAction={
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerBtn}
              onPress={() => bot.setHistoryModalVisible(true)}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel="Histórico de conversas"
            >
              <Ionicons name="time-outline" size={18} color={theme.text} />
            </TouchableOpacity>
            {bot.messages.length > 0 ? (
              <TouchableOpacity
                style={styles.headerBtn}
                onPress={bot.novaConversa}
                activeOpacity={0.75}
                accessibilityRole="button"
                accessibilityLabel="Nova conversa"
              >
                <Ionicons name="add-outline" size={20} color={theme.primary} />
              </TouchableOpacity>
            ) : null}
          </View>
        }
      />

      <View
        style={[
          styles.contextBox,
          {
            paddingLeft: Math.max(insets.left, spacing.md),
            paddingRight: Math.max(insets.right, spacing.md),
          },
        ]}
      >
        <PickerTriggerButton
          icon={bot.selectedChamado ? 'document-text-outline' : 'earth-outline'}
          label="Contexto selecionado"
          valueLabel={currentContextLabel}
          active={Boolean(bot.selectedChamado)}
          fullWidth
          onPress={() => setContextModalVisible(true)}
        />
      </View>

      <View style={styles.insightsWrap}>
        <ZelaBotInsightsBanner bairro={bot.bairroAtivo} insights={bot.insights} loading={bot.loadingInsights} />
      </View>

      <FlatList
        ref={flatListRef}
        data={bot.messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ZelaBotMessageBubble message={item} />}
        contentContainerStyle={[
          styles.chatContent,
          {
            paddingLeft: Math.max(insets.left, spacing.md),
            paddingRight: Math.max(insets.right, spacing.md),
          },
          bot.messages.length === 0 && styles.chatContentEmpty,
        ]}
        ItemSeparatorComponent={MessageListSeparator}
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
                : 'Pergunte sobre prazos municipais, legislação de zeladoria urbana, encaminhamento ou toque em "Contexto selecionado" acima para vincular um chamado.'}
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
      />

      <SelectPickerModal
        visible={contextModalVisible}
        onClose={() => setContextModalVisible(false)}
        title="Contexto do ZelaBot"
        subtitle="Escolha um chamado específico ou use Consulta Geral"
        options={contextOptions}
        selectedValue={bot.selectedChamadoId ? String(bot.selectedChamadoId) : GERAL_CONTEXT_KEY}
        onSelect={(val) =>
          bot.selecionarChamadoContexto(val === GERAL_CONTEXT_KEY ? null : Number(val))
        }
        searchable={contextOptions.length > 5}
        searchPlaceholder="Buscar por título, protocolo ou bairro..."
      />

      <ZelaBotHistoryModal
        visible={bot.historyModalVisible}
        onClose={() => bot.setHistoryModalVisible(false)}
        sessoes={bot.sessoes}
        loading={bot.loadingSessoes}
        error={bot.sessionsError}
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
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs + 2,
    },
    headerBtn: {
      width: 38,
      height: 38,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    contextBox: {
      paddingBottom: spacing.sm,
    },
    insightsWrap: {
      marginBottom: spacing.xs,
    },
    chatContent: {
      paddingTop: spacing.sm,
      paddingBottom: spacing.md,
    },
    chatContentEmpty: {
      flexGrow: 1,
      justifyContent: 'center',
    },
    emptyHero: {
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
      gap: spacing.sm + 2,
    },
    heroIcon: {
      width: 60,
      height: 60,
      borderRadius: borderRadius.full,
      backgroundColor: theme.primaryLight,
      borderWidth: 1,
      borderColor: theme.primaryBorder,
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroTitle: {
      fontSize: fontSize.title,
      fontWeight: fontWeight.extrabold,
      color: theme.text,
      textAlign: 'center',
    },
    heroDesc: {
      fontSize: fontSize.body,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 21,
    },
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
      marginTop: spacing.sm,
      alignSelf: 'flex-start',
    },
    typingText: {
      fontSize: fontSize.bodySmall,
      color: theme.textSecondary,
    },
  });
