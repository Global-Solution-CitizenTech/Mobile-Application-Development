import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { borderRadius, fontWeight } from '@/theme';
import { getInitials } from '@/utils/formatters';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  nome?: string | null;
  tamanho?: AvatarSize | number;
}

const PRESET_SIZES: Record<AvatarSize, { size: number; fontSize: number }> = {
  sm: { size: 32, fontSize: 13 },
  md: { size: 42, fontSize: 16 },
  lg: { size: 60, fontSize: 22 },
  xl: { size: 72, fontSize: 26 },
};

export const Avatar = ({ nome, tamanho = 'md' }: AvatarProps) => {
  const { theme } = useTheme();

  const dim =
    typeof tamanho === 'number'
      ? { size: tamanho, fontSize: Math.max(12, Math.floor(tamanho * 0.38)) }
      : PRESET_SIZES[tamanho];

  return (
    <View
      style={[
        styles.circle,
        {
          width: dim.size,
          height: dim.size,
          borderRadius: borderRadius.full,
          backgroundColor: theme.primaryLight,
        },
      ]}
    >
      <Text style={[styles.initials, { fontSize: dim.fontSize, color: theme.primary }]}>
        {getInitials(nome)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontWeight: fontWeight.bold,
  },
});
