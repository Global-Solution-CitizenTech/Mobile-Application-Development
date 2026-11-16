import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { ChamadoCreateSchema, ChamadoFormSchema, extractFieldErrors, LoginSchema, ProfileEditSchema, RegisterSchema, StatusUpdateSchema } from '../src/utils/schemas.ts';

describe('schemas', () => {
  describe('extractFieldErrors', () => {
    it('maps ZodError into flat field-to-message object using first error per field', () => {
      const result = LoginSchema.safeParse({ email: 'invalid-email', senha: '' });
      assert.equal(result.success, false);
      if (!result.success) {
        const errors = extractFieldErrors(result.error);
        assert.equal(errors.email, 'E-mail inválido');
        assert.equal(errors.senha, 'Informe sua senha');
      }
    });
  });

  describe('LoginSchema', () => {
    it('validates correct email and non-empty password', () => {
      const valid = LoginSchema.safeParse({
        email: 'enzo@fiap.com.br',
        senha: 'SecretPassword123',
      });
      assert.equal(valid.success, true);
    });

    it('rejects invalid email formats', () => {
      const invalid = LoginSchema.safeParse({
        email: 'enzo.fiap.com',
        senha: 'SecretPassword123',
      });
      assert.equal(invalid.success, false);
      if (!invalid.success) {
        const errors = extractFieldErrors(invalid.error);
        assert.equal(errors.email, 'E-mail inválido');
      }
    });

    it('rejects empty password', () => {
      const invalid = LoginSchema.safeParse({
        email: 'enzo@fiap.com.br',
        senha: '',
      });
      assert.equal(invalid.success, false);
      if (!invalid.success) {
        const errors = extractFieldErrors(invalid.error);
        assert.equal(errors.senha, 'Informe sua senha');
      }
    });
  });

  describe('RegisterSchema', () => {
    const validRegisterData = {
      nome: 'Enzo Okuizumi',
      email: 'enzo@fiap.com.br',
      telefone: '(11) 98765-4321',
      cep: '01310-100',
      rua: 'Avenida Paulista',
      numero: '1000',
      referencia: 'Metrô Trianon-Masp',
      senha: 'password123',
      confirmarSenha: 'password123',
    };

    it('accepts complete, valid registration data', () => {
      const result = RegisterSchema.safeParse(validRegisterData);
      assert.equal(result.success, true);
    });

    it('rejects when password and password confirmation do not match', () => {
      const result = RegisterSchema.safeParse({
        ...validRegisterData,
        confirmarSenha: 'differentPassword',
      });
      assert.equal(result.success, false);
      if (!result.success) {
        const errors = extractFieldErrors(result.error);
        assert.equal(errors.confirmarSenha, 'As senhas não coincidem');
      }
    });

    it('rejects invalid Brazilian DDD', () => {
      const result = RegisterSchema.safeParse({
        ...validRegisterData,
        telefone: '(00) 98765-4321',
      });
      assert.equal(result.success, false);
      if (!result.success) {
        const errors = extractFieldErrors(result.error);
        assert.equal(errors.telefone, 'DDD brasileiro inválido');
      }
    });

    it('rejects phone numbers with invalid length', () => {
      const result = RegisterSchema.safeParse({
        ...validRegisterData,
        telefone: '11987',
      });
      assert.equal(result.success, false);
      if (!result.success) {
        const errors = extractFieldErrors(result.error);
        assert.equal(errors.telefone, 'Informe o telefone com DDD (10 ou 11 dígitos)');
      }
    });

    it('rejects CEP not having 8 digits', () => {
      const result = RegisterSchema.safeParse({
        ...validRegisterData,
        cep: '123',
      });
      assert.equal(result.success, false);
      if (!result.success) {
        const errors = extractFieldErrors(result.error);
        assert.equal(errors.cep, 'CEP deve conter 8 dígitos');
      }
    });
  });

  describe('ProfileEditSchema', () => {
    it('accepts valid profile updates with matching criteria', () => {
      const result = ProfileEditSchema.safeParse({
        nome: 'Maria Silva',
        email: 'maria@sp.gov.br',
        telefone: '11912345678',
        cep: '04571010',
        numero: '500',
        referencia: 'Próximo à estação',
        senha: 'newSecurePassword',
      });
      assert.equal(result.success, true);
    });
  });

  describe('ChamadoFormSchema', () => {
    const validChamado = {
      titulo: 'Vazamento de água na calçada',
      categoriaId: 1, // ILUMINACAO_PUBLICA
      descricao: 'Cano rompido jorrando água limpa continuamente pela calçada há dois dias.',
      cep: '01310-100',
      numero: '250',
      referencia: 'Em frente ao restaurante',
    };

    it('accepts valid chamado form data', () => {
      const result = ChamadoFormSchema.safeParse(validChamado);
      assert.equal(result.success, true);
    });

    it('enforces minimum title length of 5 characters', () => {
      const result = ChamadoFormSchema.safeParse({
        ...validChamado,
        titulo: 'Cano',
      });
      assert.equal(result.success, false);
      if (!result.success) {
        const errors = extractFieldErrors(result.error);
        assert.equal(errors.titulo, 'Descreva o problema em pelo menos 5 caracteres');
      }
    });

    it('enforces minimum description length of 15 characters', () => {
      const result = ChamadoFormSchema.safeParse({
        ...validChamado,
        descricao: 'Vazamento ruim',
      });
      assert.equal(result.success, false);
      if (!result.success) {
        const errors = extractFieldErrors(result.error);
        assert.equal(errors.descricao, 'Detalhe a ocorrência (mínimo 15 caracteres)');
      }
    });

    it('rejects unknown categoriaId', () => {
      const result = ChamadoFormSchema.safeParse({
        ...validChamado,
        categoriaId: 9999,
      });
      assert.equal(result.success, false);
      if (!result.success) {
        const errors = extractFieldErrors(result.error);
        assert.equal(errors.categoriaId, 'Selecione uma categoria');
      }
    });
  });

  describe('ChamadoCreateSchema', () => {
    it('accepts valid photo upload object with uri, name and image mime type', () => {
      const result = ChamadoCreateSchema.safeParse({
        cep: '01310100',
        numero: '100',
        referencia: 'Esquina',
        foto: { uri: 'file:///photo.jpg', name: 'photo.jpg', type: 'image/jpeg' },
      });
      assert.equal(result.success, true);

      const upperMimeResult = ChamadoCreateSchema.safeParse({
        cep: '01310100',
        numero: '100',
        referencia: 'Esquina',
        foto: { uri: 'file:///photo.png', name: 'photo.png', type: 'IMAGE/PNG' },
      });
      assert.equal(upperMimeResult.success, true);
    });

    it('rejects missing, incomplete or non-image photo uploads', () => {
      const nullFoto = ChamadoCreateSchema.safeParse({
        cep: '01310100',
        numero: '100',
        referencia: 'Esquina',
        foto: null,
      });
      assert.equal(nullFoto.success, false);
      if (!nullFoto.success) {
        const errors = extractFieldErrors(nullFoto.error);
        assert.equal(errors.foto, 'Envie uma foto da ocorrência');
      }

      const emptyUri = ChamadoCreateSchema.safeParse({
        cep: '01310100',
        numero: '100',
        referencia: 'Esquina',
        foto: { uri: '   ', name: 'photo.jpg', type: 'image/jpeg' },
      });
      assert.equal(emptyUri.success, false);

      const emptyName = ChamadoCreateSchema.safeParse({
        cep: '01310100',
        numero: '100',
        referencia: 'Esquina',
        foto: { uri: 'file:///photo.jpg', name: '   ', type: 'image/jpeg' },
      });
      assert.equal(emptyName.success, false);

      const nonImageMime = ChamadoCreateSchema.safeParse({
        cep: '01310100',
        numero: '100',
        referencia: 'Esquina',
        foto: { uri: 'file:///doc.pdf', name: 'doc.pdf', type: 'application/pdf' },
      });
      assert.equal(nonImageMime.success, false);
    });
  });

  describe('StatusUpdateSchema', () => {
    it('accepts valid status and observation', () => {
      const result = StatusUpdateSchema.safeParse({
        status: 'EM_EXECUCAO',
        observacao: 'Equipe de manutenção enviada ao local para reparo imediato.',
      });
      assert.equal(result.success, true);
    });

    it('rejects invalid status', () => {
      const result = StatusUpdateSchema.safeParse({
        status: 'INVALID_STATUS',
        observacao: 'Observação qualquer',
      });
      assert.equal(result.success, false);
    });

    it('rejects empty observation', () => {
      const result = StatusUpdateSchema.safeParse({
        status: 'CONCLUIDO',
        observacao: '   ',
      });
      assert.equal(result.success, false);
      if (!result.success) {
        const errors = extractFieldErrors(result.error);
        assert.equal(errors.observacao, 'Informe uma observação ou parecer');
      }
    });

    it('rejects observation exceeding 255 characters', () => {
      const result = StatusUpdateSchema.safeParse({
        status: 'REJEITADO',
        observacao: 'A'.repeat(256),
      });
      assert.equal(result.success, false);
      if (!result.success) {
        const errors = extractFieldErrors(result.error);
        assert.equal(errors.observacao, 'Máximo de 255 caracteres');
      }
    });
  });
});
