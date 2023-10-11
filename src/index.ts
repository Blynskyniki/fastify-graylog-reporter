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
    const { query, params, body, headers, method, routerPath } = request;
    const payload = {
      request: { query, params, body, headers },
    };
    instance.sendMessage(
      GelfMessage.fromJSON(
        facility,
        payload,
      ),
    );

    done();
  });
  done();
};

export const fastifyGrayLogReporter = fp(plugin);
