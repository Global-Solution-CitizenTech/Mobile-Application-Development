import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BaseModal } from '@/components/BaseModal';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { type AppTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { useZodForm } from '@/hooks/useZodForm';
import { borderRadius, fontSize, fontWeight, spacing } from '@/theme';
import { STATUS_OPTIONS } from '@/theme/semanticConfig';
import type { StatusChamado } from '@/types/categoria';
import { StatusUpdateSchema, type StatusUpdateFormData } from '@/utils/schemas';

interface StatusChangeModalProps {
  visible: boolean;
  currentStatus: StatusChamado;
  onClose: () => void;
  onSubmit: (data: StatusUpdateFormData) => void;
  submitting: boolean;
}

export const StatusChangeModal: React.FC<StatusChangeModalProps> = ({
  visible,
  currentStatus,
  onClose,
  onSubmit,
  submitting,
}) => {
  const styles = useThemedStyles(createStyles);
  const { values, errors, setFieldValue, validate } = useZodForm(StatusUpdateSchema, {
    status: currentStatus,
    observacao: '',
  });

  const handleConfirm = () => {
    const parsed = validate();
    if (parsed) onSubmit(parsed);
  };

  return (
    <BaseModal visible={visible} title="Atualizar Status" subtitle="Selecione a nova situação e informe um parecer técnico" onClose={onClose}>
      <View style={styles.form}>
        <Text style={styles.label}>Novo Status *</Text>
        <View style={styles.chipsWrap}>
          {STATUS_OPTIONS.map((opt) => {
            const active = values.status === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setFieldValue('status', opt.value)}
                activeOpacity={0.8}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{opt.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Input
          label="Parecer / Observação *"
          placeholder="Descreva a vistoria, encaminhamento ou motivo da decisão..."
          value={values.observacao}
          onChangeText={(text) => setFieldValue('observacao', text)}
          multiline
          numberOfLines={3}
          maxLength={255}
          style={styles.textArea}
          error={errors.observacao}
        />

        <View style={styles.actions}>
          <Button title="Cancelar" variant="outline" onPress={onClose} style={styles.btn} disabled={submitting} />
          <Button title="Confirmar" onPress={handleConfirm} loading={submitting} style={styles.btn} />
        </View>
      </View>
    </BaseModal>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    form: { gap: spacing.sm },
    label: { fontSize: fontSize.bodySmall, fontWeight: fontWeight.semibold, color: theme.text },
    chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs + 2, marginBottom: spacing.xs },
    chip: {
      paddingHorizontal: spacing.sm + 4,
      paddingVertical: spacing.xs + 3,
      borderRadius: borderRadius.full,
      backgroundColor: theme.cardSubtle,
      borderWidth: 1,
      borderColor: theme.border,
    },
    chipActive: { backgroundColor: theme.primary, borderColor: theme.primary },
    chipText: { fontSize: fontSize.caption, fontWeight: fontWeight.semibold, color: theme.textSecondary },
    chipTextActive: { color: theme.inverseText },
    textArea: { minHeight: 84, textAlignVertical: 'top', paddingTop: spacing.sm },
    actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
    btn: { flex: 1 },
  });
