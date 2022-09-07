import { defineConfig } from 'vite';
// @ts-ignore
import packageJson from './package.json';

// @ts-ignore
import manifest from './src/manifest';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/scripts/content/dapp-api.ts'),
      fileName: 'dapp-api',
      name: packageJson.name,
      formats: ['es'],
    },
    outDir: 'public',
    emptyOutDir: false,
    rollupOptions: {
      output: {
        extend: true,
      },
    },
  },
  plugins: [],
});
