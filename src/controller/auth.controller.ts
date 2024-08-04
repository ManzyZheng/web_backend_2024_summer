import { Inject, Controller, Get, Post, Body } from '@midwayjs/core';
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
