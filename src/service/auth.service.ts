// src/services/auth.service.ts
import { Provide } from '@midwayjs/decorator';
import { UserModel } from '../models/user.model';

@Provide()
export class AuthService {
  async login(loginDto: { email: string; password: string }) {
    // 登录逻辑
  }

  async register(registerDto: { email: string; password: string }) {// 注册逻辑
    const user = new UserModel();
    user.email = registerDto.email;
    user.password = registerDto.password;
    // 假设你已经有一个ORM的save方法
    await user.save();
    return user;
  }
}