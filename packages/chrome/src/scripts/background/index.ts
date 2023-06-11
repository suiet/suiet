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

const MIN_DISCONNECT_TIMEOUT = 1000 * 30;
const MAX_DISCONNECT_TIMEOUT = 1000 * 60 * 3;

function getRandomDisconnectTimeout() {
  return Math.floor(
    Math.random() * (MAX_DISCONNECT_TIMEOUT - MIN_DISCONNECT_TIMEOUT) +
      MIN_DISCONNECT_TIMEOUT
  );
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

    // when killed by chrome, the content script will reconnect and wake this up
    newPort.onDisconnect.addListener(() => {
      deleteTimer(newPort);
    });
    // force client page to reconnect the port before chrome kills this service worker
    (newPort as any)._timer = setTimeout(
      forceReconnect,
      getRandomDisconnectTimeout(),
      newPort
    );
  });

  function forceReconnect(port: any) {
    deleteTimer(port);
    port.disconnect(); // manually trigger disconnect to force client page to reconnect
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
