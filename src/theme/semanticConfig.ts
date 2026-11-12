import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';
import type { AppTheme } from '@/contexts/ThemeContext';
import type { StatusChamado } from '@/types/categoria';

export type IoniconName = ComponentProps<typeof Ionicons>['name'];

export interface VisualBadgeConfig {
  label: string;
  bg: string;
  text: string;
  border: string;
  icon: string;
  iconName: IoniconName;
}

export const STATUS_LABELS: Record<StatusChamado, string> = {
  PENDENTE: 'Pendente',
  ABERTO: 'Aberto',
  EM_ANALISE: 'Em Análise',
  EM_EXECUCAO: 'Em Execução',
  CONCLUIDO: 'Concluído',
  REJEITADO: 'Rejeitado',
};

export const STATUS_OPTIONS: readonly { value: StatusChamado; label: string }[] = [
  { value: 'PENDENTE', label: STATUS_LABELS.PENDENTE },
  { value: 'ABERTO', label: STATUS_LABELS.ABERTO },
  { value: 'EM_ANALISE', label: STATUS_LABELS.EM_ANALISE },
  { value: 'EM_EXECUCAO', label: STATUS_LABELS.EM_EXECUCAO },
  { value: 'CONCLUIDO', label: STATUS_LABELS.CONCLUIDO },
  { value: 'REJEITADO', label: STATUS_LABELS.REJEITADO },
];

export const CATEGORY_ICONS: Record<string, { iconName: IoniconName; colorKey: 'warning' | 'info' | 'danger' | 'primary' }> = {
  'Iluminação Pública': { iconName: 'bulb', colorKey: 'warning' },
  'Vias e Pavimentação': { iconName: 'car', colorKey: 'danger' },
  'Drenagem e Esgoto': { iconName: 'water', colorKey: 'info' },
  'Limpeza Urbana': { iconName: 'trash', colorKey: 'primary' },
  'Árvores e Parques': { iconName: 'leaf', colorKey: 'primary' },
  'Sinalização e Trânsito': { iconName: 'warning', colorKey: 'warning' },
};

export function getStatusVisuals(status: StatusChamado, theme: AppTheme): VisualBadgeConfig {
  const label = STATUS_LABELS[status] || status;
  switch (status) {
    case 'PENDENTE':
      return { label, bg: theme.warningBg, text: theme.warningText, border: theme.warningBorder, icon: theme.warning, iconName: 'time' };
    case 'ABERTO':
      return { label, bg: theme.warningBg, text: theme.warningText, border: theme.warningBorder, icon: theme.warning, iconName: 'alert-circle' };
    case 'EM_ANALISE':
      return { label, bg: theme.infoBg, text: theme.infoText, border: theme.infoBorder, icon: theme.info, iconName: 'eye' };
    case 'EM_EXECUCAO':
      return { label, bg: theme.infoBg, text: theme.infoText, border: theme.infoBorder, icon: theme.info, iconName: 'construct' };
    case 'CONCLUIDO':
      return { label, bg: theme.successBg, text: theme.successText, border: theme.primaryBorder, icon: theme.success, iconName: 'checkmark-circle' };
    case 'REJEITADO':
      return { label, bg: theme.dangerBg, text: theme.dangerText, border: theme.dangerBorder, icon: theme.danger, iconName: 'close-circle' };
  }
}

export function getCategoryIconName(categoriaNome: string): IoniconName {
  return CATEGORY_ICONS[categoriaNome]?.iconName ?? 'ellipsis-horizontal';
}

export function getCategoryVisuals(categoriaNome: string, theme: AppTheme): { iconName: IoniconName; color: string; bg: string } {
  const entry = CATEGORY_ICONS[categoriaNome];
  if (!entry) {
    return { iconName: 'ellipsis-horizontal', color: theme.textSecondary, bg: theme.cardSubtle };
  }
  const palette = {
    warning: { color: theme.warningText, bg: theme.warningBg },
    info: { color: theme.infoText, bg: theme.infoBg },
    danger: { color: theme.dangerText, bg: theme.dangerBg },
    primary: { color: theme.primary, bg: theme.primaryLight },
  }[entry.colorKey];
  return { iconName: entry.iconName, ...palette };
}

export function getPriorityVisuals(prioridade: string, theme: AppTheme): { label: string; color: string; bg: string } {
  const norm = prioridade.trim().toUpperCase();
  if (norm === 'URGENTE' || norm === 'CRITICA' || norm === 'CRÍTICA') {
    return { label: prioridade, color: theme.dangerText, bg: theme.dangerBg };
  }
  if (norm === 'ALTA') {
    return { label: prioridade, color: theme.warningText, bg: theme.warningBg };
  }
  if (norm === 'MEDIA' || norm === 'MÉDIA') {
    return { label: prioridade, color: theme.infoText, bg: theme.infoBg };
  }
  return { label: prioridade, color: theme.primary, bg: theme.primaryLight };
}

export function canSupportChamado(status: StatusChamado): boolean {
  return status !== 'CONCLUIDO' && status !== 'REJEITADO';
}
