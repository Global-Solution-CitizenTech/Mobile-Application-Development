import { Platform, ViewStyle } from 'react-native';

interface ShadowOptions {
  color?: string;
  offsetX?: number;
  offsetY?: number;
  blur?: number;
  opacity?: number;
}

function parseHexToRgb(color: string): [number, number, number] {
  if (color.startsWith('#')) {
    let hex = color.slice(1);
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map((c) => c + c)
        .join('');
    }
    if (hex.length === 6) {
      return [
        parseInt(hex.slice(0, 2), 16),
        parseInt(hex.slice(2, 4), 16),
        parseInt(hex.slice(4, 6), 16),
      ];
    }
  }
  return [15, 23, 42];
}

export function createShadow({
  color = '#0F172A',
  offsetX = 0,
  offsetY = 2,
  blur = 4,
  opacity = 0.06,
}: ShadowOptions = {}): ViewStyle {
  const [r, g, b] = parseHexToRgb(color);

  return (
    Platform.select<ViewStyle>({
      web: {
        boxShadow: `${offsetX}px ${offsetY}px ${blur}px rgba(${r}, ${g}, ${b}, ${opacity})`,
      } as ViewStyle,
      default: {
        shadowColor: color,
        shadowOffset: { width: offsetX, height: offsetY },
        shadowOpacity: opacity,
        shadowRadius: blur,
        elevation: Math.max(1, Math.round(blur / 2)),
      },
    }) ?? {}
  );
}

export const shadows = {
  sm: createShadow({ offsetY: 1, blur: 3, opacity: 0.05 }),
  md: createShadow({ offsetY: 3, blur: 6, opacity: 0.08 }),
  lg: createShadow({ offsetY: 6, blur: 14, opacity: 0.12 }),
};
