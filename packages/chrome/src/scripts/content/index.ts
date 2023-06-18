import { PortName, WindowMsg, WindowMsgTarget } from '../shared';
import { WindowMsgStream } from '../shared/msg-passing/window-msg-stream';
import {
  getSiteMetadata,
  SiteMetadata,
  validateExternalWindowMsg,
} from './utils';
import Port, { IPort } from '../background/utils/Port';
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

  const handlePortConnect = (newPort: IPort) => {
    const passMessageToPort = (eventData: WindowMsg, port: IPort) => {
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
      port.postMessage(message);
    };

    // port msg from background - content script proxy -> window msg to dapp
    newPort.onMessage.addListener((msg) => {
      windowMsgStream.post(msg);
    });

    // window msg from dapp - content script proxy -> port msg to ext background
    const winMsgSubscription = windowMsgStream.subscribe((eventData) => {
      passMessageToPort(eventData, newPort);
    });

    newPort.onDisconnect.addListener(() => {
      winMsgSubscription.unsubscribe();
    });
  };

  return new Port(
    {
      name: PortName.SUIET_CONTENT_BACKGROUND,
    },
    {
      onConnect: handlePortConnect,
    }
  );
}

(function main() {
  injectDappInterface();
  const keepAlive = new KeepAliveConnection('CONTENT_SCRIPT');
  keepAlive.connect();
})();

(async function asyncMain() {
  const siteMetadata = await getSiteMetadata();
  setupMessageProxy(siteMetadata);
})();
