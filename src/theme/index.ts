import { colors } from '@/theme/colors';
import { spacing, borderRadius, shadows } from '@/theme/spacing';
import { fontSize, fontWeight } from '@/theme/typography';

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
