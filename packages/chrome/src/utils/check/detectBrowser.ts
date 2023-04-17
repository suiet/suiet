import { BrowserInfo, detect } from 'detect-browser';

export type BrowserDetector = BrowserInfo & {
  isWindows: () => boolean;
  isLinux: () => boolean;
};
export default function detectBrowser(): BrowserDetector {
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
