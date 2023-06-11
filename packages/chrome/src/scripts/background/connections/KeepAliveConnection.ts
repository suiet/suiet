import Port, { IPort } from '../utils/Port';
import { PortName } from '../../shared';

export default class KeepAliveConnection {
  #port: IPort;

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
  }
}
