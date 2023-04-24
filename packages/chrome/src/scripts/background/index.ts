import { PortName } from '../shared';
import { BackgroundApiProxy } from './api-proxy';

class ApiBridgeConnection {
  private readonly bgApiProxy: BackgroundApiProxy;
  private readonly portName: PortName;

  constructor(bgApiProxy: BackgroundApiProxy, portName: PortName) {
    this.bgApiProxy = bgApiProxy;
    this.portName = portName;
  }

  connect() {
    const handleConnect = (port: chrome.runtime.Port) => {
      // console.log('handleConnect port.name', port.name);
      if (port.name === this.portName) {
        this.bgApiProxy.listen(port);
      }
    };
    // once the client side calls chrome.runtime.connect,
    // the background script will receive a port
    chrome.runtime.onConnect.addListener(handleConnect);
  }
}

/**
 * Because Chrome would kill sw periodically,
 * so notify content script to reconnect by disconnect the port after specific timeout,
 * then our service worker can survive by receiving a new connect and sending "keep-alive" messages
 * workaround: https://stackoverflow.com/questions/66618136/persistent-service-worker-in-chrome-extension
 */
function keepAlive() {
  chrome.runtime.onConnect.addListener((port) => {
    if (port.name !== PortName.SUIET_KEEP_ALIVE) return;
    // post a message to content script to avoid be killed by chrome
    port.postMessage('keep-alive');
    // when killed by chrome, the content script will reconnect and wake this up
    port.onDisconnect.addListener(deleteTimer);
    // force client page to reconnect the port before chrome kills this service worker
    (port as any)._timer = setTimeout(forceReconnect, 250e3, port);
  });
  function forceReconnect(port: any) {
    deleteTimer(port);
    port.disconnect();
  }
  function deleteTimer(port: any) {
    if (port._timer) {
      clearTimeout(port._timer);
      delete port._timer;
    }
  }
}

(function main() {
  chrome.runtime.onInstalled.addListener((): void => {
    // eslint-disable-next-line no-console
    console.log('Extension installed');
  });

  keepAlive();

  const bgApiProxy = new BackgroundApiProxy();
  const uiBgBridgeConnection = new ApiBridgeConnection(
    bgApiProxy,
    PortName.SUIET_UI_BACKGROUND
  );
  uiBgBridgeConnection.connect();

  const cntBgBridgeConnection = new ApiBridgeConnection(
    bgApiProxy,
    PortName.SUIET_CONTENT_BACKGROUND
  );
  cntBgBridgeConnection.connect();
})();
