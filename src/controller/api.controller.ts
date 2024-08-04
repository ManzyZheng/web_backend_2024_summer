import { Inject, Controller, Get, Query, Post, Body } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';

const userNameList = [];
const userPasswordList = [];

@Controller('/api')
export class APIController {
  @Inject()  //get data
  ctx: Context;

  @Inject()
  userService: UserService;

  @Get('/get_user')
  async getUser(@Query('uid') uid) {
    const user = await this.userService.getUser({ uid });
    return { success: true, message: 'OK', data: user };
  }

  @Post('/register')
  async addUser(@Body() body: { username: string, password: string }) {
    console.log('success');
    this.ctx.body = {
      success: true,
      message: 'User registered successfully',
    };
    userNameList.push (body.username);
    userPasswordList.push(body.password);
    return;
  }

  @Get('/login')
  async checkUser(){
    return { success: true, message: {
      userNameList,
      userPasswordList,
    } };
  }

}
