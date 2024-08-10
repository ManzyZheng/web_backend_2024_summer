import { MidwayConfig } from '@midwayjs/core';
import path = require('path');

export default {
  // Use for cookie sign key, should change to your own and keep security
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
  staticFile: {
    dirs: {
      default: {
        prefix: '/uploads/',
        dir: path.join(__dirname, '../../public/uploads'), // 确保这个路径是正确的
      },
    },
  },
} as MidwayConfig;
