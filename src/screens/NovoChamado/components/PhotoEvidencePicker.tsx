import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FOTOS_SIMULADAS } from '../../../hooks/useChamadoForm';
import { colors, borderRadius, spacing, fontSize, fontWeight, shadows } from '../../../theme';

interface PhotoEvidencePickerProps {
  fotoUrl: string;
  onSelectFoto: (url: string) => void;
}

export const PhotoEvidencePicker: React.FC<PhotoEvidencePickerProps> = ({
  fotoUrl,
  onSelectFoto,
}) => {
  return (
    <View style={[styles.sectionCard, shadows.sm]}>
      <Text style={styles.sectionTitle}>Evidência Fotográfica</Text>

      {fotoUrl ? (
        <View style={styles.selectedPhotoPreview}>
          <Image
            source={{ uri: fotoUrl }}
            style={styles.previewImage}
            resizeMode="cover"
          />
          <View style={styles.photoOverlayTag}>
            <Ionicons name="camera" size={13} color={colors.surface} />
            <Text style={styles.photoOverlayText}>Foto Selecionada</Text>
          </View>
        </View>
      ) : null}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.photoPickerRow}
      >
        {FOTOS_SIMULADAS.map((item, idx) => {
          const isSelected = fotoUrl === item.url;
          return (
            <TouchableOpacity
              key={idx}
              style={styles.photoOption}
              onPress={() => onSelectFoto(item.url)}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: item.url }}
                style={[
                  styles.photoThumbnail,
                  isSelected && styles.photoThumbnailSelected,
                ]}
              />
              <Text
                style={[
                  styles.photoLabel,
                  isSelected && styles.photoLabelSelected,
                ]}
              >
                {item.rotulo}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.secondary[100],
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    color: colors.secondary[900],
    marginBottom: spacing.sm + 2,
  },
  selectedPhotoPreview: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginBottom: spacing.sm,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: 155,
    borderRadius: borderRadius.md,
  },
  photoOverlayTag: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  photoOverlayText: {
    color: colors.surface,
    fontSize: fontSize.tiny,
    fontWeight: fontWeight.semibold,
  },
  photoPickerRow: {
    gap: spacing.sm,
    paddingTop: 2,
  },
  photoOption: {
    alignItems: 'center',
  },
  photoThumbnail: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: colors.secondary[100],
  },
  photoThumbnailSelected: {
    borderColor: colors.primary[600],
  },
  photoLabel: {
    fontSize: 10.5,
    color: colors.secondary[500],
    marginTop: 4,
    fontWeight: fontWeight.medium,
  },
  photoLabelSelected: {
    color: colors.primary[700],
    fontWeight: fontWeight.bold,
  },
});
