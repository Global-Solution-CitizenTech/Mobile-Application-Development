/**
 * Tipografia e Escala de Fontes
 */

import type { TextStyle } from 'react-native';

export const fontSize = {
  tiny: 10,
  caption: 12,
  bodySmall: 13,
  body: 14,
  bodyLarge: 16,
  subtitle: 18,
  title: 20,
  heading: 24,
  display: 28,
  hero: 32,
};

export const fontWeight: Record<
  'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold',
  TextStyle['fontWeight']
> = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
};

