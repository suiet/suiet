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
      if (port.name === this.portName) {
        this.bgApiProxy.listen(port);
      }
    };
    chrome.runtime.onConnect.addListener(handleConnect);
  }
}

(function main() {
  chrome.runtime.onInstalled.addListener((): void => {
    // eslint-disable-next-line no-console
    console.log('Extension installed');
  });
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
