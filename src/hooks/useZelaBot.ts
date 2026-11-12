import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useChamadoDetail, useChamadosList } from '@/hooks/useChamados';
import { queryKeys } from '@/lib/queryKeys';
import { aiService } from '@/services/aiService';
import type { AiChatSession, AiMessage } from '@/types/ai';

function gerarSessionId(): string {
  return `zf_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

const SUGESTOES_GERAIS = [
  'Qual o prazo para tapar um buraco na rua?',
  'Poste apagado: devo acionar a Ilumina SP ou Prefeitura?',
  'Como denunciar descarte irregular de entulho?',
  'Quais são os direitos do cidadão na zeladoria urbana?',
];

const SUGESTOES_CHAMADO = [
  'Qual órgão municipal atende este chamado?',
  'Qual o prazo regulamentar e prioridade desse problema?',
  'Quais cuidados de segurança devo tomar até o reparo?',
];

export function useZelaBot(initialChamadoId?: number) {
  const { usuario } = useAuth();
  const queryClient = useQueryClient();

  const seedId = initialChamadoId ?? null;
  const [manualSelection, setManualSelection] = useState<{ seed: number | null; id: number | null } | null>(null);
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [sessionId, setSessionId] = useState<string>(gerarSessionId);
  const [inputText, setInputText] = useState('');
  const [historyModalVisible, setHistoryModalVisible] = useState(false);

  const selectedChamadoId = manualSelection?.seed === seedId ? manualSelection.id : seedId;

  useEffect(() => {
    void aiService.warmup();
  }, []);

  const recentChamadosQuery = useChamadosList({ page: 0, size: 12, sort: 'dtAbertura,desc' });
  const detailQuery = useChamadoDetail(selectedChamadoId ?? undefined);

  const selectedChamado = useMemo(() => {
    if (!selectedChamadoId) return null;
    if (detailQuery.chamado && detailQuery.chamado.idChamado === selectedChamadoId) {
      return detailQuery.chamado;
    }
    return recentChamadosQuery.chamados.find((c) => c.idChamado === selectedChamadoId) ?? null;
  }, [detailQuery.chamado, recentChamadosQuery.chamados, selectedChamadoId]);

  const bairroAtivo = selectedChamado?.endereco?.bairro || usuario?.endereco?.bairro || undefined;

  const insightsQuery = useQuery({
    queryKey: queryKeys.ai.insights(bairroAtivo),
    queryFn: () => aiService.obterInsights(bairroAtivo),
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });

  const sessionsQuery = useQuery({
    queryKey: queryKeys.ai.sessions(),
    queryFn: () => aiService.listarSessoes(),
    enabled: historyModalVisible,
    staleTime: 0,
  });

  const sendMutation = useMutation({
    mutationFn: (vars: { pergunta: string; historico: AiMessage[]; sessionId: string }) =>
      aiService.enviarMensagem({
        pergunta: vars.pergunta,
        chamado: selectedChamado,
        historico: vars.historico,
        sessionId: vars.sessionId,
      }),
    onSuccess: (res) => {
      setSessionId(res.sessionId);
      setMessages((prev) => [...prev, res.message]);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'assistant',
          text: 'Não consegui falar com o ZelaBot agora. O serviço de IA pode estar acordando no servidor — tente enviar novamente em alguns segundos.',
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          isError: true,
        },
      ]);
    },
  });

  const loadSessionMutation = useMutation({
    mutationFn: (id: string) => aiService.carregarHistorico(id),
    onSuccess: (loadedMessages, id) => {
      setSessionId(id);
      setMessages(loadedMessages);
      setHistoryModalVisible(false);
    },
  });

  const deleteSessionMutation = useMutation({
    mutationFn: (id: string) => aiService.excluirSessao(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.ai.sessions() });
      const previous = queryClient.getQueryData<AiChatSession[]>(queryKeys.ai.sessions());
      queryClient.setQueryData<AiChatSession[]>(queryKeys.ai.sessions(), (curr) => curr?.filter((s) => s.sessionId !== id) ?? []);
      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(queryKeys.ai.sessions(), ctx.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.ai.sessions() });
    },
  });

  const novaConversa = useCallback(() => {
    setMessages([]);
    setSessionId(gerarSessionId());
  }, []);

  const selecionarChamadoContexto = useCallback(
    (id: number | null) => {
      if (id === selectedChamadoId) return;
      setManualSelection({ seed: seedId, id });
      novaConversa();
    },
    [novaConversa, seedId, selectedChamadoId]
  );

  const enviarPergunta = useCallback(
    (textoCustom?: string) => {
      const texto = (textoCustom ?? inputText).trim();
      if (!texto || sendMutation.isPending) return;

      const userMsg: AiMessage = {
        id: `usr_${Date.now()}`,
        sender: 'user',
        text: texto,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };

      const historicoAtual = messages;
      setMessages((prev) => [...prev, userMsg]);
      if (!textoCustom) setInputText('');

      sendMutation.mutate({ pergunta: texto, historico: historicoAtual, sessionId });
    },
    [inputText, messages, sendMutation, sessionId]
  );

  const removerSessao = useCallback(
    (id: string) => {
      deleteSessionMutation.mutate(id, {
        onSuccess: () => {
          if (id === sessionId) novaConversa();
        },
      });
    },
    [deleteSessionMutation, novaConversa, sessionId]
  );

  return {
    messages,
    sessionId,
    inputText,
    setInputText,
    isSending: sendMutation.isPending,
    enviarPergunta,
    novaConversa,
    chamadosDisponiveis: recentChamadosQuery.chamados,
    selectedChamadoId,
    selectedChamado,
    selecionarChamadoContexto,
    sugestoesRapidas: selectedChamado ? SUGESTOES_CHAMADO : SUGESTOES_GERAIS,
    bairroAtivo,
    insights: insightsQuery.data?.insights ?? [],
    loadingInsights: insightsQuery.isLoading,
    historyModalVisible,
    setHistoryModalVisible,
    sessoes: sessionsQuery.data ?? [],
    loadingSessoes: sessionsQuery.isLoading,
    loadingSessionId: loadSessionMutation.isPending ? loadSessionMutation.variables ?? null : null,
    abrirSessao: (id: string) => loadSessionMutation.mutate(id),
    removerSessao,
  };
}
