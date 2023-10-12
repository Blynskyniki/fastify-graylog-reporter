import * as dgram from 'dgram';

import { GelfMessageSerializer } from './gelfMessageSerializer';
import { MAX_CHUNK_SIZE, MIN_COMPRESS_SIZE } from './options';
import { TransportAbstract } from './Transport/TransportAbstract';
import { UdpTransport } from './Transport/UdpTransport';

export type ConnectionOptions = {
  facility: string;
  host: string;
  port: number;
  compress: boolean;
  minCompressSize: number;
  maxChunkSize: number;
};
/**
 * ClientConnectionOptions with optional chunk size values
 */
export type ClientConnectionOptions =
  Omit<ConnectionOptions, 'minCompressSize' | 'maxChunkSize'>
  & Partial<Pick<ConnectionOptions, 'maxChunkSize' | 'minCompressSize'>>
export type GrayLogReportMessage = {
  host: string;
  short_message: string;
  full_message?: string;
  timestamp: number;

  [key: string]: any
}

export class GrayLogGelfReporter {
  serializer: GelfMessageSerializer;
  transport: TransportAbstract;

  constructor(
    private options: ClientConnectionOptions,
  ) {
    this.options.maxChunkSize = this.options.maxChunkSize || MAX_CHUNK_SIZE;
    this.options.minCompressSize = this.options.minCompressSize || MIN_COMPRESS_SIZE;
    this.serializer = new GelfMessageSerializer(options as ConnectionOptions);
    this.transport = new UdpTransport(this.options as ConnectionOptions);
  }


  async report(data: GrayLogReportMessage) {
    const { short_message, full_message, timestamp, host, ...other_fields } = data;
    const chunks = await this.serializer.serialize(Buffer.from(JSON.stringify({
      facility: this.options.facility, short_message, full_message, timestamp, host,
      ...this.changeOtherFieldsFormat(other_fields),
    }), 'utf8'));

    for (const chunk of chunks) {
      await this.transport.sendMessage(chunk);
    }


  }

  changeOtherFieldsFormat(obj: Record<string, any>) {
    return Object.keys(obj).reduce((acc, key) => {
      if (key.startsWith('_')) {
        acc[key] = obj[key];
      } else {
        acc[`_${key}`] = obj[key];

      }
      return acc;
    }, {});
  };

  close() {
    this.transport.close();
  }

}
