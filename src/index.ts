import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { ClientConnectionOptions, GrayLogGelfReporter } from './Gelf';

const plugin: FastifyPluginCallback<ClientConnectionOptions & {}> = function (
  fastify,
  options,
  done,
) {
  const instance = new GrayLogGelfReporter(options);

  fastify.addHook('onResponse', async (request, reply) => {
    const { query, params, body, headers, routerMethod, routerPath } = request;
    try {

      await instance.report({
        host: headers?.['host'] || 'empty',
        short_message: `${routerMethod}:${routerPath} ${query ? JSON.stringify(query) : ''}${body ? JSON.stringify(body) : ''}`,
        path: routerPath,
        method: routerMethod,
        query,
        uri: request.url,
        params,
        body,
        headers,
      });

    } catch (err) {
      console.error(err);
    }


  });
  done();
};

export const fastifyGrayLogReporter = fp(plugin);
