import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';
import { studioApiPlugin } from './vite-plugin-studio-api';

const MONO_ROOT = resolve(__dirname, '../..');

/**
 * Ensures imports resolve correctly from files outside the studio app root
 * (e.g. decks/<slug>/slides.tsx). Uses Vite's own resolution but pretends
 * the import came from within the studio app so pnpm can find packages.
 */
function monorepoResolvePlugin(): Plugin {
  const studioSrc = resolve(__dirname, 'src');
  const studioEntry = resolve(studioSrc, 'main.tsx');

  // Packages that deck files might import
  const redirectPkgs = new Set([
    'react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime',
    'framer-motion', 'lucide-react',
  ]);

  return {
    name: 'slidemason-monorepo-resolve',
    handleHotUpdate({ file, server, modules }) {
      // When a deck's slides.tsx changes, invalidate the module and
      // notify the client via a custom HMR event. The client does a
      // dynamic re-import with a cache-busting timestamp — no full
      // page reload needed.
      if (file.includes('/decks/') && file.endsWith('/slides.tsx')) {
        const match = file.match(/\/decks\/([^/]+)\/slides\.tsx$/);
        const slug = match?.[1];

        for (const mod of modules) {
          server.moduleGraph.invalidateModule(mod);
        }

        if (slug) {
          server.ws.send({
            type: 'custom',
            event: 'slidemason:slides-updated',
            data: { slug, moduleUrl: modules[0]?.url, t: Date.now() },
          });
        }
        return []; // prevent default HMR cascade
      }
    },
    async resolveId(source, importer, options) {
      // Only intercept imports from files outside the studio app
      if (!importer || importer.startsWith(studioSrc)) return null;

      // Workspace package — point directly to source
      if (source === '@slidemason/renderer') {
        return resolve(MONO_ROOT, 'packages/renderer/src/index.ts');
      }

      if (source === '@slidemason/primitives') {
        return resolve(MONO_ROOT, 'packages/primitives/src/index.ts');
      }

      // Re-resolve through the studio app so pnpm's strict isolation is satisfied
      if (redirectPkgs.has(source)) {
        const resolved = await this.resolve(source, studioEntry, {
          ...options,
          skipSelf: true,
        });
        if (!resolved) return null;
        return resolved;
      }

      return null;
    },
  };
}

export default defineConfig({
  plugins: [
    monorepoResolvePlugin(),
    { enforce: 'pre', ...mdx({ providerImportSource: '@mdx-js/react' }) },
    react(),
    tailwindcss(),
    studioApiPlugin(),
  ],
  server: {
    port: 4200,
  },
  ssr: {
    external: ['react', 'react-dom', 'framer-motion', 'lucide-react', 'recharts'],
  },
  define: {
    __MONO_ROOT__: JSON.stringify(MONO_ROOT),
  },
  resolve: {
    conditions: ['source'],
    alias: {
      '@generated': resolve(MONO_ROOT, 'generated'),
    },
  },
});
