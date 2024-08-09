import { Inject, Controller, Get, Post, Body } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/auth.service';
import { IUser } from '../service/fileDB';

interface IGetUserResponse {
  success: boolean;
  message: string;
  data?: IUser;
}

@Controller('/api')
export class APIController {
  [x: string]: any;
  @Inject()  //get data
  ctx: Context;

  @Inject()
  userService: UserService;


  @Post('/register')
  async register(@Body() body: { username: string; password: string }): Promise<IGetUserResponse> {
    const { username, password } = body;
    if (!username || !password) {
      this.ctx.status = 500;
      return { success: false, message: '参数错误' };
    }
    const user = await this.userService.register(username, password);
    return { success: true, message: '注册成功', data: user };
  }


  @Post('/login')
  async login(@Body() body: { username: string; password: string }): Promise<IGetUserResponse> {
    const { username, password } = body;
    const success = await this.userService.login(username, password);
    console.log(1);
    if (success) {
      // 成功登录
      const user = await this.userService.getUser(username);
      console.log(2);
      return { success: true, message: '登录成功', data: { id: user.id, username: user.username, password: user.password, activity: user.activity } };
    } else {
      // 登录失败
      // TODO 密码错误三次禁止登录
      this.ctx.status = 403;
    }
  }

  @Get('/logout')
  async logout() {
    this.ctx.cookies.set('my_session_data', '', { maxAge: 0, path: '/' }); // 设置 maxAge 为 0 来清除 cookie
    return { success: true, message: '登出成功' };
  }

  @Get('/userList')
  async getUsers() {
    try {
      const users = await this.userService.getUsers();
      return { success: true, data: users };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Get('/currentUser')
  async getUsername() {
    console.log('All cookies:', this.ctx.cookies.get('my_session_data'));
    try {
      const text = this.ctx.cookies.get('my_session_data');
      console.log('my_session_data cookie:', text);

      if (!text) {
        return { username: null };
      }

      const data = JSON.parse(decodeURIComponent(text));
      return { username: data.username || null };
    } catch (error) {
      console.error('Error retrieving username from cookies:', error);
      return { username: null, error: 'Unable to retrieve username' };
    }
  }



}


