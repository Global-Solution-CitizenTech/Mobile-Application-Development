import { buildApiAssetUrl } from '@/services/api';
import { CATEGORIA_CATALOG } from '@/theme/semanticConfig';
import type { Chamado, ChamadoCreateRequest, ChamadoRequest, ChamadoResponse } from '@/types/chamado';
import type { EnderecoFormInput, EnderecoRequest } from '@/types/endereco';
import { onlyDigits } from '@/utils/formatters';
import type { ChamadoCreateFormData, ChamadoFormData } from '@/utils/schemas';

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
  const { foto, ...rest } = item;
  return {
    ...rest,
    fotoUrl: foto ? buildApiAssetUrl(`${foto}?v=${encodeURIComponent(item.dtAbertura)}`) : undefined,
  };
}

export function toChamadoCreateRequest(form: ChamadoCreateFormData): ChamadoCreateRequest {
  return {
    endereco: buildEnderecoRequest(form),
    foto: form.foto,
  };
}

export function toChamadoRequest(form: ChamadoFormData): ChamadoRequest {
  const categoria = CATEGORIA_CATALOG.find((c) => c.id === form.categoriaId)?.nome;
  if (!categoria) {
    throw new Error(`Categoria desconhecida: ${form.categoriaId}`);
  }
  return {
    titulo: form.titulo.trim(),
    descricao: form.descricao.trim(),
    categoria,
    endereco: buildEnderecoRequest(form),
  };
}
