import { buildApiAssetUrl } from '@/services/api';
import { CATEGORIA_CATALOG } from '@/theme/semanticConfig';
import type { Chamado, ChamadoCreateRequest, ChamadoRequest, ChamadoResponse } from '@/types/chamado';
import type { EnderecoFormInput, EnderecoRequest } from '@/types/endereco';
import { onlyDigits } from '@/utils/formatters';
import type { ChamadoCreateFormData, ChamadoFormData } from '@/utils/schemas';

export function stripDataUriPrefix(base64?: string): string | undefined {
  if (!base64) return undefined;
  const cleaned = base64.replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/i, '').trim();
  return cleaned || undefined;
}

export function buildEnderecoRequest(input: EnderecoFormInput): EnderecoRequest {
  const rua = input.rua?.trim().slice(0, 100);
  return {
    cep: onlyDigits(input.cep),
    numero: (input.numero.trim() || 'S/N').slice(0, 100),
    referencia: input.referencia.trim().slice(0, 50),
    ...(rua ? { rua } : {}),
  };
}

export function mapChamadoResponse(item: ChamadoResponse): Chamado {
  const historico = Array.isArray(item.historico) ? item.historico : [];
  return {
    idChamado: item.idChamado,
    titulo: item.titulo,
    descricao: item.descricao,
    dtAbertura: item.dtAbertura,
    categoriaId: item.categoriaId,
    categoriaNome: item.categoriaNome,
    prioridadeId: item.prioridadeId,
    prioridadeNome: item.prioridadeNome,
    orgaoId: item.orgaoId,
    orgaoNome: item.orgaoNome,
    usuarioId: item.usuarioId,
    usuarioNome: item.usuarioNome,
    endereco: item.endereco,
    fotoUrl: item.foto ? buildApiAssetUrl(`${item.foto}?v=${encodeURIComponent(item.dtAbertura)}`) : undefined,
    status: item.status,
    totalVotos: item.totalVotos,
    apoiadoPorMim: item.apoiadoPorMim,
    historico,
  };
}

export function toChamadoCreateRequest(form: ChamadoCreateFormData): ChamadoCreateRequest {
  return {
    endereco: buildEnderecoRequest(form),
    fotoBase64: stripDataUriPrefix(form.fotoBase64) ?? '',
  };
}

export function toChamadoRequest(form: ChamadoFormData): ChamadoRequest {
  const fotoBase64 = stripDataUriPrefix(form.fotoBase64);
  const categoria = CATEGORIA_CATALOG.find((c) => c.id === form.categoriaId)?.nome ?? 'VIAS_E_PAVIMENTACAO';
  return {
    titulo: form.titulo.trim(),
    descricao: form.descricao.trim(),
    categoria,
    endereco: buildEnderecoRequest(form),
    ...(fotoBase64 ? { fotoBase64 } : {}),
  };
}
