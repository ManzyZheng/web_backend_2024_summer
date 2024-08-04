import { MidwayConfig } from '@midwayjs/core';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1721717716089_502',
  koa: {
    port: 7001,
  },
  cors: {
    origin: '*', // 允许所有来源
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    allowHeaders: 'Content-Type,Authorization',
  },
} as MidwayConfig;
