import { log } from './log';

export interface IPort extends chrome.runtime.Port {}

export default class Port implements IPort {
  #port: chrome.runtime.Port;
  #connected: boolean;
  #portName: string;

  constructor(connectInfo: chrome.runtime.ConnectInfo) {
    if (!connectInfo.name) {
      throw new Error('port name is required');
    }
    this.#portName = connectInfo.name;
    this.#port = this.#createPort();
  }

  #createPort() {
    const newPort = chrome.runtime.connect({
      name: this.#portName,
    });
    this.#connected = true;
    log(`chrome port ${this.#portName} connected`);
    newPort.onDisconnect.addListener(() => {
      this.#connected = false;
      log(`chrome port ${this.#portName} connected`);
    });
    return newPort;
  }

  public postMessage(message: any) {
    if (!this.#connected) {
      console.debug('postMessage: chrome port not connected, reconnect');
      this.#port = this.#createPort();
    }
    this.#port.postMessage(message);
  }

  get connected() {
    return this.#connected;
  }

  get sender() {
    return this.#port.sender;
  }

  get disconnect() {
    return this.#port.disconnect;
  }

  get onDisconnect() {
    return this.#port.onDisconnect;
  }

  get onMessage() {
    return this.#port.onMessage;
  }

  get name() {
    return this.#port.name;
  }
}
