import { PortName, WindowMsg, WindowMsgTarget } from '../shared';
import { has } from 'lodash-es';
import { WindowMsgStream } from '../shared/msg-passing/window-msg-stream';
import { getSiteMetadata, SiteMetadata } from './utils';
import { validateExternalWindowMsg } from './utils';

function injectDappInterface() {
  const script = document.createElement('script');
  const url = chrome.runtime.getURL('dapp-api.js');
  script.setAttribute('src', url);
  script.setAttribute('type', 'module');
  const container = document.head || document.documentElement;
  container.insertBefore(script, container.firstElementChild);
  container.removeChild(script);
}

function isMsgFromSuietContext(event: MessageEvent<any>) {
  // FIXME: validate event.origin from already handshaked list!!
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

function validateInputData(eventData: WindowMsg) {
  return true;
}

/**
 * Set up proxy between in-page window message and chrome ext port
 * @param siteMetadata
 */
function setupMessageProxy(siteMetadata: SiteMetadata): chrome.runtime.Port {
  const windowMsgStream = new WindowMsgStream(
    WindowMsgTarget.SUIET_CONTENT,
    WindowMsgTarget.DAPP,
    siteMetadata.origin
  );
  const port = chrome.runtime.connect({
    name: PortName.SUIET_CONTENT_BACKGROUND,
  });

  // port msg from background - content script proxy -> window msg to dapp
  port.onMessage.addListener((msg) => {
    // console.log('[content] before port sends data to window', msg);
    windowMsgStream.post(msg);
  });

  // window msg from dapp - content script proxy -> port msg to ext background
  const passMessageToPort = (eventData: WindowMsg) => {
    // console.log('[content] received data from window postMessage', eventData);

    try {
      validateExternalWindowMsg(eventData);
    } catch (e) {
      console.warn(
        `[${WindowMsgTarget.SUIET_CONTENT}] rejects an invalid request from window message`
      );
      return;
    }

    const { payload: trueData } = eventData;
    const message = {
      id: trueData.id,
      funcName: trueData.funcName,
      payload: {
        params: trueData.payload,
        context: {
          origin: siteMetadata.origin,
          name: siteMetadata.name,
          favicon: siteMetadata.icon,
        },
      },
    };
    // console.log('[content]  before port postMessage', message);
    port.postMessage(message);
  };

  windowMsgStream.subscribe(passMessageToPort);
  return port;
}

/**
 * Workaround to avoid service-worker be killed by Chrome
 * https://stackoverflow.com/questions/66618136/persistent-service-worker-in-chrome-extension
 */
function keepServiceWorkerAlive() {
  let port: chrome.runtime.Port;
  function connect() {
    port = chrome.runtime.connect({ name: PortName.SUIET_KEEP_ALIVE });
    // Everytime the port gets killed, reconnect it
    port.onDisconnect.addListener(connect);
  }
  connect();
}

injectDappInterface();
keepServiceWorkerAlive();

(async function main() {
  const siteMetadata = await getSiteMetadata();
  setupMessageProxy(siteMetadata);
})();
