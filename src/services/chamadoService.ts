import { api } from '@/services/api';
import type { SpringPageResponse } from '@/types/api';
import type { Chamado, ChamadoCreateRequest, ChamadoRequest, ChamadoResponse, ChamadoStatusRequest, EstatisticasChamados } from '@/types/chamado';
import type { FiltroChamados } from '@/types/filters';
import { appendMultipartFile, mapChamadoResponse } from '@/utils/chamadoMappers';

export const chamadoService = {
  async listar(filtros?: FiltroChamados, signal?: AbortSignal): Promise<SpringPageResponse<Chamado>> {
    const { data } = await api.get<SpringPageResponse<ChamadoResponse>>('/chamados', {
      signal,
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

  async buscarPorId(id: number, signal?: AbortSignal): Promise<Chamado> {
    const { data } = await api.get<ChamadoResponse>(`/chamados/${id}`, { signal });
    return mapChamadoResponse(data);
  },

  async criar(payload: ChamadoCreateRequest): Promise<Chamado> {
    const formData = new FormData();
    formData.append('cep', payload.endereco.cep);
    formData.append('numero', payload.endereco.numero);
    formData.append('referencia', payload.endereco.referencia);
    if (payload.endereco.rua) {
      formData.append('rua', payload.endereco.rua);
    }
    appendMultipartFile(formData, 'foto', payload.foto);
    const { data } = await api.post<ChamadoResponse>('/chamados', formData);
    return mapChamadoResponse(data);
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

  async obterEstatisticas(signal?: AbortSignal): Promise<EstatisticasChamados> {
    const { data } = await api.get<EstatisticasChamados>('/chamados/estatisticas', { signal });
    return data;
  },
};
