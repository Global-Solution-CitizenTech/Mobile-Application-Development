import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useThemedStyles } from '@/contexts/ThemeContext';
import { borderRadius, spacing } from '@/theme/spacing';
import { fontSize, fontWeight } from '@/theme/typography';
import type { MarkdownBlock, MarkdownInlineSegment } from '@/types/markdown';
import type { AppTheme } from '@/types/theme';
import type { MarkdownTextProps } from '@/types/ui';
import { parseMarkdownBlocks } from '@/utils/markdown';

const INDENT_STEP = spacing.md;

export const MarkdownText = ({ content, compact = false, textColor, accentColor }: MarkdownTextProps) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const blocks = useMemo(() => parseMarkdownBlocks(content), [content]);

  const bodyColor = textColor ?? theme.text;
  const accent = accentColor ?? theme.primary;
  const bodyStyle = compact ? styles.bodyCompact : styles.body;

  const renderInline = (segments: MarkdownInlineSegment[]): ReactNode[] =>
    segments.map((segment, index) => (
      <Text
        key={`seg-${index}`}
        style={[
          segment.bold && styles.bold,
          segment.italic && styles.italic,
          segment.code && styles.inlineCode,
        ]}
      >
        {segment.text}
      </Text>
    ));

  const renderBlock = (block: MarkdownBlock, index: number): ReactNode => {
    const key = `${block.type}-${index}`;

    switch (block.type) {
      case 'heading':
        return (
          <Text
            key={key}
            style={[styles.heading, block.level === 1 ? styles.headingPrimary : { color: accent }]}
          >
            {renderInline(block.segments)}
          </Text>
        );

      case 'paragraph':
        return (
          <Text key={key} style={[bodyStyle, { color: bodyColor }]}>
            {renderInline(block.segments)}
          </Text>
        );

      case 'bullet':
        return (
          <View key={key} style={[styles.listRow, { marginLeft: block.indent * INDENT_STEP }]}>
            <Text style={[styles.bulletDot, { color: accent }]}>•</Text>
            <Text style={[bodyStyle, styles.listText, { color: bodyColor }]}>
              {renderInline(block.segments)}
            </Text>
          </View>
        );

      case 'numbered':
        return (
          <View key={key} style={[styles.listRow, { marginLeft: block.indent * INDENT_STEP }]}>
            <View style={[styles.numberBadge, { backgroundColor: accent }]}>
              <Text style={styles.numberBadgeText}>{block.number}</Text>
            </View>
            <Text style={[bodyStyle, styles.listText, { color: bodyColor }]}>
              {renderInline(block.segments)}
            </Text>
          </View>
        );

      case 'quote':
        return (
          <View key={key} style={styles.callout}>
            <Ionicons name="bulb-outline" size={16} color={theme.warningText} />
            <Text style={[bodyStyle, styles.listText, styles.calloutText]}>
              {renderInline(block.segments)}
            </Text>
          </View>
        );

      case 'code':
        return (
          <View key={key} style={styles.codeBlock}>
            <Text style={styles.codeBlockText}>{block.text}</Text>
          </View>
        );

      case 'divider':
        return <View key={key} style={styles.divider} />;

      case 'table':
        return (
          <ScrollView
            key={key}
            horizontal
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
            style={styles.tableScroll}
          >
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeaderRow]}>
                {block.headers.map((header, cellIndex) => (
                  <View
                    key={`th-${cellIndex}`}
                    style={[styles.tableCell, cellIndex > 0 && styles.tableCellDivider]}
                  >
                    <Text
                      style={[
                        styles.tableText,
                        styles.tableHeaderText,
                        { textAlign: block.aligns[cellIndex] ?? 'left' },
                      ]}
                    >
                      {renderInline(header)}
                    </Text>
                  </View>
                ))}
              </View>
              {block.rows.map((row, rowIndex) => (
                <View key={`tr-${rowIndex}`} style={[styles.tableRow, styles.tableBodyRow]}>
                  {row.map((cell, cellIndex) => (
                    <View
                      key={`td-${rowIndex}-${cellIndex}`}
                      style={[styles.tableCell, cellIndex > 0 && styles.tableCellDivider]}
                    >
                      <Text
                        style={[
                          styles.tableText,
                          { color: bodyColor, textAlign: block.aligns[cellIndex] ?? 'left' },
                        ]}
                      >
                        {renderInline(cell)}
                      </Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>
        );
    }
  };

  return <View style={styles.container}>{blocks.map(renderBlock)}</View>;
};

const MONOSPACE = Platform.select({ ios: 'Menlo', default: 'monospace' });

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { gap: spacing.xs + 2 },
    body: { fontSize: fontSize.body, lineHeight: 21, color: theme.text },
    bodyCompact: { fontSize: fontSize.caption, lineHeight: 17, color: theme.textSecondary },
    bold: { fontWeight: fontWeight.bold },
    italic: { fontStyle: 'italic' },
    inlineCode: {
      fontFamily: MONOSPACE,
      backgroundColor: theme.cardSubtle,
      color: theme.primaryDark,
    },
    heading: { fontWeight: fontWeight.extrabold, marginTop: spacing.xs },
    headingPrimary: { fontSize: fontSize.bodyLarge, color: theme.text },
    listRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
    listText: { flex: 1 },
    bulletDot: { fontSize: fontSize.bodyLarge, fontWeight: fontWeight.bold, lineHeight: 21 },
    numberBadge: {
      width: 20,
      height: 20,
      borderRadius: borderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 1,
    },
    numberBadgeText: { fontSize: fontSize.tiny, fontWeight: fontWeight.bold, color: theme.inverseText },
    callout: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.sm,
      padding: spacing.sm + 2,
      borderRadius: borderRadius.sm,
      borderLeftWidth: 4,
      borderLeftColor: theme.warning,
      backgroundColor: theme.warningBg,
    },
    calloutText: { color: theme.warningText, fontWeight: fontWeight.semibold },
    codeBlock: {
      padding: spacing.sm + 2,
      borderRadius: borderRadius.sm,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.cardSubtle,
    },
    codeBlockText: { fontFamily: MONOSPACE, fontSize: fontSize.caption, color: theme.text },
    divider: { height: 1, backgroundColor: theme.divider, marginVertical: spacing.xs },
    tableScroll: { marginVertical: spacing.xs },
    table: {
      borderRadius: borderRadius.sm,
      borderWidth: 1,
      borderColor: theme.border,
      overflow: 'hidden',
    },
    tableRow: { flexDirection: 'row' },
    tableHeaderRow: {
      backgroundColor: theme.cardSubtle,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    tableBodyRow: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.border },
    tableCell: {
      minWidth: 88,
      maxWidth: 220,
      paddingVertical: spacing.sm - 1,
      paddingHorizontal: spacing.sm + 2,
      justifyContent: 'center',
    },
    tableCellDivider: { borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: theme.border },
    tableText: { fontSize: fontSize.caption, lineHeight: 16 },
    tableHeaderText: { fontWeight: fontWeight.bold, color: theme.text },
  });
