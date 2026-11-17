import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { parseInlineMarkdown, parseMarkdownBlocks, stripInlineMarkdown } from '../src/utils/markdown.ts';

describe('markdown parser', () => {
  it('parses inline bold, italic, code, and links cleanly', () => {
    const segments = parseInlineMarkdown('Use **negrito**, *itálico*, `codigo` e [Site](https://fiap.com.br).');
    assert.deepEqual(
      segments.map((s) => ({ text: s.text, bold: s.bold, italic: s.italic, code: s.code })),
      [
        { text: 'Use ', bold: false, italic: false, code: false },
        { text: 'negrito', bold: true, italic: false, code: false },
        { text: ', ', bold: false, italic: false, code: false },
        { text: 'itálico', bold: false, italic: true, code: false },
        { text: ', ', bold: false, italic: false, code: false },
        { text: 'codigo', bold: false, italic: false, code: true },
        { text: ' e Site (https://fiap.com.br).', bold: false, italic: false, code: false },
      ]
    );
    assert.equal(stripInlineMarkdown('**Resumo** do `protocolo`'), 'Resumo do protocolo');
  });

  it('parses headings, lists, blockquotes, dividers, and code fences', () => {
    const blocks = parseMarkdownBlocks(
      [
        '# Título Principal',
        '---',
        '> Dica importante **aqui**',
        '1. Primeiro passo',
        '  - Subitem',
        '```ts',
        'const x = 1;',
        '```',
      ].join('\n')
    );

    assert.equal(blocks.length, 6);
    assert.equal(blocks[0]?.type, 'heading');
    assert.equal(blocks[1]?.type, 'divider');
    assert.equal(blocks[2]?.type, 'quote');
    assert.equal(blocks[3]?.type, 'numbered');
    assert.equal(blocks[4]?.type, 'bullet');
    assert.deepEqual(blocks[5], { type: 'code', text: 'const x = 1;' });
  });

  it('parses markdown tables with column alignments', () => {
    const blocks = parseMarkdownBlocks(
      ['| Órgão | Prazo | Status |', '| :--- | :---: | ---: |', '| CET | 48h | **Ativo** |'].join('\n')
    );

    assert.equal(blocks.length, 1);
    const table = blocks[0];
    assert.equal(table?.type, 'table');
    if (table?.type === 'table') {
      assert.deepEqual(table.aligns, ['left', 'center', 'right']);
      assert.equal(table.headers.length, 3);
      assert.equal(table.rows.length, 1);
      assert.equal(table.rows[0]?.[2]?.[0]?.bold, true);
    }
  });
});
