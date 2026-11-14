import type { InfiniteData } from '@tanstack/react-query';
import type { SpringPageResponse } from '@/types/api';
import type { Chamado } from '@/types/chamado';

export type ChamadoListCache =
  | SpringPageResponse<Chamado>
  | InfiniteData<SpringPageResponse<Chamado>>;

export function toggleApoioOtimista(chamado: Chamado): Chamado {
  const apoiado = !chamado.apoiadoPorMim;
  return {
    ...chamado,
    apoiadoPorMim: apoiado,
    totalVotos: Math.max(0, chamado.totalVotos + (apoiado ? 1 : -1)),
  };
}

export function patchApoioInCache(
  old: ChamadoListCache | undefined,
  chamadoId: number
): ChamadoListCache | undefined {
  if (!old) return old;
  const patch = (item: Chamado) => (item.idChamado === chamadoId ? toggleApoioOtimista(item) : item);

  if ('pages' in old) {
    return {
      ...old,
      pages: old.pages.map((page) => ({ ...page, content: page.content.map(patch) })),
    };
  }

  return {
    ...old,
    content: old.content.map(patch),
  };
}
