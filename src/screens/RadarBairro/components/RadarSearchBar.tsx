import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { borderRadius, spacing } from '@/theme/spacing';
import { fontSize } from '@/theme/typography';
import type { AppTheme } from '@/types/theme';
import type { RadarSearchBarProps } from '@/types/ui';

export const RadarSearchBar = ({ value, onChangeText }: RadarSearchBarProps) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.searchRow}>
      <Ionicons name="search-outline" size={18} color={theme.textMuted} />
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar rua, título ou bairro..."
        placeholderTextColor={theme.textMuted}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
      />
      {value.length > 0 ? (
        <TouchableOpacity onPress={() => onChangeText('')} hitSlop={8}>
          <Ionicons name="close-circle" size={18} color={theme.textMuted} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      paddingHorizontal: spacing.sm + 4,
      height: 44,
      borderRadius: borderRadius.card,
      backgroundColor: theme.cardSubtle,
      borderWidth: 1,
      borderColor: theme.border,
    },
    searchInput: {
      flex: 1,
      fontSize: fontSize.bodySmall,
      color: theme.text,
    },
  });
