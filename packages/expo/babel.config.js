module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@components': './src/components',
            '@styles': './src/styles',
            '@assets': './assets',
            '@': './src',
          },
        },
      ],
      'react-native-reanimated/plugin',
      [
        '@babel/plugin-syntax-import-attributes',
        {
          deprecatedAssertSyntax: true,
        },
      ],
    ],
  };
};
