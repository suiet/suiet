/**
 * convert serialized object to uint8array (because of Chrome Port passing)
 * e.g. {0: 72, 1: 101, 2: 108, 3: 108} -> Uint8Array(4) [72,101,108,108]
 * @param bufferObj
 */
export function objectToUint8Array(bufferObj: Record<string, any>) {
  return Uint8Array.from(Object.values(bufferObj));
}

/**
 * convert number array to uint8array
 * e.g. [72, 101, 108, 108] -> Uint8Array(4) [72,101,108,108]
 * @param bufferArray
 */
export function arrayToUint8array(bufferArray: number[]) {
  return Uint8Array.from(bufferArray);
}

/**
 * convert uint8array to number array
 * e.g. Uint8Array(4) [72,101,108,108] -> [72, 101, 108, 108]
 * @param uArray
 */
export function uint8arrayToArray(uArray: Uint8Array) {
  return Array.from(uArray);
}
