import { MidwayConfig } from '@midwayjs/core';
import path = require('path');

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: 'your_secure_key', // 更改为你自己的安全密钥
  koa: {
    port: 7001,
  },
  cors: {
    origin: '*', // 允许所有来源
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    allowHeaders: 'Content-Type,Authorization',
  },
  upload: {
    mode: 'file',
    fileSize: '10mb',
    whitelist: ['.jpg', '.jpeg', '.png', '.gif'],
    tmpdir: path.join(__dirname, '../public/uploads'), 
    cleanTimeout: 5 * 60 * 1000, // 清理临时文件的时间
  },
  static: {
    prefix: '/uploads/',
    dir: path.join(__dirname, '../../public/uploads'), // Ensure this path is correct
  },
} as MidwayConfig;
