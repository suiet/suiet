export default function ellipsis(value: unknown): string {
  if (typeof value !== 'string') return String(value);
  if (value.length <= 8) return value;
  return value.slice(0, 6) + '...' + value.slice(-4, value.length);
}
