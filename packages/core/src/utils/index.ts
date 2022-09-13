export function has(obj: Object, key: string) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
export function isNonEmptyArray(value: any): boolean {
  return Array.isArray(value) && value.length > 0;
}
