export function isBrowser() {
  return typeof window !== 'undefined';
}

export const platform = {
  isBrowser: isBrowser()
}