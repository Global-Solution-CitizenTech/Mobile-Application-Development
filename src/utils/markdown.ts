import type {
  MarkdownBlock,
  MarkdownInlineSegment,
  MarkdownInlineStyleFlags,
  MarkdownTableAlign,
} from '@/types/markdown';

const INLINE_PATTERN = /\*\*(.+?)\*\*|`([^`]+)`|\*([^*\s](?:[^*]*[^*\s])?)\*/g;
const LINK_PATTERN = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;
const FENCE_PATTERN = /^```/;
const DIVIDER_PATTERN = /^(?:-{3,}|\*{3,}|_{3,})$/;
const HEADING_PATTERN = /^(#{1,6})\s+(.*)$/;
const QUOTE_PATTERN = /^>\s?(.*)$/;
const NUMBERED_PATTERN = /^(\s*)(\d+)[.)]\s+(.*)$/;
const BULLET_PATTERN = /^(\s*)[-*•+]\s+(.*)$/;
const TABLE_DELIMITER_PATTERN = /^\|?\s*:?-+:?\s*(?:\|\s*:?-+:?\s*)*\|?$/;

const MAX_INDENT = 3;

function parseInline(text: string, flags: MarkdownInlineStyleFlags): MarkdownInlineSegment[] {
  const segments: MarkdownInlineSegment[] = [];
  let cursor = 0;

  const pushPlain = (value: string) => {
    if (value) segments.push({ text: value, bold: flags.bold, italic: flags.italic, code: false });
  };

  for (const match of text.matchAll(INLINE_PATTERN)) {
    const start = match.index ?? 0;
    pushPlain(text.slice(cursor, start));

    const [, boldInner, codeInner, italicInner] = match;
    if (boldInner !== undefined) {
      segments.push(...parseInline(boldInner, { ...flags, bold: true }));
    } else if (codeInner !== undefined) {
      segments.push({ text: codeInner, bold: flags.bold, italic: flags.italic, code: true });
    } else if (italicInner !== undefined) {
      segments.push(...parseInline(italicInner, { ...flags, italic: true }));
    }

    cursor = start + match[0].length;
  }

  pushPlain(text.slice(cursor));
  return segments;
}

export function parseInlineMarkdown(text: string): MarkdownInlineSegment[] {
  const withLinks = text.replace(LINK_PATTERN, '$1 ($2)');
  return parseInline(withLinks, { bold: false, italic: false });
}

export function stripInlineMarkdown(text: string): string {
  return parseInlineMarkdown(text)
    .map((segment) => segment.text)
    .join('');
}

function splitTableRow(line: string): string[] {
  let row = line.trim();
  if (row.startsWith('|')) row = row.slice(1);
  if (row.endsWith('|')) row = row.slice(0, -1);
  return row.split('|').map((cell) => cell.trim());
}

function isTableDelimiter(line: string): boolean {
  const trimmed = line.trim();
  return trimmed.includes('|') && TABLE_DELIMITER_PATTERN.test(trimmed);
}

function toAlign(cell: string): MarkdownTableAlign {
  const startsWithColon = cell.startsWith(':');
  const endsWithColon = cell.endsWith(':');
  if (startsWithColon && endsWithColon) return 'center';
  if (endsWithColon) return 'right';
  return 'left';
}

function normalizeRow(cells: string[], columns: number): string[] {
  return Array.from({ length: columns }, (_, index) => cells[index] ?? '');
}

function toIndent(whitespace: string): number {
  return Math.min(Math.floor(whitespace.replace(/\t/g, '  ').length / 2), MAX_INDENT);
}

export function parseMarkdownBlocks(markdown: string): MarkdownBlock[] {
  const lines = markdown.replace(/\r\n?/g, '\n').split('\n');
  const blocks: MarkdownBlock[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index] ?? '';
    const line = rawLine.trim();

    if (!line) continue;

    if (FENCE_PATTERN.test(line)) {
      const codeLines: string[] = [];
      index += 1;
      while (index < lines.length && !FENCE_PATTERN.test((lines[index] ?? '').trim())) {
        codeLines.push(lines[index] ?? '');
        index += 1;
      }
      blocks.push({ type: 'code', text: codeLines.join('\n') });
      continue;
    }

    if (DIVIDER_PATTERN.test(line)) {
      blocks.push({ type: 'divider' });
      continue;
    }

    if (line.includes('|') && isTableDelimiter(lines[index + 1] ?? '')) {
      const headerCells = splitTableRow(line);
      const columns = headerCells.length;
      const aligns = normalizeRow(splitTableRow(lines[index + 1] ?? ''), columns).map(toAlign);
      const rows: MarkdownInlineSegment[][][] = [];

      index += 2;
      while (index < lines.length && (lines[index] ?? '').trim().includes('|')) {
        const cells = normalizeRow(splitTableRow(lines[index] ?? ''), columns);
        rows.push(cells.map(parseInlineMarkdown));
        index += 1;
      }
      index -= 1;

      blocks.push({
        type: 'table',
        aligns,
        headers: headerCells.map(parseInlineMarkdown),
        rows,
      });
      continue;
    }

    const headingMatch = HEADING_PATTERN.exec(line);
    if (headingMatch) {
      const segments = parseInlineMarkdown((headingMatch[2] ?? '').trim());
      if (segments.length > 0) {
        blocks.push({ type: 'heading', level: (headingMatch[1] ?? '#').length, segments });
      }
      continue;
    }

    const quoteMatch = QUOTE_PATTERN.exec(line);
    if (quoteMatch) {
      blocks.push({ type: 'quote', segments: parseInlineMarkdown((quoteMatch[1] ?? '').trim()) });
      continue;
    }

    const numberedMatch = NUMBERED_PATTERN.exec(rawLine);
    if (numberedMatch) {
      blocks.push({
        type: 'numbered',
        indent: toIndent(numberedMatch[1] ?? ''),
        number: numberedMatch[2] ?? '',
        segments: parseInlineMarkdown((numberedMatch[3] ?? '').trim()),
      });
      continue;
    }

    const bulletMatch = BULLET_PATTERN.exec(rawLine);
    if (bulletMatch) {
      blocks.push({
        type: 'bullet',
        indent: toIndent(bulletMatch[1] ?? ''),
        segments: parseInlineMarkdown((bulletMatch[2] ?? '').trim()),
      });
      continue;
    }

    blocks.push({ type: 'paragraph', segments: parseInlineMarkdown(line) });
  }

  return blocks;
}
