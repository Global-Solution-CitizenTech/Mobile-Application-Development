export interface MarkdownInlineStyleFlags {
  bold: boolean;
  italic: boolean;
}

export interface MarkdownInlineSegment {
  text: string;
  bold: boolean;
  italic: boolean;
  code: boolean;
}

export type MarkdownTableAlign = 'left' | 'center' | 'right';

export type MarkdownBlock =
  | { type: 'heading'; level: number; segments: MarkdownInlineSegment[] }
  | { type: 'paragraph'; segments: MarkdownInlineSegment[] }
  | { type: 'bullet'; indent: number; segments: MarkdownInlineSegment[] }
  | { type: 'numbered'; indent: number; number: string; segments: MarkdownInlineSegment[] }
  | { type: 'quote'; segments: MarkdownInlineSegment[] }
  | { type: 'code'; text: string }
  | { type: 'divider' }
  | {
      type: 'table';
      aligns: MarkdownTableAlign[];
      headers: MarkdownInlineSegment[][];
      rows: MarkdownInlineSegment[][][];
    };
