/** Takes a normalized move type and returns the address information contained within it */
import { SuiMoveNormalizedType } from '@mysten/sui.js';

export interface TypeReference {
  address: string;
  module: string;
  name: string;
  type_arguments: SuiMoveNormalizedType[];
}

export function unwrapTypeReference(
  type: SuiMoveNormalizedType
): null | TypeReference {
  if (typeof type !== 'object') return null;

  if ('Struct' in type) {
    return type.Struct;
  }
  if ('Reference' in type) {
    return unwrapTypeReference(type.Reference);
  }
  if ('MutableReference' in type) {
    return unwrapTypeReference(type.MutableReference);
  }
  if ('Vector' in type) {
    return unwrapTypeReference(type.Vector);
  }
  return null;
}
