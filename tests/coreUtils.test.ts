import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  formatEnumTokensInText,
  formatTimelineObservation,
  getCategoryLabel,
  getOrgaoLabel,
  getPriorityVisuals,
} from '../src/theme/semanticConfig.ts';
import type { AppTheme } from '../src/types/theme.ts';
import { formatDate, formatMessageTime, getInitials } from '../src/utils/formatters.ts';
import { canSupportChamado, isStatusFinal } from '../src/utils/permissions.ts';

function makeMockTheme(): AppTheme {
  return {
    isDark: false,
    background: '#background',
    surface: '#surface',
    card: '#card',
    cardSubtle: '#cardSubtle',
    inputBg: '#inputBg',
    text: '#text',
    textSecondary: '#textSecondary',
    textMuted: '#textMuted',
    inverseText: '#inverseText',
    border: '#border',
    cardBorder: '#cardBorder',
    divider: '#divider',
    overlay: '#overlay',
    primary: '#primary',
    primaryLight: '#primaryLight',
    primaryBorder: '#primaryBorder',
    primaryDark: '#primaryDark',
    danger: '#danger',
    dangerBg: '#dangerBg',
    dangerText: '#danger',
    dangerBorder: '#dangerBorder',
    warning: '#warning',
    warningBg: '#warningBg',
    warningText: '#warning',
    warningBorder: '#warningBorder',
    info: '#info',
    infoBg: '#infoBg',
    infoText: '#info',
    infoBorder: '#infoBorder',
    success: '#success',
    successBg: '#successBg',
    successText: '#successText',
    pillBg: '#pillBg',
    pillActiveBg: '#pillActiveBg',
    pillActiveText: '#pillActiveText',
    tabBarBg: '#tabBarBg',
    tabBarBorder: '#tabBarBorder',
    tabBarActive: '#tabBarActive',
    tabBarInactive: '#tabBarInactive',
    secondaryButtonBg: '#secondaryButtonBg',
  };
}

const MOCK_THEME = makeMockTheme();

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
    assert.equal(getPriorityVisuals('URGENTE', MOCK_THEME).label, 'Urgente');
    assert.equal(getPriorityVisuals('alta', MOCK_THEME).color, '#warning');
    assert.equal(getPriorityVisuals('alta', MOCK_THEME).label, 'Alta');
    assert.equal(getPriorityVisuals('media', MOCK_THEME).color, '#info');
    assert.equal(getPriorityVisuals('media', MOCK_THEME).label, 'Média');
    assert.equal(getPriorityVisuals('baixa', MOCK_THEME).color, '#primary');
    assert.equal(getPriorityVisuals('baixa', MOCK_THEME).label, 'Baixa');
  });

  it('formats raw technical observation tokens into localized friendly text', () => {
    const rawObs = 'Triagem automática por IA concluída. Prioridade: ALTA. Categoria: VIAS_E_PAVIMENTACAO. Órgão: SECRETARIA_OBRAS.';
    const formatted = formatTimelineObservation(rawObs);
    assert.equal(
      formatted,
      'Triagem automática por IA concluída. Prioridade: Alta. Categoria: Vias e Pavimentação. Órgão: Secretaria Municipal de Infraestrutura Urbana e Obras.'
    );

    const contingencyObs = 'Triagem concluída. Prioridade: MEDIA. Categoria: VIAS_E_PAVIMENTACAO. Órgão: SUBPREFEITURA.';
    assert.equal(
      formatTimelineObservation(contingencyObs),
      'Triagem concluída. Prioridade: Média. Categoria: Vias e Pavimentação. Órgão: Subprefeitura Regional.'
    );

    const openingObs = 'Chamado registrado pelo cidadão Enzo Okuizumi via ZelaFix Mobile.';
    assert.equal(formatTimelineObservation(openingObs), openingObs);
  });

  it('formats inline enum tokens in free-form AI insights and responses', () => {
    assert.equal(
      formatEnumTokensInText("Destaque para 'LIMPEZA_URBANA' (1 registro(s))"),
      "Destaque para 'Limpeza Urbana' (1 registro(s))"
    );
    assert.equal(
      formatEnumTokensInText('Chamado #1 (EM_ANALISE): VIAS_E_PAVIMENTACAO — CET_TRANSITO'),
      'Chamado #1 (Em Análise): Vias e Pavimentação — Companhia de Engenharia de Tráfego (CET)'
    );
    assert.equal(
      formatEnumTokensInText('Órgão: ILUMINACAO_PUBLICA'),
      'Órgão: Departamento de Iluminação Pública (Ilume)'
    );
  });
});
