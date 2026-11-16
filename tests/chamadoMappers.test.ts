import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { ChamadoResponse, FotoUpload, ReactNativeFormFile, ReactNativeMultipartFormData } from '../src/types/chamado.ts';
import {
  appendMultipartFile,
  buildApiAssetUrl,
  buildEnderecoRequest,
  mapChamadoResponse,
  toChamadoCreateRequest,
  toChamadoRequest,
  toReactNativeFormFile,
} from '../src/utils/chamadoMappers.ts';

describe('chamadoMappers', () => {
  describe('buildApiAssetUrl', () => {
    it('returns undefined for empty, null or undefined input', () => {
      assert.equal(buildApiAssetUrl(null), undefined);
      assert.equal(buildApiAssetUrl(undefined), undefined);
      assert.equal(buildApiAssetUrl('   '), undefined);
    });

    it('preserves absolute URLs', () => {
      const url = 'https://blob.core.windows.net/zelafix/image.jpg';
      assert.equal(buildApiAssetUrl(url), url);
      assert.equal(buildApiAssetUrl('http://insecure.site/test.png'), 'http://insecure.site/test.png');
    });

    it('resolves relative paths with custom or default baseUrl', () => {
      const customBase = 'https://api.zelafix.sp.gov.br';
      assert.equal(
        buildApiAssetUrl('/uploads/foto-123.jpg', customBase),
        'https://api.zelafix.sp.gov.br/uploads/foto-123.jpg'
      );
      assert.equal(
        buildApiAssetUrl('uploads/foto-123.jpg', customBase),
        'https://api.zelafix.sp.gov.br/uploads/foto-123.jpg'
      );
      assert.equal(
        buildApiAssetUrl('/uploads/foto-123.jpg', 'https://api.zelafix.sp.gov.br/'),
        'https://api.zelafix.sp.gov.br/uploads/foto-123.jpg'
      );
    });
  });

  describe('buildEnderecoRequest', () => {
    it('normalizes CEP to digits only and provides S/N fallback for empty number', () => {
      const result = buildEnderecoRequest({
        cep: '01310-100',
        numero: '',
        referencia: 'Próximo ao metrô Trianon',
      });

      assert.equal(result.cep, '01310100');
      assert.equal(result.numero, 'S/N');
      assert.equal(result.referencia, 'Próximo ao metrô Trianon');
      assert.equal(result.rua, undefined);
    });

    it('trims rua and includes it when present', () => {
      const result = buildEnderecoRequest({
        cep: '04571-010',
        rua: '  Avenida das Nações Unidas  ',
        numero: '  12901  ',
        referencia: 'Torre Oeste',
      });

      assert.equal(result.cep, '04571010');
      assert.equal(result.rua, 'Avenida das Nações Unidas');
      assert.equal(result.numero, '12901');
      assert.equal(result.referencia, 'Torre Oeste');
    });

    it('truncates excessive characters according to database constraints', () => {
      const longStreet = 'A'.repeat(150);
      const longRef = 'B'.repeat(80);
      const longNum = '1'.repeat(120);

      const result = buildEnderecoRequest({
        cep: '01001-000',
        rua: longStreet,
        numero: longNum,
        referencia: longRef,
      });

      assert.equal(result.rua?.length, 100);
      assert.equal(result.numero.length, 100);
      assert.equal(result.referencia.length, 50);
    });
  });

  describe('mapChamadoResponse', () => {
    it('maps response and appends cache-busting timestamp to fotoUrl', () => {
      const mockResponse: ChamadoResponse = {
        idChamado: 42,
        titulo: 'Buraco perigoso na via',
        descricao: 'Buraco de grandes proporções causando acidentes.',
        categoriaId: 2,
        categoriaNome: 'Buraco no Asfalto',
        prioridadeId: 1,
        prioridadeNome: 'Alta',
        orgaoId: 1,
        orgaoNome: 'Secretaria Municipal de Obras',
        dtAbertura: '2026-11-14T10:00:00Z',
        foto: '/api/v1/chamados/42/foto',
        usuarioId: 7,
        usuarioNome: 'Enzo Okuizumi',
        status: 'EM_ANALISE',
        totalVotos: 12,
        apoiadoPorMim: true,
        historico: [],
        endereco: {
          id: 1,
          cep: '01310100',
          rua: 'Avenida Paulista',
          numero: '1000',
          bairro: 'Bela Vista',
          cidade: 'São Paulo',
          estado: 'SP',
          referencia: 'Em frente ao shopping',
        },
      };

      const mapped = mapChamadoResponse(mockResponse);

      assert.equal(mapped.idChamado, 42);
      assert.equal(mapped.titulo, 'Buraco perigoso na via');
      assert.ok(mapped.fotoUrl?.includes('/api/v1/chamados/42/foto?v=2026-11-14T10%3A00%3A00Z'));
    });

    it('sets fotoUrl to undefined when response has no foto', () => {
      const mockResponse: ChamadoResponse = {
        idChamado: 43,
        titulo: 'Semáforo apagado',
        descricao: 'Cruzamento perigoso sem sinalização luminosa.',
        categoriaId: 3,
        categoriaNome: 'Semáforo com Defeito',
        prioridadeId: 2,
        prioridadeNome: 'Média',
        orgaoId: 2,
        orgaoNome: 'CET',
        status: 'PENDENTE',
        totalVotos: 0,
        apoiadoPorMim: false,
        historico: [],
        dtAbertura: '2026-11-14T11:00:00Z',
        foto: null,
        usuarioId: 7,
        usuarioNome: 'Enzo Okuizumi',
        endereco: {
          id: 2,
          cep: '01310100',
          rua: 'Rua Augusta',
          numero: 'S/N',
          bairro: 'Consolação',
          cidade: 'São Paulo',
          estado: 'SP',
          referencia: 'Cruzamento',
        },
      };

      const mapped = mapChamadoResponse(mockResponse);
      assert.equal(mapped.fotoUrl, undefined);
    });
  });

  describe('toChamadoCreateRequest', () => {
    it('converts create form data with address and photo', () => {
      const mockPhoto: FotoUpload = {
        uri: 'file:///data/user/0/app/cache/camera.jpg',
        name: 'camera.jpg',
        type: 'image/jpeg',
      };

      const request = toChamadoCreateRequest({
        cep: '01310-100',
        rua: 'Av Paulista',
        numero: '500',
        referencia: 'Em frente ao museu',
        foto: mockPhoto,
      });

      assert.equal(request.endereco.cep, '01310100');
      assert.equal(request.endereco.numero, '500');
      assert.equal(request.foto, mockPhoto);
    });
  });

  describe('toChamadoRequest', () => {
    it('converts edit form data mapping categoriaId to canonical category name', () => {
      const request = toChamadoRequest({
        titulo: '  Poste com fiação exposta  ',
        descricao: '  Fios caídos no chão oferecendo risco de choque elétrico aos pedestres.  ',
        categoriaId: 1, // ILUMINACAO_PUBLICA in catalog
        cep: '01310-100',
        numero: '120',
        referencia: 'Próximo à padaria',
      });

      assert.equal(request.titulo, 'Poste com fiação exposta');
      assert.equal(request.descricao, 'Fios caídos no chão oferecendo risco de choque elétrico aos pedestres.');
      assert.equal(request.categoria, 'ILUMINACAO_PUBLICA');
      assert.equal(request.endereco.cep, '01310100');
    });

    it('throws error when categoriaId is unknown', () => {
      assert.throws(
        () =>
          toChamadoRequest({
            titulo: 'Título válido',
            descricao: 'Descrição longa o bastante para passar no formulário.',
            categoriaId: 99999,
            cep: '01310-100',
            numero: '10',
            referencia: 'Esquina',
          }),
        /Categoria desconhecida: 99999/
      );
    });
  });

  describe('multipart file helpers', () => {
    it('normalizes FotoUpload into a React Native FormData file object', () => {
      const normalized = toReactNativeFormFile({
        uri: ' file:///tmp/foto.jpg ',
        name: ' foto.jpg ',
        type: ' image/jpeg ',
      });

      assert.deepEqual(normalized, {
        uri: 'file:///tmp/foto.jpg',
        name: 'foto.jpg',
        type: 'image/jpeg',
      });
    });

    it('appends normalized multipart file without caller casts', () => {
      const appended: { field: string; value: string | ReactNativeFormFile }[] = [];
      const mockFormData: ReactNativeMultipartFormData = {
        append(field, value) {
          appended.push({ field, value });
        },
      };

      appendMultipartFile(mockFormData, 'foto', {
        uri: 'file:///tmp/ocorrencia.png',
        name: 'ocorrencia.png',
        type: 'image/png',
      });

      assert.deepEqual(appended, [
        {
          field: 'foto',
          value: {
            uri: 'file:///tmp/ocorrencia.png',
            name: 'ocorrencia.png',
            type: 'image/png',
          },
        },
      ]);
    });
  });
});
