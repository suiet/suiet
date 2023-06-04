export function has(obj: unknown, key: string) {
  return (
    typeof obj === 'object' && Object.prototype.hasOwnProperty.call(obj, key)
  );
}
export function isNonEmptyArray(value: any): value is any[] {
  return Array.isArray(value) && value.length > 0;
}

export * from './format';
export * from './coins';
export * from './asset-change';
export * from './nft';
