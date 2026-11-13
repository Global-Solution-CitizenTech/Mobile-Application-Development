import { buildApiAssetUrl } from '@/services/api';
import type { Chamado, ChamadoRequest, ChamadoResponse, HistoricoChamado, TriagemIa } from '@/types/chamado';
import type { EnderecoFormInput, EnderecoRequest } from '@/types/endereco';
import { onlyDigits } from '@/utils/formatters';
import type { ChamadoFormData } from '@/utils/schemas';

const TRIAGEM_IA_REGEX = /^\[Triagem IA\s*-\s*([^|\]]+)\|\s*([^\]]+)\]\s*(.*)$/is;

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

function parseTriagemIa(historico: HistoricoChamado[]): TriagemIa | undefined {
  for (const item of historico) {
    const match = item.observacao?.match(TRIAGEM_IA_REGEX);
    if (match) {
      return {
        prioridade: match[1].trim(),
        orgao: match[2].trim(),
        parecer: match[3].trim(),
      };
    }
  }
  return undefined;
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
    usuarioId: item.usuarioId,
    usuarioNome: item.usuarioNome,
    endereco: item.endereco,
    fotoUrl: buildApiAssetUrl(item.foto),
    status: item.status,
    totalVotos: item.totalVotos,
    apoiadoPorMim: item.apoiadoPorMim,
    historico,
    triagemIa: parseTriagemIa(historico),
  };
}

export function getLatestParecer(chamado: Chamado): HistoricoChamado | undefined {
  return chamado.historico.find((item) => !item.observacao?.startsWith('[Triagem IA'));
}

export function toChamadoRequest(form: ChamadoFormData): ChamadoRequest {
  const fotoBase64 = stripDataUriPrefix(form.fotoBase64);
  return {
    titulo: form.titulo.trim(),
    descricao: form.descricao.trim(),
    categoriaId: form.categoriaId,
    endereco: buildEnderecoRequest(form),
    ...(fotoBase64 ? { fotoBase64 } : {}),
  };
}
