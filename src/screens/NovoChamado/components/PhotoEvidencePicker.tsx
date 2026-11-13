import { useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import type { AppTheme } from '@/theme/types';
import { borderRadius, fontSize, fontWeight, spacing } from '@/theme';
import { stripDataUriPrefix } from '@/utils/chamadoMappers';

const MAX_IMAGE_BYTES = 7 * 1024 * 1024;

interface PhotoEvidencePickerProps {
  fotoBase64?: string;
  onChangeFoto: (base64?: string) => void;
  error?: string;
}

export const PhotoEvidencePicker = ({ fotoBase64, onChangeFoto, error }: PhotoEvidencePickerProps) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [processing, setProcessing] = useState<'camera' | 'library' | null>(null);
  const [preview, setPreview] = useState<{ uri: string; base64: string } | null>(null);

  const handlePick = async (useCamera: boolean) => {
    setProcessing(useCamera ? 'camera' : 'library');
    try {
      const perm = useCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!perm.granted) {
        Alert.alert('Permissão necessária', 'Autorize o acesso à câmera ou galeria nas configurações do dispositivo.');
        return;
      }

      const result = useCamera
        ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.7, base64: true, allowsEditing: true })
        : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7, base64: true, allowsEditing: true });

      if (result.canceled || !result.assets?.[0]) return;
      const asset = result.assets[0];
      const base64 = stripDataUriPrefix(asset.base64 ?? undefined);

      if (!base64) {
        Alert.alert('Erro', 'Não foi possível ler os dados da imagem selecionada.');
        return;
      }

      const sizeInBytes = asset.fileSize ?? Math.ceil((base64.length * 3) / 4);
      if (sizeInBytes > MAX_IMAGE_BYTES) {
        Alert.alert('Imagem muito grande', 'Escolha uma imagem com até 7 MB.');
        return;
      }

      setPreview({ uri: asset.uri, base64 });
      onChangeFoto(base64);
    } catch {
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
    } finally {
      setProcessing(null);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChangeFoto(undefined);
  };

  const previewSource =
    preview && preview.base64 === fotoBase64
      ? preview.uri
      : fotoBase64
        ? `data:image/jpeg;base64,${fotoBase64}`
        : null;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Foto de Evidência *</Text>

      {previewSource ? (
        <View style={styles.previewWrap}>
          <Image source={{ uri: previewSource }} style={styles.previewImage} resizeMode="cover" />
          <TouchableOpacity style={styles.removeBtn} onPress={handleRemove} activeOpacity={0.8}>
            <Ionicons name="trash-outline" size={16} color={theme.inverseText} />
            <Text style={styles.removeText}>Remover Foto</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[styles.pickBtn, error && styles.pickBtnError]}
            onPress={() => handlePick(true)}
            disabled={processing !== null}
            activeOpacity={0.8}
          >
            {processing === 'camera' ? <ActivityIndicator size="small" color={theme.primary} /> : <Ionicons name="camera-outline" size={20} color={theme.primary} />}
            <Text style={styles.pickText}>Tirar Foto</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.pickBtn, error && styles.pickBtnError]}
            onPress={() => handlePick(false)}
            disabled={processing !== null}
            activeOpacity={0.8}
          >
            {processing === 'library' ? <ActivityIndicator size="small" color={theme.primary} /> : <Ionicons name="images-outline" size={20} color={theme.primary} />}
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
    container: { gap: spacing.xs + 2, marginTop: spacing.xs },
    label: { fontSize: fontSize.bodySmall, fontWeight: fontWeight.semibold, color: theme.text },
    buttonsRow: { flexDirection: 'row', gap: spacing.sm },
    pickBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs + 2,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: theme.primary,
      backgroundColor: theme.surface,
    },
    pickBtnError: { borderColor: theme.danger },
    pickText: { fontSize: fontSize.bodySmall, fontWeight: fontWeight.bold, color: theme.primary },
    errorText: { fontSize: fontSize.caption, color: theme.danger, fontWeight: fontWeight.medium },
    previewWrap: { borderRadius: borderRadius.md, overflow: 'hidden', borderWidth: 1, borderColor: theme.border },
    previewImage: { width: '100%', height: 190, backgroundColor: theme.cardSubtle },
    removeBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      backgroundColor: theme.danger,
      paddingVertical: spacing.sm,
    },
    removeText: { fontSize: fontSize.bodySmall, fontWeight: fontWeight.bold, color: theme.inverseText },
  });
