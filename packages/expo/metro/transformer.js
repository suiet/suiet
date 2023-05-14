const { transform } = require('metro-transform-worker');
const { build } = require('esbuild');
const path = require('path');

module.exports = {
  /**
   * Standard Metro transformer.
   * @param {import("metro-transform-worker").JsTransformerConfig} config
   * @param {string} projectRoot
   * @param {string} filename
   * @param {Buffer} data
   * @param {import("metro-transform-worker").JsTransformOptions} options
   * @returns {Promise<import("metro-transform-worker").TransformResponse>}
   */
  async transform(config, projectRoot, filename, data, options) {
    if (filename.endsWith('.raw.js') | filename.endsWith('.raw.ts')) {
      return await transform(
        config,
        projectRoot,
        filename,
        Buffer.from(`export const code = ${JSON.stringify(data.toString())}`),
        options
      );
    }

    if (filename.endsWith('.esbuild.js') || filename.endsWith('.esbuild.ts')) {
      const res = await build({
        entryPoints: [filename],
        absWorkingDir: projectRoot,
        bundle: true,
        write: false,
        format: 'iife',
        target: 'esnext',
        minify: false,
        sourcemap: 'inline',
        metafile: true,
        define: {
          __REACT_NATIVE__: 'true',
        },
      });

      const {
        outputFiles: [bundle],
      } = res;

      const response = await transform(
        config,
        projectRoot,
        filename,
        Buffer.from(`export const code = ${JSON.stringify(bundle.text)}`),
        options
      );

      return response;
    }

    return await transform(config, projectRoot, filename, data, options);
  },
};
