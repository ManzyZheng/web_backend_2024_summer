import { Configuration, App } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as ws from '@midwayjs/ws';
import * as crossDomain from '@midwayjs/cross-domain';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import * as path from 'path';
import * as upload from '@midwayjs/upload';
import { DefaultErrorFilter } from './filter/default.filter';
import { NotFoundFilter } from './filter/notfound.filter';
import { ReportMiddleware } from './middleware/report.middleware';
import koaBody from 'koa-body';
import * as KoaStatic from 'koa-static';

@Configuration({
  imports: [
    koa,
    ws,
    crossDomain,
    validate,
    upload,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
  ],
  importConfigs: [path.join(__dirname, './config')],
})

export class MainConfiguration {
  @App('koa')
  app: koa.Application;

  async onReady() {
    // 添加中间件
    this.app.useMiddleware([ReportMiddleware]);

    // 添加过滤器
    this.app.useFilter([NotFoundFilter, DefaultErrorFilter]);
  }
}

export class ContainerLifeCycle {
  @App()
  app: koa.Application;

  async onReady() {
    // 配置 koa-body 作为中间件
    this.app.use(koaBody({
      multipart: true, // 支持文件上传
      formidable: {
        uploadDir: path.join(__dirname, '../public/uploads'), // 文件上传目录
        keepExtensions: true, // 保持文件扩展名
        maxFileSize: 200 * 1024 * 1024, // 最大文件大小
      },
    }));
    this.app.use(KoaStatic(path.join(__dirname, '../public')));
  }
}