import * as Buffer from 'buffer';
import { ConnectionOptions } from '../grayLogGelfReporter';
import { GelfMessageSerializer } from '../gelfMessageSerializer';
import { TransportAbstract } from './TransportAbstract';
import { createSocket, Socket } from 'dgram';

export class UdpTransport extends TransportAbstract {
  socket: Socket;

  constructor(options: ConnectionOptions) {
    super(options);
    this.socket = createSocket('udp4');
  }

  public close(): void {
    this.socket.close();
  }

  public sendMessage(buf: Buffer) {
    return new Promise<void>((resolve, reject) => {
      this.socket.send(buf, 0, buf.length, this.options.port, this.options.host, (err: Error | null) => {
        if (err) {
          console.error(err);
          reject(err);
        }
        if (!!this.options.logs) {
          console.info(`${this.options.host}:${this.options.port} -> ${this.options.facility}`);
        }
        resolve();

      });
    });


  }

}
