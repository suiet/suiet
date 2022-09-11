export class DappBgApi {
  public async connect(perms: string[]): Promise<null> {
    console.log('DappBgApi params', perms);
    this.createPopupWindow(chrome.runtime.getURL('index.html'));
    return null;
  }

  createPopupWindow(url: string) {
    chrome.windows.create({
      url,
      type: 'popup',
      focused: true,
      width: 362,
      height: 573 + 30, // height including title bar, so should add 30px more
    });
  }
}
