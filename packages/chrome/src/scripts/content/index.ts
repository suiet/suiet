import { PortName } from '../shared';
import { has } from 'lodash-es';

function injectDappInterface() {
  const script = document.createElement('script');
  const url = chrome.runtime.getURL('dapp-api.js');
  script.setAttribute('src', url);
  script.setAttribute('type', 'module');
  const container = document.head || document.documentElement;
  container.insertBefore(script, container.firstElementChild);
  // container.removeChild(script);
}

function setupMessageProxy() {
  const port = chrome.runtime.connect({
    name: PortName.SUIET_CONTENT_BACKGROUND,
  });
  port.onMessage.addListener((msg) => {
    window.postMessage({
      target: 'suiet_in-page',
      payload: msg,
    });
  });

  const handleMessage = (event: MessageEvent) => {
    if (
      event.source !== window ||
      !has(event.data, 'target') ||
      event.data.target !== 'suiet_content-script'
    )
      return;

    port.postMessage(event.data.payload);
  };

  window.addEventListener('message', handleMessage);

  port.onDisconnect.addListener((port) => {
    window.removeEventListener('message', handleMessage);
  });
}

injectDappInterface();
setupMessageProxy();

export {};
