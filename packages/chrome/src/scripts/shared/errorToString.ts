export default function errorToString(
  error: Record<string, any> | Error | null | undefined
) {
  if (error instanceof Error) {
    return error.message;
  }
  if (
    typeof error === 'object' &&
    typeof error?.code === 'number' &&
    typeof error?.msg === 'string'
  ) {
    return `${error.msg} (code: ${error.code})`;
  }
  if (error === null) return 'null';
  return 'unknown error';
}
