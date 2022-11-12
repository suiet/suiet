/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const path = require('path');
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../../');

module.exports = {
  projectRoot,
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  watchFolders: [workspaceRoot],
  resolver: {
    nodeModulesPaths: [path.resolve(projectRoot, './node_modules'), path.resolve(workspaceRoot, './node_modules')],
    extraNodeModules: {
      events: require.resolve('events/'),
      stream: require.resolve('readable-stream/'),
      crypto: require.resolve('react-native-crypto/'),
    },
    disableHierarchicalLookup: true,
  },
};
