import { PortName } from '../shared';

chrome.runtime.onInstalled.addListener((): void => {
  // eslint-disable-next-line no-console
  console.log('Extension installed');
});

function createPopupWindow(url: string) {
  chrome.windows.create({
    url,
    type: 'popup',
    focused: true,
    width: 362,
    height: 573 + 30, // height including title bar, so should add 30px more
  });
}

(function () {
  console.log('hello from background.js');

  chrome.runtime.onConnect.addListener(function (port) {
    if (port.name !== PortName.SUIET_CONTENT_BACKGROUND) return;
    port.onMessage.addListener(function (msg) {
      if (msg.joke === 'Knock knock') {
        console.log('service worker received: ', msg.joke);
        port.postMessage({ question: "Who's there?" });
        console.log('service worker ask: ', "Who's there?");

        createPopupWindow(chrome.runtime.getURL('index.html'));
      }
    });
  });
})();

export {};
