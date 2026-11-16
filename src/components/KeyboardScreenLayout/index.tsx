import { KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemedStyles } from '@/contexts/ThemeContext';
import { spacing } from '@/theme/spacing';
import type { AppTheme } from '@/types/theme';
import type { KeyboardScreenLayoutProps } from '@/types/ui';

export const KeyboardScreenLayout = ({
  children,
  header,
  footer,
  scrollable = true,
  style,
  contentContainerStyle,
  keyboardVerticalOffset,
  showsVerticalScrollIndicator = false,
  safeAreaEdges,
}: KeyboardScreenLayoutProps) => {
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();

  const resolvedEdges = safeAreaEdges ?? (header ? ['bottom', 'left', 'right'] : ['top', 'bottom', 'left', 'right']);
  const hasTopEdge = resolvedEdges.includes('top');
  const hasBottomEdge = resolvedEdges.includes('bottom');
  const hasLeftEdge = resolvedEdges.includes('left');
  const hasRightEdge = resolvedEdges.includes('right');

  const horizontalInsets = {
    paddingLeft: hasLeftEdge ? Math.max(insets.left, spacing.md) : spacing.md,
    paddingRight: hasRightEdge ? Math.max(insets.right, spacing.md) : spacing.md,
  };

  const bodyPadding = {
    paddingTop: hasTopEdge ? Math.max(insets.top, spacing.lg) + spacing.sm : spacing.md,
    paddingBottom: footer
      ? spacing.md
      : hasBottomEdge
        ? Math.max(insets.bottom, spacing.xl) + spacing.lg
        : spacing.xl,
    ...horizontalInsets,
  };

  const footerPadding = {
    paddingBottom: hasBottomEdge ? Math.max(insets.bottom, spacing.md) : spacing.md,
    ...horizontalInsets,
  };

  const resolvedOffset =
    keyboardVerticalOffset ?? (Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0);

  return (
    <View style={[styles.container, style]}>
      {header}

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={resolvedOffset}
      >
        {scrollable ? (
          <ScrollView
            style={styles.flexBody}
            contentContainerStyle={[styles.scrollContent, bodyPadding, contentContainerStyle]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.flexBody, bodyPadding, contentContainerStyle]}>{children}</View>
        )}

        {footer ? <View style={[styles.footer, footerPadding]}>{footer}</View> : null}
      </KeyboardAvoidingView>
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    keyboardContainer: {
      flex: 1,
    },
    flexBody: {
      flex: 1,
    },
    scrollContent: {
      gap: spacing.md,
    },
    footer: {
      paddingTop: spacing.sm,
      backgroundColor: theme.background,
    },
  });
