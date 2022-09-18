import { PortName } from '../shared';
import { BackgroundApiProxy } from './api-proxy';

class ApiBridgeConnection {
  static connectTo(portName: PortName) {
    const handleConnect = (port: chrome.runtime.Port) => {
      if (port.name === portName) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let bgApiProxy: BackgroundApiProxy | null =
          BackgroundApiProxy.listenTo(port); // setup listening channel

        port.onDisconnect.addListener(() => {
          console.log('clear proxy instance');
          bgApiProxy = null;
        });
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
  ApiBridgeConnection.connectTo(PortName.SUIET_UI_BACKGROUND);
  ApiBridgeConnection.connectTo(PortName.SUIET_CONTENT_BACKGROUND);
})();
