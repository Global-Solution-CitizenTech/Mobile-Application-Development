import { useCallback, useEffect, useRef, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useFeedback } from '@/contexts/FeedbackContext';
import { useChamadoDetail, useChamadosList } from '@/hooks/useChamados';
import { queryKeys } from '@/lib/queryKeys';
import { aiService, createAiMessageId } from '@/services/aiService';
import type { AiChatSession, AiInsightItem, AiMessage } from '@/types/ai';
import type { Chamado } from '@/types/chamado';
import { getApiErrorMessage } from '@/utils/apiError';
import { isMeaningfulBairro } from '@/utils/formatters';

function gerarSessionId(): string {
  return `zf_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function isAbortLikeError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const name = 'name' in error && typeof error.name === 'string' ? error.name : '';
  const code = 'code' in error && typeof error.code === 'string' ? error.code : '';
  return name === 'AbortError' || name === 'CanceledError' || code === 'ERR_CANCELED';
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
  const isFocused = useIsFocused();

  const seedId = initialChamadoId ?? null;
  const [manualSelection, setManualSelection] = useState<{
    seed: number | null;
    id: number | null;
  } | null>(null);
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [sessionId, setSessionId] = useState<string>(gerarSessionId);
  const [inputText, setInputText] = useState('');
  const [historyModalVisible, setHistoryModalVisible] = useState(false);

  const activeSessionRef = useRef(sessionId);
  const sendingRef = useRef(false);
  const mountedRef = useRef(true);
  const sessionLoadEpochRef = useRef(0);
  const loadAbortRef = useRef<AbortController | null>(null);
  const wasFocusedRef = useRef(isFocused);
  const prevSeedIdRef = useRef<number | null>(seedId);

  const selectedChamadoId = manualSelection?.seed === seedId ? manualSelection.id : seedId;
  const prevSelectedChamadoIdRef = useRef<number | null>(selectedChamadoId);

  useEffect(() => {
    mountedRef.current = true;
    void aiService.warmup();
    return () => {
      mountedRef.current = false;
      loadAbortRef.current?.abort();
    };
  }, []);

  const activateSession = useCallback((nextSessionId: string) => {
    activeSessionRef.current = nextSessionId;
    setSessionId(nextSessionId);
  }, []);

  const novaConversa = useCallback(() => {
    sessionLoadEpochRef.current += 1;
    loadAbortRef.current?.abort();
    sendingRef.current = false;
    setMessages([]);
    activateSession(gerarSessionId());
  }, [activateSession]);

  // Ao retornar para ZelaBotTab com um chamadoId nos parâmetros (ex.: a partir de ChamadoDetails),
  // limpa uma seleção manual anterior mesmo que o chamadoId seja o mesmo da visita prévia.
  useEffect(() => {
    const gainedFocus = isFocused && !wasFocusedRef.current;
    const seedChanged = seedId !== prevSeedIdRef.current;
    wasFocusedRef.current = isFocused;
    prevSeedIdRef.current = seedId;

    if ((gainedFocus && seedId !== null) || seedChanged) {
      setManualSelection(null);
    }
  }, [isFocused, seedId]);

  useEffect(() => {
    if (prevSelectedChamadoIdRef.current !== selectedChamadoId) {
      prevSelectedChamadoIdRef.current = selectedChamadoId;
      novaConversa();
    }
  }, [novaConversa, selectedChamadoId]);

  const recentChamadosQuery = useChamadosList({ page: 0, size: 12, sort: 'dtAbertura,desc' });
  const detailQuery = useChamadoDetail(selectedChamadoId ?? undefined);

  const selectedChamado = !selectedChamadoId
    ? null
    : detailQuery.chamado?.idChamado === selectedChamadoId
      ? detailQuery.chamado
      : recentChamadosQuery.chamados.find((c) => c.idChamado === selectedChamadoId) ?? null;

  const chamadoBairro = selectedChamado?.endereco?.bairro?.trim();
  const usuarioBairro = usuario?.endereco?.bairro?.trim();
  const bairroAtivo = isMeaningfulBairro(chamadoBairro)
    ? chamadoBairro
    : isMeaningfulBairro(usuarioBairro)
      ? usuarioBairro
      : undefined;

  const insightsQuery = useQuery({
    queryKey: queryKeys.ai.insights(bairroAtivo),
    queryFn: ({ signal }) => aiService.obterInsights(bairroAtivo, signal),
    enabled: Boolean(usuario),
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });

  const sessionsQuery = useQuery({
    queryKey: queryKeys.ai.sessions(),
    queryFn: ({ signal }) => aiService.listarSessoes(30, signal),
    enabled: Boolean(usuario) && historyModalVisible,
    staleTime: 0,
  });

  const sendMutation = useMutation({
    mutationFn: (vars: {
      pergunta: string;
      chamado: Chamado | null;
      historico: AiMessage[];
      sessionId: string;
    }) =>
      aiService.enviarMensagem({
        pergunta: vars.pergunta,
        chamado: vars.chamado,
        historico: vars.historico,
        sessionId: vars.sessionId,
      }),
    onSuccess: (res, vars) => {
      if (!mountedRef.current || vars.sessionId !== activeSessionRef.current) return;
      activateSession(res.sessionId);
      setMessages((prev) => [...prev, res.message]);
    },
    onError: (_err, vars) => {
      if (!mountedRef.current || vars.sessionId !== activeSessionRef.current) return;
      setMessages((prev) => [
        ...prev,
        {
          id: createAiMessageId('err'),
          sender: 'assistant',
          text: 'Não consegui falar com o ZelaBot agora. O serviço de IA pode estar acordando no servidor — tente enviar novamente em alguns segundos.',
          timestamp: new Date().toISOString(),
          isError: true,
        },
      ]);
    },
    onSettled: () => {
      sendingRef.current = false;
    },
  });

  const loadSessionMutation = useMutation({
    mutationFn: (vars: { id: string; epoch: number; signal: AbortSignal }) =>
      aiService.carregarHistorico(vars.id, 80, vars.signal),
    onSuccess: (loadedMessages, vars) => {
      if (!mountedRef.current || vars.epoch !== sessionLoadEpochRef.current) return;
      sendingRef.current = false;
      activateSession(vars.id);
      setMessages(loadedMessages);
      setHistoryModalVisible(false);
    },
    onError: (error, vars) => {
      if (!mountedRef.current || vars.epoch !== sessionLoadEpochRef.current) return;
      if (isAbortLikeError(error)) return;
      showError(
        'Erro na conversa',
        getApiErrorMessage(error, 'Não foi possível carregar a conversa selecionada.')
      );
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

  const selecionarChamadoContexto = useCallback(
    (id: number | null) => {
      if (id === selectedChamadoId) return;
      setManualSelection({ seed: seedId, id });
    },
    [seedId, selectedChamadoId]
  );

  const enviarPergunta = useCallback(
    (textoCustom?: string) => {
      const texto = (textoCustom ?? inputText).trim();
      if (!texto || sendingRef.current || sendMutation.isPending) return;

      sendingRef.current = true;
      const userMsg: AiMessage = {
        id: createAiMessageId('usr'),
        sender: 'user',
        text: texto,
        timestamp: new Date().toISOString(),
      };

      const historicoAtual = messages;
      const currentSession = activeSessionRef.current;
      setMessages((prev) => [...prev, userMsg]);
      if (!textoCustom) setInputText('');

      sendMutation.mutate({
        pergunta: texto,
        chamado: selectedChamado,
        historico: historicoAtual,
        sessionId: currentSession,
      });
    },
    [inputText, messages, selectedChamado, sendMutation]
  );

  const removerSessao = useCallback(
    (id: string) => {
      deleteSessionMutation.mutate(id, {
        onSuccess: () => {
          if (mountedRef.current && id === activeSessionRef.current) {
            novaConversa();
          }
        },
      });
    },
    [deleteSessionMutation, novaConversa]
  );

  const abrirSessao = useCallback(
    (id: string) => {
      const epoch = ++sessionLoadEpochRef.current;
      loadAbortRef.current?.abort();
      const controller = new AbortController();
      loadAbortRef.current = controller;
      loadSessionMutation.mutate({ id, epoch, signal: controller.signal });
    },
    [loadSessionMutation]
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
    insights: insightsQuery.data?.insights ?? EMPTY_INSIGHTS,
    loadingInsights: insightsQuery.isLoading,
    historyModalVisible,
    setHistoryModalVisible,
    sessoes: sessionsQuery.data ?? EMPTY_SESSIONS,
    loadingSessoes: sessionsQuery.isLoading,
    sessionsError: sessionsQuery.error
      ? getApiErrorMessage(sessionsQuery.error, 'Não foi possível carregar o histórico de conversas.')
      : null,
    loadingSessionId: loadSessionMutation.isPending
      ? loadSessionMutation.variables?.id ?? null
      : null,
    abrirSessao,
    removerSessao,
  };
}
