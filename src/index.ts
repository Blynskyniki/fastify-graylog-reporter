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
        short_message: `${routerMethod}:${routerPath} ${params ? 'params:' + JSON.stringify(params) : ''}${query ? 'query:' + JSON.stringify(query) : ''}${body ? 'body:' + JSON.stringify(body) : ''}`,
        path: routerPath,
        method: routerMethod,
        full_message: `token=${headers['authorization']},host=${headers?.['host']}`,
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
