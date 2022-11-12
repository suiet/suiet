const mkdirp = require('mkdirp');
const { ncp } = require('ncp');

mkdirp.sync('./node_modules/@react-native-community');

ncp('../../node_modules/@react-native-community', './node_modules/@react-native-community', console.error);

ncp('../../node_modules/react-native-codegen', './node_modules/react-native-codegen', console.error);

ncp('../../node_modules/react-native-gradle-plugin', './node_modules/react-native-gradle-plugin', console.error);
