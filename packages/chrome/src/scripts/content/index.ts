import { PortName, WindowMsgTarget } from '../shared';

function injectDappInterface() {
  const script = document.createElement('script');
  const url = chrome.runtime.getURL('dapp-api.js');
  script.setAttribute('src', url);
  script.setAttribute('type', 'module');
  const container = document.head || document.documentElement;
  container.insertBefore(script, container.firstElementChild);
}

function setupMessageProxy() {
  const port = chrome.runtime.connect({
    name: PortName.SUIET_CONTENT_BACKGROUND,
  });

  // port msg from background - content script proxy -> window msg to dapp
  port.onMessage.addListener((msg) => {
    window.postMessage({
      target: WindowMsgTarget.DAPP,
      payload: msg,
    });
  });

  // window msg from dapp - content script proxy -> port msg to ext background
  const passMessageToPort = (event: MessageEvent) => {
    if (
      event.source === window &&
      event.data?.target === WindowMsgTarget.SUIET_CONTENT
    ) {
      port.postMessage(event.data.payload);
    }
  };
  window.addEventListener('message', passMessageToPort);
  port.onDisconnect.addListener((port) => {
    if (port.name !== PortName.SUIET_CONTENT_BACKGROUND) return;
    window.removeEventListener('message', passMessageToPort);
  });
}

injectDappInterface();
setupMessageProxy();
