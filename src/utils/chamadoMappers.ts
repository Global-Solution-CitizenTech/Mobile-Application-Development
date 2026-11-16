import { env } from '../config/env.ts';
import { CATEGORIA_CATALOG } from '../theme/semanticConfig.ts';
import type {
  Chamado,
  ChamadoCreateRequest,
  ChamadoRequest,
  ChamadoResponse,
  FotoUpload,
  ReactNativeFormFile,
  ReactNativeMultipartFormData,
} from '../types/chamado.ts';
import type { EnderecoFormInput, EnderecoRequest } from '../types/endereco.ts';
import type { ChamadoCreateFormData, ChamadoFormData } from '../types/form.ts';
import { onlyDigits } from './formatters.ts';

export function buildApiAssetUrl(path?: string | null, baseUrl: string = env.apiUrl): string | undefined {
  if (!path || path.trim() === '') return undefined;
  const trimmed = path.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const base = baseUrl.replace(/\/+$/, '');
  const normalizedPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${base}${normalizedPath}`;
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
  const { foto, ...rest } = item;
  return {
    ...rest,
    fotoUrl: foto ? buildApiAssetUrl(`${foto}?v=${encodeURIComponent(item.dtAbertura)}`) : undefined,
  };
}

export function toReactNativeFormFile(foto: FotoUpload): ReactNativeFormFile {
  return {
    uri: foto.uri.trim(),
    name: foto.name.trim(),
    type: foto.type.trim(),
  };
}

export function appendMultipartFile(
  formData: FormData | ReactNativeMultipartFormData,
  field: string,
  foto: FotoUpload
): void {
  // React Native aceita `{ uri, name, type }` no FormData.append, diferente do DOM `Blob`.
  const target = formData as unknown as ReactNativeMultipartFormData;
  target.append(field, toReactNativeFormFile(foto));
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
