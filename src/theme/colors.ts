/**
 * ZelaFix - Paleta de Cores do Sistema
 * Baseada nas diretrizes de Cidades Inteligentes & Sustentabilidade:
 * Verde Esmeralda (Ecologia, Resolução, Ação Positiva)
 * Azul Ardósia (Governança, Tecnologia, Confiabilidade)
 * Cinzas Neutros e Branco (Acessibilidade e Contraste)
 */

export const colors = {
  // Cores Primárias (Verde Esmeralda)
  primary: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981', // Principal
    600: '#059669', // Dark primary
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },

  // Cores Secundárias (Azul Ardósia / Slate)
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155', // Principal Slate
    800: '#1e293b', // Dark Slate
    900: '#0f172a', // Deep Slate
  },

  // Cores de Status de Ocorrência
  status: {
    aberto: {
      bg: '#FEF3C7',
      text: '#D97706',
      border: '#FCD34D',
      icon: '#B45309',
    },
    emAndamento: {
      bg: '#EFF6FF',
      text: '#2563EB',
      border: '#BFDBFE',
      icon: '#1D4ED8',
    },
    resolvido: {
      bg: '#ECFDF5',
      text: '#059669',
      border: '#A7F3D0',
      icon: '#047857',
    },
  },

  // Cores de Feedback do Sistema
  feedback: {
    success: '#10B981',
    successLight: '#D1FAE5',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    danger: '#EF4444',
    dangerLight: '#FEE2E2',
    info: '#3B82F6',
    infoLight: '#DBEAFE',
  },

  // Neutros e Superfícies
  background: '#F8FAFC',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  border: '#E2E8F0',
  divider: '#F1F5F9',

  // Textos
  text: {
    primary: '#0F172A',
    secondary: '#475569',
    tertiary: '#94A3B8',
    inverse: '#FFFFFF',
    disabled: '#CBD5E1',
  },

  // Específicos
  overlay: 'rgba(15, 23, 42, 0.55)',
  shadow: '#0F172A',
};

