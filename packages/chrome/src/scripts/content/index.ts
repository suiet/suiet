import { PortName, WindowMsg, WindowMsgTarget } from '../shared';
import { WindowMsgStream } from '../shared/msg-passing/window-msg-stream';
import { getSiteMetadata, SiteMetadata } from './utils';
import { validateExternalWindowMsg } from './utils';
import Port from '../background/utils/Port';
import KeepAliveConnection from '../background/connections/KeepAliveConnection';

function injectDappInterface() {
  const script = document.createElement('script');
  const url = chrome.runtime.getURL('dapp-api.js');
  script.setAttribute('src', url);
  script.setAttribute('type', 'module');
  const container = document.head || document.documentElement;
  container.insertBefore(script, container.firstElementChild);
  container.removeChild(script);
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
  const port = new Port({
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

(function main() {
  injectDappInterface();
  const keepAlive = new KeepAliveConnection();
  keepAlive.connect();
})();

(async function asyncMain() {
  const siteMetadata = await getSiteMetadata();
  setupMessageProxy(siteMetadata);
})();
