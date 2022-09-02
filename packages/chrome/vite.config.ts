import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import {crx} from "@crxjs/vite-plugin";
import manifest from "./manifest.json";
import viteSvgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
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
    'process.env': {}
  },
  plugins: [
    react(),
    crx({manifest}),
    viteSvgr(),
  ],
});
