import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { useImageEvidencePicker } from '@/hooks/useImageEvidencePicker';
import { borderRadius, spacing } from '@/theme/spacing';
import { fontSize, fontWeight } from '@/theme/typography';
import type { AppTheme } from '@/types/theme';
import type { PhotoEvidencePickerProps } from '@/types/ui';

export const PhotoEvidencePicker = ({
  foto,
  onChangeFoto,
  error,
  disabled = false,
}: PhotoEvidencePickerProps) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { processing, pickFromCamera, pickFromLibrary, removeFoto } = useImageEvidencePicker({
    onChangeFoto,
  });

  const previewSource = foto?.uri ?? null;
  const hasError = Boolean(error);
  const isLocked = disabled || processing !== null;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Foto de Evidência *</Text>

      {previewSource ? (
        <View style={[styles.previewWrap, disabled && styles.disabledWrap]}>
          <Image source={{ uri: previewSource }} style={styles.previewImage} resizeMode="cover" />
          <TouchableOpacity
            style={styles.removeBtn}
            onPress={removeFoto}
            disabled={disabled}
            activeOpacity={0.8}
          >
            <Ionicons name="trash-outline" size={16} color={theme.inverseText} />
            <Text style={styles.removeText}>Remover Foto</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[styles.pickBtn, hasError && styles.pickBtnError, isLocked && styles.disabledWrap]}
            onPress={() => {
              void pickFromCamera();
            }}
            disabled={isLocked}
            activeOpacity={0.8}
          >
            {processing === 'camera' ? (
              <ActivityIndicator size="small" color={theme.primary} />
            ) : (
              <Ionicons name="camera-outline" size={20} color={theme.primary} />
            )}
            <Text style={styles.pickText}>Tirar Foto</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.pickBtn, hasError && styles.pickBtnError, isLocked && styles.disabledWrap]}
            onPress={() => {
              void pickFromLibrary();
            }}
            disabled={isLocked}
            activeOpacity={0.8}
          >
            {processing === 'library' ? (
              <ActivityIndicator size="small" color={theme.primary} />
            ) : (
              <Ionicons name="images-outline" size={20} color={theme.primary} />
            )}
            <Text style={styles.pickText}>Galeria</Text>
          </TouchableOpacity>
        </View>
      )}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { gap: spacing.xs + 3, marginTop: spacing.xs },
    label: { fontSize: fontSize.bodySmall, fontWeight: fontWeight.bold, color: theme.text },
    buttonsRow: { flexDirection: 'row', gap: spacing.sm + 2 },
    pickBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      paddingVertical: spacing.md + 4,
      borderRadius: borderRadius.card,
      borderWidth: 1.5,
      borderStyle: 'dashed',
      borderColor: theme.primary,
      backgroundColor: theme.primaryLight,
    },
    pickBtnError: { borderColor: theme.danger },
    pickText: { fontSize: fontSize.bodySmall, fontWeight: fontWeight.bold, color: theme.primaryDark },
    errorText: { fontSize: fontSize.caption, color: theme.danger, fontWeight: fontWeight.medium },
    previewWrap: {
      borderRadius: borderRadius.card,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.border,
    },
    previewImage: { width: '100%', height: 200, backgroundColor: theme.cardSubtle },
    removeBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      backgroundColor: theme.danger,
      paddingVertical: spacing.sm + 2,
    },
    removeText: { fontSize: fontSize.bodySmall, fontWeight: fontWeight.bold, color: theme.inverseText },
    disabledWrap: { opacity: 0.6 },
  });
