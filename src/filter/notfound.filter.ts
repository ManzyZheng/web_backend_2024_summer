import { Catch, httpError, MidwayHttpError } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';

@Catch(httpError.NotFoundError)
export class NotFoundFilter {
  async catch(err: MidwayHttpError, ctx: Context) {
    // 404 错误会到这里
    if (ctx.path === '/404.html') {
      ctx.status = 404;
      ctx.body = 'Not Found';
    } else {
      // 进行重定向到 404.html
      ctx.redirect('/404.html');
    }
  }
}
