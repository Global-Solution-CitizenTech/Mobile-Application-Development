import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useFeedback } from '@/contexts/FeedbackContext';
import { useChamadoDetail, useChamadosList } from '@/hooks/useChamados';
import { queryKeys } from '@/lib/queryKeys';
import { aiService } from '@/services/aiService';
import type { AiChatSession, AiInsightItem, AiMessage } from '@/types/ai';
import { getApiErrorMessage } from '@/utils/apiError';

function gerarSessionId(): string {
  return `zf_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

const EMPTY_INSIGHTS: AiInsightItem[] = [];
const EMPTY_SESSIONS: AiChatSession[] = [];

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
  const { showError } = useFeedback();
  const queryClient = useQueryClient();

  const seedId = initialChamadoId ?? null;
  const [manualSelection, setManualSelection] = useState<{ seed: number | null; id: number | null } | null>(null);
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [sessionId, setSessionId] = useState<string>(gerarSessionId);
  const activeSessionRef = useRef(sessionId);
  const [inputText, setInputText] = useState('');
  const [historyModalVisible, setHistoryModalVisible] = useState(false);

  const selectedChamadoId = manualSelection?.seed === seedId ? manualSelection.id : seedId;

  const activateSession = (nextSessionId: string) => {
    activeSessionRef.current = nextSessionId;
    setSessionId(nextSessionId);
  };

  useEffect(() => {
    void aiService.warmup();
  }, []);

  const recentChamadosQuery = useChamadosList({ page: 0, size: 12, sort: 'dtAbertura,desc' });
  const detailQuery = useChamadoDetail(selectedChamadoId ?? undefined);

  const selectedChamado = !selectedChamadoId
    ? null
    : detailQuery.chamado?.idChamado === selectedChamadoId
      ? detailQuery.chamado
      : recentChamadosQuery.chamados.find((c) => c.idChamado === selectedChamadoId) ?? null;

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
    onSuccess: (res, vars) => {
      if (vars.sessionId !== activeSessionRef.current) return;
      activateSession(res.sessionId);
      setMessages((prev) => [...prev, res.message]);
    },
    onError: (_err, vars) => {
      if (vars.sessionId !== activeSessionRef.current) return;
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'assistant',
          text: 'Não consegui falar com o ZelaBot agora. O serviço de IA pode estar acordando no servidor — tente enviar novamente em alguns segundos.',
          timestamp: new Date().toISOString(),
          isError: true,
        },
      ]);
    },
  });

  const loadSessionMutation = useMutation({
    mutationFn: (id: string) => aiService.carregarHistorico(id),
    onSuccess: (loadedMessages, id) => {
      activateSession(id);
      setMessages(loadedMessages);
      setHistoryModalVisible(false);
    },
    onError: (error) => {
      showError('Erro na conversa', getApiErrorMessage(error, 'Não foi possível carregar a conversa selecionada.'));
    },
  });

  const deleteSessionMutation = useMutation({
    mutationFn: (id: string) => aiService.excluirSessao(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.ai.sessions() });
      const previous = queryClient.getQueryData<AiChatSession[]>(queryKeys.ai.sessions());
      queryClient.setQueryData<AiChatSession[]>(
        queryKeys.ai.sessions(),
        (curr) => curr?.filter((s) => s.sessionId !== id) ?? []
      );
      return { previous };
    },
    onError: (error, _id, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(queryKeys.ai.sessions(), ctx.previous);
      }
      showError('Erro na conversa', getApiErrorMessage(error, 'Não foi possível excluir a conversa.'));
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.ai.sessions() });
    },
  });

  const novaConversa = () => {
    setMessages([]);
    activateSession(gerarSessionId());
  };

  const selecionarChamadoContexto = (id: number | null) => {
    if (id === selectedChamadoId) return;
    setManualSelection({ seed: seedId, id });
    novaConversa();
  };

  const enviarPergunta = (textoCustom?: string) => {
    const texto = (textoCustom ?? inputText).trim();
    if (!texto || sendMutation.isPending) return;

    const userMsg: AiMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: texto,
      timestamp: new Date().toISOString(),
    };

    const historicoAtual = messages;
    const currentSession = activeSessionRef.current;
    setMessages((prev) => [...prev, userMsg]);
    if (!textoCustom) setInputText('');

    sendMutation.mutate({ pergunta: texto, historico: historicoAtual, sessionId: currentSession });
  };

  const removerSessao = (id: string) => {
    deleteSessionMutation.mutate(id, {
      onSuccess: () => {
        if (id === activeSessionRef.current) novaConversa();
      },
    });
  };

  const abrirSessao = (id: string) => loadSessionMutation.mutate(id);

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
    insights: insightsQuery.data?.insights ?? EMPTY_INSIGHTS,
    loadingInsights: insightsQuery.isLoading,
    historyModalVisible,
    setHistoryModalVisible,
    sessoes: sessionsQuery.data ?? EMPTY_SESSIONS,
    loadingSessoes: sessionsQuery.isLoading,
    sessionsError: sessionsQuery.error
      ? getApiErrorMessage(sessionsQuery.error, 'Não foi possível carregar o histórico de conversas.')
      : null,
    loadingSessionId: loadSessionMutation.isPending ? loadSessionMutation.variables ?? null : null,
    abrirSessao,
    removerSessao,
  };
}
