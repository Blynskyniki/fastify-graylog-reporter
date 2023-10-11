import * as dgram from 'dgram';

import { GelfMessage } from './gelfMessage';

export class Gelf {
  constructor(private host: string, private port: number = 12202) {}

  private send(buf: Buffer) {
    if (this.host.length) {
      const client = dgram.createSocket('udp4');

      client.send(buf, 0, buf.length, this.port, this.host, (err: Error | null) => {
        if (err) {
          console.error(err);
        }

        console.info('UDP message sent');

        client.close();
      });
    }
  }

  public sendMessage(msg: GelfMessage) {
    this.send(Buffer.from(JSON.stringify(msg), 'utf8'));
  }
}
