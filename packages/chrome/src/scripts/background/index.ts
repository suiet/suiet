import { PortName } from '../shared';
import { BackgroundApiProxy } from './api-proxy';
import { IPort } from './utils/Port';

class ApiBridgeConnection {
  private readonly bgApiProxy: BackgroundApiProxy;
  private readonly portName: PortName;

  constructor(bgApiProxy: BackgroundApiProxy, portName: PortName) {
    this.bgApiProxy = bgApiProxy;
    this.portName = portName;
  }

  connect() {
    const handleConnect = (port: IPort) => {
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
function listenToKeepAliveChannel() {
  chrome.runtime.onConnect.addListener((newPort) => {
    if (newPort.name !== PortName.SUIET_KEEP_ALIVE) return;

    newPort.onMessage.addListener((msg) => {
      if (msg.type !== 'KEEP_ALIVE') return;
      newPort.postMessage({ type: 'KEEP_ALIVE', payload: 'PONG' });
    });
  });
}

(function main() {
  chrome.runtime.onInstalled.addListener((): void => {
    // eslint-disable-next-line no-console
    console.log('Extension installed');
  });

  listenToKeepAliveChannel();

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
