type AiSender = 'user' | 'assistant';

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

interface RetrievedSource {
  id: string;
  source: string;
  category: string;
  title: string;
  similarity_score: number;
}

interface AiHistoryMessage {
  sender: 'user' | 'model';
  text: string;
}

export interface AiChatRequest {
  pergunta: string;
  chamadoContext?: ChamadoContextPayload;
  historico?: AiHistoryMessage[];
  sessionId?: string;
}

export interface AiSessionResponse {
  session_id: string;
  titulo: string;
  total_mensagens: number;
  last_activity?: string;
}

export interface AiHistoryResponse {
  id: number;
  sender: string;
  text: string;
  timestamp?: string;
}

export interface AiChatResponse {
  resposta: string;
  categoria: string;
  urgencia: string;
  acoes_recomendadas?: string[];
  origem_resposta: string;
  sessionId?: string;
  sources_used?: RetrievedSource[];
  rag_grounded?: boolean;
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
