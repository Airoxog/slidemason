import { defineCommand } from 'citty';
import { writeFile } from 'node:fs/promises';
import consola from 'consola';

export default defineCommand({
  meta: { name: 'export-pdf', description: 'Export deck to PDF' },
  args: {
    output: { type: 'string', description: 'Output PDF path', default: 'deck.pdf' },
    slug: { type: 'string', description: 'Deck slug', required: true },
    slides: { type: 'string', description: 'Number of slides', required: true },
  },
  async run({ args }) {
    const { exportPdf } = await import('@slidemason/export');
    consola.start('Exporting to PDF...');
    const buffer = await exportPdf({
      url: 'http://localhost:4200',
      slug: args.slug,
      slideCount: parseInt(args.slides, 10),
    });
    await writeFile(args.output, buffer);
    consola.success(`PDF exported to ${args.output}`);
  },
});
