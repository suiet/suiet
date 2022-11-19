import { detect, BrowserInfo } from 'detect-browser';

export function isNonEmptyArray(value: any): boolean {
  return Array.isArray(value) && value.length > 0;
}

export type BrowserDetector = BrowserInfo & {
  isWindows: () => boolean;
  isLinux: () => boolean;
};
export function detectBrowser(): BrowserDetector {
  const info = detect() as BrowserInfo;
  console.log('window info', info);
  return {
    ...info,
    isWindows() {
      return /windows/i.test(info.os ?? '');
    },
    isLinux() {
      return /linux/i.test(info?.os ?? '');
    },
  };
}
