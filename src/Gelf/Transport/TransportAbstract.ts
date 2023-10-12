import { ConnectionOptions } from '../grayLogGelfReporter';

export abstract class TransportAbstract {
  constructor(protected options: ConnectionOptions) {
  }

  abstract sendMessage(buf: Buffer): Promise<void>

  abstract close(): void
}





