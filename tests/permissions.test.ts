import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { Usuario } from '../src/types/auth.ts';
import type { Chamado } from '../src/types/chamado.ts';
import { canAccessMobileApp, canChangeChamadoStatus, canDeleteChamado, canEditChamado, canSupportChamado, getCargoLabel, isStatusFinal } from '../src/utils/permissions.ts';

const CIDADAO_AUTOR: Usuario = { id: 1, nome: 'Enzo', email: 'enzo@fiap.com', cargo: 'CIDADAO' } as Usuario;
const CIDADAO_OUTRO: Usuario = { id: 2, nome: 'Maria', email: 'maria@fiap.com', cargo: 'CIDADAO' } as Usuario;
const GESTOR_USER: Usuario = { id: 3, nome: 'Carlos', email: 'carlos@sp.gov.br', cargo: 'GESTOR' } as Usuario;
const ADMIN_USER: Usuario = { id: 4, nome: 'Admin', email: 'admin@zelafix.com', cargo: 'ADMIN' } as Usuario;

const CHAMADO_DO_ENZO: Chamado = {
  idChamado: 10,
  usuarioId: 1,
  status: 'EM_ANALISE',
} as Chamado;

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
