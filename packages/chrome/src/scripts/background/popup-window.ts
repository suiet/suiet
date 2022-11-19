import { filter, fromEventPattern, share, take, takeWhile } from 'rxjs';
import { detectBrowser, BrowserDetector } from '../../utils/check';

const windowRemovedObservable = fromEventPattern<number>(
  (handler) => chrome.windows.onRemoved.addListener(handler),
  (handler) => chrome.windows.onRemoved.removeListener(handler)
).pipe(share());

export class PopupWindow {
  private id: number | null = null;
  private readonly url: string;
  browser: BrowserDetector;

  constructor(url: string) {
    this.url = url;
    this.browser = detectBrowser();
  }

  public async show() {
    const {
      width = 0,
      left = 0,
      top = 0,
    } = await chrome.windows.getLastFocused();

    const w = await chrome.windows.create({
      ...this.getWindowMetrics(),
      url: this.url,
      focused: true,
      type: 'popup',
      top: top,
      left: Math.floor(left + width - 450),
    });
    this.id = typeof w.id === 'undefined' ? null : w.id;
    return windowRemovedObservable.pipe(
      takeWhile(() => this.id !== null), // completes as soon as this predicate is not satisfied
      filter((winId) => winId === this.id),
      take(1)
    );
  }

  private getWindowMetrics() {
    if (this.browser.isWindows()) {
      return {
        width: 382,
        height: 614,
      };
    }
    if (this.browser.isLinux()) {
      return {
        width: 364,
        height: 574,
      };
    }
    return {
      width: 364,
      height: 602,
    };
  }

  public async close() {
    if (this.id !== null) {
      await chrome.windows.remove(this.id);
    }
  }
}
