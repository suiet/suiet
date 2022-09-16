import { filter, fromEventPattern, share, take, takeWhile } from 'rxjs';

const windowRemovedObservable = fromEventPattern<number>(
  (handler) => chrome.windows.onRemoved.addListener(handler),
  (handler) => chrome.windows.onRemoved.removeListener(handler)
).pipe(share());

export class PopupWindow {
  private id: number | null = null;
  private readonly url: string;

  constructor(url: string) {
    this.url = url;
  }

  public async show() {
    const {
      width = 0,
      left = 0,
      top = 0,
    } = await chrome.windows.getLastFocused();
    const w = await chrome.windows.create({
      url: this.url,
      focused: true,
      width: 360,
      height: 595,
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

  public async close() {
    if (this.id !== null) {
      await chrome.windows.remove(this.id);
    }
  }
}
