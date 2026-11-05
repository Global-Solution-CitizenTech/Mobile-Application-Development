import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './Button';
import { colors, borderRadius, spacing, fontSize, fontWeight, shadows } from '../theme';

export type FeedbackType = 'success' | 'error' | 'warning' | 'info';

interface FeedbackModalProps {
  visible: boolean;
  type?: FeedbackType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmLoading?: boolean;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  visible,
  type = 'info',
  title,
  message,
  confirmText = 'OK',
  cancelText,
  onConfirm,
  onCancel,
  confirmLoading = false,
}) => {
  const getModalConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: 'checkmark-circle-outline' as const,
          color: colors.feedback.success,
          bgLight: colors.feedback.successLight,
          btnVariant: 'primary' as const,
        };
      case 'error':
        return {
          icon: 'close-circle-outline' as const,
          color: colors.feedback.danger,
          bgLight: colors.feedback.dangerLight,
          btnVariant: 'danger' as const,
        };
      case 'warning':
        return {
          icon: 'alert-circle-outline' as const,
          color: colors.feedback.warning,
          bgLight: colors.feedback.warningLight,
          btnVariant: 'secondary' as const,
        };
      case 'info':
      default:
        return {
          icon: 'information-circle-outline' as const,
          color: colors.feedback.info,
          bgLight: colors.feedback.infoLight,
          btnVariant: 'primary' as const,
        };
    }
  };

  const config = getModalConfig();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel || onConfirm}
    >
      <TouchableWithoutFeedback onPress={onCancel || onConfirm}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.card, shadows.lg]}>
              {/* Ícone */}
              <View style={[styles.iconWrapper, { backgroundColor: config.bgLight }]}>
                <Ionicons name={config.icon} size={38} color={config.color} />
              </View>

              {/* Título e Mensagem */}
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>{message}</Text>

              {/* Botões de Ação */}
              <View style={styles.buttonRow}>
                {cancelText && onCancel && (
                  <Button
                    title={cancelText}
                    variant="ghost"
                    onPress={onCancel}
                    style={styles.actionButton}
                    disabled={confirmLoading}
                  />
                )}
                <Button
                  title={confirmText}
                  variant={config.btnVariant}
                  onPress={onConfirm}
                  loading={confirmLoading}
                  style={styles.actionButton}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
  },
  iconWrapper: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
    color: colors.secondary[900],
    textAlign: 'center',
    marginBottom: spacing.xs + 2,
  },
  message: {
    fontSize: fontSize.body,
    color: colors.secondary[600],
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
});

