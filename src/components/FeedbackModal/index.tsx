import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BaseModal } from '@/components/BaseModal';
import { Button, ButtonVariant } from '@/components/Button';
import { AppTheme, useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { spacing, fontSize, fontWeight } from '@/theme';

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
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  const visualMap: Record<
    FeedbackType,
    { icon: keyof typeof Ionicons.glyphMap; color: string; bg: string; btnVariant: ButtonVariant }
  > = {
    success: { icon: 'checkmark-circle-outline', color: theme.success, bg: theme.successBg, btnVariant: 'primary' },
    error: { icon: 'close-circle-outline', color: theme.danger, bg: theme.dangerBg, btnVariant: 'danger' },
    warning: { icon: 'alert-circle-outline', color: theme.warning, bg: theme.warningBg, btnVariant: 'secondary' },
    info: { icon: 'information-circle-outline', color: theme.info, bg: theme.infoBg, btnVariant: 'primary' },
  };

  const config = visualMap[type];

  return (
    <BaseModal
      visible={visible}
      onClose={onCancel || onConfirm}
      maxWidth={380}
      centered
      scrollable={false}
    >
      <View style={styles.content}>
        <View style={[styles.iconWrapper, { backgroundColor: config.bg }]}>
          <Ionicons name={config.icon} size={38} color={config.color} />
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>

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
    </BaseModal>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    content: {
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
      color: theme.text,
      textAlign: 'center',
      marginBottom: spacing.xs + 2,
    },
    message: {
      fontSize: fontSize.body,
      color: theme.textSecondary,
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
