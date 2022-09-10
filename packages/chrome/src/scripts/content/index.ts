import { PortName, WindowMsgTarget } from '../shared';
import { has } from 'lodash-es';

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

function isDappConnectRequest(event: MessageEvent<any>) {
  return (
    isMsgFromSuietContext(event) &&
    has(event.data, 'payload') &&
    event.data.payload.funcName === 'connect'
  );
}
function isDappDisconnectRequest(event: MessageEvent<any>) {
  return (
    isMsgFromSuietContext(event) &&
    has(event.data, 'payload') &&
    event.data.payload.funcName === 'disconnect'
  );
}
function isIgnoreMsg(event: MessageEvent<any>) {
  return isDappConnectRequest(event) || isDappDisconnectRequest(event);
}

function setupMessageProxy(): chrome.runtime.Port {
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
    if (isMsgFromSuietContext(event) && !isIgnoreMsg(event)) {
      console.log('port postMessage', event.data.payload);
      port.postMessage(event.data.payload);
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
  window.addEventListener('message', (event) => {
    if (port === null && isDappConnectRequest(event)) {
      console.log('setup message proxy');
      port = setupMessageProxy();
    }
    if (port !== null && isDappDisconnectRequest(event)) {
      console.log('close message proxy');
      port.disconnect();
    }
  });
})();
