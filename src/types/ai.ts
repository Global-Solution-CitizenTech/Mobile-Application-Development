export type AiSender = 'user' | 'assistant';

export interface ChamadoContextPayload {
  id?: number;
  protocolo?: string;
  categoria: string;
  titulo: string;
  descricao?: string;
  bairro?: string;
  logradouro?: string;
  numero?: string;
  cep?: string;
  apoios_comunitarios?: number;
  foto_url?: string;
}

export interface RetrievedSource {
  id: string;
  source: string;
  category: string;
  title: string;
  similarity_score: number;
}

export interface AiChatRequest {
  pergunta: string;
  chamadoContext?: ChamadoContextPayload;
  historico?: { sender: string; text: string }[];
  sessionId?: string;
}

export interface AiChatResponse {
  resposta: string;
  categoria: string;
  urgencia: string;
  acoes_recomendadas?: string[];
  origem_resposta: string;
  sessionId?: string;
  sources_used: RetrievedSource[];
  rag_grounded: boolean;
}

export interface AiMessage {
  id: string;
  sender: AiSender;
  text: string;
  timestamp: string;
  categoria?: string;
  urgencia?: string;
  acoesRecomendadas?: string[];
  sourcesUsed?: RetrievedSource[];
  ragGrounded?: boolean;
  isError?: boolean;
}

export interface AiChatSession {
  sessionId: string;
  titulo: string;
  totalMensagens: number;
  lastActivity?: string;
}

export interface AiInsightItem {
  categoria: string;
  titulo: string;
  descricao: string;
  urgencia: string;
}

export interface AiInsightsResponse {
  bairro: string;
  total_alertas: number;
  insights: AiInsightItem[];
}
