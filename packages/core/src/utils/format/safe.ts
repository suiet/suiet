export default function safe<T = any>(
  value: unknown,
  fallback?: T,
  opts?: {
    allowNull?: boolean;
  }
): T {
  if (value === undefined) {
    return fallback as T;
  }
  if (value === null) {
    if (opts?.allowNull) {
      return null as T;
    }
    return fallback as T;
  }
  return value as T;
}
