/**
 * Convert a COSE public key's key type and convert it to a human value
 *
 * See https://www.iana.org/assignments/cose/cose.xhtml#key-type
 */
export default function coseKeyTypeToString(kty: number): string {
  let keyType = `Unknown`;

  if (kty === 1) {
    keyType = 'OKP';
  } else if (kty === 2) {
    keyType = 'EC2';
  } else if (kty === 3) {
    keyType = 'RSA';
  } else if (kty === 4) {
    keyType = 'Symmetric';
  } else if (kty === 5) {
    keyType = 'HSS-LMS';
  }

  return `${keyType} (${kty})`;
}
