import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Button } from '../../../components/Button';
import { colors, borderRadius, spacing, fontSize, fontWeight, shadows } from '../../../theme';
import { StatusChamado } from '../../../types';

interface StatusChangeModalProps {
  visible: boolean;
  selectedStatus: StatusChamado;
  statusFeedback: string;
  loading: boolean;
  onSelectStatus: (st: StatusChamado) => void;
  onFeedbackChange: (text: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export const StatusChangeModal: React.FC<StatusChangeModalProps> = ({
  visible,
  selectedStatus,
  statusFeedback,
  loading,
  onSelectStatus,
  onFeedbackChange,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={[styles.modalCard, shadows.lg]}>
          <Text style={styles.modalTitle}>Atualizar Status</Text>
          <Text style={styles.modalSub}>
            Selecione a etapa atual de atendimento desta demanda:
          </Text>

          <View style={styles.statusOptionsRow}>
            {(['Aberto', 'Em Andamento', 'Resolvido'] as StatusChamado[]).map((st) => {
              const isSelected = selectedStatus === st;
              return (
                <TouchableOpacity
                  key={st}
                  style={[
                    styles.statusSelectButton,
                    isSelected && styles.statusSelectButtonActive,
                  ]}
                  onPress={() => onSelectStatus(st)}
                >
                  <Text
                    style={[
                      styles.statusSelectText,
                      isSelected && styles.statusSelectTextActive,
                    ]}
                  >
                    {st}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TextInput
            style={styles.modalTextInput}
            placeholder="Observação ou parecer técnico (opcional)..."
            placeholderTextColor={colors.text.tertiary}
            value={statusFeedback}
            onChangeText={onFeedbackChange}
            multiline
            numberOfLines={3}
          />

          <View style={styles.modalButtonsRow}>
            <Button
              title="Cancelar"
              variant="ghost"
              onPress={onCancel}
              style={{ flex: 1 }}
            />
            <Button
              title="Confirmar"
              variant="primary"
              onPress={onConfirm}
              loading={loading}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  modalTitle: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
    color: colors.secondary[900],
    marginBottom: 4,
  },
  modalSub: {
    fontSize: fontSize.caption,
    color: colors.secondary[500],
    marginBottom: spacing.md,
  },
  statusOptionsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  statusSelectButton: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: colors.secondary[50],
  },
  statusSelectButtonActive: {
    backgroundColor: colors.primary[600],
    borderColor: colors.primary[600],
  },
  statusSelectText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    color: colors.secondary[700],
  },
  statusSelectTextActive: {
    color: colors.surface,
  },
  modalTextInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    fontSize: fontSize.bodySmall,
    color: colors.text.primary,
    minHeight: 74,
    textAlignVertical: 'top',
    marginBottom: spacing.md,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
