if (typeof crypto === 'undefined') {
  const { polyfillWebCrypto } = require('expo-standard-web-crypto');
  polyfillWebCrypto();
}

if (typeof __dirname === 'undefined') global.__dirname = '/';
if (typeof __filename === 'undefined') global.__filename = '';
// if (typeof process === 'undefined') {
//   global.process = require('process');
// } else {
//   const bProcess = require('process');
//   for (const p in bProcess) {
//     if (!(p in process)) {
//       process[p] = bProcess[p];
//     }
//   }
// }

// TextEncoder and TextDecoder polyfill for starcoin
if (typeof TextDecoder === 'undefined') {
  global.TextDecoder = require('text-encoding').TextDecoder;
}
if (typeof TextEncoder === 'undefined') {
  global.TextEncoder = require('text-encoding').TextEncoder;
}

global.Buffer = require('buffer').Buffer;
