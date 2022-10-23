/**
 * Convert COSE public key alg to a human-friendly value
 *
 * See https://www.iana.org/assignments/cose/cose.xhtml#algorithms
 */
export default function coseAlgToString(alg: number): string {
  let name = algNameMap[alg];

  if (!name) {
    name = 'Unknown';
  }

  return `${name} (${alg})`;
}

/**
 * Pulled from https://www.iana.org/assignments/cose/cose.xhtml#algorithms
 */
const algNameMap: { [key: string]: string } = {
  '-65535': 'RS1',
  '-259': 'RS512',
  '-258': 'RS384',
  '-257': 'RS256',
  '-47': 'ES256K',
  '-46': 'HSS-LMS',
  '-45':
    'SHAKE256 (TEMPORARY - registered 2019-08-13, extension registered 2020-06-19, expires 2021-08-13)',
  '-44':
    'SHA-512 (TEMPORARY - registered 2019-08-13, extension registered 2020-06-19, expires 2021-08-13)',
  '-43':
    'SHA-384 (TEMPORARY - registered 2019-08-13, extension registered 2020-06-19, expires 2021-08-13)',
  '-42': 'RSAES-OAEP w/ SHA-512',
  '-41': 'RSAES-OAEP w/ SHA-256',
  '-40': 'RSAES-OAEP w/ RFC 8017 default parameters',
  '-39': 'PS512',
  '-38': 'PS384',
  '-37': 'PS256',
  '-36': 'ES512',
  '-35': 'ES384',
  '-34': 'ECDH-SS + A256KW',
  '-33': 'ECDH-SS + A192KW',
  '-32': 'ECDH-SS + A128KW',
  '-31': 'ECDH-ES + A256KW',
  '-30': 'ECDH-ES + A192KW',
  '-29': 'ECDH-ES + A128KW',
  '-28': 'ECDH-SS + HKDF-512',
  '-27': 'ECDH-SS + HKDF-256',
  '-26': 'ECDH-ES + HKDF-512',
  '-25': 'ECDH-ES + HKDF-256',
  '-18':
    'SHAKE128 (TEMPORARY - registered 2019-08-13, extension registered 2020-06-19, expires 2021-08-13)',
  '-17':
    'SHA-512/256 (TEMPORARY - registered 2019-08-13, extension registered 2020-06-19, expires 2021-08-13)',
  '-16':
    'SHA-256 (TEMPORARY - registered 2019-08-13, extension registered 2020-06-19, expires 2021-08-13)',
  '-15':
    'SHA-256/64 (TEMPORARY - registered 2019-08-13, extension registered 2020-06-19, expires 2021-08-13)',
  '-14':
    'SHA-1 (TEMPORARY - registered 2019-08-13, extension registered 2020-06-19, expires 2021-08-13)',
  '-13': 'direct+HKDF-AES-256',
  '-12': 'direct+HKDF-AES-128',
  '-11': 'direct+HKDF-SHA-512',
  '-10': 'direct+HKDF-SHA-256',
  '-8': 'EdDSA',
  '-7': 'ES256',
  '-6': 'direct',
  '-5': 'A256KW',
  '-4': 'A192KW',
  '-3': 'A128KW',
  '0': 'Reserved',
  '1': 'A128GCM',
  '2': 'A192GCM',
  '3': 'A256GCM',
  '4': 'HMAC 256/64',
  '5': 'HMAC 256/256',
  '6': 'HMAC 384/384',
  '7': 'HMAC 512/512',
  '10': 'AES-CCM-16-64-128',
  '11': 'AES-CCM-16-64-256',
  '12': 'AES-CCM-64-64-128',
  '13': 'AES-CCM-64-64-256',
  '14': 'AES-MAC 128/64',
  '15': 'AES-MAC 256/64',
  '24': 'ChaCha20/Poly1305',
  '25': 'AES-MAC 128/128',
  '26': 'AES-MAC 256/128',
  '30': 'AES-CCM-16-128-128',
  '31': 'AES-CCM-16-128-256',
  '32': 'AES-CCM-64-128-128',
  '33': 'AES-CCM-64-128-256',
};
