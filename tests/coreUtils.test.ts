import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getCategoryLabel, getOrgaoLabel, getPriorityVisuals } from '../src/theme/semanticConfig.ts';
import type { AppTheme } from '../src/theme/types.ts';
import { formatDate, formatMessageTime, getInitials } from '../src/utils/formatters.ts';
import { canSupportChamado, isStatusFinal } from '../src/utils/permissions.ts';

const MOCK_THEME = {
  dangerText: '#danger',
  dangerBg: '#dangerBg',
  warningText: '#warning',
  warningBg: '#warningBg',
  infoText: '#info',
  infoBg: '#infoBg',
  primary: '#primary',
  primaryLight: '#primaryLight',
} as AppTheme;

describe('core utils', () => {
  it('extracts initials safely for empty, single-word and multi-word names', () => {
    assert.equal(getInitials(null), 'ZF');
    assert.equal(getInitials('   '), 'ZF');
    assert.equal(getInitials('Ana'), 'AN');
    assert.equal(getInitials('Enzo Okuizumi'), 'EO');
  });

  it('parses ISO and SQLite UTC timestamps cleanly without preserving invalid strings', () => {
    assert.equal(formatMessageTime(undefined), '--:--');
    assert.equal(formatMessageTime('14:32'), '--:--');
    assert.match(formatMessageTime('2026-11-14T12:00:00.000Z'), /^\d{2}:\d{2}$/);
    assert.match(formatMessageTime('2026-11-14 02:30:00'), /^\d{2}:\d{2}$/);
    assert.match(formatDate('2026-11-14 02:30:00'), /^\d{2}\/\d{2}\/2026/);
  });

  it('identifies final statuses consistently', () => {
    assert.equal(isStatusFinal('CONCLUIDO'), true);
    assert.equal(isStatusFinal('REJEITADO'), true);
    assert.equal(isStatusFinal('PENDENTE'), false);
    assert.equal(canSupportChamado('EM_ANALISE'), true);
    assert.equal(canSupportChamado('REJEITADO'), false);
  });

  it('maps canonical backend enums in semanticConfig', () => {
    assert.equal(getCategoryLabel('ILUMINACAO_PUBLICA'), 'Iluminação Pública');
    assert.equal(getOrgaoLabel('CET_TRANSITO'), 'Companhia de Engenharia de Tráfego (CET)');
    assert.equal(getPriorityVisuals('URGENTE', MOCK_THEME).color, '#danger');
    assert.equal(getPriorityVisuals('alta', MOCK_THEME).color, '#warning');
    assert.equal(getPriorityVisuals('media', MOCK_THEME).color, '#info');
    assert.equal(getPriorityVisuals('baixa', MOCK_THEME).color, '#primary');
  });
});
