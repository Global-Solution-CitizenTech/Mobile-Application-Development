import { useCallback, useEffect, useRef, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useFeedback } from '@/contexts/FeedbackContext';
import type {
  FotoUpload,
  UseImageEvidencePickerOptions,
  UseImageEvidencePickerReturn,
} from '@/types/chamado';

const DEFAULT_MAX_IMAGE_BYTES = 7 * 1024 * 1024;
const SUPPORTED_IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

function normalizeImageMimeType(rawMime?: string | null): string | null {
  const normalized = rawMime?.trim().toLowerCase();
  if (!normalized) return 'image/jpeg';
  if (normalized === 'image/jpg') return 'image/jpeg';
  if (SUPPORTED_IMAGE_MIME_TYPES.has(normalized)) return normalized;
  return normalized.startsWith('image/') ? normalized : null;
}

function toFotoUpload(asset: ImagePicker.ImagePickerAsset, mimeType: string): FotoUpload {
  const rawExt = mimeType.split('/')[1] || 'jpg';
  const ext = rawExt === 'jpeg' ? 'jpg' : rawExt;
  const name = asset.fileName?.trim() || `ocorrencia.${ext}`;
  return { uri: asset.uri, name, type: mimeType };
}

async function resolveAssetFileSize(asset: ImagePicker.ImagePickerAsset): Promise<number | null> {
  if (typeof asset.fileSize === 'number' && Number.isFinite(asset.fileSize) && asset.fileSize >= 0) {
    return asset.fileSize;
  }

  try {
    const response = await fetch(asset.uri);
    const contentLengthHeader = response.headers.get('content-length');
    if (contentLengthHeader) {
      const parsedLength = Number(contentLengthHeader);
      if (Number.isFinite(parsedLength) && parsedLength >= 0) {
        return parsedLength;
      }
    }

    const blob = await response.blob();
    if (typeof blob.size === 'number' && Number.isFinite(blob.size) && blob.size >= 0) {
      return blob.size;
    }
  } catch {
    return null;
  }

  return null;
}

export function useImageEvidencePicker({
  onChangeFoto,
  maxBytes = DEFAULT_MAX_IMAGE_BYTES,
}: UseImageEvidencePickerOptions): UseImageEvidencePickerReturn {
  const { showError, showFeedback } = useFeedback();
  const [processing, setProcessing] = useState<'camera' | 'library' | null>(null);
  const processingRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handlePick = useCallback(
    async (useCamera: boolean) => {
      if (processingRef.current) return;
      processingRef.current = true;
      setProcessing(useCamera ? 'camera' : 'library');

      try {
        const permission = useCamera
          ? await ImagePicker.requestCameraPermissionsAsync()
          : await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!mountedRef.current) return;

        if (!permission.granted) {
          showFeedback({
            type: 'warning',
            title: 'Permissão necessária',
            message: 'Autorize o acesso à câmera ou galeria nas configurações do dispositivo.',
          });
          return;
        }

        const result = useCamera
          ? await ImagePicker.launchCameraAsync({
              mediaTypes: ['images'],
              quality: 0.7,
              allowsEditing: true,
            })
          : await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ['images'],
              quality: 0.7,
              allowsEditing: true,
            });

        if (!mountedRef.current || result.canceled || !result.assets?.[0]) return;
        const asset = result.assets[0];

        if (!asset.uri) {
          showError('Erro', 'Não foi possível ler os dados da imagem selecionada.');
          return;
        }

        const normalizedMime = normalizeImageMimeType(asset.mimeType);
        if (!normalizedMime) {
          showFeedback({
            type: 'warning',
            title: 'Formato inválido',
            message: 'Selecione uma imagem nos formatos JPEG, PNG, WEBP ou GIF.',
          });
          return;
        }

        const fileSize = await resolveAssetFileSize(asset);
        if (!mountedRef.current) return;

        if (fileSize !== null && fileSize > maxBytes) {
          const maxMb = Math.round(maxBytes / (1024 * 1024));
          showFeedback({
            type: 'warning',
            title: 'Imagem muito grande',
            message: `Escolha uma imagem com até ${maxMb} MB.`,
          });
          return;
        }

        onChangeFoto(toFotoUpload(asset, normalizedMime));
      } catch {
        if (mountedRef.current) {
          showError('Erro', 'Não foi possível selecionar a imagem.');
        }
      } finally {
        processingRef.current = false;
        if (mountedRef.current) {
          setProcessing(null);
        }
      }
    },
    [maxBytes, onChangeFoto, showError, showFeedback]
  );

  const pickFromCamera = useCallback(() => handlePick(true), [handlePick]);
  const pickFromLibrary = useCallback(() => handlePick(false), [handlePick]);
  const removeFoto = useCallback(() => {
    onChangeFoto(undefined);
  }, [onChangeFoto]);

  return {
    processing,
    pickFromCamera,
    pickFromLibrary,
    removeFoto,
  };
}
