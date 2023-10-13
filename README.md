# Fastify plugin for report request data to Graylog (GELF)

![npm](https://img.shields.io/npm/dw/fastify-graylog-reporter)

[![NPM](https://nodei.co/npm/fastify-graylog-reporter.png)](https://nodei.co/npm/fastify-graylog-reporter/)

## Graylog Setup:

This module requires a GELF_UDP input to be configured on your graylog server.

## Usage

1. Declare the input on Graylog WEB UI (support only UDP GELF)
2. Install plugin with ```npm i fastify-graylog-reporter```
3. Use.

```typescript 
import { fastifyGrayLogReporter } from 'fastify-graylog-reporter';
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
  /**
   * keys for exclude report (type ExcludeKeys[])
   */
  excludeFields: [],

  /**
   * For debug
   */
  logs: true,

});


```

### In progress

* tcp transport 



 
