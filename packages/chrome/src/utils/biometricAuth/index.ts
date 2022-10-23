import { bufferEncode } from './buffer';
import decodeAttestationObject from './decodeAttestationObject';
import parseAuthData from './parseAuthData';

export function extractInfoFromCredential(credential: any) {
  const attestationObject = credential.response.attestationObject;
  const rawId = credential.rawId;
  const decodedAttestationObject = decodeAttestationObject(
    Buffer.from(attestationObject)
  );
  const authData = parseAuthData(decodedAttestationObject.authData);
  const publicKeyBase64 = authData.credentialPublicKey;

  return {
    credentialIdBase64: bufferEncode(rawId),
    publicKeyBase64,
  };
}
