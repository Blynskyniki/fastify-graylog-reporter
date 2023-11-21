import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { type } from 'os';
import { ClientConnectionOptions, GrayLogGelfReporter } from './Gelf';

declare module 'fastify' {
  export interface FastifyRequest {
    credentials?: any;
  }
}
export type ExcludedKeys =
  'query'
  | 'params'
  | 'body'
  | 'response'
  | 'credentials'
  | 'responseStatusCode'
  | 'requestHeaders'
  | 'responseHeaders';
const plugin: FastifyPluginCallback<ClientConnectionOptions & { excludeFields?: ExcludedKeys[] }> = function (
  fastify,
  options,
  done,
) {
  const instance = new GrayLogGelfReporter(options);

  fastify.addHook('onSend', async (request, reply, payload) => {
    const { query, params, body, headers, routerMethod, routerPath, credentials } = request;

    try {
      const data = {
        host: headers?.['host'] || headers?.['x-forwarded-for']?.[0] || 'empty',
        short_message: `${routerMethod}:${routerPath} ${params ? 'params:' + JSON.stringify(params) : ''}${query ? 'query:' + JSON.stringify(query) : ''}${body ? 'body:' + JSON.stringify(body) : ''}`,
        path: routerPath,
        method: routerMethod,
        full_message: Object.keys(headers).map(key => `${key}=${headers[key]} `).join('\n'),
        query,
        uri: request.url,
        params,
        body,
        response: payload,
        credentials,
        responseStatusCode: reply.statusCode,
        requestHeaders: headers,
        responseHeaders: reply.getHeaders(),
      };
      if (options.excludeFields) {
        options.excludeFields?.forEach(key => {
          delete data[key];
        });
      }
      await instance.report(data);

    } catch (err) {
      console.error(err);
      console.error(err.stack);
    } finally {
      return payload;
    }


  });
  done();
};

export const fastifyGrayLogReporter = fp(plugin);
