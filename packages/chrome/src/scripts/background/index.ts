import { PortName } from '../shared';
import { BackgroundApiProxy } from './api-proxy';

class ApiBridgeConnection {
  private bgApiProxy: BackgroundApiProxy;
  private readonly portName: PortName;

  constructor(portName: PortName) {
    this.portName = portName;
  }

  connect() {
    const handleConnect = (port: chrome.runtime.Port) => {
      if (port.name === this.portName) {
        if (!this.bgApiProxy) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          this.bgApiProxy = new BackgroundApiProxy(); // setup listening channel
        }
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
  const uiBgBridgeConnection = new ApiBridgeConnection(
    PortName.SUIET_UI_BACKGROUND
  );
  uiBgBridgeConnection.connect();

  const cntBgBridgeConnection = new ApiBridgeConnection(
    PortName.SUIET_CONTENT_BACKGROUND
  );
  cntBgBridgeConnection.connect();
})();
