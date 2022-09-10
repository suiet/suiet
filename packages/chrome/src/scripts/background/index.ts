import { PortName } from '../shared';
import { BackgroundApiProxy } from './api-proxy';

function createPopupWindow(url: string) {
  chrome.windows.create({
    url,
    type: 'popup',
    focused: true,
    width: 362,
    height: 573 + 30, // height including title bar, so should add 30px more
  });
}

class ApiBridgeConnection {
  static connectTo(portName: PortName) {
    const handleConnect = (port: chrome.runtime.Port) => {
      if (port.name === portName) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let bgApiProxy: BackgroundApiProxy | null =
          BackgroundApiProxy.listenTo(port); // setup listening channel
        port.onDisconnect.addListener(() => {
          console.log('clear proxy instance');
          bgApiProxy = null; // clear proxy instance
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
