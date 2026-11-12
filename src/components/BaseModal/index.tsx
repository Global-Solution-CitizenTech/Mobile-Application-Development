import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, useWindowDimensions, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme, useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { borderRadius, fontSize, fontWeight, shadows, spacing } from '@/theme';

interface BaseModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: number;
  centered?: boolean;
  dismissable?: boolean;
  scrollable?: boolean;
}

export const BaseModal: React.FC<BaseModalProps> = ({
  visible,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = 440,
  centered = false,
  dismissable = true,
  scrollable = true,
}) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { height: windowHeight } = useWindowDimensions();

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={dismissable ? onClose : undefined}>
        <View style={[styles.overlay, centered && styles.overlayCentered]}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.keyboardContainer}
          >
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.card,
                  shadows.lg,
                  { maxWidth, maxHeight: Math.round(windowHeight * 0.88) },
                  centered && styles.cardCentered,
                ]}
              >
                {title && (
                  <View style={styles.header}>
                    <View style={styles.headerText}>
                      <Text style={styles.title}>{title}</Text>
                      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                    </View>
                    <TouchableOpacity
                      onPress={onClose}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      accessibilityRole="button"
                      accessibilityLabel="Fechar"
                    >
                      <Ionicons name="close" size={22} color={theme.textSecondary} />
                    </TouchableOpacity>
                  </View>
                )}

                {scrollable ? (
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    style={styles.bodyScroll}
                  >
                    {children}
                  </ScrollView>
                ) : (
                  <View>{children}</View>
                )}

                {footer && <View style={styles.footer}>{footer}</View>}
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: theme.overlay,
      justifyContent: 'center',
      padding: spacing.md,
    },
    overlayCentered: {
      padding: spacing.lg,
    },
    keyboardContainer: {
      width: '100%',
      alignItems: 'center',
    },
    card: {
      width: '100%',
      backgroundColor: theme.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: theme.border,
    },
    cardCentered: {
      padding: spacing.xl,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: spacing.md,
      gap: spacing.sm,
    },
    headerText: {
      flex: 1,
    },
    title: {
      fontSize: fontSize.subtitle,
      fontWeight: fontWeight.bold,
      color: theme.text,
    },
    subtitle: {
      fontSize: fontSize.caption,
      color: theme.textSecondary,
      marginTop: 2,
    },
    bodyScroll: {
      flexGrow: 0,
    },
    footer: {
      marginTop: spacing.md,
    },
  });
