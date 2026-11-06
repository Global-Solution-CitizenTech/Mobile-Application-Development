/**
 * Serviço de Negócio de Chamados de Zeladoria Urbana
 * Executa as operações CRUD completas integradas com o Axios e com cache local persistente
 */

import { api } from './api';
import { storageService } from './storageService';
import { INITIAL_MOCK_CHAMADOS } from './mockData';
import {
  Chamado,
  CreateChamadoDTO,
  UpdateChamadoDTO,
  FiltroChamados,
  StatusChamado,
  PrioridadeChamado,
  CategoriaChamado,
  Usuario,
  EstatisticasChamados,
} from '../types';

/**
 * Simula a Triagem Inteligente (Visão Computacional + Spring AI / GenAI)
 * quando o backend ainda está em modo mock local.
 */
export function gerarTriagemIaAutomatica(
  categoria: CategoriaChamado,
  titulo: string,
  descricao: string
): {
  prioridade: PrioridadeChamado;
  parecerIa: string;
  orgaoResponsavel: string;
} {
  const texto = `${titulo} ${descricao}`.toLowerCase();
  const temTermoCritico =
    texto.includes('risco') ||
    texto.includes('perigo') ||
    texto.includes('acidente') ||
    texto.includes('fiação') ||
    texto.includes('alagamento') ||
    texto.includes('profundo') ||
    texto.includes('cadeirante') ||
    texto.includes('idoso');

  switch (categoria) {
    case 'Buraco na Rua':
      return {
        prioridade: temTermoCritico ? 'Crítica' : 'Alta',
        orgaoResponsavel: 'Subprefeitura — Equipe de Pavimentação e Tapa-Buraco',
        parecerIa:
          'Triagem IA (Visão + LLM): Deformação asfáltica detectada na via. Risco de acidentes para motociclistas e danos mecânicos. Recomendado reparo prioritário com massa asfáltica.',
      };
    case 'Bueiro Entupido':
      return {
        prioridade: temTermoCritico ? 'Crítica' : 'Alta',
        orgaoResponsavel: 'Subprefeitura — Drenagem Urbana e Hidrojateamento',
        parecerIa:
          'Triagem IA (Visão + LLM): Obstrução de boca de lobo identificada. Risco elevado de bolsão d’água e alagamento em dias de chuva. Recomendada desobstrução preventiva.',
      };
    case 'Iluminação Pública':
      return {
        prioridade: 'Alta',
        orgaoResponsavel: 'Central Ilumina SP — Manutenção de Rede LED',
        parecerIa:
          'Triagem IA (Visão + LLM): Ponto escuro identificado em via pública, comprometendo a segurança noturna de pedestres e moradores. Encaminhado para substituição de luminária.',
      };
    case 'Poda de Árvore':
      return {
        prioridade: temTermoCritico ? 'Crítica' : 'Média',
        orgaoResponsavel: 'Defesa Civil & Equipe de Manejo Arbóreo',
        parecerIa:
          'Triagem IA (Visão + LLM): Interferência arbórea identificada no espaço urbano. Caso haja contato com rede elétrica, requer ação conjunta com a concessionária de energia.',
      };
    case 'Vazamento de Água':
      return {
        prioridade: 'Alta',
        orgaoResponsavel: 'Concessionária de Saneamento (Sabesp) & Fiscalização Municipal',
        parecerIa:
          'Triagem IA (Visão + LLM): Vazamento ativo em via pública com desperdício hídrico e risco de solapamento do asfalto.',
      };
    case 'Sinalização e Trânsito':
      return {
        prioridade: temTermoCritico ? 'Crítica' : 'Alta',
        orgaoResponsavel: 'CET — Engenharia de Tráfego e Sinalização',
        parecerIa:
          'Triagem IA (Visão + LLM): Falha de sinalização viária com impacto direto na segurança do cruzamento e travessia de pedestres.',
      };
    case 'Entulho e Descarte Irregular':
      return {
        prioridade: 'Média',
        orgaoResponsavel: 'Subprefeitura — Limpeza Pública e Fiscalização Ambiental',
        parecerIa:
          'Triagem IA (Visão + LLM): Acúmulo irregular de resíduos sólidos na calçada/via, prejudicando a mobilidade peatonal e higiene do bairro.',
      };
    default:
      return {
        prioridade: temTermoCritico ? 'Alta' : 'Baixa',
        orgaoResponsavel: 'Central de Zeladoria Municipal 156',
        parecerIa:
          'Triagem IA (Visão + LLM): Solicitação de manutenção urbana catalogada e encaminhada para vistoria técnica da regional.',
      };
  }
}

function normalizarChamado(item: Chamado): Chamado {
  let fotoUrl = item.fotoUrl;
  // Migra URLs antigas/quebradas caso estejam em cache no storage do dispositivo
  if (fotoUrl && fotoUrl.includes('photo-1584463699042-4541cb9154a4')) {
    fotoUrl =
      'https://images.unsplash.com/photo-1581375922343-ac6b40caf5e3?auto=format&fit=crop&w=800&q=80';
  } else if (
    fotoUrl &&
    (fotoUrl.includes('photo-1509114397022-ed747cca3f65') ||
      fotoUrl.includes('photo-1517483000871-1dbf64a6e1c6') ||
      fotoUrl.includes('photo-1728318251159-16a855d478a6'))
  ) {
    fotoUrl =
      'https://images.unsplash.com/photo-1780415493361-07c5a78dbaef?auto=format&fit=crop&w=800&q=80';
  }

  const triagem = gerarTriagemIaAutomatica(item.categoria, item.titulo, item.descricao);
  return {
    ...item,
    fotoUrl,
    prioridade: item.prioridade || triagem.prioridade,
    apoiosCount: typeof item.apoiosCount === 'number' ? item.apoiosCount : 12,
    parecerIa: item.parecerIa || triagem.parecerIa,
    orgaoResponsavel: item.orgaoResponsavel || triagem.orgaoResponsavel,
  };
}

export const chamadoService = {
  /**
   * Inicializa o repositório local de chamados caso o cache esteja vazio
   */
  async ensureInitialData(): Promise<Chamado[]> {
    const cached = await storageService.getChamados();
    if (cached && cached.length > 0) {
      const normalizados = cached.map(normalizarChamado);
      return normalizados;
    }
    await storageService.saveChamados(INITIAL_MOCK_CHAMADOS);
    return INITIAL_MOCK_CHAMADOS;
  },

  /**
   * READ: Lista chamados com aplicação de filtros
   */
  async listar(filtros?: FiltroChamados, usuarioId?: string): Promise<Chamado[]> {
    try {
      const response = await api.get<Chamado[]>('/chamados', {
        params: {
          categoria: filtros?.categoria !== 'Todas' ? filtros?.categoria : undefined,
          status: filtros?.status !== 'Todos' ? filtros?.status : undefined,
          busca: filtros?.busca,
          apenasMeus: filtros?.apenasMeus,
        },
      });

      if (response.data && Array.isArray(response.data)) {
        const normalizados = response.data.map(normalizarChamado);
        await storageService.saveChamados(normalizados);
        return normalizados;
      }
    } catch (error: any) {
      console.warn('API offline: Carregando chamados do repositório local persistente.');
    }

    let chamados = await this.ensureInitialData();

    if (filtros) {
      if (filtros.apenasMeus && usuarioId) {
        chamados = chamados.filter((c) => c.autorId === usuarioId);
      }

      if (filtros.status && filtros.status !== 'Todos') {
        chamados = chamados.filter((c) => c.status === filtros.status);
      }

      if (filtros.categoria && filtros.categoria !== 'Todas') {
        chamados = chamados.filter((c) => c.categoria === filtros.categoria);
      }

      if (filtros.busca && filtros.busca.trim() !== '') {
        const query = filtros.busca.toLowerCase().trim();
        chamados = chamados.filter(
          (c) =>
            c.titulo.toLowerCase().includes(query) ||
            c.descricao.toLowerCase().includes(query) ||
            c.protocolo.toLowerCase().includes(query) ||
            c.localizacao.logradouro.toLowerCase().includes(query) ||
            c.localizacao.bairro.toLowerCase().includes(query)
        );
      }
    }

    return chamados;
  },

  /**
   * READ: Busca detalhes de um chamado específico pelo seu ID
   */
  async obterPorId(id: string): Promise<Chamado> {
    // 1. Tenta buscar primeiro no repositório local persistente para resposta instantânea
    const chamados = await this.ensureInitialData();
    const local = chamados.find((c) => c.id === id);

    // 2. Se houver conexão com o backend e resposta rápida (2s timeout), tenta sincronizar
    try {
      const response = await api.get<Chamado>(`/chamados/${id}`, { timeout: 2000 });
      if (response.data) {
        const normalizado = normalizarChamado(response.data);
        const index = chamados.findIndex((c) => c.id === id);
        if (index !== -1) {
          chamados[index] = normalizado;
          await storageService.saveChamados(chamados);
        }
        return normalizado;
      }
    } catch (error: any) {
      // Backend offline ou timeout -> fallback suave para os dados locais já existentes
    }

    if (local && atoChamado(local)) {
      return local;
    }

    throw new Error('Chamado de zeladoria não encontrado.');
  },

  /**
   * CREATE: Cadastra uma nova ocorrência de zeladoria
   */
  async criar(dto: CreateChamadoDTO, autor: Usuario): Promise<Chamado> {
    const triagem = gerarTriagemIaAutomatica(dto.categoria, dto.titulo, dto.descricao);

    try {
      const response = await api.post<Chamado>('/chamados', dto);
      if (response.data) {
        const normalizado = normalizarChamado(response.data);
        const chamados = await this.ensureInitialData();
        await storageService.saveChamados([normalizado, ...chamados]);
        return normalizado;
      }
    } catch (error: any) {
      console.warn('API offline: Criando ocorrência no repositório local.');
    }

    const now = new Date().toISOString();
    const randomProtocolNum = Math.floor(1000 + Math.random() * 9000);
    const prioridadeFinal = dto.prioridade || triagem.prioridade;

    const novoChamado: Chamado = {
      id: `chm_${Date.now()}`,
      protocolo: `ZEL-2026-${randomProtocolNum}`,
      titulo: dto.titulo,
      descricao: dto.descricao,
      categoria: dto.categoria,
      status: 'Aberto',
      prioridade: prioridadeFinal,
      apoiosCount: 1,
      apoiadoPeloUsuario: true,
      parecerIa: dto.parecerIa || triagem.parecerIa,
      orgaoResponsavel: dto.orgaoResponsavel || triagem.orgaoResponsavel,
      localizacao: dto.localizacao,
      fotoUrl:
        dto.fotoUrl ||
        'https://images.unsplash.com/photo-1584463699042-4541cb9154a4?auto=format&fit=crop&w=800&q=80',
      dataAbertura: now,
      dataAtualizacao: now,
      autorId: autor.id,
      autorNome: autor.nome,
      historico: [
        {
          id: `hist_${Date.now()}`,
          data: now,
          novoStatus: 'Aberto',
          observacao: `Ocorrência registrada pelo cidadão. Triagem IA definiu prioridade ${prioridadeFinal}.`,
          autorNome: autor.nome,
        },
      ],
    };

    const chamados = await this.ensureInitialData();
    const atualizados = [novoChamado, ...chamados];
    await storageService.saveChamados(atualizados);

    return novoChamado;
  },

  /**
   * UPDATE: Atualiza os dados de uma ocorrência existente
   */
  async atualizar(id: string, dto: UpdateChamadoDTO, autorNome: string = 'Cidadão'): Promise<Chamado> {
    try {
      const response = await api.put<Chamado>(`/chamados/${id}`, dto);
      if (response.data) {
        const normalizado = normalizarChamado(response.data);
        const chamados = await this.ensureInitialData();
        const index = chamados.findIndex((c) => c.id === id);
        if (index !== -1) {
          chamados[index] = normalizado;
          await storageService.saveChamados(chamados);
        }
        return normalizado;
      }
    } catch (error: any) {
      console.warn(`API offline: Atualizando chamado ${id} localmente.`);
    }

    const chamados = await this.ensureInitialData();
    const index = chamados.findIndex((c) => c.id === id);

    if (index === -1) {
      throw new Error('Chamado não localizado para atualização.');
    }

    const existente = chamados[index];
    const now = new Date().toISOString();

    const atualizado: Chamado = {
      ...existente,
      titulo: dto.titulo ?? existente.titulo,
      descricao: dto.descricao ?? existente.descricao,
      categoria: dto.categoria ?? existente.categoria,
      prioridade: dto.prioridade ?? existente.prioridade,
      localizacao: dto.localizacao ?? existente.localizacao,
      fotoUrl: dto.fotoUrl ?? existente.fotoUrl,
      feedbackResolucao: dto.feedbackResolucao ?? existente.feedbackResolucao,
      status: dto.status ?? existente.status,
      dataAtualizacao: now,
    };

    chamados[index] = atualizado;
    await storageService.saveChamados(chamados);

    return atualizado;
  },

  /**
   * APOIAR / PRIORIZAR: Permite que moradores confirmem/apoiem um problema do bairro
   */
  async apoiar(id: string): Promise<Chamado> {
    try {
      const response = await api.post<Chamado>(`/chamados/${id}/apoiar`);
      if (response.data) {
        const normalizado = normalizarChamado(response.data);
        const chamados = await this.ensureInitialData();
        const index = chamados.findIndex((c) => c.id === id);
        if (index !== -1) {
          chamados[index] = normalizado;
          await storageService.saveChamados(chamados);
        }
        return normalizado;
      }
    } catch (error: any) {
      console.warn(`API offline: Registrando apoio comunitário no chamado ${id} localmente.`);
    }

    const chamados = await this.ensureInitialData();
    const index = chamados.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error('Chamado não localizado.');
    }

    const atual = chamados[index];
    const jaApoiado = !!atual.apoiadoPeloUsuario;
    const novoCount = jaApoiado ? Math.max(1, (atual.apoiosCount || 1) - 1) : (atual.apoiosCount || 0) + 1;

    // Se atingir alto engajamento comunitário (ex: >= 25 apoios), sobe prioridade automaticamente
    let novaPrioridade = atual.prioridade;
    if (!jaApoiado && novoCount >= 25 && atual.prioridade !== 'Crítica') {
      novaPrioridade = 'Crítica';
    } else if (!jaApoiado && novoCount >= 15 && atual.prioridade === 'Média') {
      novaPrioridade = 'Alta';
    }

    const atualizado: Chamado = {
      ...atual,
      apoiosCount: novoCount,
      apoiadoPeloUsuario: !jaApoiado,
      prioridade: novaPrioridade,
    };

    chamados[index] = atualizado;
    await storageService.saveChamados(chamados);
    return atualizado;
  },

  /**
   * UPDATE STATUS: Altera o status do chamado e adiciona evento ao histórico
   */
  async atualizarStatus(
    id: string,
    novoStatus: StatusChamado,
    feedback?: string,
    autorNome: string = 'Equipe Técnica / Cidadão'
  ): Promise<Chamado> {
    try {
      const response = await api.patch<Chamado>(`/chamados/${id}/status`, {
        status: novoStatus,
        feedbackResolucao: feedback,
      });
      if (response.data) {
        const normalizado = normalizarChamado(response.data);
        const chamados = await this.ensureInitialData();
        const index = chamados.findIndex((c) => c.id === id);
        if (index !== -1) {
          chamados[index] = normalizado;
          await storageService.saveChamados(chamados);
        }
        return normalizado;
      }
    } catch (error: any) {
      console.warn(`API offline: Atualizando status do chamado ${id} localmente.`);
    }

    const chamados = await this.ensureInitialData();
    const index = chamados.findIndex((c) => c.id === id);

    if (index === -1) {
      throw new Error('Chamado não localizado.');
    }

    const atual = chamados[index];
    const now = new Date().toISOString();

    const novoHistorico = [
      ...(atual.historico || []),
      {
        id: `hist_${Date.now()}`,
        data: now,
        statusAnterior: atual.status,
        novoStatus: novoStatus,
        observacao:
          feedback ||
          (novoStatus === 'Resolvido'
            ? 'Reparo concluído e vistoriado.'
            : novoStatus === 'Em Andamento'
            ? 'Ordem de serviço despachada para a equipe de campo.'
            : 'Chamado reaberto para reavaliação.'),
        autorNome: autorNome,
      },
    ];

    const atualizado: Chamado = {
      ...atual,
      status: novoStatus,
      feedbackResolucao: feedback || atual.feedbackResolucao,
      dataAtualizacao: now,
      historico: novoHistorico,
    };

    chamados[index] = atualizado;
    await storageService.saveChamados(chamados);

    return atualizado;
  },

  /**
   * DELETE: Remove uma ocorrência do sistema
   */
  async excluir(id: string): Promise<boolean> {
    try {
      await api.delete(`/chamados/${id}`);
    } catch (error: any) {
      console.warn(`API offline: Excluindo chamado ${id} localmente.`);
    }

    const chamados = await this.ensureInitialData();
    const filtrados = chamados.filter((c) => c.id !== id);
    await storageService.saveChamados(filtrados);

    return true;
  },

  /**
   * Estatísticas consolidadas de zeladoria urbana
   */
  obterEstatisticas(chamados: Chamado[]): EstatisticasChamados {
    const total = chamados.length;
    const abertos = chamados.filter((c) => c.status === 'Aberto').length;
    const emAndamento = chamados.filter((c) => c.status === 'Em Andamento').length;
    const resolvidos = chamados.filter((c) => c.status === 'Resolvido').length;
    const taxaResolucao = total > 0 ? Math.round((resolvidos / total) * 100) : 0;

    return {
      total,
      abertos,
      emAndamento,
      resolvidos,
      taxaResolucao,
    };
  },

  /**
   * Restaura o banco de demonstração original
   */
  async resetarMock(): Promise<Chamado[]> {
    await storageService.saveChamados(INITIAL_MOCK_CHAMADOS);
    return INITIAL_MOCK_CHAMADOS;
  },
};

function atoChamado(chamado: any): chamado is Chamado {
  return chamado && typeof chamado.id === 'string';
}
