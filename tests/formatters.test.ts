import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { EnderecoResumo } from '../src/types/endereco.ts';
import { formatCep, formatDate, formatMessageTime, formatShortDate, formatTelefone, getFirstName, getInitials, getShortEndereco, maskCepInput, maskPhoneInput, onlyDigits, splitPhoneDigits } from '../src/utils/formatters.ts';

describe('formatters', () => {
  describe('onlyDigits', () => {
    it('strips non-numeric characters and handles empty or null values', () => {
      assert.equal(onlyDigits(null), '');
      assert.equal(onlyDigits(undefined), '');
      assert.equal(onlyDigits(''), '');
      assert.equal(onlyDigits('01310-100'), '01310100');
      assert.equal(onlyDigits('(11) 98765-4321'), '11987654321');
      assert.equal(onlyDigits('abc-123.xyz_456'), '123456');
    });
  });

  describe('date formatters', () => {
    it('formatDate formats valid ISO dates and returns placeholder for invalid inputs', () => {
      assert.equal(formatDate(null), '--');
      assert.equal(formatDate(''), '--');
      assert.equal(formatDate('invalid-date'), '--');
      assert.match(formatDate('2026-11-14T10:30:00.000Z'), /^\d{2}\/\d{2}\/2026/);
    });

    it('formatShortDate formats date without time component', () => {
      assert.equal(formatShortDate(null), '--');
      assert.equal(formatShortDate(''), '--');
      assert.equal(formatShortDate('not-a-date'), '--');
      assert.match(formatShortDate('2026-11-14T15:45:00.000Z'), /^\d{2}\/\d{2}\/2026$/);
      assert.match(formatShortDate('2026-05-01 12:00:00'), /^\d{2}\/\d{2}\/2026$/);
    });

    it('formatMessageTime formats time and returns placeholder for invalid inputs', () => {
      assert.equal(formatMessageTime(null), '--:--');
      assert.equal(formatMessageTime('invalid'), '--:--');
      assert.match(formatMessageTime('2026-11-14T08:15:00.000Z'), /^\d{2}:\d{2}$/);
    });
  });

  describe('CEP formatters & masks', () => {
    it('formatCep formats 8-digit strings into CEP pattern', () => {
      assert.equal(formatCep(null), '--');
      assert.equal(formatCep(''), '--');
      assert.equal(formatCep('01310100'), '01310-100');
      assert.equal(formatCep('01310-100'), '01310-100');
      assert.equal(formatCep('123'), '123');
    });

    it('maskCepInput applies mask progressively during user typing', () => {
      assert.equal(maskCepInput(''), '');
      assert.equal(maskCepInput('013'), '013');
      assert.equal(maskCepInput('01310'), '01310');
      assert.equal(maskCepInput('013101'), '01310-1');
      assert.equal(maskCepInput('01310100'), '01310-100');
      assert.equal(maskCepInput('01310100999'), '01310-100');
    });
  });

  describe('phone formatters & masks', () => {
    it('splitPhoneDigits separates DDD and phone body', () => {
      assert.deepEqual(splitPhoneDigits(null), { ddd: '', numeroTelefone: '' });
      assert.deepEqual(splitPhoneDigits('11987654321'), { ddd: '11', numeroTelefone: '987654321' });
      assert.deepEqual(splitPhoneDigits('(11) 3456-7890'), { ddd: '11', numeroTelefone: '34567890' });
    });

    it('formatTelefone formats cellphones and landlines', () => {
      assert.equal(formatTelefone(null, null), 'Não informado');
      assert.equal(formatTelefone('11', '987654321'), '(11) 98765-4321');
      assert.equal(formatTelefone('11', '34567890'), '(11) 3456-7890');
      assert.equal(formatTelefone('11', '123'), '(11) 123');
      assert.equal(formatTelefone('', '987654321'), '98765-4321');
    });

    it('maskPhoneInput formats phone inputs interactively', () => {
      assert.equal(maskPhoneInput(''), '');
      assert.equal(maskPhoneInput('11'), '(11');
      assert.equal(maskPhoneInput('119'), '(11) 9');
      assert.equal(maskPhoneInput('119876'), '(11) 9876');
      assert.equal(maskPhoneInput('1134567890'), '(11) 3456-7890');
      assert.equal(maskPhoneInput('11987654321'), '(11) 98765-4321');
      assert.equal(maskPhoneInput('119876543219999'), '(11) 98765-4321');
    });
  });

  describe('name helpers', () => {
    it('getInitials extracts two letters or default', () => {
      assert.equal(getInitials(null), 'ZF');
      assert.equal(getInitials(''), 'ZF');
      assert.equal(getInitials('Enzo'), 'EN');
      assert.equal(getInitials('Enzo Okuizumi'), 'EO');
      assert.equal(getInitials('Ana Maria Silva'), 'AS');
    });

    it('getFirstName extracts the first name', () => {
      assert.equal(getFirstName(null), 'Cidadão');
      assert.equal(getFirstName(''), 'Cidadão');
      assert.equal(getFirstName('Enzo Okuizumi'), 'Enzo');
      assert.equal(getFirstName('Maria'), 'Maria');
    });
  });

  describe('getShortEndereco', () => {
    it('formats address according to best available fields', () => {
      assert.equal(getShortEndereco(null), 'Região não informada');
      assert.equal(getShortEndereco({} as EnderecoResumo), 'Região não informada');

      assert.equal(
        getShortEndereco({ bairro: 'Bela Vista', cidade: 'São Paulo' } as EnderecoResumo),
        'Bela Vista, São Paulo'
      );
      assert.equal(
        getShortEndereco({ bairro: 'Bela Vista' } as EnderecoResumo),
        'Bela Vista'
      );
      assert.equal(
        getShortEndereco({ rua: 'Avenida Paulista' } as EnderecoResumo),
        'Avenida Paulista'
      );
      assert.equal(
        getShortEndereco({ referencia: 'Próximo ao MASP' } as EnderecoResumo),
        'Próximo ao MASP'
      );
    });
  });
});
