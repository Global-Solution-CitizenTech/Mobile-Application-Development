import { colors } from './colors';
import { spacing, borderRadius, shadows } from './spacing';
import { fontSize, fontWeight } from './typography';

export const theme = {
  colors,
  spacing,
  borderRadius,
  shadows,
  fontSize,
  fontWeight,
};

export type Theme = typeof theme;
export { colors, spacing, borderRadius, shadows, fontSize, fontWeight };

