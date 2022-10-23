export function bufferDecode(value: string) {
  return Uint8Array.from(atob(value), (c) => c.charCodeAt(0));
}

export function bufferEncode(value: ArrayBuffer) {
  // @ts-expect-error
  return btoa(String.fromCharCode.apply(null, new Uint8Array(value)));
  // .replace(/\+/g, '-')
  // .replace(/\//g, '_')
  // .replace(/=/g, '');
}
