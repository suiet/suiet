export function has(obj: Object, key: string) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
export function isNonEmptyArray(value: any): value is any[] {
  return Array.isArray(value) && value.length > 0;
}

export * from './format';
export * from './coins';
