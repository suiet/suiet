export function isBrowser() {
  return typeof window !== 'undefined';
}

export function isExtBackgroundServiceWork() {
  return !isBrowser() && typeof chrome !== 'undefined';
}

export const platform = {
  isBrowser: isBrowser(),
  isisExtBackgroundServiceWork: isExtBackgroundServiceWork(),
};
