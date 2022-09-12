import { PortName, resData, WindowMsg, WindowMsgTarget } from '../shared';
import { has } from 'lodash-es';
import { WindowMsgStream } from '../shared/msg-passing/window-msg-stream';

function injectDappInterface() {
  const script = document.createElement('script');
  const url = chrome.runtime.getURL('dapp-api.js');
  script.setAttribute('src', url);
  script.setAttribute('type', 'module');
  const container = document.head || document.documentElement;
  container.insertBefore(script, container.firstElementChild);
}

function isMsgFromSuietContext(event: MessageEvent<any>) {
  return (
    event.source === window &&
    event.data?.target === WindowMsgTarget.SUIET_CONTENT
  );
}

function isDappHandShakeRequest(msg: WindowMsg) {
  return has(msg, 'payload') && msg.payload.funcName === 'handshake';
}
function isDappHandWaveRequest(msg: WindowMsg) {
  return has(msg, 'payload') && msg.payload.funcName === 'handwave';
}
function isIgnoreMsg(event: MessageEvent<any>) {
  return (
    isDappHandShakeRequest(event.data) || isDappHandWaveRequest(event.data)
  );
}

function setupMessageProxy(): chrome.runtime.Port {
  const port = chrome.runtime.connect({
    name: PortName.SUIET_CONTENT_BACKGROUND,
  });

  // port msg from background - content script proxy -> window msg to dapp
  port.onMessage.addListener((msg) => {
    window.postMessage({
      target: WindowMsgTarget.DAPP,
      payload: JSON.parse(msg),
    });
  });

  // window msg from dapp - content script proxy -> port msg to ext background
  const passMessageToPort = (event: MessageEvent) => {
    console.log('[content] ready to postMessage', event.data.payload);
    if (isMsgFromSuietContext(event) && !isIgnoreMsg(event)) {
      console.log('[content] actually postMessage', event.data.payload);
      port.postMessage(JSON.stringify(event.data.payload));
    }
  };

  window.addEventListener('message', passMessageToPort);
  port.onDisconnect.addListener((port) => {
    if (port.name !== PortName.SUIET_CONTENT_BACKGROUND) return;
    window.removeEventListener('message', passMessageToPort);
  });
  return port;
}

(function main() {
  injectDappInterface();

  let port: chrome.runtime.Port | null = null;
  const windowMsgStream = new WindowMsgStream(
    WindowMsgTarget.SUIET_CONTENT,
    WindowMsgTarget.DAPP
  );

  windowMsgStream.subscribe(async (windowMsg) => {
    if (port === null && isDappHandShakeRequest(windowMsg)) {
      console.log('[content] handshake: setup message proxy');
      port = setupMessageProxy();
      await windowMsgStream.post({
        id: windowMsg.payload.id,
        error: null,
        data: null,
      });
    }
    if (port !== null && isDappHandWaveRequest(windowMsg)) {
      console.log('[content] handwave: close message proxy');
      port.disconnect();
      await windowMsgStream.post({
        id: windowMsg.payload.id,
        error: null,
        data: null,
      });
    }
  });
})();
