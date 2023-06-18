import Port, { IPort } from '../utils/Port';
import { PortName } from '../../shared';

export default class KeepAliveConnection {
  private static KEEP_ALIVE_INTERVAL = 3000;
  #port: IPort | null = null;
  #timer: any = null;
  #origin: string = 'UNKNOWN';

  constructor(origin: string) {
    this.#origin = origin;
  }

  /**
   * Workaround to avoid service-worker be killed by Chrome
   * https://stackoverflow.com/questions/66618136/persistent-service-worker-in-chrome-extension
   */
  public connect() {
    const newPort = new Port({ name: PortName.SUIET_KEEP_ALIVE });
    // Everytime the port gets killed, reconnect it
    newPort.onDisconnect.addListener(() => {
      this.connect();
    });
    this.#port = newPort;
    this.#reportHeartBeats();
  }

  #reportHeartBeats() {
    if (this.#timer) {
      clearInterval(this.#timer);
    }

    this.#timer = setInterval(() => {
      this.#sendHeartBeatPackets();
    }, KeepAliveConnection.KEEP_ALIVE_INTERVAL);
  }

  #sendHeartBeatPackets() {
    if (!this.#port) {
      console.log('failed to report heart beats: port is null');
      return;
    }

    try {
      this.#port.postMessage({
        type: 'KEEP_ALIVE',
        origin: this.#origin,
        payload: 'PING',
      });
    } catch (e) {
      console.error('failed to report heart beats', e);
    }
  }
}
