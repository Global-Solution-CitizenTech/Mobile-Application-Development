import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { CargoUsuario, Usuario } from '../src/types/auth.ts';
import type { Chamado } from '../src/types/chamado.ts';
import {
  canAccessMobileApp,
  canChangeChamadoStatus,
  canDeleteChamado,
  canEditChamado,
  canSupportChamado,
  getCargoLabel,
  isStatusFinal,
} from '../src/utils/permissions.ts';

function makeUsuario(id: number, nome: string, email: string, cargo: CargoUsuario): Usuario {
  return {
    id,
    nome,
    email,
    cargo,
    ddd: '11',
    numeroTelefone: '987654321',
    endereco: {
      id: 1,
      cep: '01310100',
      numero: '100',
      rua: 'Avenida Paulista',
      referencia: 'Próximo ao metrô',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      estado: 'SP',
    },
  };
}

function makeChamado(overrides: Partial<Chamado> = {}): Chamado {
  return {
    idChamado: 10,
    titulo: 'Poste sem iluminação',
    descricao: 'Poste apagado há três dias na esquina.',
    dtAbertura: '2026-11-14T10:00:00Z',
    categoriaId: 1,
    categoriaNome: 'ILUMINACAO_PUBLICA',
    prioridadeId: 2,
    prioridadeNome: 'MEDIA',
    orgaoId: 1,
    orgaoNome: 'ILUMINACAO_PUBLICA',
    usuarioId: 1,
    usuarioNome: 'Enzo',
    endereco: {
      id: 1,
      cep: '01310100',
      numero: '100',
      rua: 'Avenida Paulista',
      referencia: 'Esquina',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      estado: 'SP',
    },
    status: 'EM_ANALISE',
    totalVotos: 0,
    apoiadoPorMim: false,
    historico: [],
    ...overrides,
  };
}

const CIDADAO_AUTOR = makeUsuario(1, 'Enzo', 'enzo@fiap.com', 'CIDADAO');
const CIDADAO_OUTRO = makeUsuario(2, 'Maria', 'maria@fiap.com', 'CIDADAO');
const GESTOR_USER = makeUsuario(3, 'Carlos', 'carlos@sp.gov.br', 'GESTOR');
const ADMIN_USER = makeUsuario(4, 'Admin', 'admin@zelafix.com', 'ADMIN');

const CHAMADO_DO_ENZO = makeChamado({
  idChamado: 10,
  usuarioId: 1,
  status: 'EM_ANALISE',
});

describe('permissions', () => {
  describe('canAccessMobileApp', () => {
    it('allows citizens and municipal managers', () => {
      assert.equal(canAccessMobileApp(CIDADAO_AUTOR), true);
      assert.equal(canAccessMobileApp(GESTOR_USER), true);
    });

    it('rejects admins and unauthenticated users', () => {
      assert.equal(canAccessMobileApp(ADMIN_USER), false);
      assert.equal(canAccessMobileApp(null), false);
      assert.equal(canAccessMobileApp(undefined), false);
    });
  });

  describe('getCargoLabel', () => {
    it('returns friendly Portuguese titles for roles', () => {
      assert.equal(getCargoLabel('GESTOR'), 'Gestor Público');
      assert.equal(getCargoLabel('CIDADAO'), 'Cidadão');
      assert.equal(getCargoLabel(undefined), 'Cidadão');
    });
  });

  describe('canEditChamado', () => {
    it('allows author and gestor to edit', () => {
      assert.equal(canEditChamado(CIDADAO_AUTOR, CHAMADO_DO_ENZO), true);
      assert.equal(canEditChamado(GESTOR_USER, CHAMADO_DO_ENZO), true);
    });

    it('blocks other citizens and unauthenticated requests', () => {
      assert.equal(canEditChamado(CIDADAO_OUTRO, CHAMADO_DO_ENZO), false);
      assert.equal(canEditChamado(null, CHAMADO_DO_ENZO), false);
      assert.equal(canEditChamado(CIDADAO_AUTOR, null), false);
    });
  });

  describe('canChangeChamadoStatus', () => {
    it('allows only municipal gestores to change status', () => {
      assert.equal(canChangeChamadoStatus(GESTOR_USER), true);
      assert.equal(canChangeChamadoStatus(CIDADAO_AUTOR), false);
      assert.equal(canChangeChamadoStatus(null), false);
    });
  });

  describe('canDeleteChamado', () => {
    it('allows author and gestor to delete', () => {
      assert.equal(canDeleteChamado(CIDADAO_AUTOR, CHAMADO_DO_ENZO), true);
      assert.equal(canDeleteChamado(GESTOR_USER, CHAMADO_DO_ENZO), true);
    });

    it('blocks unauthorized citizens and missing data', () => {
      assert.equal(canDeleteChamado(CIDADAO_OUTRO, CHAMADO_DO_ENZO), false);
      assert.equal(canDeleteChamado(null, CHAMADO_DO_ENZO), false);
      assert.equal(canDeleteChamado(CIDADAO_AUTOR, null), false);
    });
  });

  describe('status transitions and support', () => {
    it('accurately identifies terminal states', () => {
      assert.equal(isStatusFinal('CONCLUIDO'), true);
      assert.equal(isStatusFinal('REJEITADO'), true);
      assert.equal(isStatusFinal('PENDENTE'), false);
      assert.equal(isStatusFinal('EM_ANALISE'), false);
      assert.equal(isStatusFinal('EM_EXECUCAO'), false);
    });

    it('permits community support only on non-terminal chamados', () => {
      assert.equal(canSupportChamado('PENDENTE'), true);
      assert.equal(canSupportChamado('EM_ANALISE'), true);
      assert.equal(canSupportChamado('EM_EXECUCAO'), true);
      assert.equal(canSupportChamado('CONCLUIDO'), false);
      assert.equal(canSupportChamado('REJEITADO'), false);
    });
  });
});
