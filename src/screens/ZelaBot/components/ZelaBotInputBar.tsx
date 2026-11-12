import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { type AppTheme, useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { borderRadius, fontSize, fontWeight, spacing } from '@/theme';

interface ZelaBotInputBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: (customText?: string) => void;
  sugestoes: string[];
  disabled: boolean;
  bottomInset: number;
}

export const ZelaBotInputBar: React.FC<ZelaBotInputBarProps> = ({
  value,
  onChangeText,
  onSend,
  sugestoes,
  disabled,
  bottomInset,
}) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const canSend = value.trim().length > 0 && !disabled;

  return (
    <View style={[styles.container, { paddingBottom: Math.max(bottomInset, spacing.md) }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll} keyboardShouldPersistTaps="handled">
        {sugestoes.map((sugestao) => (
          <TouchableOpacity key={sugestao} style={styles.chip} onPress={() => onSend(sugestao)} disabled={disabled} activeOpacity={0.75}>
            <Ionicons name="sparkles-outline" size={12} color={theme.primary} />
            <Text style={styles.chipText}>{sugestao}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Pergunte sobre zeladoria, prazos ou decretos..."
          placeholderTextColor={theme.textMuted}
          value={value}
          onChangeText={onChangeText}
          maxLength={600}
          multiline
          returnKeyType="send"
          onSubmitEditing={() => canSend && onSend()}
        />
        <TouchableOpacity
          style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
          onPress={() => onSend()}
          disabled={!canSend}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Enviar pergunta para o ZelaBot"
        >
          <Ionicons name="arrow-up" size={18} color={theme.inverseText} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.surface,
      borderTopWidth: 1,
      borderTopColor: theme.border,
      paddingTop: spacing.sm,
      paddingHorizontal: spacing.md,
      gap: spacing.sm,
    },
    chipsScroll: { gap: spacing.xs + 2, paddingVertical: 2 },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: theme.primaryLight,
      paddingHorizontal: spacing.sm + 4,
      paddingVertical: spacing.xs + 2,
      borderRadius: borderRadius.full,
    },
    chipText: { fontSize: fontSize.caption, fontWeight: fontWeight.semibold, color: theme.primary },
    inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm },
    input: {
      flex: 1,
      backgroundColor: theme.inputBg,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: borderRadius.xl,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm + 2,
      fontSize: fontSize.body,
      color: theme.text,
      maxHeight: 108,
    },
    sendButton: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.full,
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sendButtonDisabled: { opacity: 0.4 },
  });
