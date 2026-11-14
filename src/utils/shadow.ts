import type { ViewStyle } from 'react-native';
import { colors } from '@/theme/colors';

interface ShadowOptions {
  offsetY: number;
  blur: number;
  opacity: number;
}

function createShadow({ offsetY, blur, opacity }: ShadowOptions): ViewStyle {
  return {
    shadowColor: colors.secondary[900],
    shadowOffset: { width: 0, height: offsetY },
    shadowOpacity: opacity,
    shadowRadius: blur,
    elevation: Math.max(1, Math.round(blur / 2)),
  };
}

export const shadows = {
  sm: createShadow({ offsetY: 1, blur: 3, opacity: 0.05 }),
  md: createShadow({ offsetY: 3, blur: 6, opacity: 0.08 }),
  lg: createShadow({ offsetY: 6, blur: 14, opacity: 0.12 }),
};
