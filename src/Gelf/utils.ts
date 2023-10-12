import {promisify} from 'util';
import {deflate, ZlibOptions} from "zlib";

export const deflateAsync: (data: Buffer, options?: ZlibOptions) => Promise<Buffer> = promisify(deflate);

