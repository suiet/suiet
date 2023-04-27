export function ipfsToHttp(s: string) {
  return s.replace(/^ipfs:\/\//, 'https://ipfs.io/ipfs/');
}

export function nftImgUrl(uri: string | undefined) {
  if (!uri) return undefined;
  if (String(uri).startsWith('ipfs')) return ipfsToHttp(uri);
  return uri;
}
