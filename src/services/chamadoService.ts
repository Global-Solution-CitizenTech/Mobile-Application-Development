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
  Usuario,
  EstatisticasChamados,
} from '../types';

export const chamadoService = {
  /**
   * Inicializa o repositório local de chamados caso o cache esteja vazio
   */
  async ensureInitialData(): Promise<Chamado[]> {
    const cached = await storageService.getChamados();
    if (cached && cached.length > 0) {
      return cached;
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
        await storageService.saveChamados(response.data);
        return response.data;
      }
    } catch (error: any) {
      // Se a API externa estiver offline, lê do armazenamento local com os filtros aplicados
      console.warn('API offline: Carregando chamados do repositório local persistente.');
    }

    // Leitura do cache local
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
    try {
      const response = await api.get<Chamado>(`/chamados/${id}`);
      return response.data;
    } catch (error: any) {
      console.warn(`API offline: Buscando chamado ${id} no cache local.`);
    }

    const chamados = await this.ensureInitialData();
    const chamado = chamados.find((c) => c.id === id);

    if (!atoChamado(chamado)) {
      throw new Error('Chamado de zeladoria não encontrado.');
    }

    return chamado;
  },

  /**
   * CREATE: Cadastra uma nova ocorrência de zeladoria
   */
  async criar(dto: CreateChamadoDTO, autor: Usuario): Promise<Chamado> {
    try {
      const response = await api.post<Chamado>('/chamados', dto);
      if (response.data) {
        // Atualiza cache
        const chamados = await this.ensureInitialData();
        await storageService.saveChamados([response.data, ...chamados]);
        return response.data;
      }
    } catch (error: any) {
      console.warn('API offline: Criando ocorrência no repositório local.');
    }

    // Criação em modo resiliente local
    const now = new Date().toISOString();
    const randomProtocolNum = Math.floor(1000 + Math.random() * 9000);
    const novoChamado: Chamado = {
      id: `chm_${Date.now()}`,
      protocolo: `ZEL-2026-${randomProtocolNum}`,
      titulo: dto.titulo,
      descricao: dto.descricao,
      categoria: dto.categoria,
      status: 'Aberto',
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
          observacao: 'Ocorrência registrada no sistema pelo cidadão.',
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
        const chamados = await this.ensureInitialData();
        const index = chamados.findIndex((c) => c.id === id);
        if (index !== -1) {
          chamados[index] = response.data;
          await storageService.saveChamados(chamados);
        }
        return response.data;
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
        const chamados = await this.ensureInitialData();
        const index = chamados.findIndex((c) => c.id === id);
        if (index !== -1) {
          chamados[index] = response.data;
          await storageService.saveChamados(chamados);
        }
        return response.data;
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

