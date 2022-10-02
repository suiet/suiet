import { PortName, WindowMsg, WindowMsgTarget } from '../shared';
import { has } from 'lodash-es';
import { WindowMsgStream } from '../shared/msg-passing/window-msg-stream';
import { getSiteMetadata, SiteMetadata } from './utils';

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

function setupMessageProxy(siteMetadata: SiteMetadata): {
  port: chrome.runtime.Port;
  clearWindowMsgListener: () => void;
} {
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
    if (isMsgFromSuietContext(event) && !isIgnoreMsg(event)) {
      // console.log('[content] received event.data', event.data);
      const { payload: trueData } = event.data;
      const message = {
        id: trueData.id,
        funcName: trueData.funcName,
        payload: {
          params: trueData.payload,
          context: {
            origin: event.origin,
            name: siteMetadata.name,
            favicon: siteMetadata.icon,
          },
        },
      };
      // console.log('[content] actually postMessage', message);
      port.postMessage(JSON.stringify(message));
    }
  };

  window.addEventListener('message', passMessageToPort);
  return {
    port,
    clearWindowMsgListener: () => {
      window.removeEventListener('message', passMessageToPort);
    },
  };
}

(function main() {
  injectDappInterface();

  const windowMsgStream = new WindowMsgStream(
    WindowMsgTarget.SUIET_CONTENT,
    WindowMsgTarget.DAPP
  );
  let port: chrome.runtime.Port | null = null;
  let clearWindowMsgListener: (() => void) | null = null;

  windowMsgStream.subscribe(async (windowMsg) => {
    if (isDappHandShakeRequest(windowMsg)) {
      if (port === null) {
        const siteMetadata = await getSiteMetadata();
        const result = setupMessageProxy(siteMetadata);
        port = result.port;
        clearWindowMsgListener = result.clearWindowMsgListener;
        // console.log('[content] handshake: setup message proxy');
      }
      // respond to handshake request
      await windowMsgStream.post({
        id: windowMsg.payload.id,
        error: null,
        data: null,
      });
    }
    if (isDappHandWaveRequest(windowMsg)) {
      if (port !== null) {
        // console.log('[content] handwave: clear message proxy');
        port.disconnect();
        port = null;
        if (clearWindowMsgListener) {
          clearWindowMsgListener();
          clearWindowMsgListener = null;
        }
      }
      // respond to handwave request
      await windowMsgStream.post({
        id: windowMsg.payload.id,
        error: null,
        data: null,
      });
    }
  });
})();
