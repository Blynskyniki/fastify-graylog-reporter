import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { Gelf, GelfMessage } from './Gelf';

const plugin: FastifyPluginCallback<{ facility: string; host: string; port?: number }> = function (
  fastify,
  options,
  done,
) {
  const { facility, port, host } = options;
  const instance = new Gelf(host, port);

  fastify.addHook('onResponse', (request, reply, done) => {
    const { query, params, body, headers, routerMethod, routerPath } = request;
    instance.sendMessage(
      GelfMessage.fromJSON(facility, { path: routerPath, method: routerMethod, query, params, body, headers }),
    );

    done();
  });
  done();
};

export const fastifyGrayLogReporter = fp(plugin);
