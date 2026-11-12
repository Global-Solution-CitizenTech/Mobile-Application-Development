import { create as createAxios } from 'axios';
import { env } from '@/config/env';
import { createThrottledPing } from '@/services/api';
import type { AiChatRequest, AiChatResponse, AiChatSession, AiInsightsResponse, AiMessage, ChamadoContextPayload } from '@/types/ai';
import type { Chamado } from '@/types/chamado';
import { formatCep } from '@/utils/formatters';

const aiClient = createAxios({
  baseURL: env.aiUrl,
  timeout: 70000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

interface RawSessionItem {
  session_id: string;
  titulo: string;
  total_mensagens: number;
  last_activity?: string;
}

interface RawHistoryItem {
  id: number;
  sender: string;
  text: string;
  timestamp?: string;
}

function formatMessageTime(isoOrHHMM?: string): string {
  if (!isoOrHHMM) {
    return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }
  const parsed = new Date(isoOrHHMM);
  if (Number.isNaN(parsed.getTime())) return isoOrHHMM;
  return parsed.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export function toChamadoContextPayload(chamado?: Chamado | null): ChamadoContextPayload | undefined {
  if (!chamado) return undefined;
  return {
    id: chamado.idChamado,
    protocolo: `#${chamado.idChamado}`,
    categoria: chamado.categoriaNome,
    titulo: chamado.titulo,
    descricao: chamado.descricao,
    bairro: chamado.endereco.bairro || undefined,
    logradouro: chamado.endereco.rua || undefined,
    numero: chamado.endereco.numero || undefined,
    cep: formatCep(chamado.endereco.cep),
    apoios_comunitarios: chamado.totalVotos,
    foto_url: chamado.fotoUrl,
  };
}

export const aiService = {
  warmup: createThrottledPing(() => aiClient.get('/health', { timeout: 20000 })),

  async enviarMensagem(params: {
    pergunta: string;
    chamado?: Chamado | null;
    historico: AiMessage[];
    sessionId: string;
  }): Promise<{ message: AiMessage; sessionId: string }> {
    const payload: AiChatRequest = {
      pergunta: params.pergunta,
      chamadoContext: toChamadoContextPayload(params.chamado),
      historico: params.historico.slice(-10).map((m) => ({
        sender: m.sender === 'user' ? 'user' : 'model',
        text: m.text,
      })),
      sessionId: params.sessionId,
    };

    const { data } = await aiClient.post<AiChatResponse>('/ai/chat', payload);
    const resolvedSessionId = data.sessionId || params.sessionId;

    return {
      sessionId: resolvedSessionId,
      message: {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        text: data.resposta,
        timestamp: formatMessageTime(),
        categoria: data.categoria,
        urgencia: data.urgencia,
        acoesRecomendadas: data.acoes_recomendadas ?? [],
        sourcesUsed: data.sources_used ?? [],
        ragGrounded: data.rag_grounded,
      },
    };
  },

  async obterInsights(bairro?: string): Promise<AiInsightsResponse> {
    const { data } = await aiClient.post<AiInsightsResponse>('/ai/insights', null, {
      params: bairro?.trim() ? { bairro: bairro.trim() } : undefined,
    });
    return data;
  },

  async listarSessoes(limit = 30): Promise<AiChatSession[]> {
    const { data } = await aiClient.get<{ sessoes: RawSessionItem[] }>('/ai/sessions', { params: { limit } });
    return (data.sessoes ?? []).map((item) => ({
      sessionId: item.session_id,
      titulo: item.titulo,
      totalMensagens: item.total_mensagens,
      lastActivity: item.last_activity,
    }));
  },

  async carregarHistorico(sessionId: string, limit = 80): Promise<AiMessage[]> {
    const { data } = await aiClient.get<{ mensagens: RawHistoryItem[] }>('/ai/history', {
      params: { session_id: sessionId, limit },
    });
    return (data.mensagens ?? []).map((m) => ({
      id: `sqlite_${m.id}`,
      sender: m.sender === 'user' ? 'user' : 'assistant',
      text: m.text,
      timestamp: formatMessageTime(m.timestamp),
    }));
  },

  async excluirSessao(sessionId: string): Promise<void> {
    await aiClient.delete(`/ai/sessions/${encodeURIComponent(sessionId)}`);
  },
};
