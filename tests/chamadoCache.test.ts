import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { InfiniteData } from '@tanstack/react-query';
import { patchApoioInCache, toggleApoioOtimista } from '../src/lib/chamadoCache.ts';
import type { SpringPageResponse } from '../src/types/api.ts';
import type { Chamado } from '../src/types/chamado.ts';

function makeChamado(
  idChamado: number,
  apoiadoPorMim: boolean,
  totalVotos: number
): Chamado {
  return { idChamado, apoiadoPorMim, totalVotos } as unknown as Chamado;
}

function makePage(items: Chamado[]): SpringPageResponse<Chamado> {
  return {
    content: items,
    page: {
      totalElements: items.length,
      totalPages: 1,
      number: 0,
      size: items.length,
    },
  };
}

describe('chamadoCache', () => {
  it('toggles support optimistically without dropping below zero', () => {
    const added = toggleApoioOtimista(makeChamado(1, false, 2));
    assert.equal(added.apoiadoPorMim, true);
    assert.equal(added.totalVotos, 3);

    const clamped = toggleApoioOtimista(makeChamado(1, true, 0));
    assert.equal(clamped.apoiadoPorMim, false);
    assert.equal(clamped.totalVotos, 0);
  });

  it('patches SpringPageResponse caches (MeusChamados / Home)', () => {
    const page = makePage([makeChamado(10, false, 4), makeChamado(11, true, 1)]);
    const updated = patchApoioInCache(page, 10) as SpringPageResponse<Chamado>;

    assert.equal(updated.content[0]?.apoiadoPorMim, true);
    assert.equal(updated.content[0]?.totalVotos, 5);
    assert.equal(updated.content[1]?.apoiadoPorMim, true);
    assert.equal(updated.content[1]?.totalVotos, 1);
  });

  it('patches InfiniteData<SpringPageResponse> caches (Radar infinite list)', () => {
    const infinite: InfiniteData<SpringPageResponse<Chamado>> = {
      pages: [
        makePage([makeChamado(1, false, 0)]),
        makePage([makeChamado(2, true, 7)]),
      ],
      pageParams: [0, 1],
    };

    const updated = patchApoioInCache(infinite, 2) as InfiniteData<
      SpringPageResponse<Chamado>
    >;

    assert.equal(updated.pages[0]?.content[0]?.totalVotos, 0);
    assert.equal(updated.pages[1]?.content[0]?.apoiadoPorMim, false);
    assert.equal(updated.pages[1]?.content[0]?.totalVotos, 6);
  });

  it('returns undefined when cache is empty', () => {
    assert.equal(patchApoioInCache(undefined, 99), undefined);
  });
});
