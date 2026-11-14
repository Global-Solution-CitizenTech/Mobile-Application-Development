import { api } from '@/services/api';
import { CATEGORIA_CATALOG } from '@/theme/semanticConfig';
import type { SpringPageResponse } from '@/types/api';
import type { CategoriaResponse } from '@/types/categoria';
import type { Chamado, ChamadoCreateRequest, ChamadoRequest, ChamadoResponse, ChamadoStatusRequest, EstatisticasChamados, RecusaIaResponse } from '@/types/chamado';
import type { FiltroChamados } from '@/types/filters';
import { mapChamadoResponse } from '@/utils/chamadoMappers';

export const chamadoService = {
  async listar(filtros?: FiltroChamados): Promise<SpringPageResponse<Chamado>> {
    const { data } = await api.get<SpringPageResponse<ChamadoResponse>>('/chamados', {
      params: {
        status: filtros?.status || undefined,
        categoria: filtros?.categoria || undefined,
        busca: filtros?.busca?.trim() || undefined,
        apenasMeus: filtros?.apenasMeus ?? undefined,
        cidade: filtros?.cidade?.trim() || undefined,
        bairro: filtros?.bairro?.trim() || undefined,
        estado: filtros?.estado?.trim() || undefined,
        page: filtros?.page ?? 0,
        size: filtros?.size ?? 10,
        sort: filtros?.sort ?? 'dtAbertura,desc',
      },
    });
    return {
      content: (data.content ?? []).map(mapChamadoResponse),
      page: data.page,
    };
  },

  async buscarPorId(id: number): Promise<Chamado> {
    const { data } = await api.get<ChamadoResponse>(`/chamados/${id}`);
    return mapChamadoResponse(data);
  },

  async criar(payload: ChamadoCreateRequest): Promise<void> {
    await api.post('/chamados', payload);
  },

  async atualizar(id: number, payload: ChamadoRequest): Promise<Chamado> {
    const { data } = await api.put<ChamadoResponse>(`/chamados/${id}`, payload);
    return mapChamadoResponse(data);
  },

  async alterarStatus(id: number, payload: ChamadoStatusRequest): Promise<Chamado> {
    const { data } = await api.patch<ChamadoResponse>(`/chamados/${id}/status`, payload);
    return mapChamadoResponse(data);
  },

  async apoiar(id: number): Promise<Chamado> {
    const { data } = await api.post<ChamadoResponse>(`/chamados/${id}/apoiar`);
    return mapChamadoResponse(data);
  },

  async deletar(id: number): Promise<void> {
    await api.delete(`/chamados/${id}`);
  },

  async obterEstatisticas(): Promise<EstatisticasChamados> {
    const { data } = await api.get<EstatisticasChamados>('/chamados/estatisticas');
    return data;
  },

  async obterRecusaRecente(): Promise<RecusaIaResponse> {
    const { data } = await api.get<RecusaIaResponse>('/chamados/recusa-recente');
    return data;
  },

  async listarCategorias(): Promise<CategoriaResponse[]> {
    return [...CATEGORIA_CATALOG];
  },
};
