import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
// @ts-ignore
import manifest from './src/manifest';
import viteSvgr from 'vite-plugin-svgr';
import { Buffer } from 'buffer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  esbuild: {
    pure: mode === 'production' ? ['console.log', 'debugger'] : [],
  },
  build: {
    commonjsOptions: {
      // vite build use @rollup/plugin-commonjs as default, which transforms all the cjs files
      // However Sui Sdk mixed using esm & cjs，therefore should turn on transformMixedEsModules.
      // https://github.com/originjs/vite-plugins/issues/9#issuecomment-924668456
      transformMixedEsModules: true,
    },
  },
  define: {
    // handle "process is not defined" for importing sui sdk
    // https://github.com/vitejs/vite/issues/1973#issuecomment-787571499
    'process.env': {},
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  plugins: [react(), crx({ manifest }), viteSvgr()],
}));
