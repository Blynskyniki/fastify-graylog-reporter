# Fastify plugin for report request data to Graylog

![npm](https://img.shields.io/npm/dw/fastify-graylog-reporter)

[![NPM](https://nodei.co/npm/fastify-graylog-reporter.png)](https://nodei.co/npm/fastify-graylog-reporter/)
## Install

```typescript 
import { fastifyGrayLogReporter } from 'fastifyGrayLogReporter';
/**
 * Register plugin 
 */

fastify.register(fastifyGrayLogReporter, {
  host: 'my host',
  /**
   * optional value
   */
  port: 5555,
  /**
   * stream name
   */
  facility: `API_${process.env.ENVIRONMENT}`,
});


```

