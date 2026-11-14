import type { AppTheme, IoniconName, VisualBadgeConfig } from '@/theme/types';
import type { CategoriaResponse, StatusChamado } from '@/types/categoria';

const STATUS_LABELS: Record<StatusChamado, string> = {
  PENDENTE: 'Pendente',
  EM_ANALISE: 'Em Análise',
  EM_EXECUCAO: 'Em Execução',
  CONCLUIDO: 'Concluído',
  REJEITADO: 'Rejeitado',
};

export const STATUS_OPTIONS: readonly { value: StatusChamado; label: string }[] = [
  { value: 'PENDENTE', label: STATUS_LABELS.PENDENTE },
  { value: 'EM_ANALISE', label: STATUS_LABELS.EM_ANALISE },
  { value: 'EM_EXECUCAO', label: STATUS_LABELS.EM_EXECUCAO },
  { value: 'CONCLUIDO', label: STATUS_LABELS.CONCLUIDO },
  { value: 'REJEITADO', label: STATUS_LABELS.REJEITADO },
];

type CategoryColorKey = 'warning' | 'info' | 'danger' | 'primary';

const CATEGORY_META: Record<
  string,
  { id: number; label: string; iconName: IoniconName; colorKey: CategoryColorKey }
> = {
  ILUMINACAO_PUBLICA: { id: 1, label: 'Iluminação Pública', iconName: 'bulb', colorKey: 'warning' },
  VIAS_E_PAVIMENTACAO: { id: 2, label: 'Vias e Pavimentação', iconName: 'car', colorKey: 'danger' },
  DRENAGEM_E_ESGOTO: { id: 3, label: 'Drenagem e Esgoto', iconName: 'water', colorKey: 'info' },
  LIMPEZA_URBANA: { id: 4, label: 'Limpeza Urbana', iconName: 'trash', colorKey: 'primary' },
  ARVORES_E_PARQUES: { id: 5, label: 'Árvores e Parques', iconName: 'leaf', colorKey: 'primary' },
  SINALIZACAO_E_TRANSITO: { id: 6, label: 'Sinalização e Trânsito', iconName: 'warning', colorKey: 'warning' },
};

export const CATEGORIA_CATALOG: readonly CategoriaResponse[] = Object.entries(CATEGORY_META).map(
  ([nome, { id }]) => ({ id, nome })
);

export function getCategoryLabel(categoria: string): string {
  return CATEGORY_META[categoria.trim().toUpperCase()]?.label ?? categoria;
}

export function getStatusVisuals(status: StatusChamado, theme: AppTheme): VisualBadgeConfig {
  const label = STATUS_LABELS[status];
  switch (status) {
    case 'PENDENTE':
      return { label, bg: theme.warningBg, text: theme.warningText, border: theme.warningBorder, iconColor: theme.warning, iconName: 'time' };
    case 'EM_ANALISE':
      return { label, bg: theme.infoBg, text: theme.infoText, border: theme.infoBorder, iconColor: theme.info, iconName: 'eye' };
    case 'EM_EXECUCAO':
      return { label, bg: theme.infoBg, text: theme.infoText, border: theme.infoBorder, iconColor: theme.info, iconName: 'construct' };
    case 'CONCLUIDO':
      return { label, bg: theme.successBg, text: theme.successText, border: theme.primaryBorder, iconColor: theme.success, iconName: 'checkmark-circle' };
    case 'REJEITADO':
      return { label, bg: theme.dangerBg, text: theme.dangerText, border: theme.dangerBorder, iconColor: theme.danger, iconName: 'close-circle' };
  }
}

export function getCategoryVisuals(categoriaNome: string, theme: AppTheme): { iconName: IoniconName; color: string; bg: string } {
  const entry = CATEGORY_META[categoriaNome.trim().toUpperCase()];
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
  if (norm === 'URGENTE') {
    return { label: prioridade, color: theme.dangerText, bg: theme.dangerBg };
  }
  if (norm === 'ALTA') {
    return { label: prioridade, color: theme.warningText, bg: theme.warningBg };
  }
  if (norm === 'MEDIA') {
    return { label: prioridade, color: theme.infoText, bg: theme.infoBg };
  }
  return { label: prioridade, color: theme.primary, bg: theme.primaryLight };
}

const ORGAO_LABELS: Record<string, string> = {
  SECRETARIA_OBRAS: 'Secretaria Municipal de Infraestrutura Urbana e Obras',
  CET_TRANSITO: 'Companhia de Engenharia de Tráfego (CET)',
  ILUMINACAO_PUBLICA: 'Departamento de Iluminação Pública (Ilume)',
  DEFESA_CIVIL: 'Coordenação Municipal de Defesa Civil',
  SUBPREFEITURA: 'Subprefeitura Regional',
  SANEAMENTO_BASICO: 'Companhia de Saneamento Básico e Drenagem',
};

export function getOrgaoLabel(orgao: string): string {
  return ORGAO_LABELS[orgao.trim().toUpperCase()] ?? orgao;
}
