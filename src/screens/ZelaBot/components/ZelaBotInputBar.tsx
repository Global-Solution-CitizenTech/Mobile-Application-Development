import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { borderRadius, fontSize, fontWeight, spacing } from '@/theme';
import type { AppTheme } from '@/theme/types';

interface ZelaBotInputBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: (customText?: string) => void;
  sugestoes: string[];
  disabled: boolean;
}

export const ZelaBotInputBar = ({
  value,
  onChangeText,
  onSend,
  sugestoes,
  disabled,
}: ZelaBotInputBarProps) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();
  const [showSugestoes, setShowSugestoes] = useState(false);

  const canSend = value.trim().length > 0 && !disabled;

  const handleSelectSuggestion = (text: string) => {
    setShowSugestoes(false);
    onSend(text);
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingLeft: Math.max(insets.left, spacing.md),
          paddingRight: Math.max(insets.right, spacing.md),
        },
      ]}
    >
      {sugestoes.length > 0 ? (
        <View style={styles.suggestionsSection}>
          <TouchableOpacity
            style={styles.suggestionsToggle}
            onPress={() => setShowSugestoes((prev) => !prev)}
            activeOpacity={0.78}
          >
            <View style={styles.suggestionsToggleLeft}>
              <Ionicons name="sparkles-outline" size={14} color={theme.primary} />
              <Text style={styles.suggestionsToggleText}>Sugestões rápidas</Text>
            </View>
            <Ionicons
              name={showSugestoes ? 'chevron-down' : 'chevron-up'}
              size={16}
              color={theme.textSecondary}
            />
          </TouchableOpacity>

          {showSugestoes ? (
            <View style={styles.suggestionsList}>
              {sugestoes.map((sugestao) => (
                <TouchableOpacity
                  key={sugestao}
                  style={styles.suggestionRow}
                  onPress={() => handleSelectSuggestion(sugestao)}
                  disabled={disabled}
                  activeOpacity={0.78}
                >
                  <Text style={styles.suggestionText}>{sugestao}</Text>
                  <Ionicons name="arrow-forward-circle-outline" size={16} color={theme.primary} />
                </TouchableOpacity>
              ))}
            </View>
          ) : null}
        </View>
      ) : null}

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Pergunte sobre zeladoria, prazos ou decretos..."
          placeholderTextColor={theme.textMuted}
          value={value}
          onChangeText={onChangeText}
          editable={!disabled}
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
      paddingTop: spacing.sm + 4,
      paddingBottom: spacing.sm + 4,
      gap: spacing.sm + 2,
    },
    suggestionsSection: {
      gap: spacing.xs + 2,
    },
    suggestionsToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      alignSelf: 'flex-start',
      gap: spacing.sm,
      backgroundColor: theme.primaryLight,
      borderWidth: 1,
      borderColor: theme.primaryBorder,
      borderRadius: borderRadius.full,
      paddingHorizontal: spacing.sm + 4,
      paddingVertical: 6,
    },
    suggestionsToggleLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    suggestionsToggleText: {
      fontSize: fontSize.caption,
      fontWeight: fontWeight.bold,
      color: theme.primaryDark,
    },
    suggestionsList: {
      gap: spacing.xs + 2,
    },
    suggestionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.sm,
      backgroundColor: theme.cardSubtle,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.sm + 4,
      paddingVertical: spacing.sm,
    },
    suggestionText: {
      flex: 1,
      fontSize: fontSize.caption,
      fontWeight: fontWeight.medium,
      color: theme.text,
      lineHeight: 17,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: spacing.sm + 2,
    },
    input: {
      flex: 1,
      backgroundColor: theme.inputBg,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: borderRadius.xl,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm + 3,
      fontSize: fontSize.body,
      color: theme.text,
      maxHeight: 112,
    },
    sendButton: {
      width: 44,
      height: 44,
      borderRadius: borderRadius.full,
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sendButtonDisabled: {
      backgroundColor: theme.textMuted,
      opacity: 0.5,
    },
  });
